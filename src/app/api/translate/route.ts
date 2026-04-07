import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';
import { prisma } from '@/lib/db';
import { SUPPORTED_LANGUAGES, type LanguageCode } from '@/lib/translation';

// Translation request interface
interface TranslateRequest {
  text: string;
  sourceLanguage: LanguageCode;
  targetLanguage: LanguageCode;
  context?: string; // Optional context for better translation
}

// Translation response
interface TranslateResponse {
  success: boolean;
  originalText: string;
  translatedText: string;
  sourceLanguage: LanguageCode;
  targetLanguage: LanguageCode;
  confidence?: number;
  cached?: boolean;
  error?: string;
}

// POST - Translate text
export async function POST(request: NextRequest): Promise<NextResponse<TranslateResponse>> {
  try {
    const body: TranslateRequest = await request.json();
    const { text, sourceLanguage, targetLanguage, context } = body;

    // Validate input
    if (!text || typeof text !== 'string') {
      return NextResponse.json({
        success: false,
        originalText: '',
        translatedText: '',
        sourceLanguage,
        targetLanguage,
        error: 'Text is required'
      }, { status: 400 });
    }

    // If same language, return original text
    if (sourceLanguage === targetLanguage) {
      return NextResponse.json({
        success: true,
        originalText: text,
        translatedText: text,
        sourceLanguage,
        targetLanguage,
        confidence: 1.0
      });
    }

    // Check cache first
    const cacheKey = text.toLowerCase().trim();
    const cached = await prisma.translationCache.findFirst({
      where: {
        sourceText: cacheKey,
        sourceLanguage,
        targetLanguage
      }
    });

    if (cached) {
      return NextResponse.json({
        success: true,
        originalText: text,
        translatedText: cached.translatedText,
        sourceLanguage,
        targetLanguage,
        confidence: 0.95,
        cached: true
      });
    }

    // Use AI for translation
    const translatedText = await translateWithAI(text, sourceLanguage, targetLanguage, context);

    // Cache the result
    try {
      await prisma.translationCache.create({
        data: {
          sourceText: cacheKey,
          sourceLanguage,
          targetLanguage,
          translatedText
        }
      });
    } catch (cacheError) {
      // Ignore cache errors, translation was successful
      console.log('Cache write failed:', cacheError);
    }

    return NextResponse.json({
      success: true,
      originalText: text,
      translatedText,
      sourceLanguage,
      targetLanguage,
      confidence: 0.90,
      cached: false
    });

  } catch (error) {
    console.error('Translation error:', error);
    return NextResponse.json({
      success: false,
      originalText: '',
      translatedText: '',
      sourceLanguage: 'en',
      targetLanguage: 'en',
      error: error instanceof Error ? error.message : 'Translation failed'
    }, { status: 500 });
  }
}

// Translate using AI
async function translateWithAI(
  text: string,
  sourceLanguage: LanguageCode,
  targetLanguage: LanguageCode,
  context?: string
): Promise<string> {
  try {
    const zai = await ZAI.create();

    const sourceLangName = SUPPORTED_LANGUAGES[sourceLanguage]?.nativeName || sourceLanguage;
    const targetLangName = SUPPORTED_LANGUAGES[targetLanguage]?.nativeName || targetLanguage;

    const systemPrompt = `You are a professional translator. Translate the given text accurately while:
1. Preserving the original meaning and tone
2. Using natural, native-level expressions in the target language
3. Keeping any formatting, emojis, or special characters
4. If the text contains educational/academic content, maintain accuracy
5. Respond ONLY with the translated text, no explanations`;

    const userPrompt = context
      ? `Context: ${context}\n\nTranslate the following ${sourceLangName} text to ${targetLangName}:\n\n"${text}"`
      : `Translate the following ${sourceLangName} text to ${targetLangName}:\n\n"${text}"`;

    const completion = await zai.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.3, // Lower temperature for more consistent translations
    });

    const translatedText = completion.choices[0]?.message?.content?.trim() || text;
    
    // Clean up the translation (remove quotes if AI added them)
    let cleaned = translatedText;
    if ((cleaned.startsWith('"') && cleaned.endsWith('"')) ||
        (cleaned.startsWith('"') && cleaned.endsWith('"'))) {
      cleaned = cleaned.slice(1, -1);
    }

    return cleaned || text;

  } catch (error) {
    console.error('AI translation failed:', error);
    // Fallback: return original text
    return text;
  }
}

// GET - Get supported languages
export async function GET() {
  const languages = Object.entries(SUPPORTED_LANGUAGES).map(([code, info]) => ({
    code,
    ...info
  }));

  return NextResponse.json({
    success: true,
    languages,
    count: languages.length
  });
}
