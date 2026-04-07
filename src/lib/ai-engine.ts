import ZAI from 'z-ai-web-dev-sdk';

// Initialize ZAI
let zaiInstance: Awaited<ReturnType<typeof ZAI.create>> | null = null;

async function getZai() {
  if (!zaiInstance) {
    zaiInstance = await ZAI.create();
  }
  return zaiInstance;
}

// Types
export interface QuestionGenerationParams {
  subject: string;
  topic: string;
  level: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  questionType: 'multiple_choice' | 'short_answer' | 'long_explanation';
}

export interface GeneratedQuestion {
  text: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
}

export interface AnswerEvaluation {
  isCorrect: boolean;
  partialCredit: number;
  explanation: string;
  feedback: string;
}

// Generate a question using AI
export async function generateQuestion(params: QuestionGenerationParams): Promise<GeneratedQuestion> {
  const zai = await getZai();

  const prompt = `You are an expert educational question generator. Generate a ${params.difficulty} ${params.questionType} question on the topic "${params.topic}" for ${params.level} students in the subject of ${params.subject}.

${params.questionType === 'multiple_choice' ? 'Provide exactly 4 answer options labeled A, B, C, D.' : 'Provide a clear expected answer.'}

Respond in JSON format only:
{
  "text": "The question text",
  ${params.questionType === 'multiple_choice' ? '"options": ["A. option1", "B. option2", "C. option3", "D. option4"],' : ''}
  "correctAnswer": "${params.questionType === 'multiple_choice' ? 'A' : 'The correct answer'}",
  "explanation": "Detailed explanation of why this is the correct answer"
}

Make the question educational, clear, and appropriate for the difficulty level.`;

  try {
    const response = await zai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are an expert educational content generator. Always respond with valid JSON only.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    });

    const content = response.choices[0]?.message?.content || '';
    
    // Extract JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in response');
    }

    const question = JSON.parse(jsonMatch[0]) as GeneratedQuestion;
    return question;
  } catch (error) {
    console.error('Error generating question:', error);
    // Return a fallback question
    return {
      text: `What is the correct approach to solving problems in ${params.topic}?`,
      options: params.questionType === 'multiple_choice' 
        ? ['A. Method 1', 'B. Method 2', 'C. Method 3', 'D. Method 4']
        : undefined,
      correctAnswer: params.questionType === 'multiple_choice' ? 'A' : 'The standard approach',
      explanation: `This is a sample question about ${params.topic}. The correct answer depends on the specific problem context.`
    };
  }
}

// Evaluate an answer using AI
export async function evaluateAnswer(
  question: string,
  userAnswer: string,
  correctAnswer: string,
  questionType: string
): Promise<AnswerEvaluation> {
  const zai = await getZai();

  const prompt = `Evaluate this student's answer to an educational question.

Question: ${question}
Correct Answer: ${correctAnswer}
Student's Answer: ${userAnswer}
Question Type: ${questionType}

For multiple choice: exact match required.
For short/long answers: evaluate for conceptual correctness, allow partial credit.

Respond in JSON format only:
{
  "isCorrect": true/false,
  "partialCredit": 0-1 (for partial credit, 0 if wrong, 1 if fully correct),
  "explanation": "Why this is correct/incorrect",
  "feedback": "Encouraging feedback for the student"
}`;

  try {
    const response = await zai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are an educational assessment AI. Always respond with valid JSON only.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 500
    });

    const content = response.choices[0]?.message?.content || '';
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      // Simple comparison fallback
      const isCorrect = userAnswer.toLowerCase().trim() === correctAnswer.toLowerCase().trim();
      return {
        isCorrect,
        partialCredit: isCorrect ? 1 : 0,
        explanation: isCorrect ? 'Your answer matches the correct answer.' : 'Your answer does not match the correct answer.',
        feedback: isCorrect ? 'Great job!' : 'Keep practicing!'
      };
    }

    return JSON.parse(jsonMatch[0]) as AnswerEvaluation;
  } catch (error) {
    console.error('Error evaluating answer:', error);
    const isCorrect = userAnswer.toLowerCase().trim() === correctAnswer.toLowerCase().trim();
    return {
      isCorrect,
      partialCredit: isCorrect ? 1 : 0,
      explanation: isCorrect ? 'Correct!' : 'Not quite right.',
      feedback: isCorrect ? 'Well done!' : 'Try again!'
    };
  }
}

