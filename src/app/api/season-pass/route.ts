import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// Season pass reward tiers configuration
const DEFAULT_FREE_REWARDS = [
  { tier: 1, type: 'points', value: 100, icon: '💎', name: '100 Points' },
  { tier: 5, type: 'streak_freeze', value: 1, icon: '❄️', name: 'Streak Freeze' },
  { tier: 10, type: 'points', value: 250, icon: '💎', name: '250 Points' },
  { tier: 15, type: 'badge', value: 1, icon: '🎖️', name: 'Season Badge Frame' },
  { tier: 20, type: 'points', value: 500, icon: '💎', name: '500 Points' },
  { tier: 25, type: 'cosmetic', value: 1, icon: '✨', name: 'Common Avatar Frame' },
  { tier: 30, type: 'streak_freeze', value: 2, icon: '❄️', name: '2x Streak Freeze' },
  { tier: 35, type: 'points', value: 750, icon: '💎', name: '750 Points' },
  { tier: 40, type: 'cosmetic', value: 1, icon: '🌟', name: 'Card Back Design' },
  { tier: 45, type: 'points', value: 1000, icon: '💎', name: '1000 Points' },
  { tier: 50, type: 'badge', value: 1, icon: '🏆', name: 'Season Veteran Badge' },
];

const DEFAULT_PREMIUM_REWARDS = [
  { tier: 1, type: 'points', value: 200, icon: '💎', name: '200 Points' },
  { tier: 2, type: 'cosmetic', value: 1, icon: '👑', name: 'Premium Avatar Frame' },
  { tier: 3, type: 'streak_freeze', value: 2, icon: '❄️', name: '2x Streak Freeze' },
  { tier: 4, type: 'points', value: 300, icon: '💎', name: '300 Points' },
  { tier: 5, type: 'cosmetic', value: 1, icon: '🎭', name: 'Animated Title' },
  { tier: 6, type: 'bonus_xp', value: 500, icon: '⚡', name: '500 Bonus XP' },
  { tier: 7, type: 'points', value: 400, icon: '💎', name: '400 Points' },
  { tier: 8, type: 'cosmetic', value: 1, icon: '🌟', name: 'Premium Card Back' },
  { tier: 9, type: 'streak_freeze', value: 3, icon: '❄️', name: '3x Streak Freeze' },
  { tier: 10, type: 'points', value: 500, icon: '💎', name: '500 Points' },
  { tier: 15, type: 'cosmetic', value: 1, icon: '🔥', name: 'Battle Effects Pack' },
  { tier: 20, type: 'bonus_xp', value: 1000, icon: '⚡', name: '1000 Bonus XP' },
  { tier: 25, type: 'cosmetic', value: 1, icon: '💫', name: 'Victory Animation' },
  { tier: 30, type: 'points', value: 1000, icon: '💎', name: '1000 Points' },
  { tier: 35, type: 'cosmetic', value: 1, icon: '🎖️', name: 'Elite Badge Frame' },
  { tier: 40, type: 'streak_freeze', value: 5, icon: '❄️', name: '5x Streak Freeze' },
  { tier: 45, type: 'points', value: 2000, icon: '💎', name: '2000 Points' },
  { tier: 50, type: 'badge', value: 1, icon: '👑', name: 'Season Champion Title' },
];

