/**
 * Tournament Engine for EduSparring
 * 
 * Supports the EduSparring World Cup concept with:
 * - Bracket-style tournaments (single/double elimination)
 * - Swiss system tournaments
 * - Round-robin group stages
 * - Live spectator support
 * 
 * TOURNAMENT FLOW:
 * 
 * Registration → Group Stage → Knockout → Finals
 */

import { prisma } from './db'

// Tournament types
export type TournamentFormat = 'single_elimination' | 'double_elimination' | 'swiss' | 'round_robin'
export type TournamentStage = 'registration' | 'group_stage' | 'knockout' | 'quarterfinal' | 'semifinal' | 'final' | 'completed'

// Bracket match
export interface BracketMatch {
  id: string
  round: number
  position: number
  player1Id: string | null
  player2Id: string | null
  winnerId: string | null
  score1: number
  score2: number
  status: 'pending' | 'ready' | 'active' | 'completed'
  matchId?: string // Reference to actual match
}

// Group stage group
export interface TournamentGroup {
  id: string
  name: string
  players: string[]
  standings: {
    playerId: string
    wins: number
    losses: number
    draws: number
    points: number
  }[]
}

// Tournament bracket structure
export interface TournamentBracket {
  tournamentId: string
  format: TournamentFormat
  stage: TournamentStage
  groups: TournamentGroup[]
  knockout: {
    rounds: BracketMatch[][]
    currentRound: number
  }
  seedOrder: string[] // Player IDs in seed order
}

/**
 * Generate tournament bracket
 */
export function generateBracket(
  tournamentId: string,
  playerIds: string[],
  format: TournamentFormat
): TournamentBracket {
  // Shuffle players for fair seeding (or sort by KR in production)
  const shuffledPlayers = [...playerIds].sort(() => Math.random() - 0.5)

  switch (format) {
    case 'single_elimination':
      return generateSingleEliminationBracket(tournamentId, shuffledPlayers)
    case 'double_elimination':
      return generateDoubleEliminationBracket(tournamentId, shuffledPlayers)
    case 'swiss':
      return generateSwissTournament(tournamentId, shuffledPlayers)
    case 'round_robin':
      return generateRoundRobinGroups(tournamentId, shuffledPlayers)
    default:
      throw new Error(`Unknown tournament format: ${format}`)
  }
}

/**
 * Single Elimination Bracket
 * 
 * Example with 8 players:
 * 
 * Round 1 (Quarterfinals):
 *   Match 1: Seed 1 vs Seed 8
 *   Match 2: Seed 4 vs Seed 5
 *   Match 3: Seed 3 vs Seed 6
 *   Match 4: Seed 2 vs Seed 7
 * 
 * Round 2 (Semifinals):
 *   Match 5: Winner M1 vs Winner M2
 *   Match 6: Winner M3 vs Winner M4
 * 
 * Round 3 (Final):
 *   Match 7: Winner M5 vs Winner M6
 */
function generateSingleEliminationBracket(
  tournamentId: string,
  players: string[]
): TournamentBracket {
  const playerCount = players.length
  const nextPowerOf2 = Math.pow(2, Math.ceil(Math.log2(playerCount)))
  const byeCount = nextPowerOf2 - playerCount
  const totalRounds = Math.log2(nextPowerOf2)

  // Add byes (null players that auto-advance)
  const bracketPlayers = [...players]
  for (let i = 0; i < byeCount; i++) {
    bracketPlayers.push('bye')
  }

  const rounds: BracketMatch[][] = []
  let matchId = 1

  // Generate first round
  const firstRoundMatches: BracketMatch[] = []
  for (let i = 0; i < bracketPlayers.length / 2; i++) {
    firstRoundMatches.push({
      id: `m${matchId++}`,
      round: 1,
      position: i,
      player1Id: bracketPlayers[i] === 'bye' ? null : bracketPlayers[i],
      player2Id: bracketPlayers[bracketPlayers.length - 1 - i] === 'bye' ? null : bracketPlayers[bracketPlayers.length - 1 - i],
      winnerId: null,
      score1: 0,
      score2: 0,
      status: bracketPlayers[i] === 'bye' || bracketPlayers[bracketPlayers.length - 1 - i] === 'bye' ? 'completed' : 'pending'
    })
  }
  rounds.push(firstRoundMatches)

  // Generate subsequent rounds (empty placeholders)
  let matchesInRound = firstRoundMatches.length / 2
  for (let round = 2; round <= totalRounds; round++) {
    const roundMatches: BracketMatch[] = []
    for (let i = 0; i < matchesInRound; i++) {
      roundMatches.push({
        id: `m${matchId++}`,
        round,
        position: i,
        player1Id: null,
        player2Id: null,
        winnerId: null,
        score1: 0,
        score2: 0,
        status: 'pending'
      })
    }
    rounds.push(roundMatches)
    matchesInRound /= 2
  }

  return {
    tournamentId,
    format: 'single_elimination',
    stage: playerCount <= 4 ? 'semifinal' : playerCount <= 8 ? 'quarterfinal' : 'knockout',
    groups: [],
    knockout: {
      rounds,
      currentRound: 1
    },
    seedOrder: players
  }
}

