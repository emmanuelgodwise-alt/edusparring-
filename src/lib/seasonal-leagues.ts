/**
 * Seasonal Ranked Knowledge Leagues
 * 
 * Implements competitive ranking seasons similar to Fortnite, League of Legends, and Duolingo.
 * 
 * ADDICTION LOOP:
 * - Players compete in seasons (60-90 days)
 * - Climb visible ranks (Bronze → Grandmaster)
 * - Earn exclusive rewards
 * - Season reset keeps competition fresh
 * - Top players qualify for World Championship
 */

import { prisma } from './db'

// Types
export type RankTier = 
  | 'bronze' 
  | 'silver' 
  | 'gold' 
  | 'platinum' 
  | 'diamond' 
  | 'master' 
  | 'grandmaster' 
  | 'world_champion'

export type SeasonStatus = 'upcoming' | 'active' | 'ended'

export interface Season {
  id: string
  name: string
  number: number
  startDate: Date
  endDate: Date
  status: SeasonStatus
  rewards: SeasonReward[]
  participantCount: number
  championId?: string
}

export interface SeasonReward {
  id: string
  name: string
  description: string
  icon: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  requirement: {
    type: 'rank' | 'top_percent' | 'top_position' | 'wins'
    value: number | string
  }
}

export interface PlayerRank {
  playerId: string
  currentTier: RankTier
  currentRating: number
  seasonHigh: number
  allTimeHigh: number
  tierProgress: number // 0-100 progress within tier
  wins: number
  losses: number
  winStreak: number
  bestStreak: number
  rankBadge: string
  promotionMatches?: number // Best of 3/5 for promotion
  demotionShield: boolean // Protects from demotion temporarily
}

export interface RankTierInfo {
  tier: RankTier
  name: string
  minRating: number
  maxRating: number
  color: string
  gradient: string
  icon: string
  emoji: string
  rewards: string[]
}

// Rank tier definitions
export const RANK_TIERS: RankTierInfo[] = [
  {
    tier: 'bronze',
    name: 'Bronze Scholar',
    minRating: 0,
    maxRating: 999,
    color: '#CD7F32',
    gradient: 'from-amber-700 to-amber-600',
    icon: '🥉',
    emoji: '🥉',
    rewards: ['Bronze Badge', 'Basic Avatar Frame']
  },
  {
    tier: 'silver',
    name: 'Silver Scholar',
    minRating: 1000,
    maxRating: 1199,
    color: '#C0C0C0',
    gradient: 'from-gray-400 to-gray-300',
    icon: '🥈',
    emoji: '🥈',
    rewards: ['Silver Badge', 'Silver Avatar Frame', 'Weekly Bonus +5%']
  },
  {
    tier: 'gold',
    name: 'Gold Scholar',
    minRating: 1200,
    maxRating: 1399,
    color: '#FFD700',
    gradient: 'from-yellow-500 to-yellow-400',
    icon: '🥇',
    emoji: '🥇',
    rewards: ['Gold Badge', 'Gold Avatar Frame', 'Weekly Bonus +10%', 'Priority Matchmaking']
  },
  {
    tier: 'platinum',
    name: 'Platinum Scholar',
    minRating: 1400,
    maxRating: 1599,
    color: '#E5E4E2',
    gradient: 'from-cyan-400 to-teal-300',
    icon: '💎',
    emoji: '💎',
    rewards: ['Platinum Badge', 'Animated Avatar Frame', 'Weekly Bonus +15%', 'Exclusive Subjects']
  },
  {
    tier: 'diamond',
    name: 'Diamond Scholar',
    minRating: 1600,
    maxRating: 1799,
    color: '#B9F2FF',
    gradient: 'from-blue-400 to-cyan-300',
    icon: '💠',
    emoji: '💠',
    rewards: ['Diamond Badge', 'Custom Title', 'Weekly Bonus +20%', 'Tournament Priority']
  },
  {
    tier: 'master',
    name: 'Master Scholar',
    minRating: 1800,
    maxRating: 1999,
    color: '#9945FF',
    gradient: 'from-purple-500 to-pink-400',
    icon: '👑',
    emoji: '👑',
    rewards: ['Master Badge', 'Legendary Title', 'Weekly Bonus +25%', 'World Cup Qualifier Access']
  },
  {
    tier: 'grandmaster',
    name: 'Grandmaster Scholar',
    minRating: 2000,
    maxRating: 2299,
    color: '#FF4500',
    gradient: 'from-orange-500 to-red-400',
    icon: '🏆',
    emoji: '🏆',
    rewards: ['Grandmaster Badge', 'Exclusive Legend Title', 'Weekly Bonus +30%', 'Guaranteed World Cup Spot']
  },
  {
    tier: 'world_champion',
    name: 'World Champion',
    minRating: 2300,
    maxRating: 9999,
    color: '#FFD700',
    gradient: 'from-yellow-300 via-white to-yellow-300',
    icon: '🌟',
    emoji: '🌟',
    rewards: ['Champion Crown', 'Immortal Status', 'Prize Pool Share', 'Hall of Fame']
  }
]

