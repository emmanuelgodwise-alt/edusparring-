import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCountryFlag } from '@/lib/i18n';

/**
 * GET /api/leaderboard/global
 * Get global leaderboard with country filtering
 * 
 * Query params:
 * - country: Filter by country code (optional)
 * - period: Time period - daily, weekly, monthly, all_time (default: all_time)
 * - limit: Number of results (default: 50)
 * - offset: Pagination offset (default: 0)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const country = searchParams.get('country');
    const period = searchParams.get('period') || 'all_time';
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    // Build user filter for country
    const userFilter: Record<string, unknown> = {};
    if (country && country !== 'all') {
      userFilter.country = country;
    }

    // Get users with their stats, ordered by KR
    const users = await db.user.findMany({
      where: userFilter,
      select: {
        id: true,
        name: true,
        avatar: true,
        knowledgeRating: true,
        country: true,
        totalWins: true,
        totalLosses: true,
        currentStreak: true,
        bestStreak: true,
        points: true,
        isGlobalChampion: true,
      },
      orderBy: [
        { knowledgeRating: 'desc' },
        { totalWins: 'desc' }
      ],
      take: limit,
      skip: offset
    });

    // Get total count for pagination
    const totalUsers = await db.user.count({
      where: userFilter
    });

    // Transform users for leaderboard
    const leaderboard = users.map((user, index) => {
      const winRate = user.totalWins + user.totalLosses > 0
        ? Math.round((user.totalWins / (user.totalWins + user.totalLosses)) * 100)
        : 0;
      
      const rank = offset + index + 1;
      
      return {
        rank,
        userId: user.id,
        name: user.name,
        avatar: user.avatar,
        country: user.country,
        countryFlag: getCountryFlag(user.country || ''),
        knowledgeRating: user.knowledgeRating,
        points: user.points,
        totalWins: user.totalWins,
        totalLosses: user.totalLosses,
        winRate,
        currentStreak: user.currentStreak,
        bestStreak: user.bestStreak,
        isGlobalChampion: user.isGlobalChampion,
        // Special badges
        badges: getBadges(rank, user.isGlobalChampion, user.currentStreak)
      };
    });

    // Get top 3 for podium display
    const podium = leaderboard.slice(0, 3);

    // Get country stats
    const countryStats = await getCountryStats();

    return NextResponse.json({
      success: true,
      leaderboard,
      podium,
      total: totalUsers,
      hasMore: offset + limit < totalUsers,
      countryFilter: country || 'all',
      period,
      countryStats
    });
  } catch (error) {
    console.error('Error fetching global leaderboard:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch leaderboard' },
      { status: 500 }
    );
  }
}

// Get badges for a player
function getBadges(rank: number, isChampion: boolean, streak: number): string[] {
  const badges: string[] = [];
  
  if (isChampion) {
    badges.push('global_champion');
  }
  
  if (rank === 1) {
    badges.push('gold');
  } else if (rank === 2) {
    badges.push('silver');
  } else if (rank === 3) {
    badges.push('bronze');
  }
  
  if (streak >= 10) {
    badges.push('hot_streak');
  } else if (streak >= 5) {
    badges.push('on_fire');
  }
  
  return badges;
}

// Get country statistics
async function getCountryStats() {
  const users = await db.user.findMany({
    select: {
      country: true,
      knowledgeRating: true,
      totalWins: true,
      totalLosses: true
    }
  });

  // Aggregate by country
  const countryMap = new Map<string, {
    code: string;
    playerCount: number;
    totalRating: number;
    totalWins: number;
    totalLosses: number;
  }>();

  users.forEach(user => {
    if (!user.country) return;
    
    const existing = countryMap.get(user.country) || {
      code: user.country,
      playerCount: 0,
      totalRating: 0,
      totalWins: 0,
      totalLosses: 0
    };

    existing.playerCount++;
    existing.totalRating += user.knowledgeRating;
    existing.totalWins += user.totalWins;
    existing.totalLosses += user.totalLosses;

    countryMap.set(user.country, existing);
  });

  // Convert to array and sort
  const countryStats = Array.from(countryMap.values())
    .map(c => ({
      code: c.code,
      flag: getCountryFlag(c.code),
      playerCount: c.playerCount,
      avgRating: Math.round(c.totalRating / c.playerCount),
      totalWins: c.totalWins,
      winRate: Math.round((c.totalWins / (c.totalWins + c.totalLosses)) * 100) || 0
    }))
    .sort((a, b) => b.avgRating - a.avgRating)
    .slice(0, 20);

  return countryStats;
}
