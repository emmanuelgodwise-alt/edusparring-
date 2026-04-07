import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { SUPPORTED_LANGUAGES, type LanguageCode } from '@/lib/translation';

// GET - Get user's language preferences
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ success: false, error: 'User ID required' }, { status: 400 });
    }

    let preferences = await prisma.userLanguagePreference.findUnique({
      where: { userId }
    });

    // Create default preferences if not exists
    if (!preferences) {
      preferences = await prisma.userLanguagePreference.create({
        data: {
          userId,
          nativeLanguage: 'en',
          preferredChatLanguage: 'en',
          autoTranslate: true,
          showOriginalText: true
        }
      });
    }

    return NextResponse.json({
      success: true,
      preferences: {
        nativeLanguage: preferences.nativeLanguage,
        preferredChatLanguage: preferences.preferredChatLanguage,
        autoTranslate: preferences.autoTranslate,
        showOriginalText: preferences.showOriginalText
      }
    });

  } catch (error) {
    console.error('Error getting language preferences:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to get language preferences'
    }, { status: 500 });
  }
}

// POST - Update user's language preferences
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, nativeLanguage, preferredChatLanguage, autoTranslate, showOriginalText } = body;

    if (!userId) {
      return NextResponse.json({ success: false, error: 'User ID required' }, { status: 400 });
    }

    // Validate language codes
    if (nativeLanguage && !SUPPORTED_LANGUAGES[nativeLanguage as LanguageCode]) {
      return NextResponse.json({ success: false, error: 'Invalid native language' }, { status: 400 });
    }

    if (preferredChatLanguage && !SUPPORTED_LANGUAGES[preferredChatLanguage as LanguageCode]) {
      return NextResponse.json({ success: false, error: 'Invalid preferred chat language' }, { status: 400 });
    }

    const preferences = await prisma.userLanguagePreference.upsert({
      where: { userId },
      update: {
        nativeLanguage: nativeLanguage || undefined,
        preferredChatLanguage: preferredChatLanguage || undefined,
        autoTranslate: autoTranslate !== undefined ? autoTranslate : undefined,
        showOriginalText: showOriginalText !== undefined ? showOriginalText : undefined
      },
      create: {
        userId,
        nativeLanguage: nativeLanguage || 'en',
        preferredChatLanguage: preferredChatLanguage || 'en',
        autoTranslate: autoTranslate !== undefined ? autoTranslate : true,
        showOriginalText: showOriginalText !== undefined ? showOriginalText : true
      }
    });

    return NextResponse.json({
      success: true,
      preferences: {
        nativeLanguage: preferences.nativeLanguage,
        preferredChatLanguage: preferences.preferredChatLanguage,
        autoTranslate: preferences.autoTranslate,
        showOriginalText: preferences.showOriginalText
      }
    });

  } catch (error) {
    console.error('Error updating language preferences:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to update language preferences'
    }, { status: 500 });
  }
}
