/**
 * Live Matches API
 * 
 * Returns a list of currently active matches for spectators
 */

import { NextRequest, NextResponse } from 'next/server'

// In production, this would query from Redis or the socket server state
// For now, we return mock live matches

export async function GET(request: NextRequest) {
  try {
    // In production, fetch from Redis/socket server
    // For demo, return mock data
    
    const liveMatches = [
      {
        matchId: 'match-demo-1',
        player1: {
          id: 'p1',
          name: 'Alex Chen',
          score: 45,
          knowledgeRating: 1450
        },
        player2: {
          id: 'p2',
          name: 'Yuki Tanaka',
          score: 30,
          knowledgeRating: 1380
        },
        subject: 'mathematics',
        difficulty: 'hard',
        currentRound: 3,
        status: 'active',
        spectatorCount: 12,
        startedAt: Date.now() - 300000
      },
      {
        matchId: 'match-demo-2',
        player1: {
          id: 'p3',
          name: 'Emma Schmidt',
          score: 60,
          knowledgeRating: 1320
        },
        player2: {
          id: 'p4',
          name: 'Park Ji-hoon',
          score: 60,
          knowledgeRating: 1520
        },
        subject: 'physics',
        difficulty: 'expert',
        currentRound: 4,
        status: 'active',
        spectatorCount: 28,
        startedAt: Date.now() - 480000
      }
    ]

    return NextResponse.json({
      success: true,
      matches: liveMatches,
      totalSpectators: liveMatches.reduce((sum, m) => sum + m.spectatorCount, 0)
    })
  } catch (error) {
    console.error('Error fetching live matches:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch live matches' },
      { status: 500 }
    )
  }
}
