import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

/**
 * GET /api/sparring/leaderboard
 * Get global leaderboard for sparring scores
 */
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '50');
    const period = url.searchParams.get('period') || 'all_time'; // daily, weekly, monthly, all_time

    // Calculate date filter based on period
    let dateFilter: Date | null = null;
    const now = new Date();
    
    switch (period) {
      case 'daily':
        dateFilter = new Date(now.setDate(now.getDate() - 1));
        break;
      case 'weekly':
        dateFilter = new Date(now.setDate(now.getDate() - 7));
        break;
      case 'monthly':
        dateFilter = new Date(now.setMonth(now.getMonth() - 1));
        break;
      default:
        dateFilter = null; // All time
    }

    // Aggregate scores by player
    const sessions = await prisma.sparringSession.findMany({
      where: {
        status: 'completed',
        ...(dateFilter && { startedAt: { gte: dateFilter } })
      },
      select: {
        playerId: true,
        playerScore: true,
        systemScore: true,
        winner: true
      }
    });

    // Aggregate by player
    const playerStats: Record<string, {
      playerId: string;
      totalScore: number;
      wins: number;
      losses: number;
      draws: number;
      gamesPlayed: number;
    }> = {};

    sessions.forEach(session => {
      const id = session.playerId || 'guest';
      if (!playerStats[id]) {
        playerStats[id] = {
          playerId: id,
          totalScore: 0,
          wins: 0,
          losses: 0,
          draws: 0,
          gamesPlayed: 0
        };
      }

      playerStats[id].totalScore += session.playerScore;
      playerStats[id].gamesPlayed += 1;
      
      if (session.winner === 'player') {
        playerStats[id].wins += 1;
      } else if (session.winner === 'system') {
        playerStats[id].losses += 1;
      } else {
        playerStats[id].draws += 1;
      }
    });

    // Convert to array and sort
    const leaderboard = Object.values(playerStats)
      .sort((a, b) => b.totalScore - a.totalScore)
      .slice(0, limit)
      .map((player, index) => ({
        rank: index + 1,
        playerId: player.playerId,
        displayName: player.playerId === 'guest' ? 'Guest Player' : player.playerId,
        totalScore: player.totalScore,
        wins: player.wins,
        losses: player.losses,
        draws: player.draws,
        gamesPlayed: player.gamesPlayed,
        winRate: player.gamesPlayed > 0 
          ? Math.round((player.wins / player.gamesPlayed) * 100) 
          : 0
      }));

    // Get current player's rank (if playerId provided)
    const currentPlayerId = url.searchParams.get('playerId') || 'guest';
    const currentPlayerStats = playerStats[currentPlayerId];
    const currentRank = currentPlayerStats
      ? leaderboard.findIndex(p => p.playerId === currentPlayerId) + 1 ||
        Object.values(playerStats).sort((a, b) => b.totalScore - a.totalScore)
          .findIndex(p => p.playerId === currentPlayerId) + 1
      : null;

    return NextResponse.json({
      success: true,
      leaderboard,
      period,
      currentPlayer: currentPlayerStats ? {
        rank: currentRank,
        ...leaderboard.find(p => p.playerId === currentPlayerId) || {
          playerId: currentPlayerId,
          displayName: currentPlayerId === 'guest' ? 'Guest Player' : currentPlayerId,
          totalScore: currentPlayerStats.totalScore,
          wins: currentPlayerStats.wins,
          losses: currentPlayerStats.losses,
          draws: currentPlayerStats.draws,
          gamesPlayed: currentPlayerStats.gamesPlayed,
          winRate: currentPlayerStats.gamesPlayed > 0 
            ? Math.round((currentPlayerStats.wins / currentPlayerStats.gamesPlayed) * 100) 
            : 0
        }
      } : null,
      stats: {
        totalPlayers: Object.keys(playerStats).length,
        totalGames: sessions.length,
        period
      }
    });
  } catch (error) {
    console.error('Failed to get leaderboard:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get leaderboard' },
      { status: 500 }
    );
  }
}
