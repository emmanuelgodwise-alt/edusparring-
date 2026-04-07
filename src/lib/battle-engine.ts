import { prisma } from './db';
import { generateQuestion, generateOpponentAnswer, evaluateAnswer } from './ai-engine';

// Types
export interface BattleState {
  matchId: string;
  playerId: string;
  opponentId: string;
  currentRound: number;
  totalRounds: number;
  playerScore: number;
  opponentScore: number;
  currentQuestion?: {
    id: string;
    text: string;
    options: string[];
    correctAnswer: string;
    explanation: string;
    pointsValue: number;
    difficulty: string;
  };
  status: 'active' | 'completed';
  timeLeft: number;
}

export interface RoundResult {
  playerAnswer: string;
  opponentAnswer: string;
  playerCorrect: boolean;
  opponentCorrect: boolean;
  playerPoints: number;
  opponentPoints: number;
  explanation: string;
}

// Calculate Knowledge Rating change (ELO-like system)
export function calculateKRChange(
  playerKR: number,
  opponentKR: number,
  won: boolean,
  kFactor: number = 32
): number {
  const expectedScore = 1 / (1 + Math.pow(10, (opponentKR - playerKR) / 400));
  const actualScore = won ? 1 : 0;
  const change = Math.round(kFactor * (actualScore - expectedScore));
  return change;
}

// Create a new match
export async function createMatch(
  playerId: string,
  mode: 'quick' | 'ranked' | 'challenge',
  subject?: string,
  opponentId?: string
): Promise<{ matchId: string; opponent: { id: string; name: string; knowledgeRating: number } }> {
  // Get or create opponent
  let opponent;
  
  if (opponentId) {
    opponent = await prisma.user.findUnique({
      where: { id: opponentId }
    });
  } else {
    // Find a random opponent or create AI opponent
    const player = await prisma.user.findUnique({ where: { id: playerId } });
    const playerKR = player?.knowledgeRating || 800;
    
    // Find opponents with similar KR (within 200 points)
    const potentialOpponents = await prisma.user.findMany({
      where: {
        id: { not: playerId },
        knowledgeRating: {
          gte: playerKR - 200,
          lte: playerKR + 200
        }
      },
      take: 5
    });

    if (potentialOpponents.length > 0) {
      opponent = potentialOpponents[Math.floor(Math.random() * potentialOpponents.length)];
    } else {
      // Create an AI opponent
      opponent = await prisma.user.create({
        data: {
          email: `ai_${Date.now()}@edusparring.ai`,
          name: generateAIName(),
          knowledgeRating: playerKR + Math.floor(Math.random() * 100) - 50,
          avatar: '🤖'
        }
      });
    }
  }

  if (!opponent) {
    throw new Error('Could not find or create opponent');
  }

  // Determine difficulty based on KR
  const avgKR = ((await prisma.user.findUnique({ where: { id: playerId } }))?.knowledgeRating || 800 + opponent.knowledgeRating) / 2;
  let difficulty = 'medium';
  if (avgKR < 1000) difficulty = 'easy';
  else if (avgKR < 1400) difficulty = 'medium';
  else if (avgKR < 1800) difficulty = 'hard';
  else difficulty = 'expert';

  // Create match
  const match = await prisma.match.create({
    data: {
      player1Id: playerId,
      player2Id: opponent.id,
      mode,
      subject: subject || 'Math',
      status: 'active',
      totalRounds: 5,
      currentRound: 0,
      difficulty,
      startedAt: new Date()
    }
  });

  return {
    matchId: match.id,
    opponent: {
      id: opponent.id,
      name: opponent.name,
      knowledgeRating: opponent.knowledgeRating
    }
  };
}

// Generate AI opponent names
function generateAIName(): string {
  const prefixes = ['Alpha', 'Beta', 'Gamma', 'Delta', 'Omega', 'Nova', 'Zen', 'Neo', 'Cyber', 'Quantum'];
  const suffixes = ['Bot', 'Mind', 'Scholar', 'Genius', 'Pro', 'Master', 'Whiz', 'Ace', 'Champ', 'Star'];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
  return `${prefix}${suffix}${Math.floor(Math.random() * 100)}`;
}

