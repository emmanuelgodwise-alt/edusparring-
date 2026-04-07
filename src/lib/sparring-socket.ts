/**
 * Sparring Socket Client
 * 
 * Client-side Socket.IO manager for Person-to-Person Sparring.
 * Handles connection, matchmaking, game events, presence, challenges, and tournaments.
 */

import { io, Socket } from 'socket.io-client'

// ===============================
// TYPES
// ===============================

export interface PlayerInfo {
  id: string
  name: string
  avatar?: string
  knowledgeRating?: number
}

export interface QueueData {
  player: {
    id: string
    name: string
    knowledgeRating: number
  }
  subject: string
  difficulty: string
}

export interface MatchFoundData {
  matchId: string
  opponent: PlayerInfo
  subject: string
  difficulty: string
  isFriendMatch?: boolean
  isRematch?: boolean
}

export interface QuestionData {
  id: string
  text: string
  options: string[]
  correctAnswer?: string
}

export interface AnswerData {
  matchId: string
  answer: string
  isCorrect: boolean
  points?: number
}

export interface GameEndData {
  winner: string
  yourScore: number
  opponentScore: number
  youWon: boolean
  matchId?: string
}

export interface PresenceData {
  userId: string
  status: 'online' | 'offline' | 'away'
  currentActivity?: string
}

export interface FriendChallengeData {
  challengeId: string
  from: PlayerInfo
  subject: string
  difficulty: string
}

export interface TournamentData {
  id: string
  name: string
  participants: PlayerInfo[]
  bracket: any[]
  status: string
}

// ===============================
// CALLBACKS
// ===============================

export interface SparringSocketCallbacks {
  // Connection
  onConnect?: () => void
  onDisconnect?: () => void
  onError?: (data: { message: string }) => void

  // Presence
  onPresenceUpdate?: (data: PresenceData) => void
  onOnlineFriendsList?: (friends: { userId: string; userName: string; status: string; currentActivity: string }[]) => void

  // Matchmaking
  onQueueStatus?: (data: { playersInQueue: number }) => void
  onMatchFound?: (data: MatchFoundData) => void

  // Match
  onOpponentReady?: () => void
  onMatchStart?: (data: { matchId: string }) => void
  onQuestionReceived?: (data: { question: QuestionData; from: string }) => void
  onAnswerReceived?: (data: { answer: string; isCorrect: boolean; from: string }) => void
  onScoresUpdated?: (data: { player1Score: number; player2Score: number }) => void
  onNewRound?: (data: { round: number; player1Score: number; player2Score: number }) => void
  onGameEnded?: (data: GameEndData) => void
  onOpponentDisconnected?: (data: { matchId?: string; gracePeriod?: number }) => void
  onOpponentReconnected?: () => void
  onOpponentForfeited?: () => void

  // Rematch
  onRematchRequested?: () => void
  onRematchDeclined?: () => void

  // Friend Challenge
  onFriendChallenge?: (data: FriendChallengeData) => void
  onChallengeDeclined?: (data: { toUserId: string }) => void
  onChallengeError?: (data: { message: string }) => void

  // Spectator
  onSpectatorCount?: (count: number) => void

  // Chat
  onChatMessage?: (message: any) => void
  onUserTyping?: (data: { userId: string; isTyping: boolean }) => void

  // Reconnection
  onReconnectSuccess?: (data: any) => void
  onReconnectFailed?: (data: { message: string }) => void
}

// ===============================
// SOCKET MANAGER CLASS
// ===============================

class SparringSocketManager {
  private socket: Socket | null = null
  private callbacks: SparringSocketCallbacks = {}
  private isConnected: boolean = false
  private userId: string | null = null

