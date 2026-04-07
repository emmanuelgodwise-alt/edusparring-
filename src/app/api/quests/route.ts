import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// Quest definitions
const QUEST_TEMPLATES = [
  {
    type: 'win_matches',
    title: 'Victory Rush',
    description: 'Win {target} matches today',
    targetRange: [2, 5],
    pointsRange: [20, 50],
  },
  {
    type: 'answer_correct',
    title: 'Sharp Shooter',
    description: 'Answer {target} questions correctly',
    targetRange: [10, 25],
    pointsRange: [15, 40],
  },
  {
    type: 'play_subject',
    title: 'Subject Master',
    description: 'Play {target} matches in any subject',
    targetRange: [3, 7],
    pointsRange: [15, 35],
  },
  {
    type: 'help_student',
    title: 'Helpful Hand',
    description: 'Help {target} students in study circles',
    targetRange: [1, 3],
    pointsRange: [25, 50],
  },
  {
    type: 'streak_match',
    title: 'On Fire!',
    description: 'Get a {target}+ win streak',
    targetRange: [2, 5],
    pointsRange: [30, 75],
  },
  {
    type: 'quick_match',
    title: 'Speed Runner',
    description: 'Complete {target} quick matches',
    targetRange: [3, 8],
    pointsRange: [15, 40],
  },
  {
    type: 'perfect_round',
    title: 'Perfect Round',
    description: 'Get {target} perfect rounds (all correct)',
    targetRange: [1, 3],
    pointsRange: [40, 100],
  },
];

// GET - Get user's daily quests
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  try {
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Get today's quests
    let quests = await prisma.dailyQuest.findMany({
      where: {
        userId,
        date: today,
      },
    });

    // Generate new quests if none exist for today
    if (quests.length === 0) {
      quests = await generateDailyQuests(userId, today, tomorrow);
    }

    // Check for expired quests from previous days
    const expiredQuests = await prisma.dailyQuest.findMany({
      where: {
        userId,
        expiresAt: { lt: now },
        completed: false,
      },
    });

    // Mark expired quests
    if (expiredQuests.length > 0) {
      await prisma.dailyQuest.updateMany({
        where: {
          id: { in: expiredQuests.map(q => q.id) },
        },
        data: { completed: true }, // Mark as complete to not show again
      });
    }

    // Calculate progress summary
    const completedCount = quests.filter(q => q.completed).length;
    const totalPoints = quests
      .filter(q => q.completed && q.claimed)
      .reduce((sum, q) => sum + q.pointsReward, 0);
    const pendingPoints = quests
      .filter(q => q.completed && !q.claimed)
      .reduce((sum, q) => sum + q.pointsReward, 0);

    return NextResponse.json({
      success: true,
      quests: quests.map(q => ({
        id: q.id,
        type: q.questType,
        title: q.title,
        description: q.description,
        target: q.target,
        progress: q.progress,
        completed: q.completed,
        claimed: q.claimed,
        pointsReward: q.pointsReward,
        bonusReward: q.bonusReward ? JSON.parse(q.bonusReward) : null,
        expiresAt: q.expiresAt,
      })),
      summary: {
        total: quests.length,
        completed: completedCount,
        pendingClaims: quests.filter(q => q.completed && !q.claimed).length,
        totalPointsEarned: totalPoints,
        pendingPoints,
      },
    });
  } catch (error) {
    console.error('Error fetching quests:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch quests' },
      { status: 500 }
    );
  }
}

// POST - Update quest progress
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, questType, increment = 1 } = body;

    if (!userId || !questType) {
      return NextResponse.json(
        { success: false, error: 'User ID and quest type are required' },
        { status: 400 }
      );
    }

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Find active quest of this type
    const quest = await prisma.dailyQuest.findFirst({
      where: {
        userId,
        questType,
        date: today,
        completed: false,
      },
    });

    if (!quest) {
      return NextResponse.json({
        success: true,
        message: 'No active quest of this type',
      });
    }

    // Update progress
    const newProgress = Math.min(quest.progress + increment, quest.target);
    const completed = newProgress >= quest.target;

    const updatedQuest = await prisma.dailyQuest.update({
      where: { id: quest.id },
      data: {
        progress: newProgress,
        completed,
      },
    });

    return NextResponse.json({
      success: true,
      quest: {
        id: updatedQuest.id,
        type: updatedQuest.questType,
        progress: updatedQuest.progress,
        target: updatedQuest.target,
        completed: updatedQuest.completed,
        pointsReward: updatedQuest.pointsReward,
      },
      justCompleted: completed && quest.progress < quest.target,
    });
  } catch (error) {
    console.error('Error updating quest:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update quest' },
      { status: 500 }
    );
  }
}

// PUT - Claim quest reward
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { questId, userId } = body;

    if (!questId || !userId) {
      return NextResponse.json(
        { success: false, error: 'Quest ID and User ID are required' },
        { status: 400 }
      );
    }

    const quest = await prisma.dailyQuest.findFirst({
      where: {
        id: questId,
        userId,
        completed: true,
        claimed: false,
      },
    });

    if (!quest) {
      return NextResponse.json(
        { success: false, error: 'Quest not found or already claimed' },
        { status: 404 }
      );
    }

    // Mark as claimed
    await prisma.dailyQuest.update({
      where: { id: questId },
      data: { claimed: true },
    });

    // Award points
    await prisma.user.update({
      where: { id: userId },
      data: { points: { increment: quest.pointsReward } },
    });

    // Apply bonus if any
    if (quest.bonusReward) {
      const bonus = JSON.parse(quest.bonusReward);
      if (bonus.type === 'streak_freeze') {
        await prisma.dailyStreak.update({
          where: { userId },
          data: { streakFreeze: { increment: bonus.value } },
        });
      }
    }

    return NextResponse.json({
      success: true,
      pointsAwarded: quest.pointsReward,
      bonusReward: quest.bonusReward ? JSON.parse(quest.bonusReward) : null,
    });
  } catch (error) {
    console.error('Error claiming quest:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to claim quest' },
      { status: 500 }
    );
  }
}

// Helper function to generate daily quests
async function generateDailyQuests(userId: string, date: Date, expiresAt: Date) {
  // Select 3 random quests
  const shuffled = [...QUEST_TEMPLATES].sort(() => Math.random() - 0.5);
  const selectedQuests = shuffled.slice(0, 3);

  const quests = [];

  for (const template of selectedQuests) {
    const target = Math.floor(
      Math.random() * (template.targetRange[1] - template.targetRange[0] + 1)
    ) + template.targetRange[0];
    
    const points = Math.floor(
      Math.random() * (template.pointsRange[1] - template.pointsRange[0] + 1)
    ) + template.pointsRange[0];

    const quest = await prisma.dailyQuest.create({
      data: {
        userId,
        questType: template.type,
        title: template.title,
        description: template.description.replace('{target}', target.toString()),
        target,
        progress: 0,
        completed: false,
        claimed: false,
        pointsReward: points,
        date,
        expiresAt,
      },
    });

    quests.push(quest);
  }

  return quests;
}
