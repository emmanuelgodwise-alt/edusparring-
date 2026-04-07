/**
 * Sparring Highlights System
 * 
 * Generates shareable match highlights for viral growth.
 * 
 * STRATEGY:
 * - Track dramatic moments during matches
 * - Generate shareable battle recap pages
 * - Create shareable cards for social media
 * - Enable "Challenge This Player" functionality
 * 
 * VIRAL LOOP:
 * Student plays → Highlight generated → Shared on social → Friends watch → Friends join → Challenge
 */

import { prisma } from './db'

// Types
export interface MatchHighlight {
  id: string
  matchId: string
  player1: {
    id: string
    name: string
    avatar?: string
    rating: number
  }
  player2: {
    id: string
    name: string
    avatar?: string
    rating: number
  }
  subject: string
  finalScore: {
    player1: number
    player2: number
  }
  winner: string | null
  duration: number // seconds
  moments: HighlightMoment[]
  stats: MatchStats
  shareUrl: string
  createdAt: Date
}

export interface HighlightMoment {
  type: 'fastest_answer' | 'turning_point' | 'comeback' | 'close_call' | 'domination' | 'clutch' | 'perfect_round'
  roundNumber: number
  timestamp: number
  question: string
  player: string
  details: {
    timeTaken?: number
    scoreChange?: { before: number; after: number }
    description: string
  }
  significance: number // 1-10 how dramatic
}

export interface MatchStats {
  totalRounds: number
  averageAnswerTime: { player1: number; player2: number }
  fastestAnswer: { player: string; time: number; round: number }
  accuracyRate: { player1: number; player2: number }
  closestRound: number
  leadChanges: number
  comebackSize: number // largest deficit overcome
}

/**
 * Generate highlights from a completed match
 */
export async function generateMatchHighlights(matchId: string): Promise<MatchHighlight | null> {
  // Get match with all rounds
  const match = await prisma.match.findUnique({
    where: { id: matchId },
    include: {
      player1: true,
      player2: true,
      rounds: {
        include: { question: true },
        orderBy: { roundNumber: 'asc' }
      }
    }
  })

  if (!match || match.status !== 'completed') {
    return null
  }

  // Extract moments from rounds
  const moments = extractDramaticMoments(match)

  // Calculate stats
  const stats = calculateMatchStats(match)

  // Create highlight record
  const highlight: MatchHighlight = {
    id: `hl_${matchId}`,
    matchId: match.id,
    player1: {
      id: match.player1Id,
      name: match.player1.name,
      avatar: match.player1.avatar || undefined,
      rating: match.player1.knowledgeRating
    },
    player2: {
      id: match.player2Id,
      name: match.player2.name,
      avatar: match.player2.avatar || undefined,
      rating: match.player2.knowledgeRating
    },
    subject: match.subject || 'Mixed',
    finalScore: {
      player1: match.player1Score,
      player2: match.player2Score
    },
    winner: match.winnerId,
    duration: match.rounds.length * 15, // approximate
    moments,
    stats,
    shareUrl: `/highlight/${matchId}`,
    createdAt: new Date()
  }

  // Save to database (would need a Highlight table in production)
  // For now, return the highlight object

  return highlight
}

/**
 * Extract dramatic moments from match rounds
 */
