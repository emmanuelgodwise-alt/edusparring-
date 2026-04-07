import { NextResponse } from 'next/server';
import { generateQuestion } from '@/lib/ai-engine';
import { prisma } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { subject, topic, level, difficulty, questionType } = body;

    const generatedQ = await generateQuestion({
      subject: subject || 'Math',
      topic: topic || 'Algebra',
      level: level || 'High School',
      difficulty: difficulty || 'medium',
      questionType: questionType || 'multiple_choice'
    });

    // Save to database
    const question = await prisma.question.create({
      data: {
        subject: subject || 'Math',
        topic: topic || 'Algebra',
        difficulty: difficulty || 'medium',
        type: questionType || 'multiple_choice',
        text: generatedQ.text,
        options: JSON.stringify(generatedQ.options || []),
        correctAnswer: generatedQ.correctAnswer,
        explanation: generatedQ.explanation
      }
    });

    return NextResponse.json({
      success: true,
      question: {
        id: question.id,
        text: question.text,
        options: generatedQ.options,
        correctAnswer: question.correctAnswer,
        explanation: question.explanation,
        pointsValue: question.pointsValue
      }
    });
  } catch (error) {
    console.error('Generate question error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate question' },
      { status: 500 }
    );
  }
}
