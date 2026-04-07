import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

/**
 * Save PvP Sparring Match Result
 * POST /api/sparring/pvp-match
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      matchId,
      player1Id,
      player2Id,
      player1Name,
      player2Name,
      subject,
      difficulty,
      player1Score,
      player2Score,
      winnerId,
      winnerName,
      questions,
      answers
    } = body;

    // Create or update the match record
    const match = await db.pvPSparringMatch.upsert({
      where: { id: matchId || 'new' },
      create: {
        id: matchId,
        player1Id,
        player2Id,
        player1Name,
        player2Name,
        subject,
        difficulty,
        player1Score,
        player2Score,
        winnerId,
        winnerName,
        questions: JSON.stringify(questions || []),
        answers: JSON.stringify(answers || []),
        status: 'completed',
        endedAt: new Date()
      },
      update: {
        player1Score,
        player2Score,
        winnerId,
        winnerName,
        questions: JSON.stringify(questions || []),
        answers: JSON.stringify(answers || []),
        status: 'completed',
        endedAt: new Date()
      }
    });

    return NextResponse.json({
      success: true,
      match
    });
  } catch (error) {
    console.error('Error saving PvP match:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save match' },
      { status: 500 }
    );
  }
}

/**
 * Get PvP Match History
 * GET /api/sparring/pvp-match?playerId=xxx
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const playerId = searchParams.get('playerId');
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!playerId) {
      return NextResponse.json(
        { success: false, error: 'Player ID required' },
        { status: 400 }
      );
    }

    const matches = await db.pvPSparringMatch.findMany({
      where: {
        OR: [
          { player1Id: playerId },
          { player2Id: playerId }
        ],
        status: 'completed'
      },
      orderBy: { endedAt: 'desc' },
      take: limit
    });

    // Add computed fields for each match
    const matchesWithMeta = matches.map(match => {
      const isPlayer1 = match.player1Id === playerId;
      const won = match.winnerId === playerId;
      const myScore = isPlayer1 ? match.player1Score : match.player2Score;
      const opponentScore = isPlayer1 ? match.player2Score : match.player1Score;
      const opponentName = isPlayer1 ? match.player2Name : match.player1Name;

      return {
        ...match,
        won,
        myScore,
        opponentScore,
        opponentName,
        questions: JSON.parse(match.questions),
        answers: JSON.parse(match.answers)
      };
    });

    return NextResponse.json({
      success: true,
      matches: matchesWithMeta
    });
  } catch (error) {
    console.error('Error fetching PvP matches:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch matches' },
      { status: 500 }
    );
  }
}
