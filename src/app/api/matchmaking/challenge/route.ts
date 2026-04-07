import { NextResponse } from 'next/server';
import { createMatch } from '@/lib/battle-engine';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { playerId, opponentId, subject } = body;

    if (!playerId || !opponentId) {
      return NextResponse.json(
        { success: false, error: 'Player ID and Opponent ID required' },
        { status: 400 }
      );
    }

    const result = await createMatch(playerId, 'challenge', subject, opponentId);

    return NextResponse.json({
      success: true,
      matchId: result.matchId,
      opponent: result.opponent
    });
  } catch (error) {
    console.error('Challenge match error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create challenge match' },
      { status: 500 }
    );
  }
}