/**
 * Get rank tier info for a given rating
 */
export function getRankTier(rating: number): RankTierInfo {
  for (let i = RANK_TIERS.length - 1; i >= 0; i--) {
    if (rating >= RANK_TIERS[i].minRating) {
      return RANK_TIERS[i]
    }
  }
  return RANK_TIERS[0]
}

/**
 * Calculate tier progress (0-100 within current tier)
 */
export function calculateTierProgress(rating: number): number {
  const tier = getRankTier(rating)
  const range = tier.maxRating - tier.minRating + 1
  const progress = rating - tier.minRating
  return Math.round((progress / range) * 100)
}

/**
 * Calculate KR change after a match
 */
export function calculateKRChange(
  playerRating: number,
  opponentRating: number,
  won: boolean,
  isStreak: number = 0
): number {
  // ELO-like calculation
  const K = 32 // K-factor
  const expected = 1 / (1 + Math.pow(10, (opponentRating - playerRating) / 400))
  const actual = won ? 1 : 0
  let change = Math.round(K * (actual - expected))

  // Streak bonus
  if (won && isStreak >= 3) {
    change = Math.round(change * (1 + isStreak * 0.1)) // +10% per streak win
  }

  // Protect new players
  if (!won && playerRating < 1000) {
    change = Math.max(change, -10) // Minimum loss for beginners
  }

  return change
}

/**
 * Check if player should be promoted or demoted
 */
export function checkTierTransition(
  oldRating: number,
  newRating: number
): { 
  promoted: boolean; 
  demoted: boolean; 
  oldTier: RankTierInfo; 
  newTier: RankTierInfo 
} {
  const oldTier = getRankTier(oldRating)
  const newTier = getRankTier(newRating)

  return {
    promoted: newTier.minRating > oldTier.minRating,
    demoted: newTier.minRating < oldTier.minRating,
    oldTier,
    newTier
  }
}

/**
 * Create or get current active season
 */
export async function getCurrentSeason(): Promise<Season> {
  // Check for active season
  let season = await prisma.season.findFirst({
    where: { status: 'active' },
    orderBy: { startDate: 'desc' }
  })

  if (!season) {
    // Create new season (90 days)
    const now = new Date()
    const endDate = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000)
    
    // Get season number
    const lastSeason = await prisma.season.findFirst({
      orderBy: { number: 'desc' }
    })
    const nextNumber = (lastSeason?.number || 0) + 1

    season = await prisma.season.create({
      data: {
        name: `Season ${nextNumber}`,
        number: nextNumber,
        startDate: now,
        endDate,
        status: 'active',
        participantCount: 0,
        rewards: getDefaultSeasonRewards()
      }
    })
  }

  return {
    id: season.id,
    name: season.name,
    number: season.number,
    startDate: season.startDate,
    endDate: season.endDate,
    status: season.status as SeasonStatus,
    rewards: season.rewards as SeasonReward[],
    participantCount: season.participantCount,
    championId: season.winnerId || undefined
  }
}

/**
 * Get default rewards for a season
 */
function getDefaultSeasonRewards(): SeasonReward[] {
  return [
    {
      id: 'top_1',
      name: 'World Champion Badge',
      description: 'Finish #1 globally',
      icon: '🌟',
      rarity: 'legendary',
      requirement: { type: 'top_position', value: 1 }
    },
    {
      id: 'top_10',
      name: 'Elite Top 10',
      description: 'Finish in top 10 globally',
      icon: '🏆',
      rarity: 'legendary',
      requirement: { type: 'top_position', value: 10 }
    },
    {
      id: 'top_100',
      name: 'Century Club',
      description: 'Finish in top 100 globally',
      icon: '💎',
      rarity: 'epic',
      requirement: { type: 'top_position', value: 100 }
    },
    {
      id: 'top_1_percent',
      name: 'Top 1%',
      description: 'Finish in top 1% of all players',
      icon: '👑',
      rarity: 'epic',
      requirement: { type: 'top_percent', value: 1 }
    },
    {
      id: 'grandmaster',
      name: 'Grandmaster Rank',
      description: 'Achieve Grandmaster rank',
      icon: '🏆',
      rarity: 'epic',
      requirement: { type: 'rank', value: 'grandmaster' }
    },
    {
      id: 'master',
      name: 'Master Rank',
      description: 'Achieve Master rank',
      icon: '👑',
      rarity: 'rare',
      requirement: { type: 'rank', value: 'master' }
    },
    {
      id: 'diamond',
      name: 'Diamond Rank',
      description: 'Achieve Diamond rank',
      icon: '💠',
      rarity: 'rare',
      requirement: { type: 'rank', value: 'diamond' }
    },
    {
      id: '50_wins',
      name: '50 Victory Badge',
      description: 'Win 50 matches this season',
      icon: '⚔️',
      rarity: 'common',
      requirement: { type: 'wins', value: 50 }
    }
  ]
}

/**
 * End current season and start new one
 */