  /**
   * Connect to the sparring server
   */
  connect(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (this.socket?.connected) {
        resolve(true)
        return
      }

      this.socket = io('http://localhost:3003', {
        transports: ['websocket', 'polling'],
        forceNew: true,
        reconnection: true,
        reconnectionAttempts: 10,
        reconnectionDelay: 1000,
        timeout: 10000
      })

      this.socket.on('connect', () => {
        console.log('[Socket] Connected to server')
        this.isConnected = true
        this.callbacks.onConnect?.()
        resolve(true)
      })

      this.socket.on('disconnect', () => {
        console.log('[Socket] Disconnected from server')
        this.isConnected = false
        this.callbacks.onDisconnect?.()
      })

      // ===============================
      // PRESENCE EVENTS
      // ===============================

      this.socket.on('presence-update', (data: PresenceData) => {
        this.callbacks.onPresenceUpdate?.(data)
      })

      this.socket.on('online-friends-list', (friends: any[]) => {
        this.callbacks.onOnlineFriendsList?.(friends)
      })

      // ===============================
      // MATCHMAKING EVENTS
      // ===============================

      this.socket.on('queue-status', (data: { playersInQueue: number }) => {
        this.callbacks.onQueueStatus?.(data)
      })

      this.socket.on('match-found', (data: MatchFoundData) => {
        console.log('[Socket] Match found:', data)
        this.callbacks.onMatchFound?.(data)
      })

      // ===============================
      // MATCH EVENTS
      // ===============================

      this.socket.on('opponent-ready', () => {
        this.callbacks.onOpponentReady?.()
      })

      this.socket.on('match-start', (data: { matchId: string }) => {
        console.log('[Socket] Match started:', data)
        this.callbacks.onMatchStart?.(data)
      })

      this.socket.on('question-received', (data: { question: QuestionData; from: string }) => {
        this.callbacks.onQuestionReceived?.(data)
      })

      this.socket.on('answer-received', (data: { answer: string; isCorrect: boolean; from: string }) => {
        this.callbacks.onAnswerReceived?.(data)
      })

      this.socket.on('scores-updated', (data: { player1Score: number; player2Score: number }) => {
        this.callbacks.onScoresUpdated?.(data)
      })

      this.socket.on('new-round', (data: { round: number; player1Score: number; player2Score: number }) => {
        this.callbacks.onNewRound?.(data)
      })

      this.socket.on('game-ended', (data: GameEndData) => {
        console.log('[Socket] Game ended:', data)
        this.callbacks.onGameEnded?.(data)
      })

      this.socket.on('opponent-disconnected', (data: { matchId?: string; gracePeriod?: number }) => {
        console.log('[Socket] Opponent disconnected:', data)
        this.callbacks.onOpponentDisconnected?.(data)
      })

      this.socket.on('opponent-reconnected', () => {
        this.callbacks.onOpponentReconnected?.()
      })

      this.socket.on('opponent-forfeited', () => {
        this.callbacks.onOpponentForfeited?.()
      })

      // ===============================
      // REMATCH EVENTS
      // ===============================

      this.socket.on('rematch-requested', () => {
        this.callbacks.onRematchRequested?.()
      })

      this.socket.on('rematch-declined', () => {
        this.callbacks.onRematchDeclined?.()
      })

      // ===============================
      // FRIEND CHALLENGE EVENTS
      // ===============================

      this.socket.on('friend-challenge', (data: FriendChallengeData) => {
        this.callbacks.onFriendChallenge?.(data)
      })

      this.socket.on('challenge-declined', (data: { toUserId: string }) => {
        this.callbacks.onChallengeDeclined?.(data)
      })

      this.socket.on('challenge-error', (data: { message: string }) => {
        this.callbacks.onChallengeError?.(data)
      })

      // ===============================
      // SPECTATOR EVENTS
      // ===============================

      this.socket.on('spectator-count', (count: number) => {
        this.callbacks.onSpectatorCount?.(count)
      })

      // ===============================
      // CHAT EVENTS
      // ===============================

      this.socket.on('chat-message', (message: any) => {
        this.callbacks.onChatMessage?.(message)
      })

      this.socket.on('user-typing', (data: { userId: string; isTyping: boolean }) => {
        this.callbacks.onUserTyping?.(data)
      })

      // ===============================
      // RECONNECTION EVENTS
      // ===============================

      this.socket.on('reconnect-success', (data: any) => {
        this.callbacks.onReconnectSuccess?.(data)
      })

      this.socket.on('reconnect-failed', (data: { message: string }) => {
        this.callbacks.onReconnectFailed?.(data)
      })

      // ===============================
      // ERROR EVENTS
      // ===============================

      this.socket.on('error', (data: { message: string }) => {
        console.error('[Socket] Error:', data)
        this.callbacks.onError?.(data)
      })

      this.socket.on('connect_error', (error) => {
        console.error('[Socket] Connection error:', error)
        reject(error)
      })

      // Connection timeout
      setTimeout(() => {
        if (!this.isConnected) {
          reject(new Error('Connection timeout'))
        }
      }, 10000)
    })
  }

  /**
   * Disconnect from the server
   */
  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
      this.isConnected = false
    }
  }

  /**
   * Check if connected
   */
  connected(): boolean {
    return this.isConnected
  }

  /**
   * Set event callbacks
   */
  setCallbacks(callbacks: SparringSocketCallbacks) {
    this.callbacks = { ...this.callbacks, ...callbacks }
  }

  /**
   * Clear callbacks
   */
  clearCallbacks() {
    this.callbacks = {}
  }

  // ===============================
  // PRESENCE METHODS
  // ===============================

  /**
   * Register user as online
   */
  setUserOnline(data: { userId: string; userName: string; knowledgeRating: number }) {
    if (!this.socket?.connected) return false
    this.userId = data.userId
    this.socket.emit('user-online', data)
    return true
  }

  /**
   * Update current activity
   */
  updateActivity(activity: string) {
    if (!this.socket?.connected || !this.userId) return false
    this.socket.emit('update-activity', { userId: this.userId, activity })
    return true
  }

  /**
   * Get online friends
   */
  getOnlineFriends(friendIds: string[]) {
    if (!this.socket?.connected) return false
    this.socket.emit('get-online-friends', { friendIds })
    return true
  }

  // ===============================
  // MATCHMAKING METHODS
  // ===============================

  /**
   * Join the matchmaking queue
   */
  joinQueue(data: QueueData) {
    if (!this.socket?.connected) {
      console.error('[Socket] Not connected')
      return false
    }
    this.socket.emit('join-queue', data)
    return true
  }

  /**
   * Leave the matchmaking queue
   */
  leaveQueue() {
    if (!this.socket?.connected) return false
    this.socket.emit('leave-queue')
    return true
  }

  // ===============================
  // MATCH METHODS
  // ===============================

  /**
   * Mark player as ready
   */
  playerReady(matchId: string) {
    if (!this.socket?.connected) return false
    this.socket.emit('player-ready', { matchId })
    return true
  }

  /**
   * Cancel the match
   */
  cancelMatch(matchId: string) {
    if (!this.socket?.connected) return false
    this.socket.emit('cancel-match', { matchId })
    return true
  }

  /**
   * Send a question to opponent
   */
  sendQuestion(matchId: string, question: QuestionData) {
    if (!this.socket?.connected) return false
    this.socket.emit('send-question', { matchId, question })
    return true
  }

  /**
   * Submit an answer
   */
  submitAnswer(matchId: string, answer: string, isCorrect: boolean, points?: number) {
    if (!this.socket?.connected) return false
    this.socket.emit('send-answer', { matchId, answer, isCorrect, points })
    return true
  }

  /**
   * Update scores
   */
  updateScore(matchId: string) {
    if (!this.socket?.connected) return false
    this.socket.emit('score-update', { matchId })
    return true
  }

  /**
   * Complete a round
   */
  roundComplete(matchId: string) {
    if (!this.socket?.connected) return false
    this.socket.emit('round-complete', { matchId })
    return true
  }

  /**
   * End the game
   */
  endGame(matchId: string) {
    if (!this.socket?.connected) return false
    this.socket.emit('game-end', { matchId })
    return true
  }

  // ===============================
  // REMATCH METHODS
  // ===============================

  /**
   * Request a rematch
   */
  requestRematch(matchId: string) {
    if (!this.socket?.connected) return false
    this.socket.emit('request-rematch', { matchId })
    return true
  }

  /**
   * Decline a rematch
   */
  declineRematch(matchId: string) {
    if (!this.socket?.connected) return false
    this.socket.emit('decline-rematch', { matchId })
    return true
  }

  // ===============================
  // FRIEND CHALLENGE METHODS
  // ===============================

  /**
   * Challenge a friend
   */
  challengeFriend(data: { fromUserId: string; fromUserName: string; toUserId: string; subject: string; difficulty: string }) {
    if (!this.socket?.connected) return false
    this.socket.emit('challenge-friend', data)
    return true
  }

  /**
   * Accept a challenge
   */
  acceptChallenge(challengeId: string) {
    if (!this.socket?.connected) return false
    this.socket.emit('accept-challenge', { challengeId })
    return true
  }

  /**
   * Decline a challenge
   */
  declineChallenge(challengeId: string) {
    if (!this.socket?.connected) return false
    this.socket.emit('decline-challenge', { challengeId })
    return true
  }

  // ===============================
  // CHAT METHODS
  // ===============================

  /**
   * Join chat room
   */
  joinChat(userId: string) {
    if (!this.socket?.connected) return false
    this.socket.emit('join-chat', { userId })
    return true
  }

  /**
   * Send chat message
   */
  sendMessage(toUserId: string, message: any) {
    if (!this.socket?.connected) return false
    this.socket.emit('send-message', { toUserId, message })
    return true
  }

  /**
   * Send typing indicator
   */
  sendTyping(toUserId: string, isTyping: boolean) {
    if (!this.socket?.connected) return false
    this.socket.emit('typing', { userId: this.userId, toUserId, isTyping })
    return true
  }

  // ===============================
  // RECONNECTION METHODS
  // ===============================

  /**
   * Reconnect to an active match
   */
  reconnectToMatch(matchId: string, userId: string) {
    if (!this.socket?.connected) return false
    this.socket.emit('reconnect-to-match', { matchId, userId })
    return true
  }

  /**
   * Get the socket instance (for advanced use)
   */
  getSocket(): Socket | null {
    return this.socket
  }
}

// Export singleton instance
export const sparringSocket = new SparringSocketManager()
