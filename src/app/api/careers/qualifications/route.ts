import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET - Get qualification status for a student
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

    // Get user stats
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        knowledgeRating: true,
        totalWins: true,
        totalLosses: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Get user badges
    const safetyBadges = await prisma.safetyBadge.findMany({
      where: { userId },
    });

    const characterBadges = await prisma.characterBadge.findMany({
      where: { userId },
    });

    // Get or create qualification record
    let qualification = await prisma.careerQualification.findUnique({
      where: { userId },
    });

    if (!qualification) {
      const winRate = user.totalWins + user.totalLosses > 0 
        ? user.totalWins / (user.totalWins + user.totalLosses) 
        : 0;

      qualification = await prisma.careerQualification.create({
        data: {
          userId,
          krCurrent: user.knowledgeRating,
          krRequired: 1200,
          krQualified: user.knowledgeRating >= 1200,
          earnedBadges: JSON.stringify([...safetyBadges, ...characterBadges].map(b => b.badgeType || b.badgeType)),
          winsCurrent: user.totalWins,
          winsRequired: 10,
          winsQualified: user.totalWins >= 10,
          winRateCurrent: winRate,
          winRateRequired: 0.6,
          winRateQualified: winRate >= 0.6,
          fullyQualified: user.knowledgeRating >= 1200 && user.totalWins >= 10 && winRate >= 0.6,
        },
      });
    } else {
      // Update qualification with current stats
      const winRate = user.totalWins + user.totalLosses > 0 
        ? user.totalWins / (user.totalWins + user.totalLosses) 
        : 0;

      const krQualified = user.knowledgeRating >= qualification.krRequired;
      const winsQualified = user.totalWins >= qualification.winsRequired;
      const winRateQualified = winRate >= qualification.winRateRequired;
      const fullyQualified = krQualified && winsQualified && winRateQualified;

      qualification = await prisma.careerQualification.update({
        where: { userId },
        data: {
          krCurrent: user.knowledgeRating,
          krQualified,
          winsCurrent: user.totalWins,
          winsQualified,
          winRateCurrent: winRate,
          winRateQualified,
          fullyQualified,
          qualifiedAt: fullyQualified && !qualification.qualifiedAt ? new Date() : qualification.qualifiedAt,
        },
      });
    }

    // Determine qualification tier
    let tier = 'none';
    if (user.knowledgeRating >= 1600) tier = 'platinum';
    else if (user.knowledgeRating >= 1400) tier = 'gold';
    else if (user.knowledgeRating >= 1200) tier = 'silver';
    else if (user.knowledgeRating >= 1000) tier = 'bronze';

    return NextResponse.json({
      success: true,
      qualification: {
        ...qualification,
        tier,
      },
      stats: {
        kr: user.knowledgeRating,
        wins: user.totalWins,
        losses: user.totalLosses,
        winRate: user.totalWins + user.totalLosses > 0 
          ? user.totalWins / (user.totalWins + user.totalLosses) 
          : 0,
        safetyBadges: safetyBadges.length,
        characterBadges: characterBadges.length,
      },
    });
  } catch (error) {
    console.error('Error fetching qualification:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch qualification' },
      { status: 500 }
    );
  }
}

// PUT - Update qualification requirements (admin)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, krRequired, winsRequired, winRateRequired, requiredBadges } = body;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    const updateData: any = {};
    if (krRequired !== undefined) updateData.krRequired = krRequired;
    if (winsRequired !== undefined) updateData.winsRequired = winsRequired;
    if (winRateRequired !== undefined) updateData.winRateRequired = winRateRequired;
    if (requiredBadges) updateData.requiredBadges = JSON.stringify(requiredBadges);

    const qualification = await prisma.careerQualification.update({
      where: { userId },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      qualification,
    });
  } catch (error) {
    console.error('Error updating qualification:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update qualification' },
      { status: 500 }
    );
  }
}
