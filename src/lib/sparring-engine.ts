/**
 * EduSparring - True Sparring Engine
 * 
 * The sparring concept: Turn-based Q&A where players take turns
 * asking and answering questions. Learning happens through coaching
 * when either party answers incorrectly.
 * 
 * Flow:
 * 1. Player asks a question → System answers → System scores if correct
 * 2. System asks a question → Player answers → Player scores if correct
 * 3. Repeat, alternating turns
 * 
 * Coaching: When someone answers wrong, the correct answer is explained.
 */

import ZAI from 'z-ai-web-dev-sdk';
import { prisma } from './db';

// Types
export type SparringTurn = 'player_ask' | 'system_ask' | 'player_answer' | 'system_answer' | 'coaching' | 'ended';

export interface SparringState {
  sessionId: string;
  subject: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  
  // Turn management
  currentTurn: SparringTurn;
  turnNumber: number;
  roundNumber: number;
  
  // Scores
  playerScore: number;
  systemScore: number;
  
  // Current exchange
  currentQuestion: string | null;
  currentAnswer: string | null;
  expectedAnswer: string | null;
  
  // History
  exchanges: SparringExchange[];
  
  // Current coaching (if any)
  coachingMessage: string | null;
  
  // Status
  status: 'active' | 'completed';
}

export interface SparringExchange {
  roundNumber: number;
  questionBy: 'player' | 'system';
  question: string;
  answerBy: 'player' | 'system';
  answer: string;
  correctAnswer: string;
  isCorrect: boolean;
  pointsAwarded: number;
  coaching?: string;
}

export interface QuestionResult {
  question: string;
  correctAnswer: string;
  systemAnswer: string;
  isCorrect: boolean;
  explanation: string;
  pointsAwarded: number;
}

export interface AnswerResult {
  playerAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  explanation: string;
  pointsAwarded: number;
}

// Initialize ZAI
let zaiInstance: Awaited<ReturnType<typeof ZAI.create>> | null = null;

async function getZai() {
  if (!zaiInstance) {
    try {
      zaiInstance = await ZAI.create();
    } catch (error) {
      console.error('Failed to initialize ZAI:', error);
      return null;
    }
  }
  return zaiInstance;
}

// Points based on difficulty
const POINTS_MAP = {
  easy: 10,
  medium: 15,
  hard: 20,
  expert: 30
};

/**
 * Create a new sparring session
 */
export async function createSparringSession(
  playerId: string,
  subject: string,
  difficulty: 'easy' | 'medium' | 'hard' | 'expert' = 'medium'
): Promise<SparringState> {
  // Create or get a system opponent
  let systemPlayer = await prisma.user.findFirst({
    where: { email: 'system@edusparring.ai' }
  });

  if (!systemPlayer) {
    systemPlayer = await prisma.user.create({
      data: {
        email: 'system@edusparring.ai',
        name: 'EduBot',
        avatar: '🤖',
        knowledgeRating: 1500
      }
    });
  }

  // Create match record
  const match = await prisma.match.create({
    data: {
      player1Id: playerId,
      player2Id: systemPlayer.id,
      mode: 'quick',
      subject,
      status: 'active',
      totalRounds: 10, // 10 exchanges (5 questions each)
      currentRound: 0,
      difficulty
    }
  });

  return {
    sessionId: match.id,
    subject,
    difficulty,
    currentTurn: 'player_ask', // Player starts by asking
    turnNumber: 1,
    roundNumber: 1,
    playerScore: 0,
    systemScore: 0,
    currentQuestion: null,
    currentAnswer: null,
    expectedAnswer: null,
    exchanges: [],
    coachingMessage: null,
    status: 'active'
  };
}

/**
 * Process player's question - System answers
 */