function extractDramaticMoments(match: any): HighlightMoment[] {
  const moments: HighlightMoment[] = []
  let player1Score = 0
  let player2Score = 0
  let previousLeader: string | null = null

  for (const round of match.rounds) {
    const p1Correct = round.player1Correct
    const p2Correct = round.player2Correct
    const p1Time = round.player1Time || 15
    const p2Time = round.player2Time || 15
    const question = round.question.text
    const points = round.pointsAwarded

    // Update scores
    const newP1Score = player1Score + (p1Correct ? points : 0)
    const newP2Score = player2Score + (p2Correct ? points : 0)

    // Detect fastest answer
    const fastestTime = Math.min(p1Time, p2Time)
    if (fastestTime <= 5 && (p1Correct || p2Correct)) {
      const fastPlayer = p1Time < p2Time ? match.player1.name : match.player2.name
      moments.push({
        type: 'fastest_answer',
        roundNumber: round.roundNumber,
        timestamp: (round.roundNumber - 1) * 15 + (15 - fastestTime),
        question: question.substring(0, 100),
        player: fastPlayer,
        details: {
          timeTaken: fastestTime,
          description: `${fastPlayer} answered in ${fastestTime}s!`
        },
        significance: fastestTime <= 2 ? 9 : 7
      })
    }

    // Detect turning point (lead change)
    const currentLeader = newP1Score > newP2Score ? match.player1Id : 
                          newP2Score > newP1Score ? match.player2Id : null
    if (previousLeader && currentLeader && previousLeader !== currentLeader) {
      moments.push({
        type: 'turning_point',
        roundNumber: round.roundNumber,
        timestamp: round.roundNumber * 15,
        question: question.substring(0, 100),
        player: currentLeader === match.player1Id ? match.player1.name : match.player2.name,
        details: {
          scoreChange: { before: previousLeader === match.player1Id ? player1Score : player2Score, after: currentLeader === match.player1Id ? newP1Score : newP2Score },
          description: `${currentLeader === match.player1Id ? match.player1.name : match.player2.name} takes the lead!`
        },
        significance: 8
      })
    }
    previousLeader = currentLeader

    // Detect clutch (last round decides winner)
    if (round.roundNumber === match.totalRounds) {
      const scoreDiff = Math.abs(newP1Score - newP2Score)
      if (scoreDiff <= points) {
        moments.push({
          type: 'clutch',
          roundNumber: round.roundNumber,
          timestamp: round.roundNumber * 15,
          question: question.substring(0, 100),
          player: match.winnerId === match.player1Id ? match.player1.name : match.player2.name,
          details: {
            description: `FINAL ROUND! Winner takes all!`
          },
          significance: 10
        })
      }
    }

    // Detect perfect round (both correct, fastest wins)
    if (p1Correct && p2Correct) {
      const winner = p1Time < p2Time ? match.player1.name : match.player2.name
      moments.push({
        type: 'perfect_round',
        roundNumber: round.roundNumber,
        timestamp: round.roundNumber * 15,
        question: question.substring(0, 100),
        player: winner,
        details: {
          timeTaken: Math.min(p1Time, p2Time),
          description: `Both correct! ${winner} was faster!`
        },
        significance: 7
      })
    }

    player1Score = newP1Score
    player2Score = newP2Score
  }

  // Sort by significance and take top moments
  return moments
    .sort((a, b) => b.significance - a.significance)
    .slice(0, 5)
}

/**
 * Calculate match statistics
 */
function calculateMatchStats(match: any): MatchStats {
  const rounds = match.rounds
  
  const p1Times = rounds.map((r: any) => r.player1Time || 15)
  const p2Times = rounds.map((r: any) => r.player2Time || 15)
  const p1Correct = rounds.filter((r: any) => r.player1Correct).length
  const p2Correct = rounds.filter((r: any) => r.player2Correct).length

  const fastestTime = Math.min(...p1Times, ...p2Times)
  const fastestRound = [...p1Times, ...p2Times].indexOf(fastestTime) + 1
  const fastestPlayer = p1Times[fastestRound - 1] < p2Times[fastestRound - 1] 
    ? match.player1.name : match.player2.name

  // Find closest round
  let closestRound = 1
  let smallestDiff = Infinity
  let p1Score = 0, p2Score = 0
  
  for (const round of rounds) {
    p1Score += round.player1Correct ? round.pointsAwarded : 0
    p2Score += round.player2Correct ? round.pointsAwarded : 0
    const diff = Math.abs(p1Score - p2Score)
    if (diff < smallestDiff && diff > 0) {
      smallestDiff = diff
      closestRound = round.roundNumber
    }
  }

  // Count lead changes
  let leadChanges = 0
  let currentLeader: string | null = null
  p1Score = 0
  p2Score = 0
  
  for (const round of rounds) {
    p1Score += round.player1Correct ? round.pointsAwarded : 0
    p2Score += round.player2Correct ? round.pointsAwarded : 0
    const leader = p1Score > p2Score ? match.player1Id : p2Score > p1Score ? match.player2Id : null
    if (currentLeader && leader && currentLeader !== leader) {
      leadChanges++
    }
    if (leader) currentLeader = leader
  }

  return {
    totalRounds: rounds.length,
    averageAnswerTime: {
      player1: p1Times.reduce((a: number, b: number) => a + b, 0) / p1Times.length,
      player2: p2Times.reduce((a: number, b: number) => a + b, 0) / p2Times.length
    },
    fastestAnswer: {
      player: fastestPlayer,
      time: fastestTime,
      round: fastestRound
    },
    accuracyRate: {
      player1: rounds.length > 0 ? p1Correct / rounds.length : 0,
      player2: rounds.length > 0 ? p2Correct / rounds.length : 0
    },
    closestRound,
    leadChanges,
    comebackSize: 0 // Would need more complex tracking
  }
}