// Generate coaching feedback
export async function generateCoachingFeedback(
  matchHistory: {
    subject: string;
    topic: string;
    correct: boolean;
    timeTaken: number;
    difficulty: string;
  }[],
  playerName: string
): Promise<{
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  studyPlan: string[];
}> {
  const zai = await getZai();

  const summary = matchHistory.map(m => 
    `${m.topic} (${m.difficulty}): ${m.correct ? 'Correct' : 'Incorrect'} in ${m.timeTaken}s`
  ).join('\n');

  const prompt = `Analyze this player's match performance and provide coaching feedback.

Player: ${playerName}
Match Summary:
${summary}

Provide personalized feedback including:
1. Strengths (what they did well)
2. Weaknesses (areas to improve)
3. Recommendations (specific actions)
4. Study Plan (topics to focus on)

Respond in JSON format only:
{
  "strengths": ["strength1", "strength2"],
  "weaknesses": ["weakness1", "weakness2"],
  "recommendations": ["recommendation1", "recommendation2"],
  "studyPlan": ["topic1", "topic2"]
}`;

  try {
    const response = await zai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are an educational coach AI. Provide helpful, encouraging feedback. Always respond with valid JSON only.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 800
    });

    const content = response.choices[0]?.message?.content || '';
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      return getFallbackFeedback(matchHistory);
    }

    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error('Error generating coaching feedback:', error);
    return getFallbackFeedback(matchHistory);
  }
}

function getFallbackFeedback(matchHistory: { topic: string; correct: boolean }[]): {
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  studyPlan: string[];
} {
  const correctCount = matchHistory.filter(m => m.correct).length;
  const totalCount = matchHistory.length;
  const accuracy = correctCount / totalCount;

  return {
    strengths: accuracy > 0.6 
      ? ['Good overall performance', 'Strong problem-solving skills']
      : ['Good effort and participation'],
    weaknesses: accuracy < 0.6
      ? ['Need more practice', 'Review fundamental concepts']
      : ['Minor mistakes to correct'],
    recommendations: [
      'Practice regularly to maintain skills',
      'Review incorrect answers to learn from mistakes'
    ],
    studyPlan: matchHistory
      .filter(m => !m.correct)
      .map(m => m.topic)
      .slice(0, 3)
  };
}

// Generate AI opponent answer (simulated opponent)
export function generateOpponentAnswer(
  question: GeneratedQuestion,
  opponentKR: number,
  playerKR: number,
  difficulty: string
): { answer: string; timeTaken: number; isCorrect: boolean } {
  // Calculate base accuracy based on KR difference
  const krDiff = opponentKR - playerKR;
  let baseAccuracy = 0.5 + (krDiff / 1000); // +10% per 100 KR above player

  // Adjust for difficulty
  const difficultyMultipliers: Record<string, number> = {
    easy: 1.2,
    medium: 1.0,
    hard: 0.8,
    expert: 0.6
  };
  baseAccuracy *= difficultyMultipliers[difficulty] || 1.0;

  // Clamp accuracy
  const accuracy = Math.max(0.2, Math.min(0.95, baseAccuracy));

  // Determine if correct
  const isCorrect = Math.random() < accuracy;

  // Generate answer
  let answer: string;
  if (question.options && question.options.length > 0) {
    if (isCorrect) {
      answer = question.correctAnswer;
    } else {
      // Pick a wrong option
      const wrongOptions = question.options
        .map(o => o.charAt(0))
        .filter(o => o !== question.correctAnswer);
      answer = wrongOptions[Math.floor(Math.random() * wrongOptions.length)];
    }
  } else {
    answer = isCorrect ? question.correctAnswer : 'Incorrect answer';
  }

  // Generate realistic time (5-14 seconds, faster for easier questions)
  const baseTime = difficulty === 'easy' ? 5 : difficulty === 'medium' ? 7 : difficulty === 'hard' ? 9 : 11;
  const timeTaken = baseTime + Math.floor(Math.random() * 6);

  return { answer, timeTaken, isCorrect };
}
