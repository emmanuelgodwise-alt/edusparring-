import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { generateCoachingFeedback, calculateKRChange } from '@/lib/battle-engine';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { matchId, playerId } = body;

    if (!matchId || !playerId) {
      return NextResponse.json(
        { success: false, error: 'Match ID and Player ID required' },
        { status: 400 }
      );
    }

    // Get match details
    const match = await prisma.match.findUnique({
      where: { id: matchId },
      include: {
        player1: true,
        player2: true,
        rounds: { include: { question: true } }
      }
    });

    if (!match) {
      return NextResponse.json(
        { success: false, error: 'Match not found' },
        { status: 404 }
      );
    }

    const isPlayer1 = match.player1Id === playerId;
    const player = isPlayer1 ? match.player1 : match.player2;
    const opponent = isPlayer1 ? match.player2 : match.player1;
    const won = match.winnerId === playerId;

    // Calculate KR change
    const krChange = calculateKRChange(
      player.knowledgeRating,
      opponent.knowledgeRating,
      won
    );

    // Prepare match history for AI analysis
    const matchHistory = match.rounds.map(round => ({
      subject: round.question.subject,
      topic: round.question.topic,
      correct: isPlayer1 ? round.player1Correct : round.player2Correct,
      timeTaken: (isPlayer1 ? round.player1Time : round.player2Time) || 10,
      difficulty: round.question.difficulty
    }));

    // Generate coaching feedback
    const feedback = await generateCoachingFeedback(matchHistory, player.name);

    return NextResponse.json({
      success: true,
      feedback: {
        ...feedback,
        ratingChange: krChange,
        won,
        finalScore: {
          player: isPlayer1 ? match.player1Score : match.player2Score,
          opponent: isPlayer1 ? match.player2Score : match.player1Score
        },
        newRating: player.knowledgeRating + krChange
      }
    });
  } catch (error) {
    console.error('Coaching feedback error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate feedback' },
      { status: 500 }
    );
  }
}
