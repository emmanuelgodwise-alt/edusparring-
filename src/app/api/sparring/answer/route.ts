import { NextResponse } from 'next/server';

/**
 * POST /api/sparring/answer
 * 
 * Evaluate player's answer to system's question
 * Returns coaching feedback if wrong
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { answer, correctAnswer, question, options } = body;

    if (!answer) {
      return NextResponse.json(
        { success: false, error: 'Answer is required' },
        { status: 400 }
      );
    }

    // Evaluate the answer
    const normalizedPlayer = String(answer).trim().toUpperCase();
    const normalizedCorrect = String(correctAnswer).trim().toUpperCase();
    
    // Check if correct (allow just the letter or the full option)
    const isCorrect = normalizedPlayer === normalizedCorrect || 
                      normalizedPlayer === normalizedCorrect.charAt(0);

    // Generate coaching if wrong
    let coaching: string | null = null;
    if (!isCorrect) {
      coaching = generateCoaching(question, answer, correctAnswer, options);
    }

    return NextResponse.json({
      success: true,
      isCorrect,
      coaching,
      correctAnswer,
      pointsAwarded: isCorrect ? 15 : 0
    });
  } catch (error) {
    console.error('Answer evaluation error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to evaluate answer' },
      { status: 500 }
    );
  }
}

function generateCoaching(
  question: string,
  wrongAnswer: string,
  correctAnswer: string,
  options?: string[]
): string {
  // Find the correct option text if available
  let correctText = correctAnswer;
  if (options && Array.isArray(options)) {
    const correctOption = options.find(opt => 
      String(opt).toUpperCase().startsWith(String(correctAnswer).toUpperCase())
    );
    if (correctOption) {
      correctText = correctOption;
    }
  }

  // Generate context-aware coaching
  const coachingMessages = [
    `📚 Great effort! The correct answer is **${correctText}**. Remember, every mistake is a learning opportunity! Let's keep going!`,
    `💡 Not quite! The answer was **${correctText}**. These concepts take practice - you're doing great!`,
    `🎯 Good try! **${correctText}** is the correct answer. Review this concept and you'll nail it next time!`,
    `✨ Almost there! The right answer is **${correctText}**. Learning happens through challenges like this!`
  ];

  return coachingMessages[Math.floor(Math.random() * coachingMessages.length)];
}
