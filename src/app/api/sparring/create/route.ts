import { NextResponse } from 'next/server';
import { createSparringSession } from '@/lib/sparring-engine';

/**
 * POST /api/sparring/create
 * 
 * Create a new sparring session
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { playerId, subject, difficulty } = body;

    if (!playerId) {
      return NextResponse.json(
        { success: false, error: 'Player ID required' },
        { status: 400 }
      );
    }

    const session = await createSparringSession(
      playerId,
      subject || 'Math',
      difficulty || 'medium'
    );

    return NextResponse.json({
      success: true,
      session
    });
  } catch (error) {
    console.error('Create sparring session error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create sparring session' },
      { status: 500 }
    );
  }
}
