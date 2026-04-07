import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Badge definitions
const BADGE_TYPES = {
  helper: { name: 'Helper', description: 'Helps others in study circles', icon: '🤝', color: 'green' },
  leader: { name: 'Leader', description: 'Creates and leads study groups', icon: '👑', color: 'yellow' },
  honest: { name: 'Honest', description: 'Demonstrates academic integrity', icon: '✓', color: 'blue' },
  resilient: { name: 'Resilient', description: 'Shows persistence in learning', icon: '💪', color: 'orange' },
  kind: { name: 'Kind', description: 'Shows kindness to others', icon: '❤️', color: 'pink' },
  scholar: { name: 'Scholar', description: 'Achieves academic excellence', icon: '📚', color: 'purple' },
  mentor: { name: 'Mentor', description: 'Helps peers through tutoring', icon: '🎓', color: 'cyan' },
  verified: { name: 'Verified Student', description: 'Verified school email', icon: '✓', color: 'blue' }
};

// GET - Get user badges
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Missing userId' },
        { status: 400 }
      );
    }

    const badges = await db.characterBadge.findMany({
      where: { userId },
      orderBy: { earnedAt: 'desc' }
    });

    // Add badge type info
    const badgesWithInfo = badges.map(badge => ({
      ...badge,
      metadata: JSON.parse(badge.metadata),
      typeInfo: BADGE_TYPES[badge.badgeType as keyof typeof BADGE_TYPES] || {
        name: badge.badgeType,
        description: 'Special badge',
        icon: '🏆',
        color: 'gray'
      }
    }));

    return NextResponse.json({
      success: true,
      badges: badgesWithInfo,
      availableBadges: Object.entries(BADGE_TYPES).map(([type, info]) => ({
        type,
        ...info,
        isEarned: badges.some(b => b.badgeType === type)
      }))
    });

  } catch (error) {
    console.error('Get badges error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get badges' },
      { status: 500 }
    );
  }
}

// POST - Award a badge (internal use)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, badgeType, level, metadata } = body;

    if (!userId || !badgeType) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate badge type
    if (!BADGE_TYPES[badgeType as keyof typeof BADGE_TYPES]) {
      return NextResponse.json(
        { success: false, error: 'Invalid badge type' },
        { status: 400 }
      );
    }

    const badge = await db.characterBadge.upsert({
      where: {
        userId_badgeType: {
          userId,
          badgeType
        }
      },
      create: {
        userId,
        badgeType,
        level: level || 1,
        metadata: JSON.stringify(metadata || {})
      },
      update: {
        level: level || undefined,
        metadata: metadata ? JSON.stringify(metadata) : undefined
      }
    });

    return NextResponse.json({
      success: true,
      badge: {
        ...badge,
        metadata: JSON.parse(badge.metadata),
        typeInfo: BADGE_TYPES[badgeType as keyof typeof BADGE_TYPES]
      }
    });

  } catch (error) {
    console.error('Award badge error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to award badge' },
      { status: 500 }
    );
  }
}
