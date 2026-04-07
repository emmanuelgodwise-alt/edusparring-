import { NextResponse } from 'next/server'
import { getCurrentSeason, getPlayerRank } from '@/lib/seasonal-leagues'
import { prisma } from '@/lib/db'

/**
 * GET /api/season
 * 
 * Get current season information.
 * Includes rewards, leaderboard, and player progress.
 */
export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const playerId = url.searchParams.get('playerId')
    const includeLeaderboard = url.searchParams.get('leaderboard') === 'true'

    // Get current season
    const season = await getCurrentSeason()

    // Calculate days remaining
    const now = new Date()
    const daysRemaining = Math.max(0, Math.ceil(
      (season.endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    ))

    // Get player's season progress
    let playerProgress = null
    if (playerId) {
      const rank = await getPlayerRank(playerId)
      if (rank) {
        // Calculate rewards the player has earned
        const earnedRewards = season.rewards.filter(reward => {
          switch (reward.requirement.type) {
            case 'rank':
              // Check if player has achieved this rank
              const rankOrder = ['bronze', 'silver', 'gold', 'platinum', 'diamond', 'master', 'grandmaster', 'world_champion']
              const playerRankIndex = rankOrder.indexOf(rank.currentTier)
              const requiredRankIndex = rankOrder.indexOf(reward.requirement.value as string)
              return playerRankIndex >= requiredRankIndex
            case 'wins':
              return rank.wins >= (reward.requirement.value as number)
            default:
              return false
          }
        })

        // Find next reward to earn
        const nextReward = season.rewards.find(reward => {
          return !earnedRewards.includes(reward)
        })

        playerProgress = {
          rank,
          earnedRewards: earnedRewards.map(r => ({
            name: r.name,
            icon: r.icon,
            rarity: r.rarity
          })),
          nextReward: nextReward ? {
            name: nextReward.name,
            description: nextReward.description,
            icon: nextReward.icon,
            requirement: nextReward.requirement
          } : null
        }
      }
    }

    // Get top 10 leaderboard if requested
    let topPlayers = null
    if (includeLeaderboard) {
      topPlayers = await prisma.user.findMany({
        where: { knowledgeRating: { gte: 800 } },
        orderBy: { knowledgeRating: 'desc' },
        take: 10,
        select: {
          id: true,
          name: true,
          knowledgeRating: true,
          country: true
        }
      })
    }

    return NextResponse.json({
      success: true,
      season: {
        id: season.id,
        name: season.name,
        number: season.number,
        startDate: season.startDate,
        endDate: season.endDate,
        daysRemaining,
        status: season.status,
        participantCount: season.participantCount
      },
      rewards: season.rewards,
      playerProgress,
      topPlayers
    })
  } catch (error) {
    console.error('Failed to get season info:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to get season information' },
      { status: 500 }
    )
  }
}
