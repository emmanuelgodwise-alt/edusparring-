import { NextResponse } from 'next/server';
import { submitAnswer } from '@/lib/battle-engine';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ matchId: string }> }
) {
  try {
    const { matchId } = await params;
    const body = await request.json();
    const { playerId, answer, timeTaken } = body;

    if (!playerId || !answer) {
      return NextResponse.json(
        { success: false, error: 'Player ID and answer required' },
        { status: 400 }
      );
    }

    const result = await submitAnswer(matchId, playerId, answer, timeTaken || 10);

    return NextResponse.json({
      success: true,
      result
    });
  } catch (error) {
    console.error('Submit answer error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit answer' },
      { status: 500 }
    );
  }
}