// GET - Get current season pass info
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

    // Get or create current active season pass
    let seasonPass = await prisma.seasonPass.findFirst({
      where: { status: 'active' },
    });

    // Create a new season pass if none exists
    if (!seasonPass) {
      const now = new Date();
      const endDate = new Date(now);
      endDate.setDate(endDate.getDate() + 90); // 90-day season

      seasonPass = await prisma.seasonPass.create({
        data: {
          seasonId: `season-${Date.now()}`,
          name: 'Season 1: Rise of Scholars',
          description: 'Complete challenges, earn XP, and unlock exclusive rewards!',
          startDate: now,
          endDate,
          status: 'active',
          freeTiers: JSON.stringify(DEFAULT_FREE_REWARDS),
          premiumTiers: JSON.stringify(DEFAULT_PREMIUM_REWARDS),
          totalTiers: 50,
          totalXpRequired: 10000,
        },
      });
    }

    // Get user's progress
    let userProgress = await prisma.userSeasonPass.findUnique({
      where: {
        userId_seasonPassId: {
          userId,
          seasonPassId: seasonPass.id,
        },
      },
    });

    // Create user progress if not exists
    if (!userProgress) {
      userProgress = await prisma.userSeasonPass.create({
        data: {
          userId,
          seasonPassId: seasonPass.id,
          maxXp: seasonPass.totalXpRequired,
        },
      });
    }

    // Calculate tier progress
    const freeRewards = JSON.parse(seasonPass.freeTiers);
    const premiumRewards = JSON.parse(seasonPass.premiumTiers);
    const freeRewardsClaimed = JSON.parse(userProgress.freeRewardsClaimed);
    const premiumRewardsClaimed = JSON.parse(userProgress.premiumRewardsClaimed);

    // Calculate current tier based on XP
    const xpPerTier = seasonPass.totalXpRequired / seasonPass.totalTiers;
    const calculatedTier = Math.floor(userProgress.currentXp / xpPerTier) + 1;

    // Get available rewards
    const availableFreeRewards = freeRewards.filter(
      (r: any) => r.tier <= calculatedTier && !freeRewardsClaimed.includes(r.tier)
    );
    const availablePremiumRewards = premiumRewards.filter(
      (r: any) => r.tier <= calculatedTier && !premiumRewardsClaimed.includes(r.tier) && userProgress?.isPremium
    );

    // Calculate days remaining
    const daysRemaining = Math.max(
      0,
      Math.ceil((new Date(seasonPass.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    );

    // Calculate XP progress percentage
    const xpProgress = Math.min(100, (userProgress.currentXp / seasonPass.totalXpRequired) * 100);
    const tierProgress = ((userProgress.currentXp % xpPerTier) / xpPerTier) * 100;

    return NextResponse.json({
      success: true,
      seasonPass: {
        id: seasonPass.id,
        name: seasonPass.name,
        description: seasonPass.description,
        startDate: seasonPass.startDate,
        endDate: seasonPass.endDate,
        status: seasonPass.status,
        totalTiers: seasonPass.totalTiers,
        premiumPrice: seasonPass.premiumPrice,
        participantCount: seasonPass.participantCount,
        premiumPurchases: seasonPass.premiumPurchases,
        daysRemaining,
      },
      progress: {
        currentXp: userProgress.currentXp,
        maxXp: userProgress.maxXp,
        currentTier: calculatedTier,
        xpProgress,
        tierProgress,
        isPremium: userProgress.isPremium,
        matchesPlayed: userProgress.matchesPlayed,
        questsCompleted: userProgress.questsCompleted,
      },
      rewards: {
        free: freeRewards,
        premium: premiumRewards,
        freeClaimed: freeRewardsClaimed,
        premiumClaimed: premiumRewardsClaimed,
        availableFree: availableFreeRewards,
        availablePremium: availablePremiumRewards,
      },
    });
  } catch (error) {
    console.error('Error fetching season pass:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch season pass' },
      { status: 500 }
    );
  }
}

// POST - Add XP to season pass
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, xpAmount, source = 'match' } = body;

    if (!userId || !xpAmount) {
      return NextResponse.json(
        { success: false, error: 'User ID and XP amount are required' },
        { status: 400 }
      );
    }

    // Get active season pass
    const seasonPass = await prisma.seasonPass.findFirst({
      where: { status: 'active' },
    });

    if (!seasonPass) {
      return NextResponse.json(
        { success: false, error: 'No active season pass' },
        { status: 400 }
      );
    }

    // Get user progress
    let userProgress = await prisma.userSeasonPass.findUnique({
      where: {
        userId_seasonPassId: {
          userId,
          seasonPassId: seasonPass.id,
        },
      },
    });

    if (!userProgress) {
      userProgress = await prisma.userSeasonPass.create({
        data: {
          userId,
          seasonPassId: seasonPass.id,
          maxXp: seasonPass.totalXpRequired,
        },
      });
    }

    // Update XP
    const newXp = Math.min(userProgress.currentXp + xpAmount, seasonPass.totalXpRequired);
    const oldTier = Math.floor(userProgress.currentXp / (seasonPass.totalXpRequired / seasonPass.totalTiers)) + 1;
    const newTier = Math.floor(newXp / (seasonPass.totalXpRequired / seasonPass.totalTiers)) + 1;
    const tierUp = newTier > oldTier;

    userProgress = await prisma.userSeasonPass.update({
      where: { id: userProgress.id },
      data: {
        currentXp: newXp,
        matchesPlayed: source === 'match' ? { increment: 1 } : undefined,
        questsCompleted: source === 'quest' ? { increment: 1 } : undefined,
      },
    });

    // Log XP transaction
    await prisma.xpTransaction.create({
      data: {
        userId,
        amount: xpAmount,
        source,
        balanceAfter: newXp,
      },
    });

    return NextResponse.json({
      success: true,
      xpAdded: xpAmount,
      newXp: userProgress.currentXp,
      oldTier,
      newTier,
      tierUp,
      message: tierUp ? `🎉 Tier ${newTier} unlocked!` : `+${xpAmount} XP`,
    });
  } catch (error) {
    console.error('Error adding XP:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to add XP' },
      { status: 500 }
    );
  }
}