// Get next question for the match
export async function getNextQuestion(matchId: string): Promise<BattleState['currentQuestion'] & { questionId: string }> {
  const match = await prisma.match.findUnique({
    where: { id: matchId },
    include: {
      player1: true,
      player2: true,
      rounds: { include: { question: true } }
    }
  });

  if (!match) {
    throw new Error('Match not found');
  }

  // Get topics already used
  const usedTopics = match.rounds.map(r => r.question.topic);

  // Generate new question
  const subject = match.subject || 'Math';
  const topics = getTopicsForSubject(subject);
  const availableTopics = topics.filter(t => !usedTopics.includes(t));
  const topic = availableTopics.length > 0 
    ? availableTopics[Math.floor(Math.random() * availableTopics.length)]
    : topics[Math.floor(Math.random() * topics.length)];

  const level = match.player1.level || 'High School';
  
  const generatedQ = await generateQuestion({
    subject,
    topic,
    level,
    difficulty: match.difficulty as 'easy' | 'medium' | 'hard' | 'expert',
    questionType: 'multiple_choice'
  });

  // Save question to database
  const question = await prisma.question.create({
    data: {
      subject,
      topic,
      difficulty: match.difficulty,
      type: 'multiple_choice',
      text: generatedQ.text,
      options: JSON.stringify(generatedQ.options || []),
      correctAnswer: generatedQ.correctAnswer,
      explanation: generatedQ.explanation,
      pointsValue: getPointsForDifficulty(match.difficulty)
    }
  });

  // Create the round record with the question (answers will be filled when submitted)
  const nextRoundNumber = match.currentRound + 1;
  await prisma.matchRound.create({
    data: {
      matchId,
      roundNumber: nextRoundNumber,
      questionId: question.id,
      pointsAwarded: question.pointsValue
    }
  });

  // Update match current round
  await prisma.match.update({
    where: { id: matchId },
    data: { currentRound: nextRoundNumber }
  });

  return {
    id: question.id,
    questionId: question.id,
    text: question.text,
    options: JSON.parse(question.options),
    correctAnswer: question.correctAnswer,
    explanation: question.explanation,
    pointsValue: question.pointsValue,
    difficulty: question.difficulty
  };
}

