import { NextResponse } from 'next/server'
import { 
  getPlayerRank, 
  getRankedLeaderboard, 
  RANK_TIERS,
  getRankTier,
  calculateTierProgress
} from '@/lib/seasonal-leagues'

/**
 * GET /api/rank
 * 
 * Get player rank info or global leaderboard.
 * 
 * Query params:
 * - playerId: Get specific player's rank
 * - leaderboard: Get ranked leaderboard (global, country, school, subject)
 * - limit: Number of results (default: 100)
 */
export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const playerId = url.searchParams.get('playerId')
    const leaderboard = url.searchParams.get('leaderboard')
    const limit = parseInt(url.searchParams.get('limit') || '100')

    // Get specific player rank
    if (playerId) {
      const rank = await getPlayerRank(playerId)
      
      if (!rank) {
        return NextResponse.json(
          { success: false, error: 'Player not found' },
          { status: 404 }
        )
      }

      const tierInfo = getRankTier(rank.currentRating)

      return NextResponse.json({
        success: true,
        rank: {
          ...rank,
          tierInfo: {
            name: tierInfo.name,
            color: tierInfo.color,
            gradient: tierInfo.gradient,
            emoji: tierInfo.emoji,
            progress: calculateTierProgress(rank.currentRating),
            nextTier: rank.currentTier === 'world_champion' 
              ? null 
              : RANK_TIERS[RANK_TIERS.findIndex(t => t.tier === rank.currentTier) + 1]?.name || null,
            pointsToNext: rank.currentTier === 'world_champion'
              ? 0
              : (getRankTier(rank.currentRating).maxRating + 1) - rank.currentRating
          }
        }
      })
    }

    // Get leaderboard
    if (leaderboard) {
      const validCategories = ['global', 'country', 'school', 'subject']
      if (!validCategories.includes(leaderboard)) {
        return NextResponse.json(
          { success: false, error: 'Invalid leaderboard category' },
          { status: 400 }
        )
      }

      const results = await getRankedLeaderboard(leaderboard as any, limit)

      return NextResponse.json({
        success: true,
        leaderboard: results,
        meta: {
          category: leaderboard,
          total: results.length,
          tiers: RANK_TIERS.map(t => ({
            tier: t.tier,
            name: t.name,
            minRating: t.minRating,
            emoji: t.emoji
          }))
        }
      })
    }

    // Default: return rank tier information
    return NextResponse.json({
      success: true,
      tiers: RANK_TIERS.map(tier => ({
        tier: tier.tier,
        name: tier.name,
        minRating: tier.minRating,
        maxRating: tier.maxRating,
        color: tier.color,
        gradient: tier.gradient,
        emoji: tier.emoji,
        rewards: tier.rewards
      }))
    })
  } catch (error) {
    console.error('Failed to get rank info:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to get rank information' },
      { status: 500 }
    )
  }
}
