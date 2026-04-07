import { NextRequest, NextResponse } from 'next/server';

// In-memory event storage (in production, use Redis or message queue)
const events: Map<string, {
  battleId: string;
  events: {
    type: string;
    data: any;
    timestamp: number;
  }[];
}> = new Map();

// GET /api/multiplayer/events - Get events for a battle (Server-Sent Events simulation)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const battleId = searchParams.get('battleId');
  const since = parseInt(searchParams.get('since') || '0');

  if (!battleId) {
    return NextResponse.json(
      { success: false, error: 'battleId is required' },
      { status: 400 }
    );
  }

  // Get events since timestamp
  const battleEvents = events.get(battleId);
  const newEvents = battleEvents?.events.filter(e => e.timestamp > since) || [];

  return NextResponse.json({
    success: true,
    events: newEvents,
    timestamp: Date.now(),
  });
}

// POST /api/multiplayer/events - Publish an event
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { battleId, type, data } = body;

    if (!battleId || !type) {
      return NextResponse.json(
        { success: false, error: 'battleId and type are required' },
        { status: 400 }
      );
    }

    // Initialize event storage for battle
    if (!events.has(battleId)) {
      events.set(battleId, { battleId, events: [] });
    }

    // Add event
    const battleEvents = events.get(battleId)!;
    battleEvents.events.push({
      type,
      data,
      timestamp: Date.now(),
    });

    // Keep only last 100 events
    if (battleEvents.events.length > 100) {
      battleEvents.events = battleEvents.events.slice(-100);
    }

    return NextResponse.json({
      success: true,
      event: {
        type,
        data,
        timestamp: Date.now(),
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/multiplayer/events - Clear events for a battle
export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const battleId = searchParams.get('battleId');

  if (battleId) {
    events.delete(battleId);
  }

  return NextResponse.json({
    success: true,
    message: 'Events cleared',
  });
}
