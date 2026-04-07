import { db } from '@/lib/db';
import { generateAIOpponentStats, getKRTier } from './kr-calculator';
import { createMatch } from './battle-engine';

// Types
export interface MatchmakingResult {
  matchId: string;
  opponent: {
    id: string;
    name: string;
    avatar: string;
    kr: number;
    tier: string;
    isAI: boolean;
  };
  ratingDiff?: number;
  estimatedWait?: number;
}

// Quick match - instant AI opponent
export async function quickMatch(playerId: string): Promise<MatchmakingResult> {
  // Get player info
  const player = await db.user.findUnique({
    where: { id: playerId },
  });

  if (!player) {
    throw new Error('Player not found');
  }

  // For quick match, generate an AI opponent with similar KR
  const aiStats = generateAIOpponentStats('medium', player.knowledgeRating);
  const tier = getKRTier(aiStats.kr);

  // Create the match
  const battleState = await createMatch(playerId, 'quick', 'Mixed');

  return {
    matchId: battleState.matchId,
    opponent: {
      id: 'ai-opponent',
      name: aiStats.name,
      avatar: aiStats.avatar,
      kr: aiStats.kr,
      tier: tier.label,
      isAI: true,
    },
    estimatedWait: 0,
  };
}

// Ranked match - match based on KR with tighter ranges
export async function rankedMatch(playerId: string): Promise<MatchmakingResult> {
  // Get player info
  const player = await db.user.findUnique({
    where: { id: playerId },
  });

  if (!player) {
    throw new Error('Player not found');
  }

  // For ranked, create an AI opponent with rating within ±200 KR
  const ratingVariance = Math.floor(Math.random() * 400) - 200; // -200 to +200
  const opponentKR = Math.max(800, player.knowledgeRating + ratingVariance);
  
  // Determine difficulty based on rating difference
  let difficulty = 'medium';
  if (opponentKR > player.knowledgeRating + 100) {
    difficulty = 'hard';
  } else if (opponentKR < player.knowledgeRating - 100) {
    difficulty = 'easy';
  }

  const aiStats = generateAIOpponentStats(difficulty, player.knowledgeRating);
  const tier = getKRTier(aiStats.kr);

  // Create the match
  const battleState = await createMatch(playerId, 'ranked', 'Mixed');

  return {
    matchId: battleState.matchId,
    opponent: {
      id: 'ai-opponent',
      name: aiStats.name,
      avatar: aiStats.avatar,
      kr: aiStats.kr,
      tier: tier.label,
      isAI: true,
    },
    ratingDiff: Math.abs(player.knowledgeRating - aiStats.kr),
    estimatedWait: 0,
  };
}

// Challenge a specific player
export async function challengePlayer(
  challengerId: string,
  opponentId: string
): Promise<MatchmakingResult> {
  // Get both players
  const challenger = await db.user.findUnique({
    where: { id: challengerId },
  });

  const opponent = await db.user.findUnique({
    where: { id: opponentId },
  });

  if (!challenger || !opponent) {
    throw new Error('Player not found');
  }

  const tier = getKRTier(opponent.knowledgeRating);

  // Create the challenge match
  const battleState = await createMatch(challengerId, 'challenge', 'Mixed', opponentId);

  // In a real app, we would notify the opponent here
  // For now, simulate the opponent accepting immediately

  return {
    matchId: battleState.matchId,
    opponent: {
      id: opponent.id,
      name: opponent.name || 'Opponent',
      avatar: opponent.avatar || '👤',
      kr: opponent.knowledgeRating,
      tier: tier.label,
      isAI: false,
    },
    ratingDiff: Math.abs(challenger.knowledgeRating - opponent.knowledgeRating),
  };
}

// Find potential opponents for challenge
export async function findPotentialOpponents(
  playerId: string,
  limit: number = 10
): Promise<Array<{
  id: string;
  name: string;
  avatar: string;
  kr: number;
  tier: string;
  winRate: number;
}>> {
  const player = await db.user.findUnique({
    where: { id: playerId },
  });

  if (!player) {
    throw new Error('Player not found');
  }

  // Find players with similar KR (±300)
  const nearbyPlayers = await db.user.findMany({
    where: {
      id: { not: playerId },
      knowledgeRating: {
        gte: player.knowledgeRating - 300,
        lte: player.knowledgeRating + 300,
      },
    },
    take: limit,
    orderBy: { knowledgeRating: 'desc' },
  });

  // Calculate win rates and format response
  const opponents = await Promise.all(
    nearbyPlayers.map(async (p) => {
      const matches = await db.match.count({
        where: {
          OR: [
            { player1Id: p.id },
            { player2Id: p.id },
          ],
          status: 'completed',
        },
      });

      const wins = await db.match.count({
        where: {
          winnerId: p.id,
          status: 'completed',
        },
      });

      const winRate = matches > 0 ? (wins / matches) * 100 : 0;
      const tier = getKRTier(p.knowledgeRating);

      return {
        id: p.id,
        name: p.name || 'Unknown',
        avatar: p.avatar || '👤',
        kr: p.knowledgeRating,
        tier: tier.label,
        winRate: Math.round(winRate),
      };
    })
  );

  return opponents;
}

// Get match history for a player
export async function getMatchHistory(
  playerId: string,
  limit: number = 10
): Promise<Array<{
  id: string;
  opponent: string;
  opponentKR: number;
  result: 'win' | 'loss' | 'draw';
  playerScore: number;
  opponentScore: number;
  krChange: number;
  subject: string;
  mode: string;
  createdAt: Date;
}>> {
  const matches = await db.match.findMany({
    where: {
      OR: [
        { player1Id: playerId },
        { player2Id: playerId },
      ],
      status: 'completed',
    },
    include: {
      player1: true,
      player2: true,
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });

  return matches.map((match) => {
    const isPlayer1 = match.player1Id === playerId;
    const playerScore = isPlayer1 ? match.player1Score : match.player2Score || 0;
    const opponentScore = isPlayer1 ? match.player2Score : match.player1Score;
    const opponent = isPlayer1 
      ? (match.player2?.name || 'AI Opponent') 
      : (match.player1?.name || 'Opponent');
    const opponentKR = 1200; // Default for AI opponents

    let result: 'win' | 'loss' | 'draw';
    if (match.winnerId === playerId) {
      result = 'win';
    } else if (match.winnerId === null && playerScore === opponentScore) {
      result = 'draw';
    } else {
      result = 'loss';
    }

    return {
      id: match.id,
      opponent,
      opponentKR,
      result,
      playerScore,
      opponentScore,
      krChange: result === 'win' ? 15 : result === 'loss' ? -10 : 0,
      subject: match.subject,
      mode: match.mode,
      createdAt: match.createdAt,
    };
  });
}
