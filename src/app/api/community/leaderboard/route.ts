import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const category = url.searchParams.get('category') || 'global';
    const limit = parseInt(url.searchParams.get('limit') || '50');

    const leaderboard = await prisma.leaderboard.findMany({
      where: { category },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
            knowledgeRating: true,
            points: true,
            country: true
          }
        }
      },
      orderBy: { rank: 'asc' },
      take: limit
    });

    const entries = leaderboard.map((entry, index) => ({
      rank: index + 1,
      userId: entry.user.id,
      name: entry.user.name,
      avatar: entry.user.avatar,
      knowledgeRating: entry.user.knowledgeRating,
      points: entry.user.points,
      country: entry.user.country
    }));

    return NextResponse.json({
      success: true,
      leaderboard: entries,
      category
    });
  } catch (error) {
    console.error('Leaderboard error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get leaderboard' },
      { status: 500 }
    );
  }
}
