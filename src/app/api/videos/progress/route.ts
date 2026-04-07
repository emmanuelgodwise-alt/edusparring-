import { NextRequest, NextResponse } from 'next/server';

// GET /api/videos/progress - Get video progress for a user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const videoId = searchParams.get('videoId');

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'userId is required' },
        { status: 400 }
      );
    }

    // Mock progress data
    const mockProgress = {
      videoId: videoId || '1',
      userId,
      progress: 45,
      currentTime: 380, // seconds
      completed: false,
      lastWatchedAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      progress: mockProgress,
    });
  } catch (error) {
    console.error('Error fetching video progress:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch video progress' },
      { status: 500 }
    );
  }
}

// POST /api/videos/progress - Update video progress
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, videoId, currentTime, progress } = body;

    if (!userId || !videoId) {
      return NextResponse.json(
        { success: false, error: 'userId and videoId are required' },
        { status: 400 }
      );
    }

    // In production, save to database
    return NextResponse.json({
      success: true,
      progress: {
        videoId,
        userId,
        currentTime,
        progress,
        completed: progress >= 95,
        lastWatchedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Error updating video progress:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update video progress' },
      { status: 500 }
    );
  }
}