/**
 * Generate a shareable highlight card (for social media)
 */
export function generateShareCard(highlight: MatchHighlight): {
  title: string
  description: string
  imageText: string
  hashtags: string[]
  challengeUrl: string
} {
  const winner = highlight.winner === highlight.player1.id 
    ? highlight.player1.name 
    : highlight.player2.name
  const loser = highlight.winner === highlight.player1.id 
    ? highlight.player2.name 
    : highlight.player1.name
  const winnerScore = highlight.winner === highlight.player1.id 
    ? highlight.finalScore.player1 
    : highlight.finalScore.player2
  const loserScore = highlight.winner === highlight.player1.id 
    ? highlight.finalScore.player2 
    : highlight.finalScore.player1

  // Find best moment for description
  const bestMoment = highlight.moments[0]

  return {
    title: `${winner} defeated ${loser} in ${highlight.subject} Sparring!`,
    description: `Final Score: ${winnerScore}-${loserScore}. ${bestMoment?.details.description || 'Epic battle!'}`,
    imageText: `🏆 ${winner} WINS!\n${highlight.subject} Sparring\n${winnerScore} - ${loserScore}\n${highlight.moments.length} highlight moments`,
    hashtags: ['#EduSparring', '#KnowledgeBattle', `#${highlight.subject}`, '#CompetitiveLearning'],
    challengeUrl: `/challenge/${highlight.winner}?from=${highlight.matchId}`
  }
}

/**
 * Get trending highlights (for the feed)
 */
export async function getTrendingHighlights(limit: number = 10): Promise<MatchHighlight[]> {
  // Get recent completed matches with interesting characteristics
  const matches = await prisma.match.findMany({
    where: {
      status: 'completed',
      createdAt: {
        gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
      }
    },
    include: {
      player1: true,
      player2: true,
      rounds: { include: { question: true } }
    },
    orderBy: { createdAt: 'desc' },
    take: limit
  })

  // Generate highlights for each
  const highlights: MatchHighlight[] = []
  for (const match of matches) {
    const hl = await generateMatchHighlights(match.id)
    if (hl) {
      highlights.push(hl)
    }
  }

  // Sort by "trending score" (closeness + moments + time)
  return highlights.sort((a, b) => {
    const aScore = a.moments.length + (Math.abs(a.finalScore.player1 - a.finalScore.player2) <= 10 ? 5 : 0)
    const bScore = b.moments.length + (Math.abs(b.finalScore.player1 - b.finalScore.player2) <= 10 ? 5 : 0)
    return bScore - aScore
  })
}

/**
 * Create a challenge link for a player
 */
export function createChallengeLink(playerId: string, matchId?: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://edusparring.com'
  return `${baseUrl}/challenge/${playerId}${matchId ? `?from=${matchId}` : ''}`
}

// Named exports for sparring highlights
const sparringHighlights = {
  generateMatchHighlights,
  generateShareCard,
  getTrendingHighlights,
  createChallengeLink
}

export default sparringHighlights
