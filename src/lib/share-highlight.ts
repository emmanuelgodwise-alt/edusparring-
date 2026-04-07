/**
 * Share Page Data for Battle Highlights
 * 
 * Used by the highlight share page to display battle recaps.
 */

import { prisma } from './db'

export interface ShareableHighlight {
  id: string
  matchId: string
  createdAt: Date
  
  // Players
  player1: {
    id: string
    name: string
    avatar?: string
    rating: number
    country?: string
  }
  player2: {
    id: string
    name: string
    avatar?: string
    rating: number
    country?: string
  }
  
  // Result
  winner: {
    id: string
    name: string
    score: number
  }
  loser: {
    id: string
    name: string
    score: number
  }
  
  // Match details
  subject: string
  duration: number
  totalRounds: number
  
  // Dramatic moments
  moments: Array<{
    type: string
    round: number
    description: string
    player: string
    significance: number
  }>
  
  // Stats
  stats: {
    fastestAnswer: { player: string; time: number }
    accuracyRate: { player1: number; player2: number }
    leadChanges: number
    closestRound: number
  }
  
  // Share data
  shareUrl: string
  challengeUrl: string
  embedCode: string
  
  // Social preview
  previewImage: string
  previewTitle: string
  previewDescription: string
}

/**
 * Generate a shareable highlight from a match
 */
export async function getShareableHighlight(matchId: string): Promise<ShareableHighlight | null> {
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

  // Determine winner and loser
  const player1Won = match.winnerId === match.player1Id
  const winner = player1Won ? match.player1 : match.player2
  const loser = player1Won ? match.player2 : match.player1
  const winnerScore = player1Won ? match.player1Score : match.player2Score
  const loserScore = player1Won ? match.player2Score : match.player1Score

  // Extract moments
  const moments = extractMoments(match)

  // Calculate stats
  const stats = calculateStats(match)

  // Generate URLs
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://edusparring.com'
  const shareUrl = `${baseUrl}/highlight/${matchId}`
  const challengeUrl = `${baseUrl}/challenge/${winner.id}?from=${matchId}`

  // Generate embed code
  const embedCode = generateEmbedCode(shareUrl, winner.name, loser.name, winnerScore, loserScore)

  return {
    id: `hl_${matchId}`,
    matchId: match.id,
    createdAt: match.createdAt,
    
    player1: {
      id: match.player1Id,
      name: match.player1.name,
      avatar: match.player1.avatar || undefined,
      rating: match.player1.knowledgeRating,
      country: match.player1.country || undefined
    },
    player2: {
      id: match.player2Id,
      name: match.player2.name,
      avatar: match.player2.avatar || undefined,
      rating: match.player2.knowledgeRating,
      country: match.player2.country || undefined
    },
    
    winner: {
      id: winner.id,
      name: winner.name,
      score: winnerScore
    },
    loser: {
      id: loser.id,
      name: loser.name,
      score: loserScore
    },
    
    subject: match.subject || 'Mixed',
    duration: match.rounds.length * 15,
    totalRounds: match.rounds.length,
    
    moments,
    stats,
    
    shareUrl,
    challengeUrl,
    embedCode,
    
    previewImage: `${baseUrl}/api/highlights/${matchId}/image`,
    previewTitle: `${winner.name} defeats ${loser.name} in ${match.subject} Sparring!`,
    previewDescription: `Final Score: ${winnerScore}-${loserScore}. ${moments.length > 0 ? moments[0].description : 'Epic battle!'}`
  }
}

/**
 * Extract dramatic moments
 */