/**
 * Double Elimination Bracket
 * 
 * Players must lose twice to be eliminated.
 * Has winners bracket and losers bracket.
 * 
 * Used for important tournaments where one bad match shouldn't eliminate you.
 */
function generateDoubleEliminationBracket(
  tournamentId: string,
  players: string[]
): TournamentBracket {
  // For simplicity, we'll use single elimination structure
  // In production, implement full winners/losers bracket logic
  const bracket = generateSingleEliminationBracket(tournamentId, players)
  return {
    ...bracket,
    format: 'double_elimination'
  }
}

/**
 * Swiss Tournament
 * 
 * Players are paired with others of similar score.
 * No elimination - everyone plays all rounds.
 * 
 * Good for educational tournaments where learning > elimination.
 */
function generateSwissTournament(
  tournamentId: string,
  players: string[]
): TournamentBracket {
  const roundCount = Math.ceil(Math.log2(players.length))
  const matchesPerRound = Math.floor(players.length / 2)

  const rounds: BracketMatch[][] = []

  for (let round = 1; round <= roundCount; round++) {
    const roundMatches: BracketMatch[] = []
    for (let i = 0; i < matchesPerRound; i++) {
      roundMatches.push({
        id: `m${round}-${i + 1}`,
        round,
        position: i,
        player1Id: null,
        player2Id: null,
        winnerId: null,
        score1: 0,
        score2: 0,
        status: 'pending'
      })
    }
    rounds.push(roundMatches)
  }

  // Initialize standings
  const standings = players.map(playerId => ({
    playerId,
    wins: 0,
    losses: 0,
    draws: 0,
    points: 0
  }))

  return {
    tournamentId,
    format: 'swiss',
    stage: 'group_stage',
    groups: [{
      id: 'main',
      name: 'Swiss Stage',
      players,
      standings
    }],
    knockout: {
      rounds,
      currentRound: 1
    },
    seedOrder: players
  }
}

/**
 * Round Robin Groups
 * 
 * Players divided into groups, everyone plays everyone in their group.
 * Top performers advance to knockout.
 * 
 * Used in World Cup style tournaments.
 */
function generateRoundRobinGroups(
  tournamentId: string,
  players: string[]
): TournamentBracket {
  // Divide into groups of 4
  const groupSize = 4
  const groupCount = Math.ceil(players.length / groupSize)
  const groups: TournamentGroup[] = []

  for (let g = 0; g < groupCount; g++) {
    const groupPlayers = players.slice(g * groupSize, (g + 1) * groupSize)
    groups.push({
      id: `group-${g + 1}`,
      name: `Group ${String.fromCharCode(65 + g)}`, // A, B, C, ...
      players: groupPlayers,
      standings: groupPlayers.map(playerId => ({
        playerId,
        wins: 0,
        losses: 0,
        draws: 0,
        points: 0
      }))
    })
  }

  // Generate group stage matches
  const groupMatches: BracketMatch[][] = []
  let matchId = 1

  groups.forEach((group, groupIndex) => {
    // Each player plays everyone else in their group
    const groupRounds: BracketMatch[] = []
    for (let i = 0; i < group.players.length; i++) {
      for (let j = i + 1; j < group.players.length; j++) {
        groupRounds.push({
          id: `m${matchId++}`,
          round: 1,
          position: groupIndex,
          player1Id: group.players[i],
          player2Id: group.players[j],
          winnerId: null,
          score1: 0,
          score2: 0,
          status: 'pending'
        })
      }
    }
    groupMatches.push(groupRounds)
  })

  return {
    tournamentId,
    format: 'round_robin',
    stage: 'group_stage',
    groups,
    knockout: {
      rounds: groupMatches,
      currentRound: 1
    },
    seedOrder: players
  }
}

