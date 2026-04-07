import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET - Get match history for a user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    if (!userId) {
      // Return mock data if no userId provided
      return NextResponse.json({
        matches: generateMockHistory(),
        total: 50,
        stats: {
          totalMatches: 50,
          wins: 32,
          losses: 15,
          draws: 3,
          winRate: 64,
          averageScore: 85,
          favoriteSubject: 'Math',
          currentStreak: 5
        }
      });
    }

    // In production, query from database
    const matches = await prisma.match.findMany({
      where: {
        OR: [
          { player1Id: userId },
          { player2Id: userId }
        ]
      },
      include: {
        player1: { select: { id: true, name: true, avatar: true } },
        player2: { select: { id: true, name: true, avatar: true } },
        turns: true
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset
    });

    const total = await prisma.match.count({
      where: {
        OR: [
          { player1Id: userId },
          { player2Id: userId }
        ]
      }
    });

    return NextResponse.json({ matches, total });
  } catch (error) {
    console.error('Error fetching match history:', error);
    return NextResponse.json(
      { error: 'Failed to fetch match history' },
      { status: 500 }
    );
  }
}

// POST - Save a match to history
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      player1Id,
      player2Id,
      player1Score,
      player2Score,
      subject,
      difficulty,
      winner,
      matchType,
      duration
    } = body;

    // In production, save to database
    const match = await prisma.match.create({
      data: {
        player1Id,
        player2Id: player2Id || null,
        player1Score,
        player2Score,
        subject,
        difficulty: difficulty || 'medium',
        winner: winner || null,
        status: 'completed',
        matchType: matchType || 'bot',
        startedAt: new Date(Date.now() - (duration || 0) * 1000),
        endedAt: new Date()
      }
    });

    return NextResponse.json({ success: true, match });
  } catch (error) {
    console.error('Error saving match:', error);
    return NextResponse.json(
      { error: 'Failed to save match' },
      { status: 500 }
    );
  }
}

// Generate mock history data for demo
function generateMockHistory() {
  const subjects = ['Math', 'Physics', 'Chemistry', 'Biology', 'History', 'Geography', 'Literature', 'Economics'];
  const opponents = ['Bot', 'NeuralNinja', 'QuantumMind', 'CosmicScholar', 'EinsteinJr', 'TeslaMind'];
  const difficulties = ['easy', 'medium', 'hard'];
  
  return Array.from({ length: 20 }, (_, i) => {
    const playerScore = Math.floor(Math.random() * 100) + 20;
    const opponentScore = Math.floor(Math.random() * 100) + 20;
    const won = playerScore > opponentScore;
    const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
    
    return {
      id: `match-${i + 1}`,
      playerScore,
      opponentScore,
      opponent: opponents[Math.floor(Math.random() * opponents.length)],
      subject: subjects[Math.floor(Math.random() * subjects.length)],
      difficulty: difficulties[Math.floor(Math.random() * difficulties.length)],
      result: playerScore > opponentScore ? 'win' : playerScore < opponentScore ? 'loss' : 'draw',
      date: date.toISOString(),
      duration: Math.floor(Math.random() * 600) + 120, // 2-12 minutes
      roundsPlayed: 10,
      correctAnswers: Math.floor(playerScore / 10),
      xpEarned: won ? 50 + Math.floor(Math.random() * 30) : 20 + Math.floor(Math.random() * 15),
      matchType: Math.random() > 0.3 ? 'bot' : 'player'
    };
  });
}