export async function playerAsks(
  sessionId: string,
  question: string
): Promise<QuestionResult> {
  const zai = await getZai();
  const match = await prisma.match.findUnique({
    where: { id: sessionId }
  });

  if (!match) {
    throw new Error('Session not found');
  }

  const prompt = `You are an educational AI participating in a knowledge sparring session on the subject of ${match.subject}.
The student has asked you a question. Answer it accurately and concisely.

Student's Question: "${question}"

Instructions:
1. Provide a clear, accurate answer
2. If the question is factual, give the direct answer
3. If the question is ambiguous, provide the most reasonable interpretation
4. Keep your answer concise (1-3 sentences typically)

Respond in JSON format:
{
  "answer": "Your direct answer to the question",
  "isFactual": true/false,
  "confidence": 0.0-1.0,
  "explanation": "Brief explanation if needed"
}`;

  let systemAnswer = '';
  let isCorrect = false;
  let correctAnswer = '';
  let explanation = '';

  if (zai) {
    try {
      const response = await zai.chat.completions.create({
        messages: [
          { role: 'system', content: 'You are an expert educational AI. Provide accurate, helpful answers. Always respond with valid JSON.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
        max_tokens: 500
      });

      const content = response.choices[0]?.message?.content || '';
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        systemAnswer = parsed.answer || '';
        correctAnswer = systemAnswer; // System's answer IS the answer for factual questions
        isCorrect = true; // System gets points for answering
        explanation = parsed.explanation || '';
      }
    } catch (error) {
      console.error('AI error:', error);
    }
  }

  // Fallback response
  if (!systemAnswer) {
    systemAnswer = "That's an interesting question! Let me provide an answer based on my knowledge.";
    correctAnswer = systemAnswer;
    isCorrect = true;
    explanation = 'The system provided a response.';
  }

  const pointsAwarded = isCorrect ? POINTS_MAP[match.difficulty as keyof typeof POINTS_MAP] || 15 : 0;

  // Update match score
  await prisma.match.update({
    where: { id: sessionId },
    data: {
      player2Score: { increment: pointsAwarded }
    }
  });

  return {
    question,
    correctAnswer,
    systemAnswer,
    isCorrect,
    explanation,
    pointsAwarded
  };
}

/**
 * System generates a question for the player
 */
export async function systemAsks(
  sessionId: string
): Promise<{ question: string; correctAnswer: string; options?: string[]; explanation: string }> {
  const zai = await getZai();
  const match = await prisma.match.findUnique({
    where: { id: sessionId }
  });

  if (!match) {
    throw new Error('Session not found');
  }

  const subject = match.subject || 'General Knowledge';
  const difficulty = match.difficulty || 'medium';

  const prompt = `You are an educational AI in a knowledge sparring session.
Generate a ${difficulty} level multiple-choice question for the student on the subject: ${subject}.

Requirements:
1. Create an educational, clear question
2. Provide 4 answer options (A, B, C, D)
3. Only ONE correct answer
4. Include a brief explanation of why the answer is correct

Respond in JSON format:
{
  "question": "The question text?",
  "options": ["A. option1", "B. option2", "C. option3", "D. option4"],
  "correctAnswer": "A",
  "explanation": "Why A is correct..."
}`;

  let question = '';
  let correctAnswer = '';
  let options: string[] = [];
  let explanation = '';

  if (zai) {
    try {
      const response = await zai.chat.completions.create({
        messages: [
          { role: 'system', content: 'You are an expert educational content generator. Always respond with valid JSON.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 600
      });

      const content = response.choices[0]?.message?.content || '';
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        question = parsed.question || '';
        correctAnswer = parsed.correctAnswer || 'A';
        options = parsed.options || [];
        explanation = parsed.explanation || '';
      }
    } catch (error) {
      console.error('AI error generating question:', error);
    }
  }

  // Fallback questions by subject
  if (!question) {
    const fallbacks = getFallbackQuestion(subject);
    question = fallbacks.question;
    correctAnswer = fallbacks.correctAnswer;
    options = fallbacks.options;
    explanation = fallbacks.explanation;
  }

  return { question, correctAnswer, options, explanation };
}

/**
 * Evaluate player's answer to system's question
 */
export async function playerAnswers(
  sessionId: string,
  playerAnswer: string,
  correctAnswer: string,
  question: string,
  explanation: string
): Promise<AnswerResult> {
  const match = await prisma.match.findUnique({
    where: { id: sessionId }
  });

  if (!match) {
    throw new Error('Session not found');
  }

  // Simple comparison for multiple choice
  const normalizedPlayer = playerAnswer.trim().toUpperCase();
  const normalizedCorrect = correctAnswer.trim().toUpperCase();
  const isCorrect = normalizedPlayer === normalizedCorrect || 
                     normalizedPlayer === normalizedCorrect.charAt(0);

  const pointsAwarded = isCorrect ? POINTS_MAP[match.difficulty as keyof typeof POINTS_MAP] || 15 : 0;

  // Update match score
  await prisma.match.update({
    where: { id: sessionId },
    data: {
      player1Score: { increment: pointsAwarded },
      currentRound: { increment: 1 }
    }
  });

  return {
    playerAnswer,
    correctAnswer,
    isCorrect,
    explanation,
    pointsAwarded
  };
}

/**
 * Get sparring session state
 */
export async function getSparringState(sessionId: string): Promise<SparringState | null> {
  const match = await prisma.match.findUnique({
    where: { id: sessionId }
  });

  if (!match) return null;

  return {
    sessionId: match.id,
    subject: match.subject || 'General Knowledge',
    difficulty: match.difficulty as 'easy' | 'medium' | 'hard' | 'expert',
    currentTurn: 'player_ask', // Simplified for now
    turnNumber: match.currentRound + 1,
    roundNumber: match.currentRound + 1,
    playerScore: match.player1Score,
    systemScore: match.player2Score,
    currentQuestion: null,
    currentAnswer: null,
    expectedAnswer: null,
    exchanges: [],
    coachingMessage: null,
    status: match.status as 'active' | 'completed'
  };
}

/**
 * End sparring session
 */
export async function endSparringSession(sessionId: string): Promise<void> {
  await prisma.match.update({
    where: { id: sessionId },
    data: {
      status: 'completed',
      endedAt: new Date()
    }
  });
}

/**
 * Generate coaching feedback for wrong answers
 */
export async function generateCoaching(
  question: string,
  wrongAnswer: string,
  correctAnswer: string,
  subject: string
): Promise<string> {
  const zai = await getZai();

  if (!zai) {
    return `The correct answer is ${correctAnswer}. Keep practicing to improve your understanding!`;
  }

  const prompt = `You are an encouraging educational coach. A student answered incorrectly in a ${subject} sparring session.

Question: "${question}"
Student's Answer: "${wrongAnswer}"
Correct Answer: "${correctAnswer}"

Provide a brief, encouraging explanation that:
1. Explains why the correct answer is right
2. Helps the student understand the concept
3. Encourages them to keep learning

Keep it to 2-4 sentences, friendly and educational.`;

  try {
    const response = await zai.chat.completions.create({
      messages: [
        { role: 'system', content: 'You are a helpful educational coach.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 200
    });

    return response.choices[0]?.message?.content || 
      `The correct answer is ${correctAnswer}. Keep practicing!`;
  } catch (error) {
    return `The correct answer is ${correctAnswer}. Keep practicing to improve!`;
  }
}

/**
 * Fallback questions by subject
 */
function getFallbackQuestion(subject: string): {
  question: string;
  correctAnswer: string;
  options: string[];
  explanation: string;
} {
  const fallbacks: Record<string, Array<{
    question: string;
    correctAnswer: string;
    options: string[];
    explanation: string;
  }>> = {
    Math: [
      {
        question: "What is the value of x in the equation 2x + 6 = 14?",
        correctAnswer: "A",
        options: ["A. x = 4", "B. x = 5", "C. x = 6", "D. x = 7"],
        explanation: "Subtract 6 from both sides: 2x = 8, then divide by 2: x = 4"
      },
      {
        question: "What is the derivative of f(x) = x³?",
        correctAnswer: "B",
        options: ["A. 3x²", "B. 3x²", "C. x²", "D. 3x"],
        explanation: "Using the power rule, the derivative of x³ is 3x²"
      }
    ],
    Physics: [
      {
        question: "What is the SI unit of electric current?",
        correctAnswer: "C",
        options: ["A. Volt", "B. Watt", "C. Ampere", "D. Ohm"],
        explanation: "The Ampere (A) is the SI unit of electric current."
      }
    ],
    Chemistry: [
      {
        question: "What is the atomic number of Oxygen?",
        correctAnswer: "B",
        options: ["A. 6", "B. 8", "C. 10", "D. 16"],
        explanation: "Oxygen has 8 protons, so its atomic number is 8."
      }
    ],
    Biology: [
      {
        question: "Which organelle is responsible for protein synthesis?",
        correctAnswer: "A",
        options: ["A. Ribosome", "B. Mitochondria", "C. Nucleus", "D. Golgi apparatus"],
        explanation: "Ribosomes are the cellular structures where protein synthesis occurs."
      }
    ],
    History: [
      {
        question: "In which year did World War I begin?",
        correctAnswer: "C",
        options: ["A. 1912", "B. 1913", "C. 1914", "D. 1915"],
        explanation: "World War I began on July 28, 1914."
      }
    ]
  };

  const subjectQuestions = fallbacks[subject] || fallbacks['Math'];
  return subjectQuestions[Math.floor(Math.random() * subjectQuestions.length)];
}

// Export default
const sparringEngine = {
  createSparringSession,
  playerAsks,
  systemAsks,
  playerAnswers,
  getSparringState,
  endSparringSession,
  generateCoaching
};

export default sparringEngine;
