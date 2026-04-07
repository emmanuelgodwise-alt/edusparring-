import { NextResponse } from 'next/server'
import { matchState } from '@/lib/match-state'

/**
 * Spectator Mode API
 * 
 * Provides real-time match updates for spectators.
 * 
 * HOW IT WORKS:
 * 1. Client polls this endpoint for match state
 * 2. In production, upgrade to WebSocket for true real-time
 * 3. Spectators can watch questions, answers, scores, timer
 * 
 * WEBSOCKET UPGRADE PATH (Production):
 * 
 * For true real-time spectator mode, implement WebSocket:
 * 
 * // Install: npm install socket.io
 * // Create: server.ts (custom server)
 * 
 * import { Server } from 'socket.io'
 * 
 * io.on('connection', (socket) => {
 *   socket.on('spectate', (matchId) => {
 *     socket.join(`match:${matchId}`)
 *     matchState.addSpectator(matchId)
 *   })
 *   
 *   socket.on('leave', (matchId) => {
 *     socket.leave(`match:${matchId}`)
 *     matchState.removeSpectator(matchId)
 *   })
 * })
 * 
 * // Broadcast updates:
 * io.to(`match:${matchId}`).emit('update', event)
 */

// GET /api/spectator/[matchId] - Get current match state
export async function GET(
  request: Request,
  { params }: { params: Promise<{ matchId: string }> }
) {
  try {
    const { matchId } = await params
    
    const state = await matchState.get(matchId)
    
    if (!state) {
      return NextResponse.json(
        { success: false, error: 'Match not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      match: state
    })
  } catch (error) {
    console.error('Spectator API error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to get match state' },
      { status: 500 }
    )
  }
}

// POST /api/spectator/[matchId] - Join as spectator
export async function POST(
  request: Request,
  { params }: { params: Promise<{ matchId: string }> }
) {
  try {
    const { matchId } = await params
    
    const spectatorCount = await matchState.addSpectator(matchId)
    
    return NextResponse.json({
      success: true,
      spectatorCount
    })
  } catch (error) {
    console.error('Failed to add spectator:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to join as spectator' },
      { status: 500 }
    )
  }
}

// DELETE /api/spectator/[matchId] - Leave spectator mode
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ matchId: string }> }
) {
  try {
    const { matchId } = await params
    
    const spectatorCount = await matchState.removeSpectator(matchId)
    
    return NextResponse.json({
      success: true,
      spectatorCount
    })
  } catch (error) {
    console.error('Failed to remove spectator:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to leave spectator mode' },
      { status: 500 }
    )
  }
}

/**
 * PRODUCTION WEBSOCKET ARCHITECTURE:
 * 
 * For EduSparring World Cup and large-scale events:
 * 
 * 1. Dedicated WebSocket Server
 *    - Deploy separate Socket.IO server
 *    - Handle thousands of concurrent spectators
 *    - Scale horizontally behind load balancer
 * 
 * 2. Room-based Broadcasting
 *    - Each match = one room
 *    - Spectators join/leave rooms
 *    - Efficient broadcasting to specific match viewers
 * 
 * 3. Event Types for Spectators:
 *    - 'question': New question displayed
 *    - 'answer': Player submitted answer
 *    - 'score': Score updated
 *    - 'timer': Countdown tick
 *    - 'end': Match concluded
 * 
 * 4. Spectator Features:
 *    - Live chat (optional)
 *    - Reaction emojis
 *    - Stats overlay (player KR, win rate)
 *    - Question difficulty indicator
 *    - AI explanation reveal
 * 
 * 5. Analytics Integration:
 *    - Track spectator engagement
 *    - Popular matches
 *    - Peak viewing times
 *    - Subject interest
 */
