import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

/**
 * POST /api/sparring/session
 * Create a new sparring session
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { playerId, subject, difficulty = 'medium' } = body;

    // Create a new sparring session
    const session = await prisma.sparringSession.create({
      data: {
        playerId: playerId || 'guest',
        subject: subject || 'Math',
        difficulty,
        playerScore: 0,
        systemScore: 0,
        currentRound: 0,
        status: 'active',
        exchanges: JSON.stringify([])
      }
    });

    return NextResponse.json({
      success: true,
      sessionId: session.id,
      message: 'Sparring session created!'
    });
  } catch (error) {
    console.error('Failed to create session:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create session' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/sparring/session
 * Get session details
 */
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const sessionId = url.searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json(
        { success: false, error: 'Session ID required' },
        { status: 400 }
      );
    }

    const session = await prisma.sparringSession.findUnique({
      where: { id: sessionId }
    });

    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Session not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      session: {
        id: session.id,
        subject: session.subject,
        difficulty: session.difficulty,
        playerScore: session.playerScore,
        systemScore: session.systemScore,
        currentRound: session.currentRound,
        totalRounds: session.totalRounds,
        status: session.status,
        winner: session.winner,
        exchanges: JSON.parse(session.exchanges)
      }
    });
  } catch (error) {
    console.error('Failed to get session:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get session' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/sparring/session
 * Update session (add scores, end session)
 */
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { sessionId, playerScoreDelta, systemScoreDelta, exchange, endSession } = body;

    if (!sessionId) {
      return NextResponse.json(
        { success: false, error: 'Session ID required' },
        { status: 400 }
      );
    }

    const session = await prisma.sparringSession.findUnique({
      where: { id: sessionId }
    });

    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Session not found' },
        { status: 404 }
      );
    }

    // Prepare update data
    const updateData: Record<string, unknown> = {};

    // Update scores
    if (playerScoreDelta) {
      updateData.playerScore = session.playerScore + playerScoreDelta;
    }
    if (systemScoreDelta) {
      updateData.systemScore = session.systemScore + systemScoreDelta;
    }

    // Add exchange to history
    if (exchange) {
      const exchanges = JSON.parse(session.exchanges);
      exchanges.push(exchange);
      updateData.exchanges = JSON.stringify(exchanges);
      updateData.currentRound = session.currentRound + 1;
    }

    // End session
    if (endSession) {
      const finalPlayerScore = (updateData.playerScore as number) ?? session.playerScore;
      const finalSystemScore = (updateData.systemScore as number) ?? session.systemScore;

      updateData.status = 'completed';
      updateData.endedAt = new Date();

      if (finalPlayerScore > finalSystemScore) {
        updateData.winner = 'player';
      } else if (finalSystemScore > finalPlayerScore) {
        updateData.winner = 'system';
      } else {
        updateData.winner = 'draw';
      }
    }

    // Update the session
    const updatedSession = await prisma.sparringSession.update({
      where: { id: sessionId },
      data: updateData
    });

    return NextResponse.json({
      success: true,
      session: {
        id: updatedSession.id,
        playerScore: updatedSession.playerScore,
        systemScore: updatedSession.systemScore,
        currentRound: updatedSession.currentRound,
        status: updatedSession.status,
        winner: updatedSession.winner
      }
    });
  } catch (error) {
    console.error('Failed to update session:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update session' },
      { status: 500 }
    );
  }
}