// Submit answer for a round
export async function submitAnswer(
  matchId: string,
  playerId: string,
  answer: string,
  timeTaken: number
): Promise<RoundResult & { matchEnded: boolean; winner?: string }> {
  const match = await prisma.match.findUnique({
    where: { id: matchId },
    include: {
      player1: true,
      player2: true,
      rounds: { orderBy: { roundNumber: 'desc' }, take: 1, include: { question: true } }
    }
  });

  if (!match) {
    throw new Error('Match not found');
  }

  const isPlayer1 = match.player1Id === playerId;
  const currentRoundNumber = match.currentRound; // Already incremented by getNextQuestion
  const latestRound = match.rounds[0];

  if (!latestRound || !latestRound.question) {
    throw new Error('No current question - round not found');
  }

  const question = latestRound.question;

  // Evaluate player answer
  const evaluation = await evaluateAnswer(
    question.text,
    answer,
    question.correctAnswer,
    question.type
  );

  // Generate opponent answer
  const opponentKR = isPlayer1 ? match.player2.knowledgeRating : match.player1.knowledgeRating;
  const playerKR = isPlayer1 ? match.player1.knowledgeRating : match.player2.knowledgeRating;
  
  const opponentResult = generateOpponentAnswer(
    {
      text: question.text,
      options: JSON.parse(question.options),
      correctAnswer: question.correctAnswer,
      explanation: question.explanation
    },
    opponentKR,
    playerKR,
    match.difficulty
  );

  // Calculate points
  const playerPoints = evaluation.isCorrect ? question.pointsValue : 0;
  const opponentPoints = opponentResult.isCorrect ? question.pointsValue : 0;

  // Update the existing round record with answers
  await prisma.matchRound.update({
    where: { id: latestRound.id },
    data: {
      player1Answer: isPlayer1 ? answer : opponentResult.answer,
      player2Answer: isPlayer1 ? opponentResult.answer : answer,
      player1Time: isPlayer1 ? timeTaken : opponentResult.timeTaken,
      player2Time: isPlayer1 ? opponentResult.timeTaken : timeTaken,
      player1Correct: isPlayer1 ? evaluation.isCorrect : opponentResult.isCorrect,
      player2Correct: isPlayer1 ? opponentResult.isCorrect : evaluation.isCorrect,
      winnerId: playerPoints > opponentPoints 
        ? playerId 
        : opponentPoints > playerPoints 
          ? (isPlayer1 ? match.player2Id : match.player1Id)
          : null,
      pointsAwarded: Math.max(playerPoints, opponentPoints)
    }
  });

  // Update match scores
  const newPlayer1Score = match.player1Score + (isPlayer1 ? playerPoints : opponentPoints);
  const newPlayer2Score = match.player2Score + (isPlayer1 ? opponentPoints : playerPoints);

  await prisma.match.update({
    where: { id: matchId },
    data: {
      player1Score: newPlayer1Score,
      player2Score: newPlayer2Score
    }
  });

  // Check if match ended
  const matchEnded = currentRoundNumber >= match.totalRounds;
  let winner: string | undefined;

  if (matchEnded) {
    winner = newPlayer1Score > newPlayer2Score 
      ? match.player1Id 
      : newPlayer2Score > newPlayer1Score 
        ? match.player2Id 
        : undefined;

    await prisma.match.update({
      where: { id: matchId },
      data: {
        status: 'completed',
        winnerId: winner,
        endedAt: new Date()
      }
    });

    // Update user stats
    const playerWon = winner === playerId;
    const krChange = calculateKRChange(playerKR, opponentKR, playerWon);

    await prisma.user.update({
      where: { id: playerId },
      data: {
        knowledgeRating: { increment: krChange },
        points: { increment: playerWon ? 50 : 20 },
        totalWins: playerWon ? { increment: 1 } : undefined,
        totalLosses: !playerWon ? { increment: 1 } : undefined,
        currentStreak: playerWon ? { increment: 1 } : 0,
        bestStreak: playerWon ? { increment: 1 } : undefined
      }
    });
  }

  return {
    playerAnswer: answer,
    opponentAnswer: opponentResult.answer,
    playerCorrect: evaluation.isCorrect,
    opponentCorrect: opponentResult.isCorrect,
    playerPoints,
    opponentPoints,
    explanation: evaluation.explanation,
    matchEnded,
    winner
  };
}

// Get points for difficulty
function getPointsForDifficulty(difficulty: string): number {
  const points: Record<string, number> = {
    easy: 10,
    medium: 15,
    hard: 20,
    expert: 30
  };
  return points[difficulty] || 15;
}

// Get topics for subject
function getTopicsForSubject(subject: string): string[] {
  const topics: Record<string, string[]> = {
    Math: [
      'Algebra: Linear Equations',
      'Algebra: Quadratic Equations',
      'Geometry: Triangles',
      'Geometry: Circles',
      'Trigonometry',
      'Calculus: Derivatives',
      'Calculus: Integrals',
      'Statistics: Probability',
      'Statistics: Mean/Median/Mode',
      'Number Theory'
    ],
    Physics: [
      'Mechanics: Newton\'s Laws',
      'Mechanics: Kinematics',
      'Mechanics: Energy',
      'Electricity: Circuits',
      'Electricity: Fields',
      'Magnetism',
      'Waves and Optics',
      'Thermodynamics',
      'Modern Physics',
      'Fluid Mechanics'
    ],
    Chemistry: [
      'Atomic Structure',
      'Chemical Bonding',
      'Stoichiometry',
      'Thermodynamics',
      'Kinetics',
      'Equilibrium',
      'Electrochemistry',
      'Organic Chemistry',
      'Periodic Table',
      'Acids and Bases'
    ],
    Biology: [
      'Cell Structure',
      'Genetics',
      'Evolution',
      'Ecology',
      'Human Anatomy',
      'Plant Biology',
      'Microbiology',
      'Biochemistry',
      'Physiology',
      'Biotechnology'
    ],
    History: [
      'World War I',
      'World War II',
      'Ancient Civilizations',
      'Medieval Period',
      'Renaissance',
      'Industrial Revolution',
      'American History',
      'European History',
      'Asian History',
      'Modern History'
    ]
  };

  return topics[subject] || topics['Math'];
}

