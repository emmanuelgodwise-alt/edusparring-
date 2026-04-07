import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET - Get user's streak status
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

    // Get or create streak record
    let streak = await prisma.dailyStreak.findUnique({
      where: { userId },
    });

    if (!streak) {
      streak = await prisma.dailyStreak.create({
        data: { userId },
      });
    }

    // Check if today's login should update the streak
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const lastLogin = streak.lastLoginDate 
      ? new Date(streak.lastLoginDate.getFullYear(), streak.lastLoginDate.getMonth(), streak.lastLoginDate.getDate())
      : null;

    let shouldUpdateStreak = false;
    let isNewDay = false;

    if (!lastLogin || today.getTime() > lastLogin.getTime()) {
      isNewDay = true;
      
      // Check if streak should continue (within 1 day) or reset
      if (lastLogin) {
        const dayDiff = Math.floor((today.getTime() - lastLogin.getTime()) / (1000 * 60 * 60 * 24));
        
        if (dayDiff === 1) {
          // Consecutive day - increment streak
          shouldUpdateStreak = true;
        } else if (dayDiff > 1) {
          // Streak broken - check for freeze
          if (streak.streakFreeze > 0 && dayDiff === 2) {
            // Use streak freeze
            await prisma.dailyStreak.update({
              where: { userId },
              data: { 
                streakFreeze: { decrement: 1 },
                lastLoginDate: now,
              },
            });
            streak.streakFreeze -= 1;
          } else {
            // Reset streak
            streak = await prisma.dailyStreak.update({
              where: { userId },
              data: {
                currentStreak: 1,
                lastLoginDate: now,
              },
            });
          }
        }
      } else {
        // First login ever
        shouldUpdateStreak = true;
      }
    }

    // Update streak if needed
    if (shouldUpdateStreak) {
      const newStreak = streak.currentStreak + 1;
      const milestones = JSON.parse(streak.milestones);
      
      // Check for new milestone
      const milestoneValues = [7, 14, 30, 60, 90, 180, 365];
      const newMilestones = milestoneValues.filter(m => m <= newStreak && !milestones.includes(m));
      
      streak = await prisma.dailyStreak.update({
        where: { userId },
        data: {
          currentStreak: newStreak,
          bestStreak: Math.max(streak.bestStreak, newStreak),
          lastLoginDate: now,
          milestones: JSON.stringify([...milestones, ...newMilestones]),
        },
      });
    }

    // Calculate today's login bonus
    const dayInCycle = ((streak.currentStreak - 1) % 7) + 1;
    const loginBonus = getLoginBonus(dayInCycle);

    // Check if today's bonus already claimed
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const todayBonus = await prisma.loginBonus.findFirst({
      where: {
        userId,
        claimedAt: { gte: todayStart },
      },
    });

    return NextResponse.json({
      success: true,
      streak: {
        current: streak.currentStreak,
        best: streak.bestStreak,
        lastLogin: streak.lastLoginDate,
        streakFreeze: streak.streakFreeze,
        milestones: JSON.parse(streak.milestones),
        totalRewards: streak.totalRewards,
      },
      loginBonus: {
        dayInCycle,
        ...loginBonus,
        claimed: !!todayBonus,
      },
      isNewDay,
      streakUpdated: shouldUpdateStreak,
    });
  } catch (error) {
    console.error('Error fetching streak:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch streak' },
      { status: 500 }
    );
  }
}

// POST - Claim login bonus
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    const streak = await prisma.dailyStreak.findUnique({
      where: { userId },
    });

    if (!streak) {
      return NextResponse.json(
        { success: false, error: 'Streak not found' },
        { status: 404 }
      );
    }

    // Check if already claimed today
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const todayBonus = await prisma.loginBonus.findFirst({
      where: {
        userId,
        claimedAt: { gte: todayStart },
      },
    });

    if (todayBonus) {
      return NextResponse.json(
        { success: false, error: 'Bonus already claimed today' },
        { status: 400 }
      );
    }

    // Calculate bonus
    const dayInCycle = ((streak.currentStreak - 1) % 7) + 1;
    const bonus = getLoginBonus(dayInCycle);

    // Award bonus
    await prisma.loginBonus.create({
      data: {
        userId,
        dayNumber: dayInCycle,
        pointsGiven: bonus.points,
        bonusGiven: JSON.stringify(bonus.bonus || {}),
      },
    });

    // Update user points and total rewards
    await prisma.dailyStreak.update({
      where: { userId },
      data: {
        totalRewards: { increment: bonus.points },
      },
    });

    // Update user's main points
    await prisma.user.update({
      where: { id: userId },
      data: { points: { increment: bonus.points } },
    });

    return NextResponse.json({
      success: true,
      bonus: {
        dayInCycle,
        ...bonus,
      },
      message: `Day ${dayInCycle} bonus claimed! +${bonus.points} points`,
    });
  } catch (error) {
    console.error('Error claiming bonus:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to claim bonus' },
      { status: 500 }
    );
  }
}

// Helper function to get login bonus by day
function getLoginBonus(day: number): { points: number; bonus?: { type: string; value: number } } {
  const bonuses: Record<number, { points: number; bonus?: { type: string; value: number } }> = {
    1: { points: 10 },
    2: { points: 15 },
    3: { points: 20 },
    4: { points: 25 },
    5: { points: 30 },
    6: { points: 40, bonus: { type: 'streak_freeze', value: 1 } },
    7: { points: 100, bonus: { type: 'bonus_multiplier', value: 2 } },
  };
  
  return bonuses[day] || { points: 10 };
}
