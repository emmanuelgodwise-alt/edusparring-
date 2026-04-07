/**
 * Achievement Definitions for EduSparring
 * 
 * This module defines all available achievements that players can earn.
 */

export interface AchievementDefinition {
  id: string
  name: string
  description: string
  icon: string
  category: 'battle' | 'learning' | 'social' | 'special'
  requirement: string
  pointsValue: number
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  condition: (stats: UserStats) => boolean
}

export interface UserStats {
  totalWins: number
  totalLosses: number
  currentStreak: number
  bestStreak: number
  knowledgeRating: number
  perfectMatches: number
  totalMatches: number
  friendsCount: number
  subjectsMastered: number
  tournamentWins: number
  seasonRank?: string
}

// Achievement definitions
export const ACHIEVEMENTS: AchievementDefinition[] = [
  // === BATTLE ACHIEVEMENTS ===
  {
    id: 'first_win',
    name: 'First Victory',
    description: 'Win your first sparring match',
    icon: '🏆',
    category: 'battle',
    requirement: 'Win 1 match',
    pointsValue: 10,
    rarity: 'common',
    condition: (stats) => stats.totalWins >= 1
  },
  {
    id: 'winning_streak_3',
    name: 'Hot Streak',
    description: 'Win 3 matches in a row',
    icon: '🔥',
    category: 'battle',
    requirement: '3 win streak',
    pointsValue: 25,
    rarity: 'common',
    condition: (stats) => stats.bestStreak >= 3
  },
  {
    id: 'winning_streak_5',
    name: 'On Fire',
    description: 'Win 5 matches in a row',
    icon: '💥',
    category: 'battle',
    requirement: '5 win streak',
    pointsValue: 50,
    rarity: 'rare',
    condition: (stats) => stats.bestStreak >= 5
  },
  {
    id: 'winning_streak_10',
    name: 'Unstoppable',
    description: 'Win 10 matches in a row',
    icon: '⚡',
    category: 'battle',
    requirement: '10 win streak',
    pointsValue: 100,
    rarity: 'epic',
    condition: (stats) => stats.bestStreak >= 10
  },
  {
    id: 'wins_10',
    name: 'Rising Star',
    description: 'Win 10 matches total',
    icon: '⭐',
    category: 'battle',
    requirement: '10 total wins',
    pointsValue: 30,
    rarity: 'common',
    condition: (stats) => stats.totalWins >= 10
  },
  {
    id: 'wins_50',
    name: 'Battle Veteran',
    description: 'Win 50 matches total',
    icon: '🎖️',
    category: 'battle',
    requirement: '50 total wins',
    pointsValue: 75,
    rarity: 'rare',
    condition: (stats) => stats.totalWins >= 50
  },
  {
    id: 'wins_100',
    name: 'Sparring Master',
    description: 'Win 100 matches total',
    icon: '🏅',
    category: 'battle',
    requirement: '100 total wins',
    pointsValue: 150,
    rarity: 'epic',
    condition: (stats) => stats.totalWins >= 100
  },
  {
    id: 'perfect_score',
    name: 'Perfect Score',
    description: 'Win a match without missing any questions',
    icon: '💯',
    category: 'battle',
    requirement: '1 perfect match',
    pointsValue: 50,
    rarity: 'rare',
    condition: (stats) => stats.perfectMatches >= 1
  },
  {
    id: 'perfect_streak_3',
    name: 'Flawless',
    description: 'Achieve 3 perfect score matches',
    icon: '✨',
    category: 'battle',
    requirement: '3 perfect matches',
    pointsValue: 100,
    rarity: 'epic',
    condition: (stats) => stats.perfectMatches >= 3
  },
  
  // === LEARNING ACHIEVEMENTS ===
  {
    id: 'kr_1000',
    name: 'Knowledge Seeker',
    description: 'Reach 1000 Knowledge Rating',
    icon: '📚',
    category: 'learning',
    requirement: 'KR 1000',
    pointsValue: 25,
    rarity: 'common',
    condition: (stats) => stats.knowledgeRating >= 1000
  },
  {
    id: 'kr_1200',
    name: 'Scholar',
    description: 'Reach 1200 Knowledge Rating',
    icon: '📖',
    category: 'learning',
    requirement: 'KR 1200',
    pointsValue: 50,
    rarity: 'common',
    condition: (stats) => stats.knowledgeRating >= 1200
  },
  {
    id: 'kr_1500',
    name: 'Expert',
    description: 'Reach 1500 Knowledge Rating',
    icon: '🎯',
    category: 'learning',
    requirement: 'KR 1500',
    pointsValue: 100,
    rarity: 'rare',
    condition: (stats) => stats.knowledgeRating >= 1500
  },
  {
    id: 'kr_1800',
    name: 'Master',
    description: 'Reach 1800 Knowledge Rating',
    icon: '👑',
    category: 'learning',
    requirement: 'KR 1800',
    pointsValue: 150,
    rarity: 'epic',
    condition: (stats) => stats.knowledgeRating >= 1800
  },
  {
    id: 'kr_2000',
    name: 'Grandmaster',
    description: 'Reach 2000 Knowledge Rating',
    icon: '🏅',
    category: 'learning',
    requirement: 'KR 2000',
    pointsValue: 250,
    rarity: 'legendary',
    condition: (stats) => stats.knowledgeRating >= 2000
  },
  {
    id: 'subject_master',
    name: 'Subject Master',
    description: 'Master a subject with 100% proficiency',
    icon: '🎓',
    category: 'learning',
    requirement: '1 subject mastered',
    pointsValue: 75,
    rarity: 'rare',
    condition: (stats) => stats.subjectsMastered >= 1
  },
  {
    id: 'matches_100',
    name: 'Dedicated Learner',
    description: 'Complete 100 sparring matches',
    icon: '📝',
    category: 'learning',
    requirement: '100 matches',
    pointsValue: 50,
    rarity: 'common',
    condition: (stats) => stats.totalMatches >= 100
  },
  
  // === SOCIAL ACHIEVEMENTS ===
  {
    id: 'first_friend',
    name: 'Friendly',
    description: 'Add your first friend',
    icon: '🤝',
    category: 'social',
    requirement: '1 friend',
    pointsValue: 10,
    rarity: 'common',
    condition: (stats) => stats.friendsCount >= 1
  },
  {
    id: 'friends_10',
    name: 'Social Butterfly',
    description: 'Have 10 friends',
    icon: '🦋',
    category: 'social',
    requirement: '10 friends',
    pointsValue: 30,
    rarity: 'common',
    condition: (stats) => stats.friendsCount >= 10
  },
  {
    id: 'friends_50',
    name: 'Popular',
    description: 'Have 50 friends',
    icon: '🌟',
    category: 'social',
    requirement: '50 friends',
    pointsValue: 75,
    rarity: 'rare',
    condition: (stats) => stats.friendsCount >= 50
  },
  
  // === SPECIAL ACHIEVEMENTS ===
  {
    id: 'tournament_winner',
    name: 'Tournament Champion',
    description: 'Win a tournament',
    icon: '🏆',
    category: 'special',
    requirement: '1 tournament win',
    pointsValue: 200,
    rarity: 'epic',
    condition: (stats) => stats.tournamentWins >= 1
  },
  {
    id: 'season_gold',
    name: 'Golden Season',
    description: 'Reach Gold rank in a season',
    icon: '🥇',
    category: 'special',
    requirement: 'Gold rank',
    pointsValue: 100,
    rarity: 'rare',
    condition: (stats) => ['gold', 'platinum', 'diamond', 'champion', 'world_champion'].includes(stats.seasonRank || '')
  },
  {
    id: 'season_diamond',
    name: 'Diamond Elite',
    description: 'Reach Diamond rank in a season',
    icon: '💎',
    category: 'special',
    requirement: 'Diamond rank',
    pointsValue: 200,
    rarity: 'epic',
    condition: (stats) => ['diamond', 'champion', 'world_champion'].includes(stats.seasonRank || '')
  },
  {
    id: 'comeback_king',
    name: 'Comeback King',
    description: 'Win after being down by 3+ rounds',
    icon: '🔄',
    category: 'special',
    requirement: 'Win from behind',
    pointsValue: 75,
    rarity: 'rare',
    condition: () => false // This is tracked separately in match logic
  },
  {
    id: 'early_bird',
    name: 'Early Bird',
    description: 'Win a match in under 2 minutes',
    icon: '🌅',
    category: 'special',
    requirement: 'Fast victory',
    pointsValue: 50,
    rarity: 'rare',
    condition: () => false // This is tracked separately in match logic
  }
]

