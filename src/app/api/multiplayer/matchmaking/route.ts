import { NextRequest, NextResponse } from 'next/server';

// In-memory matchmaking queue (in production, use Redis)
const matchmakingQueue: Map<string, {
  userId: string;
  name: string;
  knowledgeRating: number;
  subject: string;
  joinedAt: number;
  preferences: {
    ratingRange: number;
    maxWaitTime: number;
  };
}> = new Map();

// GET /api/multiplayer/matchmaking - Get queue status
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  // Get queue stats
  const queueArray = Array.from(matchmakingQueue.values());
  const queueBySubject: Record<string, number> = {};
  
  queueArray.forEach(entry => {
    queueBySubject[entry.subject] = (queueBySubject[entry.subject] || 0) + 1;
  });

  // Check if user is in queue
  const userEntry = userId ? matchmakingQueue.get(userId) : null;

  return NextResponse.json({
    success: true,
    queue: {
      total: queueArray.length,
      bySubject: queueBySubject,
      userPosition: userEntry ? queueArray.findIndex(e => e.userId === userId) + 1 : null,
      estimatedWait: userEntry ? Math.ceil((Date.now() - userEntry.joinedAt) / 1000) : null,
    },
  });
}

// POST /api/multiplayer/matchmaking - Join queue
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, name, knowledgeRating, subject, preferences } = body;

    if (!userId || !name || !subject) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Add to queue
    matchmakingQueue.set(userId, {
      userId,
      name,
      knowledgeRating: knowledgeRating || 800,
      subject,
      joinedAt: Date.now(),
      preferences: {
        ratingRange: preferences?.ratingRange || 200,
        maxWaitTime: preferences?.maxWaitTime || 60,
      },
    });

    // Try to find a match
    const match = findMatch(userId, subject, knowledgeRating || 800, preferences?.ratingRange || 200);

    if (match) {
      // Remove both from queue
      matchmakingQueue.delete(userId);
      matchmakingQueue.delete(match.userId);

      return NextResponse.json({
        success: true,
        matchFound: true,
        battle: {
          id: `battle-${Date.now()}`,
          opponent: match,
          subject,
          scheduledFor: new Date(Date.now() + 5000).toISOString(),
        },
      });
    }

    return NextResponse.json({
      success: true,
      matchFound: false,
      message: 'Added to matchmaking queue',
      position: matchmakingQueue.size,
    });
  } catch (error: any) {
    console.error('Matchmaking error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/multiplayer/matchmaking - Leave queue
export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json(
      { success: false, error: 'userId is required' },
      { status: 400 }
    );
  }

  matchmakingQueue.delete(userId);

  return NextResponse.json({
    success: true,
    message: 'Removed from queue',
  });
}

// Helper function to find a match
function findMatch(
  userId: string,
  subject: string,
  rating: number,
  ratingRange: number
): { userId: string; name: string; knowledgeRating: number } | null {
  for (const [id, entry] of matchmakingQueue) {
    // Skip self
    if (id === userId) continue;
    
    // Check subject match
    if (entry.subject !== subject) continue;
    
    // Check rating range
    const ratingDiff = Math.abs(entry.knowledgeRating - rating);
    if (ratingDiff > ratingRange) continue;
    
    // Found a match!
    return {
      userId: entry.userId,
      name: entry.name,
      knowledgeRating: entry.knowledgeRating,
    };
  }
  
  return null;
}
