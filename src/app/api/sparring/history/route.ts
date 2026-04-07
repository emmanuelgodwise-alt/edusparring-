import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

/**
 * GET /api/sparring/history
 * Get history of past sparring sessions for a player
 */
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const playerId = url.searchParams.get('playerId') || 'guest';
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const offset = parseInt(url.searchParams.get('offset') || '0');

    // Get completed sessions
    const sessions = await prisma.sparringSession.findMany({
      where: {
        playerId,
        status: 'completed'
      },
      orderBy: {
        startedAt: 'desc'
      },
      take: limit,
      skip: offset
    });

    // Get total count
    const total = await prisma.sparringSession.count({
      where: {
        playerId,
        status: 'completed'
      }
    });

    // Calculate stats
    const stats = await prisma.sparringSession.aggregate({
      where: {
        playerId,
        status: 'completed'
      },
      _count: true,
      _sum: {
        playerScore: true,
        systemScore: true
      }
    });

    const wins = sessions.filter(s => s.winner === 'player').length;
    const losses = sessions.filter(s => s.winner === 'system').length;
    const draws = sessions.filter(s => s.winner === 'draw').length;

    return NextResponse.json({
      success: true,
      sessions: sessions.map(session => ({
        id: session.id,
        subject: session.subject,
        difficulty: session.difficulty,
        playerScore: session.playerScore,
        systemScore: session.systemScore,
        winner: session.winner,
        rounds: session.currentRound,
        startedAt: session.startedAt,
        endedAt: session.endedAt,
        isWin: session.winner === 'player',
        isDraw: session.winner === 'draw'
      })),
      stats: {
        totalGames: total,
        wins,
        losses,
        draws,
        winRate: total > 0 ? Math.round((wins / total) * 100) : 0,
        totalPlayerScore: stats._sum.playerScore || 0,
        totalSystemScore: stats._sum.systemScore || 0,
        averagePlayerScore: total > 0 ? Math.round((stats._sum.playerScore || 0) / total) : 0
      },
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    });
  } catch (error) {
    console.error('Failed to get history:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get history' },
      { status: 500 }
    );
  }
}
