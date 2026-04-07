import { NextResponse } from 'next/server';
import { getBattleState, getNextQuestion } from '@/lib/battle-engine';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ matchId: string }> }
) {
  try {
    const { matchId } = await params;
    const url = new URL(request.url);
    const playerId = url.searchParams.get('playerId');

    if (!playerId) {
      return NextResponse.json(
        { success: false, error: 'Player ID required' },
        { status: 400 }
      );
    }

    const state = await getBattleState(matchId, playerId);

    // Get next question if match is active
    if (state.status === 'active') {
      const question = await getNextQuestion(matchId);
      return NextResponse.json({
        success: true,
        battle: {
          ...state,
          currentQuestion: question
        }
      });
    }

    return NextResponse.json({
      success: true,
      battle: state
    });
  } catch (error) {
    console.error('Get battle error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get battle state' },
      { status: 500 }
    );
  }
}
