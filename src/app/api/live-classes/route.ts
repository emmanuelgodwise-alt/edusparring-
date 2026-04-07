import { NextRequest, NextResponse } from 'next/server';

// GET /api/live-classes - List live classes
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const subject = searchParams.get('subject');
    const limit = parseInt(searchParams.get('limit') || '20');

    // Mock live classes data
    const mockLiveClasses = [
      {
        id: 'l1',
        title: 'Mathematics Olympiad Prep',
        description: 'Prepare for the upcoming Math Olympiad competition.',
        subject: 'Math',
        hostId: 'h1',
        hostName: 'Prof. Mathews',
        hostAvatar: null,
        streamUrl: '/stream/live1',
        thumbnailUrl: 'https://picsum.photos/seed/live1/640/360',
        status: 'live',
        viewerCount: 245,
        maxViewers: 500,
        chatEnabled: true,
        recordEnabled: true,
        tags: ['olympiad', 'competition', 'math'],
        difficulty: 'advanced',
      },
      {
        id: 'l2',
        title: 'JAMB Chemistry Revision',
        description: 'Last-minute revision for JAMB chemistry exam.',
        subject: 'Chemistry',
        hostId: 'h2',
        hostName: 'Chem Master',
        hostAvatar: null,
        streamUrl: '/stream/live2',
        thumbnailUrl: 'https://picsum.photos/seed/live2/640/360',
        status: 'scheduled',
        scheduledFor: new Date(Date.now() + 3600000 * 2).toISOString(),
        viewerCount: 0,
        maxViewers: 300,
        chatEnabled: true,
        recordEnabled: true,
        tags: ['JAMB', 'revision', 'chemistry'],
        difficulty: 'intermediate',
      },
      {
        id: 'l3',
        title: 'Physics Problem Solving',
        description: 'Live problem solving session for WAEC physics.',
        subject: 'Physics',
        hostId: 'h3',
        hostName: 'Dr. Physics',
        hostAvatar: null,
        streamUrl: '/stream/live3',
        thumbnailUrl: 'https://picsum.photos/seed/live3/640/360',
        status: 'scheduled',
        scheduledFor: new Date(Date.now() + 86400000).toISOString(),
        viewerCount: 0,
        maxViewers: 400,
        chatEnabled: true,
        recordEnabled: true,
        tags: ['WAEC', 'physics', 'problems'],
        difficulty: 'intermediate',
      },
    ];

    // Apply filters
    let filtered = mockLiveClasses;
    if (status) {
      filtered = filtered.filter(lc => lc.status === status);
    }
    if (subject) {
      filtered = filtered.filter(lc => lc.subject === subject);
    }

    return NextResponse.json({
      success: true,
      liveClasses: filtered.slice(0, limit),
      total: filtered.length,
    });
  } catch (error) {
    console.error('Error fetching live classes:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch live classes' },
      { status: 500 }
    );
  }
}

// POST /api/live-classes - Create a new live class
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, subject, difficulty, scheduledFor, hostId } = body;

    if (!title || !subject || !hostId) {
      return NextResponse.json(
        { success: false, error: 'Title, subject, and hostId are required' },
        { status: 400 }
      );
    }

    // In production, create stream in streaming service (Mux, Livepeer, etc.)
    const liveClassId = `live_${Date.now()}`;

    return NextResponse.json({
      success: true,
      liveClass: {
        id: liveClassId,
        title,
        description,
        subject,
        hostId,
        hostName: 'You',
        streamUrl: `/stream/${liveClassId}`,
        status: scheduledFor ? 'scheduled' : 'live',
        scheduledFor: scheduledFor || null,
        startedAt: scheduledFor ? null : new Date().toISOString(),
        viewerCount: 0,
        maxViewers: 500,
        chatEnabled: true,
        recordEnabled: true,
        tags: [],
        difficulty: difficulty || 'intermediate',
      },
    });
  } catch (error) {
    console.error('Error creating live class:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create live class' },
      { status: 500 }
    );
  }
}
