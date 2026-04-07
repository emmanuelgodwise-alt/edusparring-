import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');
    const email = url.searchParams.get('email');

    if (!userId && !email) {
      return NextResponse.json(
        { success: false, error: 'User ID or email required' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: userId ? { id: userId } : { email: email! },
      include: {
        subjects: true,
        achievements: {
          include: { achievement: true },
          orderBy: { earnedAt: 'desc' },
          take: 10
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
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
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
        subjects: user.subjects.map(s => ({
          subject: s.subject,
          proficiency: s.proficiency
        })),
        achievements: user.achievements.map(a => ({
          name: a.achievement.name,
          icon: a.achievement.icon,
          earnedAt: a.earnedAt.toISOString()
        }))
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get user' },
      { status: 500 }
    );
  }
}