// PUT - Claim reward
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, tier, isPremium = false } = body;

    if (!userId || !tier) {
      return NextResponse.json(
        { success: false, error: 'User ID and tier are required' },
        { status: 400 }
      );
    }

    // Get active season pass
    const seasonPass = await prisma.seasonPass.findFirst({
      where: { status: 'active' },
    });

    if (!seasonPass) {
      return NextResponse.json(
        { success: false, error: 'No active season pass' },
        { status: 400 }
      );
    }

    // Get user progress
    const userProgress = await prisma.userSeasonPass.findUnique({
      where: {
        userId_seasonPassId: {
          userId,
          seasonPassId: seasonPass.id,
        },
      },
    });

    if (!userProgress) {
      return NextResponse.json(
        { success: false, error: 'User progress not found' },
        { status: 404 }
      );
    }

    // Check tier is unlocked
    if (tier > userProgress.currentTier) {
      return NextResponse.json(
        { success: false, error: 'Tier not yet unlocked' },
        { status: 400 }
      );
    }

    // Check premium requirement
    if (isPremium && !userProgress.isPremium) {
      return NextResponse.json(
        { success: false, error: 'Premium pass required for this reward' },
        { status: 403 }
      );
    }

    // Get reward
    const rewards = isPremium
      ? JSON.parse(seasonPass.premiumTiers)
      : JSON.parse(seasonPass.freeTiers);
    const reward = rewards.find((r: any) => r.tier === tier);

    if (!reward) {
      return NextResponse.json(
        { success: false, error: 'Reward not found' },
        { status: 404 }
      );
    }

    // Check if already claimed
    const claimedKey = isPremium ? 'premiumRewardsClaimed' : 'freeRewardsClaimed';
    const claimed = JSON.parse((userProgress as any)[claimedKey]);
    if (claimed.includes(tier)) {
      return NextResponse.json(
        { success: false, error: 'Reward already claimed' },
        { status: 400 }
      );
    }

    // Claim reward
    await prisma.userSeasonPass.update({
      where: { id: userProgress.id },
      data: {
        [claimedKey]: JSON.stringify([...claimed, tier]),
      },
    });

    // Apply reward to user
    if (reward.type === 'points') {
      await prisma.user.update({
        where: { id: userId },
        data: { points: { increment: reward.value } },
      });
    } else if (reward.type === 'streak_freeze') {
      await prisma.dailyStreak.update({
        where: { userId },
        data: { streakFreeze: { increment: reward.value } },
      });
    } else if (reward.type === 'cosmetic' || reward.type === 'badge') {
      await prisma.userCosmetic.create({
        data: {
          userId,
          itemType: reward.type === 'badge' ? 'badge_border' : 'avatar_frame',
          itemId: `season-${seasonPass.seasonId}-${tier}`,
          itemName: reward.name,
          rarity: 'rare',
          source: isPremium ? 'season_pass_premium' : 'season_pass',
        },
      });
    }

    return NextResponse.json({
      success: true,
      reward: {
        tier,
        name: reward.name,
        type: reward.type,
        value: reward.value,
        icon: reward.icon,
      },
      message: `🎉 Claimed: ${reward.name}!`,
    });
  } catch (error) {
    console.error('Error claiming reward:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to claim reward' },
      { status: 500 }
    );
  }
}
