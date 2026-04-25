import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getKRTier } from '@/lib/kr-calculator';

// GET /api/matchmaking/opponents - Find potential opponents
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const playerId = searchParams.get('playerId');
    const limit = parseInt(searchParams.get('limit') || '20');

    if (!playerId) {
      return NextResponse.json(
        { success: false, error: 'Player ID required' },
        { status: 400 }
      );
    }

    // Get current player
    const player = await prisma.user.findUnique({
      where: { id: playerId },
    });

    if (!player) {
      return NextResponse.json(
        { success: false, error: 'Player not found' },
        { status: 404 }
      );
    }

    // Find players with similar KR (±500 for broader matching)
    const nearbyPlayers = await prisma.user.findMany({
      where: {
        id: { not: playerId },
        knowledgeRating: {
          gte: Math.max(100, player.knowledgeRating - 500),
          lte: player.knowledgeRating + 500,
        },
      },
      take: limit,
      orderBy: { knowledgeRating: 'desc' },
      select: {
        id: true,
        name: true,
        avatar: true,
        knowledgeRating: true,
        country: true,
        createdAt: true,
      },
    });

    // Format opponents with additional data
    const opponents = nearbyPlayers.map((p) => {
      const tier = getKRTier(p.knowledgeRating);
      return {
        id: p.id,
        name: p.name || 'Unknown Player',
        avatar: p.avatar || undefined,
        knowledgeRating: p.knowledgeRating,
        tier: tier.label,
        country: p.country || 'US',
        // Mock additional data for display
        online: Math.random() > 0.3, // Random online status
        favoriteSubjects: getRandomSubjects(),
        winRate: Math.floor(40 + Math.random() * 40), // 40-80%
        lastActive: getRandomLastActive(),
      };
    });

    return NextResponse.json({
      success: true,
      opponents,
      total: opponents.length,
    });
  } catch (error) {
    console.error('Error finding opponents:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to find opponents' },
      { status: 500 }
    );
  }
}

// Helper functions for mock data
function getRandomSubjects(): string[] {
  const subjects = ['Math', 'Physics', 'Chemistry', 'Biology', 'History', 'Geography', 'Literature', 'Economics', 'ComputerScience', 'Civics', 'English'];
  const shuffled = subjects.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 2);
}

function getRandomLastActive(): string {
  const options = ['now', '2m ago', '5m ago', '10m ago', '1h ago'];
  return options[Math.floor(Math.random() * options.length)];
}
