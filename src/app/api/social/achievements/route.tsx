import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Achievement definitions
const ACHIEVEMENTS = [
  // Battle achievements
  { id: 'first_win', name: 'First Victory', description: 'Win your first match', icon: '🏆', category: 'battle', requirement: 'wins >= 1', pointsValue: 10, rarity: 'common' },
  { id: 'win_10', name: 'Rising Star', description: 'Win 10 matches', icon: '⭐', category: 'battle', requirement: 'wins >= 10', pointsValue: 25, rarity: 'rare' },
  { id: 'win_50', name: 'Battle Master', description: 'Win 50 matches', icon: '⚔️', category: 'battle', requirement: 'wins >= 50', pointsValue: 50, rarity: 'epic' },
  { id: 'win_100', name: 'Legendary Warrior', description: 'Win 100 matches', icon: '👑', category: 'battle', requirement: 'wins >= 100', pointsValue: 100, rarity: 'legendary' },
  { id: 'streak_5', name: 'Hot Streak', description: 'Get a 5-win streak', icon: '🔥', category: 'battle', requirement: 'streak >= 5', pointsValue: 20, rarity: 'rare' },
  { id: 'streak_10', name: 'Unstoppable', description: 'Get a 10-win streak', icon: '💥', category: 'battle', requirement: 'streak >= 10', pointsValue: 50, rarity: 'epic' },
  
  // Knowledge achievements
  { id: 'kr_1000', name: 'Knowledge Seeker', description: 'Reach KR 1000', icon: '📚', category: 'learning', requirement: 'kr >= 1000', pointsValue: 15, rarity: 'common' },
  { id: 'kr_1500', name: 'Scholar', description: 'Reach KR 1500', icon: '🎓', category: 'learning', requirement: 'kr >= 1500', pointsValue: 30, rarity: 'rare' },
  { id: 'kr_2000', name: 'Sage', description: 'Reach KR 2000', icon: '🧙', category: 'learning', requirement: 'kr >= 2000', pointsValue: 75, rarity: 'epic' },
  { id: 'kr_2500', name: 'Oracle', description: 'Reach KR 2500', icon: '🔮', category: 'learning', requirement: 'kr >= 2500', pointsValue: 150, rarity: 'legendary' },
  
  // Social achievements
  { id: 'friend_1', name: 'Friendly', description: 'Make your first friend', icon: '👋', category: 'social', requirement: 'friends >= 1', pointsValue: 5, rarity: 'common' },
  { id: 'friend_10', name: 'Social Butterfly', description: 'Make 10 friends', icon: '🦋', category: 'social', requirement: 'friends >= 10', pointsValue: 25, rarity: 'rare' },
  { id: 'friend_50', name: 'Community Leader', description: 'Make 50 friends', icon: '🌟', category: 'social', requirement: 'friends >= 50', pointsValue: 75, rarity: 'epic' },
  
  // Special achievements
  { id: 'perfect_match', name: 'Perfect Score', description: 'Get all answers correct in a match', icon: '💯', category: 'special', requirement: 'perfect_match', pointsValue: 30, rarity: 'epic' },
  { id: 'quick_answer', name: 'Quick Thinker', description: 'Answer 5 questions in under 5 seconds', icon: '⚡', category: 'special', requirement: 'quick_answers >= 5', pointsValue: 25, rarity: 'rare' },
  { id: 'global_champion', name: 'Global Champion', description: 'Reach #1 on global leaderboard', icon: '🏅', category: 'special', requirement: 'rank_1', pointsValue: 200, rarity: 'legendary' },
  
  // Subject mastery
  { id: 'math_master', name: 'Math Master', description: 'Win 20 Math matches', icon: '📐', category: 'mastery', requirement: 'math_wins >= 20', pointsValue: 30, rarity: 'rare' },
  { id: 'physics_master', name: 'Physics Master', description: 'Win 20 Physics matches', icon: '⚛️', category: 'mastery', requirement: 'physics_wins >= 20', pointsValue: 30, rarity: 'rare' },
  { id: 'chemistry_master', name: 'Chemistry Master', description: 'Win 20 Chemistry matches', icon: '🧪', category: 'mastery', requirement: 'chemistry_wins >= 20', pointsValue: 30, rarity: 'rare' },
  { id: 'biology_master', name: 'Biology Master', description: 'Win 20 Biology matches', icon: '🧬', category: 'mastery', requirement: 'biology_wins >= 20', pointsValue: 30, rarity: 'rare' },
  { id: 'history_master', name: 'History Master', description: 'Win 20 History matches', icon: '📜', category: 'mastery', requirement: 'history_wins >= 20', pointsValue: 30, rarity: 'rare' },
  { id: 'geography_master', name: 'Geography Master', description: 'Win 20 Geography matches', icon: '🌍', category: 'mastery', requirement: 'geography_wins >= 20', pointsValue: 30, rarity: 'rare' },
];