function extractMoments(match: any): Array<{
  type: string
  round: number
  description: string
  player: string
  significance: number
}> {
  const moments: Array<{
    type: string
    round: number
    description: string
    player: string
    significance: number
  }> = []

  let p1Score = 0, p2Score = 0
  let previousLeader: string | null = null

  for (const round of match.rounds) {
    const p1Correct = round.player1Correct
    const p2Correct = round.player2Correct
    const p1Time = round.player1Time || 15
    const p2Time = round.player2Time || 15
    const points = round.pointsAwarded

    // Fastest answer
    if ((p1Correct && p1Time <= 5) || (p2Correct && p2Time <= 5)) {
      const fastPlayer = p1Time < p2Time ? match.player1.name : match.player2.name
      moments.push({
        type: 'fastest_answer',
        round: round.roundNumber,
        description: `⚡ ${fastPlayer} answered in ${Math.min(p1Time, p2Time)}s!`,
        player: fastPlayer,
        significance: 8
      })
    }

    // Update scores
    const newP1Score = p1Score + (p1Correct ? points : 0)
    const newP2Score = p2Score + (p2Correct ? points : 0)

    // Lead change
    const currentLeader = newP1Score > newP2Score ? match.player1Id : 
                          newP2Score > newP1Score ? match.player2Id : null
    if (previousLeader && currentLeader && previousLeader !== currentLeader) {
      const leader = currentLeader === match.player1Id ? match.player1.name : match.player2.name
      moments.push({
        type: 'lead_change',
        round: round.roundNumber,
        description: `🔥 ${leader} takes the lead! ${newP1Score}-${newP2Score}`,
        player: leader,
        significance: 7
      })
    }
    previousLeader = currentLeader

    // Perfect round
    if (p1Correct && p2Correct) {
      const winner = p1Time < p2Time ? match.player1.name : match.player2.name
      moments.push({
        type: 'perfect_round',
        round: round.roundNumber,
        description: `✨ Both correct! ${winner} was faster!`,
        player: winner,
        significance: 6
      })
    }

    // Final round clutch
    if (round.roundNumber === match.totalRounds) {
      const scoreDiff = Math.abs(newP1Score - newP2Score)
      if (scoreDiff <= points) {
        moments.push({
          type: 'clutch',
          round: round.roundNumber,
          description: `🎯 FINAL ROUND! Winner takes all!`,
          player: match.winnerId === match.player1Id ? match.player1.name : match.player2.name,
          significance: 10
        })
      }
    }

    p1Score = newP1Score
    p2Score = newP2Score
  }

  return moments.sort((a, b) => b.significance - a.significance).slice(0, 5)
}

/**
 * Calculate match stats
 */
function calculateStats(match: any): {
  fastestAnswer: { player: string; time: number }
  accuracyRate: { player1: number; player2: number }
  leadChanges: number
  closestRound: number
} {
  const rounds = match.rounds
  const p1Correct = rounds.filter((r: any) => r.player1Correct).length
  const p2Correct = rounds.filter((r: any) => r.player2Correct).length

  const p1Times = rounds.map((r: any) => r.player1Time || 15)
  const p2Times = rounds.map((r: any) => r.player2Time || 15)
  const fastestTime = Math.min(...p1Times, ...p2Times)
  const fastestPlayer = p1Times.includes(fastestTime) ? match.player1.name : match.player2.name

  // Calculate lead changes
  let leadChanges = 0
  let leader: string | null = null
  let p1Score = 0, p2Score = 0
  for (const r of rounds) {
    p1Score += r.player1Correct ? r.pointsAwarded : 0
    p2Score += r.player2Correct ? r.pointsAwarded : 0
    const newLeader = p1Score > p2Score ? 'p1' : p2Score > p1Score ? 'p2' : null
    if (leader && newLeader && leader !== newLeader) leadChanges++
    if (newLeader) leader = newLeader
  }

  return {
    fastestAnswer: { player: fastestPlayer, time: fastestTime },
    accuracyRate: {
      player1: rounds.length > 0 ? Math.round(p1Correct / rounds.length * 100) : 0,
      player2: rounds.length > 0 ? Math.round(p2Correct / rounds.length * 100) : 0
    },
    leadChanges,
    closestRound: 1
  }
}

/**
 * Generate embed code
 */
function generateEmbedCode(
  shareUrl: string,
  winner: string,
  loser: string,
  winnerScore: number,
  loserScore: number
): string {
  return `<iframe 
  src="${shareUrl}/embed" 
  width="400" 
  height="600" 
  frameborder="0"
  title="${winner} vs ${loser}: ${winnerScore}-${loserScore}">
</iframe>`
}

// Named exports for share highlight functions
const shareHighlightExports = {
  getShareableHighlight
}

export default shareHighlightExports
