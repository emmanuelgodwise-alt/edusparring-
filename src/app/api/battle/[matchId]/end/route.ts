import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { calculateKRChange } from '@/lib/battle-engine';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ matchId: string }> }
) {
  try {
    const { matchId } = await params;
    const body = await request.json();
    const { playerId } = body;

    const match = await prisma.match.findUnique({
      where: { id: matchId },
      include: {
        player1: true,
        player2: true,
        rounds: true
      }
    });

    if (!match) {
      return NextResponse.json(
        { success: false, error: 'Match not found' },
        { status: 404 }
      );
    }

    if (match.status !== 'active') {
      return NextResponse.json(
        { success: false, error: 'Match is not active' },
        { status: 400 }
      );
    }

    const isPlayer1 = match.player1Id === playerId;
    const player = isPlayer1 ? match.player1 : match.player2;
    const opponent = isPlayer1 ? match.player2 : match.player1;

    // Determine winner
    let winnerId: string | null = null;
    if (match.player1Score > match.player2Score) {
      winnerId = match.player1Id;
    } else if (match.player2Score > match.player1Score) {
      winnerId = match.player2Id;
    }

    const won = winnerId === playerId;
    const krChange = calculateKRChange(player.knowledgeRating, opponent.knowledgeRating, won);

    // Update match
    await prisma.match.update({
      where: { id: matchId },
      data: {
        status: 'completed',
        winnerId,
        endedAt: new Date()
      }
    });

    // Update player stats
    await prisma.user.update({
      where: { id: playerId },
      data: {
        knowledgeRating: { increment: krChange },
        points: { increment: won ? 50 : 20 },
        totalWins: won ? { increment: 1 } : undefined,
        totalLosses: !won ? { increment: 1 } : undefined,
        currentStreak: won ? { increment: 1 } : 0,
        bestStreak: won ? { increment: 1 } : undefined
      }
    });

    return NextResponse.json({
      success: true,
      result: {
        winner: winnerId,
        won,
        playerScore: isPlayer1 ? match.player1Score : match.player2Score,
        opponentScore: isPlayer1 ? match.player2Score : match.player1Score,
        krChange,
        newRating: player.knowledgeRating + krChange
      }
    });
  } catch (error) {
    console.error('End match error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to end match' },
      { status: 500 }
    );
  }
}