// GET - Get user achievements
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const type = searchParams.get('type') || 'earned'; // earned, available, all

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    // Get user's earned achievements
    const earnedAchievements = await db.userAchievement.findMany({
      where: { userId },
      include: { achievement: true },
      orderBy: { earnedAt: 'desc' }
    });

    if (type === 'earned') {
      return NextResponse.json({
        achievements: earnedAchievements.map(ea => ({
          id: ea.achievement.id,
          name: ea.achievement.name,
          description: ea.achievement.description,
          icon: ea.achievement.icon,
          category: ea.achievement.category,
          rarity: ea.achievement.rarity,
          earnedAt: ea.earnedAt,
          isEarned: true
        }))
      });
    }

    if (type === 'available') {
      const earnedIds = earnedAchievements.map(ea => ea.achievement.id);
      const available = ACHIEVEMENTS.filter(a => !earnedIds.includes(a.id));
      return NextResponse.json({ achievements: available });
    }

    // All - combine earned and unearned
    const earnedMap = new Map(earnedAchievements.map(ea => [ea.achievement.id, ea.earnedAt]));
    const allAchievements = ACHIEVEMENTS.map(a => ({
      ...a,
      earnedAt: earnedMap.get(a.id) || null,
      isEarned: earnedMap.has(a.id)
    }));

    return NextResponse.json({ achievements: allAchievements });
  } catch (error) {
    console.error('Error fetching achievements:', error);
    return NextResponse.json({ error: 'Failed to fetch achievements' }, { status: 500 });
  }
}

// POST - Check and award achievements
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, stats } = body;

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    // Get user's current achievements
    const earned = await db.userAchievement.findMany({
      where: { userId },
      select: { achievementId: true }
    });
    const earnedIds = earned.map(e => e.achievementId);

    const newAchievements: any[] = [];

    // Check each achievement
    for (const ach of ACHIEVEMENTS) {
      if (earnedIds.includes(ach.id)) continue;

      let qualified = false;

      // Simple stat checks
      if (ach.requirement.startsWith('wins >= ')) {
        const req = parseInt(ach.requirement.split(' >= ')[1]);
        qualified = (stats?.wins || 0) >= req;
      } else if (ach.requirement.startsWith('streak >= ')) {
        const req = parseInt(ach.requirement.split(' >= ')[1]);
        qualified = (stats?.currentStreak || 0) >= req;
      } else if (ach.requirement.startsWith('kr >= ')) {
        const req = parseInt(ach.requirement.split(' >= ')[1]);
        qualified = (stats?.knowledgeRating || 0) >= req;
      } else if (ach.requirement.startsWith('friends >= ')) {
        const req = parseInt(ach.requirement.split(' >= ')[1]);
        qualified = (stats?.friendsCount || 0) >= req;
      }

      if (qualified) {
        // Award achievement
        await db.userAchievement.create({
          data: { userId, achievementId: ach.id }
        });

        // Create activity
        await db.activity.create({
          data: {
            userId,
            type: 'achievement_earned',
            content: JSON.stringify({
              achievementId: ach.id,
              achievementName: ach.name,
              achievementIcon: ach.icon,
              rarity: ach.rarity
            }),
            visibility: 'public'
          }
        });

        newAchievements.push(ach);
      }
    }

    return NextResponse.json({ 
      success: true, 
      newAchievements,
      count: newAchievements.length 
    });
  } catch (error) {
    console.error('Error checking achievements:', error);
    return NextResponse.json({ error: 'Failed to check achievements' }, { status: 500 });
  }
}

// PUT - Manually award achievement (admin)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, achievementId } = body;

    if (!userId || !achievementId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Find achievement
    const achievement = ACHIEVEMENTS.find(a => a.id === achievementId);
    if (!achievement) {
      return NextResponse.json({ error: 'Achievement not found' }, { status: 404 });
    }

    // Check if already earned
    const existing = await db.userAchievement.findUnique({
      where: {
        userId_achievementId: { userId, achievementId }
      }
    });

    if (existing) {
      return NextResponse.json({ error: 'Achievement already earned' }, { status: 400 });
    }

    // Award achievement
    await db.userAchievement.create({
      data: { userId, achievementId }
    });

    return NextResponse.json({ success: true, achievement });
  } catch (error) {
    console.error('Error awarding achievement:', error);
    return NextResponse.json({ error: 'Failed to award achievement' }, { status: 500 });
  }
}