export async function endSeason(): Promise<void> {
  const currentSeason = await getCurrentSeason()
  
  // Mark season as ended
  await prisma.season.update({
    where: { id: currentSeason.id },
    data: { status: 'ended' }
  })

  // Award rewards to top players
  await awardSeasonRewards(currentSeason)

  // Reset player ratings (soft reset - keep partial progress)
  await performSeasonReset()

  // Create new season
  await getCurrentSeason()
}

/**
 * Award rewards to top players at season end
 */
async function awardSeasonRewards(season: Season): Promise<void> {
  // Get global leaderboard
  const leaderboard = await prisma.user.findMany({
    where: { knowledgeRating: { gte: 800 } },
    orderBy: { knowledgeRating: 'desc' },
    take: 1000
  })

  // Award badges based on position
  for (let i = 0; i < leaderboard.length; i++) {
    const player = leaderboard[i]
    const rewards: string[] = []

    // Check each reward requirement
    for (const reward of season.rewards) {
      let qualifies = false

      switch (reward.requirement.type) {
        case 'top_position':
          qualifies = i < (reward.requirement.value as number)
          break
        case 'top_percent':
          const percent = (i / leaderboard.length) * 100
          qualifies = percent <= (reward.requirement.value as number)
          break
        case 'rank':
          const tier = getRankTier(player.knowledgeRating)
          qualifies = tier.tier === reward.requirement.value
          break
        case 'wins':
          // Would need to track season wins
          qualifies = player.totalWins >= (reward.requirement.value as number)
          break
      }

      if (qualifies) {
        rewards.push(reward.name)
      }
    }

    // Add achievements
    if (rewards.length > 0) {
      // Would create UserAchievement records here
      console.log(`Player ${player.name} earned: ${rewards.join(', ')}`)
    }
  }
}

/**
 * Perform seasonal rating reset
 */
async function performSeasonReset(): Promise<void> {
  // Soft reset: Players keep 70% of rating above 800
  // This keeps the ladder competitive but allows climbs
  const players = await prisma.user.findMany({
    where: { knowledgeRating: { gt: 800 } }
  })

  for (const player of players) {
    const baseRating = 800
    const excessRating = player.knowledgeRating - baseRating
    const keptRating = Math.round(excessRating * 0.3) // Keep 30% of gains
    const newRating = baseRating + keptRating

    await prisma.user.update({
      where: { id: player.id },
      data: {
        knowledgeRating: newRating,
        currentStreak: 0 // Reset streaks
      }
    })
  }
}

/**
 * Get player rank with all details
 */
export async function getPlayerRank(playerId: string): Promise<PlayerRank | null> {
  const player = await prisma.user.findUnique({
    where: { id: playerId }
  })

  if (!player) return null

  const tier = getRankTier(player.knowledgeRating)
  const progress = calculateTierProgress(player.knowledgeRating)

  return {
    playerId: player.id,
    currentTier: tier.tier,
    currentRating: player.knowledgeRating,
    seasonHigh: player.knowledgeRating, // Would track separately in production
    allTimeHigh: player.knowledgeRating, // Would track separately
    tierProgress: progress,
    wins: player.totalWins,
    losses: player.totalLosses,
    winStreak: player.currentStreak,
    bestStreak: player.bestStreak,
    rankBadge: tier.icon,
    demotionShield: player.currentStreak >= 3 // Win streak protects from demotion
  }
}

/**
 * Get leaderboard with rank tiers
 */
export async function getRankedLeaderboard(
  category: 'global' | 'country' | 'school' | 'subject',
  limit: number = 100
): Promise<Array<PlayerRank & { position: number; name: string; country?: string }>> {
  const users = await prisma.user.findMany({
    where: {
      knowledgeRating: { gte: 800 }
    },
    orderBy: { knowledgeRating: 'desc' },
    take: limit
  })

  return users.map((user, index) => {
    const tier = getRankTier(user.knowledgeRating)
    const progress = calculateTierProgress(user.knowledgeRating)

    return {
      playerId: user.id,
      position: index + 1,
      name: user.name,
      country: user.country || undefined,
      currentTier: tier.tier,
      currentRating: user.knowledgeRating,
      seasonHigh: user.knowledgeRating,
      allTimeHigh: user.knowledgeRating,
      tierProgress: progress,
      wins: user.totalWins,
      losses: user.totalLosses,
      winStreak: user.currentStreak,
      bestStreak: user.bestStreak,
      rankBadge: tier.icon,
      demotionShield: user.currentStreak >= 3
    }
  })
}

/**
 * Check if player qualifies for World Championship
 */
export function qualifiesForWorldChampionship(
  rating: number,
  globalPosition: number
): boolean {
  return rating >= 2000 || globalPosition <= 256
}

// Named exports for seasonal leagues
const seasonalLeagues = {
  RANK_TIERS,
  getRankTier,
  calculateTierProgress,
  calculateKRChange,
  checkTierTransition,
  getCurrentSeason,
  endSeason,
  getPlayerRank,
  getRankedLeaderboard,
  qualifiesForWorldChampionship
}

export default seasonalLeagues