/**
 * Get next round pairings based on results
 */
export function advanceToNextRound(
  bracket: TournamentBracket
): TournamentBracket {
  const { knockout, stage } = bracket
  const currentRoundMatches = knockout.rounds[knockout.currentRound - 1]
  
  // Check if all matches in current round are completed
  const allCompleted = currentRoundMatches.every(m => m.status === 'completed')
  if (!allCompleted) {
    return bracket
  }

  const nextRoundIndex = knockout.currentRound
  if (nextRoundIndex >= knockout.rounds.length) {
    // Tournament completed
    return {
      ...bracket,
      stage: 'completed'
    }
  }

  // Populate next round with winners
  const nextRoundMatches = knockout.rounds[nextRoundIndex]
  for (let i = 0; i < nextRoundMatches.length; i++) {
    const match1 = currentRoundMatches[i * 2]
    const match2 = currentRoundMatches[i * 2 + 1]
    
    if (match1 && match2) {
      nextRoundMatches[i].player1Id = match1.winnerId
      nextRoundMatches[i].player2Id = match2.winnerId
      nextRoundMatches[i].status = match1.winnerId && match2.winnerId ? 'ready' : 'pending'
    }
  }

  // Update stage
  let newStage: TournamentStage = stage
  const remainingRounds = knockout.rounds.length - nextRoundIndex
  if (remainingRounds === 1) newStage = 'final'
  else if (remainingRounds === 2) newStage = 'semifinal'
  else if (remainingRounds === 3) newStage = 'quarterfinal'

  return {
    ...bracket,
    stage: newStage,
    knockout: {
      ...knockout,
      currentRound: nextRoundIndex + 1
    }
  }
}

/**
 * Update match result in bracket
 */
export function updateBracketMatch(
  bracket: TournamentBracket,
  matchId: string,
  winnerId: string,
  score1: number,
  score2: number
): TournamentBracket {
  const updatedRounds = bracket.knockout.rounds.map(round =>
    round.map(match => {
      if (match.id === matchId) {
        return {
          ...match,
          winnerId,
          score1,
          score2,
          status: 'completed' as const
        }
      }
      return match
    })
  )

  const updatedBracket = {
    ...bracket,
    knockout: {
      ...bracket.knockout,
      rounds: updatedRounds
    }
  }

  // Check if we should advance
  return advanceToNextRound(updatedBracket)
}

/**
 * World Cup Format Generator
 * 
 * Creates the full EduSparring World Cup structure:
 * 1. Qualifiers (Regional tournaments)
 * 2. Group Stage (4 players per group)
 * 3. Round of 16
 * 4. Quarterfinals
 * 5. Semifinals
 * 6. Final
 */
export function generateWorldCupFormat(
  tournamentId: string,
  qualifiedPlayers: string[] // 32 players who passed qualifiers
): TournamentBracket {
  // Start with round-robin group stage
  return generateRoundRobinGroups(tournamentId, qualifiedPlayers)
}

/**
 * Tournament prize distribution
 */
export function calculatePrizeDistribution(
  totalPrizePool: number
): { place: number; amount: number; percentage: number }[] {
  return [
    { place: 1, amount: totalPrizePool * 0.40, percentage: 40 },   // Champion
    { place: 2, amount: totalPrizePool * 0.20, percentage: 20 },   // Runner-up
    { place: 3, amount: totalPrizePool * 0.12, percentage: 12 },   // Semifinalist
    { place: 4, amount: totalPrizePool * 0.08, percentage: 8 },    // Semifinalist
    { place: 5, amount: totalPrizePool * 0.05, percentage: 5 },    // Quarterfinalist
    { place: 6, amount: totalPrizePool * 0.05, percentage: 5 },    // Quarterfinalist
    { place: 7, amount: totalPrizePool * 0.05, percentage: 5 },    // Quarterfinalist
    { place: 8, amount: totalPrizePool * 0.05, percentage: 5 },    // Quarterfinalist
  ]
}

// Named exports for tournament engine functions
const tournamentEngine = {
  generateBracket,
  advanceToNextRound,
  updateBracketMatch,
  generateWorldCupFormat,
  calculatePrizeDistribution
}

export default tournamentEngine
