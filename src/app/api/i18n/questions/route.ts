import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { LanguageCode, LANGUAGES } from '@/lib/i18n';

/**
 * GET /api/i18n/questions
 * Get questions in the user's selected language
 * 
 * Query params:
 * - language: Language code (en, es, fr, zh, ar, hi, pt)
 * - subject: Subject filter (optional)
 * - difficulty: Difficulty filter (optional)
 * - limit: Number of questions (default: 10)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const language = (searchParams.get('language') || 'en') as LanguageCode;
    const subject = searchParams.get('subject');
    const difficulty = searchParams.get('difficulty');
    const limit = parseInt(searchParams.get('limit') || '10', 10);

    // Validate language
    if (!(language in LANGUAGES)) {
      return NextResponse.json(
        { success: false, error: 'Invalid language code' },
        { status: 400 }
      );
    }

    // Build query filters
    const where: Record<string, unknown> = {};
    if (subject) where.subject = subject;
    if (difficulty) where.difficulty = difficulty;

    // Get questions with translations
    const questions = await db.question.findMany({
      where,
      include: {
        translations: {
          where: { language }
        }
      },
      take: limit,
      orderBy: { createdAt: 'desc' }
    });

    // Transform questions to include translated content
    const translatedQuestions = questions.map(q => {
      const translation = q.translations[0];
      
      return {
        id: q.id,
        subject: q.subject,
        topic: q.topic,
        difficulty: q.difficulty,
        type: q.type,
        text: translation?.text || q.text,
        options: translation?.options || q.options,
        correctAnswer: translation?.correctAnswer || q.correctAnswer,
        explanation: translation?.explanation || q.explanation,
        pointsValue: q.pointsValue,
        language: translation ? language : 'en'
      };
    });

    return NextResponse.json({
      success: true,
      questions: translatedQuestions,
      language
    });
  } catch (error) {
    console.error('Error fetching translated questions:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch questions' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/i18n/questions
 * Create or update question translation
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { questionId, language, text, options, correctAnswer, explanation } = body;

    // Validate language
    if (!(language in LANGUAGES)) {
      return NextResponse.json(
        { success: false, error: 'Invalid language code' },
        { status: 400 }
      );
    }

    // Check if question exists
    const question = await db.question.findUnique({
      where: { id: questionId }
    });

    if (!question) {
      return NextResponse.json(
        { success: false, error: 'Question not found' },
        { status: 404 }
      );
    }

    // Upsert translation
    const translation = await db.questionTranslation.upsert({
      where: {
        questionId_language: {
          questionId,
          language
        }
      },
      update: {
        text,
        options: JSON.stringify(options),
        correctAnswer,
        explanation
      },
      create: {
        questionId,
        language,
        text,
        options: JSON.stringify(options),
        correctAnswer,
        explanation
      }
    });

    return NextResponse.json({
      success: true,
      translation
    });
  } catch (error) {
    console.error('Error saving translation:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save translation' },
      { status: 500 }
    );
  }
}
