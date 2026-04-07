import { NextResponse } from 'next/server';
import { createMatch } from '@/lib/battle-engine';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { playerId, subject } = body;

    if (!playerId) {
      return NextResponse.json(
        { success: false, error: 'Player ID required' },
        { status: 400 }
      );
    }

    const result = await createMatch(playerId, 'quick', subject);

    return NextResponse.json({
      success: true,
      matchId: result.matchId,
      opponent: result.opponent
    });
  } catch (error) {
    console.error('Quick match error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create match' },
      { status: 500 }
    );
  }
}
