import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// Default spin wheel prizes
const DEFAULT_PRIZES = [
  { name: '10 Points', type: 'points', value: 10, rarity: 'common', probability: 25, icon: '💎', color: 'from-blue-500 to-blue-600' },
  { name: '25 Points', type: 'points', value: 25, rarity: 'common', probability: 20, icon: '💎', color: 'from-blue-400 to-blue-500' },
  { name: '50 Points', type: 'points', value: 50, rarity: 'uncommon', probability: 15, icon: '💎', color: 'from-green-500 to-green-600' },
  { name: '100 Points', type: 'points', value: 100, rarity: 'uncommon', probability: 10, icon: '💎', color: 'from-green-400 to-green-500' },
  { name: 'Streak Freeze', type: 'streak_freeze', value: 1, rarity: 'rare', probability: 8, icon: '❄️', color: 'from-cyan-500 to-cyan-600' },
  { name: '200 Points', type: 'points', value: 200, rarity: 'rare', probability: 7, icon: '💎', color: 'from-purple-500 to-purple-600' },
  { name: '2x Streak Freeze', type: 'streak_freeze', value: 2, rarity: 'epic', probability: 5, icon: '❄️', color: 'from-pink-500 to-pink-600' },
  { name: '500 Points', type: 'points', value: 500, rarity: 'epic', probability: 4, icon: '💎', color: 'from-yellow-500 to-yellow-600' },
  { name: 'Premium Day', type: 'premium_day', value: 1, rarity: 'epic', probability: 3, icon: '👑', color: 'from-amber-500 to-amber-600' },
  { name: '1000 Points', type: 'points', value: 1000, rarity: 'legendary', probability: 2, icon: '💎', color: 'from-red-500 to-orange-500' },
  { name: 'Mystery Box', type: 'mystery_box', value: 1, rarity: 'legendary', probability: 1, icon: '🎁', color: 'from-purple-600 to-pink-600' },
];

// GET - Get spin wheel prizes and user spin status
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  try {
    // Get or create prizes in database
    let prizes = await prisma.spinWheelPrize.findMany({
      where: { isActive: true },
      orderBy: { probability: 'desc' },
    });

    if (prizes.length === 0) {
      // Create default prizes
      for (const prize of DEFAULT_PRIZES) {
        await prisma.spinWheelPrize.create({
          data: {
            name: prize.name,
            type: prize.type,
            value: prize.value,
            rarity: prize.rarity,
            probability: prize.probability,
            icon: prize.icon,
            color: JSON.stringify({ gradient: prize.color }),
          },
        });
      }
      prizes = await prisma.spinWheelPrize.findMany({
        where: { isActive: true },
        orderBy: { probability: 'desc' },
      });
    }

    // Get user's daily spin status
    let userSpin = userId ? await prisma.userDailySpin.findUnique({
      where: { userId },
    }) : null;

    // Create user spin record if not exists
    if (userId && !userSpin) {
      userSpin = await prisma.userDailySpin.create({
        data: { userId },
      });
    }

    // Check if free spin should be reset (new day)
    const now = new Date();
    const lastSpinDate = userSpin?.lastFreeSpinAt;
    let freeSpins = userSpin?.freeSpins ?? 1;

    if (lastSpinDate) {
      const lastSpinDay = new Date(lastSpinDate.getFullYear(), lastSpinDate.getMonth(), lastSpinDate.getDate());
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      if (today.getTime() > lastSpinDay.getTime()) {
        // Reset daily free spin
        freeSpins = 1;
        if (userSpin) {
          await prisma.userDailySpin.update({
            where: { userId },
            data: { freeSpins: 1 },
          });
        }
      }
    }

    // Get recent spin history for user
    const recentSpins = userId ? await prisma.userSpinHistory.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 10,
    }) : [];

    // Calculate rarity colors for UI
    const rarityColors: Record<string, string> = {
      common: 'from-gray-400 to-gray-500',
      uncommon: 'from-green-400 to-green-500',
      rare: 'from-blue-400 to-blue-500',
      epic: 'from-purple-400 to-purple-500',
      legendary: 'from-yellow-400 to-orange-500',
    };

    return NextResponse.json({
      success: true,
      prizes: prizes.map(p => ({
        id: p.id,
        name: p.name,
        type: p.type,
        value: p.value,
        rarity: p.rarity,
        probability: p.probability,
        icon: p.icon,
        color: JSON.parse(p.color).gradient || rarityColors[p.rarity],
      })),
      spinStatus: {
        freeSpins: userSpin?.freeSpins ?? freeSpins,
        premiumSpins: userSpin?.premiumSpins ?? 0,
        lastFreeSpin: userSpin?.lastFreeSpinAt,
        consecutiveDays: userSpin?.consecutiveDays ?? 0,
      },
      recentSpins: recentSpins.map(s => ({
        id: s.id,
        prizeName: s.prizeName,
        prizeValue: s.prizeValue,
        prizeRarity: s.prizeRarity,
        isDailySpin: s.isDailySpin,
        createdAt: s.createdAt,
        claimed: s.claimed,
      })),
    });
  } catch (error) {
    console.error('Error fetching spin wheel:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch spin wheel' },
      { status: 500 }
    );
  }
}