// Helper function to check for new achievements
export function checkAchievements(stats: UserStats, earnedIds: string[]): string[] {
  const newAchievements: string[] = []
  
  for (const achievement of ACHIEVEMENTS) {
    if (!earnedIds.includes(achievement.id) && achievement.condition(stats)) {
      newAchievements.push(achievement.id)
    }
  }
  
  return newAchievements
}

// Get achievement by ID
export function getAchievementById(id: string): AchievementDefinition | undefined {
  return ACHIEVEMENTS.find(a => a.id === id)
}

// Get achievements by category
export function getAchievementsByCategory(category: AchievementDefinition['category']): AchievementDefinition[] {
  return ACHIEVEMENTS.filter(a => a.category === category)
}

// Get achievements by rarity
export function getAchievementsByRarity(rarity: AchievementDefinition['rarity']): AchievementDefinition[] {
  return ACHIEVEMENTS.filter(a => a.rarity === rarity)
}

// Rarity colors for UI
export const RARITY_COLORS: Record<AchievementDefinition['rarity'], { bg: string; text: string; border: string; glow: string }> = {
  common: {
    bg: 'bg-slate-500/20',
    text: 'text-slate-300',
    border: 'border-slate-500/50',
    glow: ''
  },
  rare: {
    bg: 'bg-blue-500/20',
    text: 'text-blue-300',
    border: 'border-blue-500/50',
    glow: 'shadow-blue-500/20'
  },
  epic: {
    bg: 'bg-purple-500/20',
    text: 'text-purple-300',
    border: 'border-purple-500/50',
    glow: 'shadow-purple-500/30'
  },
  legendary: {
    bg: 'bg-amber-500/20',
    text: 'text-amber-300',
    border: 'border-amber-500/50',
    glow: 'shadow-amber-500/40 animate-pulse'
  }
}

// Category icons
export const CATEGORY_ICONS: Record<AchievementDefinition['category'], string> = {
  battle: '⚔️',
  learning: '📚',
  social: '👥',
  special: '⭐'
}
