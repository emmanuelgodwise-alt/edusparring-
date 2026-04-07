import { NextRequest, NextResponse } from 'next/server';
import { loadTranslation, LanguageCode, LANGUAGES } from '@/lib/i18n';

/**
 * GET /api/i18n/translations
 * Get translations for a specific language
 * 
 * Query params:
 * - language: Language code (en, es, fr, zh, ar, hi, pt)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const language = (searchParams.get('language') || 'en') as LanguageCode;

    // Validate language
    if (!(language in LANGUAGES)) {
      return NextResponse.json(
        { success: false, error: 'Invalid language code' },
        { status: 400 }
      );
    }

    // Load translations
    const translations = await loadTranslation(language);
    const languageInfo = LANGUAGES[language];

    return NextResponse.json({
      success: true,
      translations,
      language: languageInfo,
      direction: languageInfo.rtl ? 'rtl' : 'ltr'
    });
  } catch (error) {
    console.error('Error loading translations:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to load translations' },
      { status: 500 }
    );
  }
}