// POST - Perform a spin
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, isPremium = false } = body;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Get user's spin status
    let userSpin = await prisma.userDailySpin.findUnique({
      where: { userId },
    });

    if (!userSpin) {
      userSpin = await prisma.userDailySpin.create({
        data: { userId },
      });
    }

    // Check if user has available spins
    const spinsAvailable = isPremium ? userSpin.premiumSpins : userSpin.freeSpins;
    if (spinsAvailable <= 0) {
      return NextResponse.json(
        { success: false, error: 'No spins available' },
        { status: 400 }
      );
    }

    // Get all active prizes
    const prizes = await prisma.spinWheelPrize.findMany({
      where: { isActive: true },
    });

    if (prizes.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No prizes available' },
        { status: 500 }
      );
    }

    // Calculate weighted random prize
    const totalWeight = prizes.reduce((sum, p) => sum + p.probability, 0);
    let random = Math.random() * totalWeight;
    let selectedPrize = prizes[0];

    // Premium users get a slight boost to rare+ prizes
    if (isPremium) {
      random = random * 0.9; // Slightly better odds
    }

    for (const prize of prizes) {
      random -= prize.probability;
      if (random <= 0) {
        selectedPrize = prize;
        break;
      }
    }

    // Record the spin
    const spinRecord = await prisma.userSpinHistory.create({
      data: {
        userId,
        prizeId: selectedPrize.id,
        prizeName: selectedPrize.name,
        prizeType: selectedPrize.type,
        prizeValue: selectedPrize.value,
        prizeRarity: selectedPrize.rarity,
        isDailySpin: !isPremium,
        isPremiumSpin: isPremium,
      },
    });

    // Update user's spin count
    const now = new Date();
    const lastSpin = isPremium ? userSpin.lastPremiumSpinAt : userSpin.lastFreeSpinAt;
    const lastSpinDay = lastSpin ? new Date(lastSpin.getFullYear(), lastSpin.getMonth(), lastSpin.getDate()) : null;
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const newDay = !lastSpinDay || today.getTime() > lastSpinDay.getTime();

    await prisma.userDailySpin.update({
      where: { userId },
      data: {
        [isPremium ? 'premiumSpins' : 'freeSpins']: { decrement: 1 },
        [isPremium ? 'lastPremiumSpinAt' : 'lastFreeSpinAt']: now,
        consecutiveDays: newDay && !isPremium ? { increment: 1 } : undefined,
      },
    });

    // Award the prize
    await awardPrize(userId, selectedPrize);

    // Update prize given count
    await prisma.spinWheelPrize.update({
      where: { id: selectedPrize.id },
      data: { currentGiven: { increment: 1 } },
    });

    // Mark as claimed
    await prisma.userSpinHistory.update({
      where: { id: spinRecord.id },
      data: { claimed: true, claimedAt: now },
    });

    // Calculate spin angle for animation (0-360 degrees)
    const prizeIndex = prizes.findIndex(p => p.id === selectedPrize.id);
    const segmentAngle = 360 / prizes.length;
    const spinAngle = 360 * 5 + (prizeIndex * segmentAngle) + (segmentAngle / 2); // 5 full rotations + landing position

    return NextResponse.json({
      success: true,
      prize: {
        id: selectedPrize.id,
        name: selectedPrize.name,
        type: selectedPrize.type,
        value: selectedPrize.value,
        rarity: selectedPrize.rarity,
        icon: selectedPrize.icon,
        color: JSON.parse(selectedPrize.color).gradient,
      },
      spinAngle,
      remainingSpins: isPremium ? userSpin.premiumSpins - 1 : userSpin.freeSpins - 1,
      message: `🎉 You won: ${selectedPrize.name}!`,
    });
  } catch (error) {
    console.error('Error performing spin:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to perform spin' },
      { status: 500 }
    );
  }
}

// Helper function to award prize to user
async function awardPrize(userId: string, prize: any) {
  switch (prize.type) {
    case 'points':
      await prisma.user.update({
        where: { id: userId },
        data: { points: { increment: prize.value } },
      });
      break;

    case 'streak_freeze':
      await prisma.dailyStreak.update({
        where: { userId },
        data: { streakFreeze: { increment: prize.value } },
      });
      break;

    case 'premium_day':
      // Add premium access for the user
      const subscription = await prisma.userSubscription.findUnique({
        where: { userId },
      });
      if (subscription) {
        const newEndDate = subscription.currentPeriodEnd 
          ? new Date(Math.max(new Date(subscription.currentPeriodEnd).getTime(), Date.now()) + prize.value * 24 * 60 * 60 * 1000)
          : new Date(Date.now() + prize.value * 24 * 60 * 60 * 1000);
        await prisma.userSubscription.update({
          where: { userId },
          data: { 
            currentPeriodEnd: newEndDate,
            status: 'active',
          },
        });
      }
      break;

    case 'mystery_box':
      // Award a random cosmetic
      const cosmetics = ['avatar_frame', 'card_back', 'title', 'effect'];
      const randomCosmetic = cosmetics[Math.floor(Math.random() * cosmetics.length)];
      await prisma.userCosmetic.create({
        data: {
          userId,
          itemType: randomCosmetic,
          itemId: `mystery-${Date.now()}`,
          itemName: `Mystery ${randomCosmetic.replace('_', ' ')}`,
          rarity: ['rare', 'epic', 'legendary'][Math.floor(Math.random() * 3)],
          source: 'spin_wheel',
        },
      });
      break;
  }
}
