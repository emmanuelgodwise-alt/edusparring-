import { NextResponse } from 'next/server';
import { getSparringState } from '@/lib/sparring-engine';

/**
 * GET /api/sparring/[sessionId]
 * 
 * Get current sparring session state
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params;

    const state = await getSparringState(sessionId);

    if (!state) {
      return NextResponse.json(
        { success: false, error: 'Session not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      state
    });
  } catch (error) {
    console.error('Get sparring state error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get session state' },
      { status: 500 }
    );
  }
}
