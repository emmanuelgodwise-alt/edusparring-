import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// Safety Badge Types
export enum SafetyBadgeType {
  SAFE_CHATTER = 'safe_chatter',       // No violations in chat
  KIND_FRIEND = 'kind_friend',         // Reported for kindness
  HELPER = 'helper',                    // Helped other students
  REPORTER = 'reporter',               // Reported safety issues
  GUARDIAN_APPROVED = 'guardian_approved', // Verified by parent/guardian
  GOOD_SPORTSMAN = 'good_sportsmanship', // Good behavior in matches
  PEACEMAKER = 'peacemaker',           // Resolved conflicts
  MENTOR = 'mentor',                   // Tutored other students
  VERIFIED_STUDENT = 'verified_student', // School email verified
  MODEL_CITIZEN = 'model_citizen',     // Top safety points
}

// Badge definitions
const BADGE_DEFINITIONS: Record<SafetyBadgeType, {
  name: string;
  description: string;
  icon: string;
  maxLevel: number;
  pointsPerLevel: number;
}> = {
  [SafetyBadgeType.SAFE_CHATTER]: {
    name: 'Safe Chatter',
    description: 'Maintained clean conversation history',
    icon: '🛡️',
    maxLevel: 5,
    pointsPerLevel: 10,
  },
  [SafetyBadgeType.KIND_FRIEND]: {
    name: 'Kind Friend',
    description: 'Recognized for kindness by peers',
    icon: '💚',
    maxLevel: 5,
    pointsPerLevel: 5,
  },
  [SafetyBadgeType.HELPER]: {
    name: 'Helper',
    description: 'Helped other students succeed',
    icon: '🤝',
    maxLevel: 5,
    pointsPerLevel: 8,
  },
  [SafetyBadgeType.REPORTER]: {
    name: 'Safety Guardian',
    description: 'Reported safety concerns to help protect others',
    icon: '👁️',
    maxLevel: 5,
    pointsPerLevel: 3,
  },
  [SafetyBadgeType.GUARDIAN_APPROVED]: {
    name: 'Guardian Verified',
    description: 'Account verified and monitored by parent/guardian',
    icon: '👨‍👩‍👧',
    maxLevel: 1,
    pointsPerLevel: 1,
  },
  [SafetyBadgeType.GOOD_SPORTSMAN]: {
    name: 'Good Sportsmanship',
    description: 'Displayed excellent behavior in matches',
    icon: '🏆',
    maxLevel: 5,
    pointsPerLevel: 15,
  },
  [SafetyBadgeType.PEACEMAKER]: {
    name: 'Peacemaker',
    description: 'Helped resolve conflicts between students',
    icon: '☮️',
    maxLevel: 3,
    pointsPerLevel: 5,
  },
  [SafetyBadgeType.MENTOR]: {
    name: 'Mentor',
    description: 'Tutored and guided other students',
    icon: '🎓',
    maxLevel: 5,
    pointsPerLevel: 10,
  },
  [SafetyBadgeType.VERIFIED_STUDENT]: {
    name: 'Verified Student',
    description: 'Verified with school email address',
    icon: '✅',
    maxLevel: 1,
    pointsPerLevel: 1,
  },
  [SafetyBadgeType.MODEL_CITIZEN]: {
    name: 'Model Citizen',
    description: 'Top safety score in the community',
    icon: '⭐',
    maxLevel: 5,
    pointsPerLevel: 100,
  },
};

// GET - Get user's safety badges
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'userId required' }, { status: 400 });
  }

  try {
    const badges = await prisma.safetyBadge.findMany({
      where: { userId },
      orderBy: { earnedAt: 'desc' },
    });

    // Calculate total safety score
    const totalPoints = badges.reduce((acc, badge) => acc + badge.points, 0);

    // Get behavior logs count
    const positiveBehaviors = await prisma.positiveBehaviorLog.count({
      where: { userId },
    });

    // Get moderation stats
    const moderationLogs = await prisma.moderationLog.count({
      where: { userId, isSafe: false },
    });

    // Calculate safety score (positive - negative * weight)
    const safetyScore = Math.max(0, totalPoints * 10 - moderationLogs * 20);

    // Enrich badges with definitions
    const enrichedBadges = badges.map(badge => ({
      ...badge,
      definition: BADGE_DEFINITIONS[badge.badgeType as SafetyBadgeType] || null,
    }));

    return NextResponse.json({
      success: true,
      badges: enrichedBadges,
      stats: {
        totalPoints,
        positiveBehaviors,
        violations: moderationLogs,
        safetyScore,
      },
      availableBadges: Object.entries(BADGE_DEFINITIONS).map(([type, def]) => ({
        type,
        ...def,
        earned: badges.some(b => b.badgeType === type),
      })),
    });
  } catch (error) {
    console.error('Failed to get safety badges:', error);
    return NextResponse.json({ error: 'Failed to get badges' }, { status: 500 });
  }
}

// POST - Award safety badge or points
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, badgeType, behavior, points = 1, description } = body;

    if (!userId) {
      return NextResponse.json({ error: 'userId required' }, { status: 400 });
    }

    // If behavior is specified, log it
    if (behavior) {
      await prisma.positiveBehaviorLog.create({
        data: {
          userId,
          behavior,
          description: description || null,
          points,
        },
      });
    }

    // If badgeType is specified, update or create badge
    if (badgeType) {
      const existingBadge = await prisma.safetyBadge.findUnique({
        where: {
          userId_badgeType: { userId, badgeType },
        },
      });

      const badgeDef = BADGE_DEFINITIONS[badgeType as SafetyBadgeType];
      if (!badgeDef) {
        return NextResponse.json({ error: 'Invalid badge type' }, { status: 400 });
      }

      if (existingBadge) {
        // Update existing badge
        const newPoints = existingBadge.points + points;
        const newLevel = Math.min(
          badgeDef.maxLevel,
          Math.floor(newPoints / badgeDef.pointsPerLevel) + 1
        );

        await prisma.safetyBadge.update({
          where: { id: existingBadge.id },
          data: {
            points: newPoints,
            level: newLevel,
          },
        });

        return NextResponse.json({
          success: true,
          badge: {
            ...existingBadge,
            points: newPoints,
            level: newLevel,
          },
          leveledUp: newLevel > existingBadge.level,
        });
      } else {
        // Create new badge
        const newBadge = await prisma.safetyBadge.create({
          data: {
            userId,
            badgeType,
            points,
            level: 1,
          },
        });

        return NextResponse.json({
          success: true,
          badge: newBadge,
          isNewBadge: true,
        });
      }
    }

    return NextResponse.json({ success: true, message: 'Behavior logged' });
  } catch (error) {
    console.error('Failed to award badge:', error);
    return NextResponse.json({ error: 'Failed to award badge' }, { status: 500 });
  }
}
