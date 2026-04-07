/**
 * Knowledge Rating (KR) Calculator
 * Similar to ELO rating system but adapted for educational battles
 */

// KR Ranges
export const KR_RANGES = {
  BEGINNER: { min: 0, max: 999, label: 'Beginner', color: '#9CA3AF' },
  INTERMEDIATE: { min: 1000, max: 1399, label: 'Intermediate', color: '#10B981' },
  ADVANCED: { min: 1400, max: 1799, label: 'Advanced', color: '#8B5CF6' },
  ELITE: { min: 1800, max: 9999, label: 'Elite', color: '#F59E0B' },
};

// Get KR tier info
export function getKRTier(kr: number): { label: string; color: string; min: number; max: number } {
  if (kr < 1000) return KR_RANGES.BEGINNER;
  if (kr < 1400) return KR_RANGES.INTERMEDIATE;
  if (kr < 1800) return KR_RANGES.ADVANCED;
  return KR_RANGES.ELITE;
}

// Calculate expected win probability
export function expectedWinProbability(playerKR: number, opponentKR: number): number {
  return 1 / (1 + Math.pow(10, (opponentKR - playerKR) / 400));
}

// Calculate KR change after a match
export function calculateKRChange(
  playerKR: number,
  opponentKR: number,
  won: boolean,
  isRanked: boolean = true
): number {
  // K-factor determines rating volatility
  // Higher K for lower-rated players (faster improvement)
  let K = 32;
  if (playerKR < 1000) K = 40;
  else if (playerKR < 1400) K = 36;
  else if (playerKR >= 1800) K = 24;

  // Non-ranked matches have less impact
  if (!isRanked) K *= 0.5;

  const expected = expectedWinProbability(playerKR, opponentKR);
  const actual = won ? 1 : 0;

  return Math.round(K * (actual - expected));
}

// Calculate bonus KR for streak
export function calculateStreakBonus(streak: number): number {
  if (streak < 3) return 0;
  if (streak < 5) return 5;
  if (streak < 10) return 10;
  return 15;
}

// Calculate performance rating based on match stats
export function calculatePerformanceRating(
  correctAnswers: number,
  totalQuestions: number,
  averageTime: number,
  difficulty: string
): number {
  const accuracy = correctAnswers / totalQuestions;
  
  // Base performance from accuracy
  let performance = accuracy * 100;
  
  // Time bonus (faster = better, capped at 1.2x)
  const timeBonus = Math.max(0.8, Math.min(1.2, 15 / averageTime));
  performance *= timeBonus;
  
  // Difficulty multiplier
  const difficultyMultiplier: Record<string, number> = {
    easy: 0.8,
    medium: 1.0,
    hard: 1.3,
    expert: 1.6,
  };
  performance *= difficultyMultiplier[difficulty] || 1.0;
  
  return Math.round(performance);
}

// Calculate level from KR
export function calculateLevel(kr: number): number {
  // Level 1-50 based on KR
  // Level 1 at 800 KR, Level 50 at 2000+ KR
  if (kr < 800) return 1;
  if (kr >= 2000) return 50;
  
  return Math.floor((kr - 800) / 25) + 1;
}

// Calculate XP needed for next level
export function calculateXPForLevel(level: number): number {
  return 100 + (level * 50);
}

// Calculate points earned from a match
export function calculateMatchPoints(
  won: boolean,
  correctAnswers: number,
  totalQuestions: number,
  opponentKR: number,
  playerKR: number
): number {
  let points = 0;
  
  // Base points for participation
  points += 10;
  
  // Points for correct answers
  points += correctAnswers * 5;
  
  // Bonus for winning
  if (won) {
    points += 25;
    
    // Extra bonus for beating higher-rated opponent
    if (opponentKR > playerKR) {
      const ratingDiff = opponentKR - playerKR;
      points += Math.floor(ratingDiff / 50);
    }
  }
  
  return points;
}

// Generate AI opponent stats based on difficulty
export function generateAIOpponentStats(difficulty: string, playerKR: number): {
  name: string;
  avatar: string;
  kr: number;
  accuracy: number;
  avgTime: number;
} {
  const aiNames: Record<string, string[]> = {
    easy: ['Nova', 'Spark', 'Bolt', 'Flash'],
    medium: ['Cipher', 'Nexus', 'Quantum', 'Vector'],
    hard: ['Apex', 'Zenith', 'Sovereign', 'Sentinel'],
    expert: ['Omega', 'Infinite', 'Transcendent', 'Omniscient'],
  };

  const avatars = ['🤖', '🧠', '💡', '⚡', '🎯', '🔮', '🌟', '💫'];
  
  const name = aiNames[difficulty][Math.floor(Math.random() * aiNames[difficulty].length)];
  const avatar = avatars[Math.floor(Math.random() * avatars.length)];
  
  // KR variance based on difficulty
  const krRange: Record<string, [number, number]> = {
    easy: [playerKR - 200, playerKR - 50],
    medium: [playerKR - 100, playerKR + 100],
    hard: [playerKR + 50, playerKR + 200],
    expert: [playerKR + 150, playerKR + 400],
  };
  
  const [minKR, maxKR] = krRange[difficulty];
  const kr = Math.max(800, Math.floor(Math.random() * (maxKR - minKR + 1)) + minKR);
  
  // Accuracy and time based on difficulty
  const stats: Record<string, { accuracy: [number, number]; avgTime: [number, number] }> = {
    easy: { accuracy: [0.4, 0.6], avgTime: [10, 14] },
    medium: { accuracy: [0.6, 0.75], avgTime: [7, 11] },
    hard: { accuracy: [0.75, 0.9], avgTime: [5, 9] },
    expert: { accuracy: [0.85, 0.98], avgTime: [4, 7] },
  };
  
  const { accuracy: accRange, avgTime: timeRange } = stats[difficulty];
  const accuracy = Math.random() * (accRange[1] - accRange[0]) + accRange[0];
  const avgTime = Math.random() * (timeRange[1] - timeRange[0]) + timeRange[0];
  
  return {
    name: `${name} AI`,
    avatar,
    kr,
    accuracy,
    avgTime,
  };
}
