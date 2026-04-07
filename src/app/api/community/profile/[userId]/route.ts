import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        subjects: true,
        achievements: {
          include: { achievement: true },
          orderBy: { earnedAt: 'desc' }
        },
        matchesAsP1: {
          where: { status: 'completed' },
          orderBy: { createdAt: 'desc' },
          take: 10,
          include: { player2: { select: { name: true } } }
        }
      }
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      profile: {
        id: user.id,
        name: user.name,
        avatar: user.avatar,
        knowledgeRating: user.knowledgeRating,
        level: user.level,
        bio: user.bio,
        country: user.country,
        points: user.points,
        totalWins: user.totalWins,
        totalLosses: user.totalLosses,
        currentStreak: user.currentStreak,
        bestStreak: user.bestStreak,
        subjects: user.subjects,
        achievements: user.achievements.map(a => ({
          name: a.achievement.name,
          icon: a.achievement.icon,
          description: a.achievement.description,
          earnedAt: a.earnedAt.toISOString()
        })),
        recentMatches: user.matchesAsP1.map(m => ({
          id: m.id,
          opponent: m.player2.name,
          playerScore: m.player1Score,
          opponentScore: m.player2Score,
          won: m.winnerId === userId,
          date: m.createdAt.toISOString()
        }))
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get profile' },
      { status: 500 }
    );
  }
}