// Get battle state
export async function getBattleState(matchId: string, playerId: string): Promise<BattleState> {
  const match = await prisma.match.findUnique({
    where: { id: matchId },
    include: {
      player1: true,
      player2: true
    }
  });

  if (!match) {
    throw new Error('Match not found');
  }

  const isPlayer1 = match.player1Id === playerId;

  return {
    matchId: match.id,
    playerId,
    opponentId: isPlayer1 ? match.player2Id : match.player1Id,
    currentRound: match.currentRound,
    totalRounds: match.totalRounds,
    playerScore: isPlayer1 ? match.player1Score : match.player2Score,
    opponentScore: isPlayer1 ? match.player2Score : match.player1Score,
    status: match.status as 'active' | 'completed',
    timeLeft: 15
  };
}

// Generate coaching feedback after match
export async function generateCoachingFeedback(
  matchHistory: Array<{
    subject: string;
    topic: string;
    correct: boolean;
    timeTaken: number;
    difficulty: string;
  }>,
  playerName: string
): Promise<{
  overallFeedback: string;
  strengths: string[];
  improvements: string[];
  recommendedTopics: string[];
  performance: number;
}> {
  // Calculate performance metrics
  const totalQuestions = matchHistory.length;
  const correctAnswers = matchHistory.filter(r => r.correct).length;
  const avgTime = matchHistory.reduce((sum, r) => sum + r.timeTaken, 0) / totalQuestions;
  const performance = Math.round((correctAnswers / totalQuestions) * 100);

  // Identify strengths (topics where player performed well)
  const topicPerformance: Record<string, { correct: number; total: number }> = {};
  for (const round of matchHistory) {
    if (!topicPerformance[round.topic]) {
      topicPerformance[round.topic] = { correct: 0, total: 0 };
    }
    topicPerformance[round.topic].total++;
    if (round.correct) {
      topicPerformance[round.topic].correct++;
    }
  }

  const strengths: string[] = [];
  const improvements: string[] = [];
  const recommendedTopics: string[] = [];

  for (const [topic, stats] of Object.entries(topicPerformance)) {
    const accuracy = stats.correct / stats.total;
    if (accuracy >= 0.7) {
      strengths.push(`Strong understanding of ${topic} (${Math.round(accuracy * 100)}% accuracy)`);
    } else {
      improvements.push(`Review ${topic} to improve accuracy`);
      recommendedTopics.push(topic);
    }
  }

  // Generate overall feedback
  let overallFeedback = '';
  if (performance >= 80) {
    overallFeedback = `Excellent performance, ${playerName}! You demonstrated mastery across most topics. Keep challenging yourself with harder questions.`;
  } else if (performance >= 60) {
    overallFeedback = `Good job, ${playerName}! You're making solid progress. Focus on the recommended topics to reach the next level.`;
  } else {
    overallFeedback = `Keep practicing, ${playerName}! Every battle is a learning opportunity. Review the suggested topics and try again.`;
  }

  // Add time-based feedback
  if (avgTime < 5) {
    strengths.push('Lightning-fast responses!');
  } else if (avgTime > 12) {
    improvements.push('Work on answering more quickly while maintaining accuracy');
  }

  return {
    overallFeedback,
    strengths: strengths.length > 0 ? strengths : ['Keep up the consistent effort!'],
    improvements: improvements.length > 0 ? improvements : ['Continue practicing to maintain your edge'],
    recommendedTopics,
    performance
  };
}
