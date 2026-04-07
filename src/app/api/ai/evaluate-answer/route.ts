import { NextRequest, NextResponse } from 'next/server';
import { evaluateAnswer } from '@/lib/ai-engine';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { questionId, userAnswer, correctAnswer, points } = body;

    // Validate input
    if (!userAnswer || !correctAnswer) {
      return NextResponse.json(
        { error: 'User answer and correct answer are required' },
        { status: 400 }
      );
    }

    // Get question info if questionId provided
    let questionType = 'multiple_choice';
    if (questionId) {
      const question = await db.question.findUnique({
        where: { id: questionId },
      });
      if (question) {
        questionType = question.type;
      }
    }

    // Evaluate the answer
    const result = await evaluateAnswer(
      questionId || 'temp',
      userAnswer,
      correctAnswer,
      points || 10,
      questionType
    );

    return NextResponse.json({
      success: true,
      evaluation: {
        isCorrect: result.isCorrect,
        pointsAwarded: result.pointsAwarded,
        feedback: result.feedback,
        explanation: result.explanation,
        partialCredit: result.partialCredit,
      },
    });
  } catch (error) {
    console.error('Error evaluating answer:', error);
    return NextResponse.json(
      { error: 'Failed to evaluate answer' },
      { status: 500 }
    );
  }
}
