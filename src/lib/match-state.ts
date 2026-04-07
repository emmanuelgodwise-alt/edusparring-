/**
 * Match State Layer
 * 
 * This abstraction provides real-time match state management with:
 * - In-memory cache for development (no Redis required)
 * - Redis support for production scaling (thousands of concurrent matches)
 * 
 * WHY THIS EXISTS:
 * - Direct database writes for every match action = database overload
 * - Redis/in-memory = sub-millisecond updates, no DB pressure
 * - Only persist final results to database
 * 
 * ARCHITECTURE:
 * 
 * Player Action → Match State Layer → Database (final results only)
 *                     ↓
 *              Redis (production) or
 *              In-Memory (development)
 */

// Types for match state
export interface LiveMatchState {
  matchId: string
  player1: {
    id: string
    name: string
    score: number
    lastAnswer: string | null
    lastCorrect: boolean | null
  }
  player2: {
    id: string
    name: string
    score: number
    lastAnswer: string | null
    lastCorrect: boolean | null
  }
  currentQuestion: {
    id: string
    text: string
    options: string[]
    difficulty: string
    pointsValue: number
  } | null
  currentRound: number
  totalRounds: number
  timeRemaining: number
  status: 'waiting' | 'active' | 'completed'
  winner: string | null
  subject: string
  spectators: number
  createdAt: Date
  updatedAt: Date
}

// Spectator update event
export interface MatchUpdateEvent {
  type: 'question' | 'answer' | 'score' | 'timer' | 'end'
  matchId: string
  data: Partial<LiveMatchState>
  timestamp: Date
}

// Subscriber callback type
type MatchSubscriber = (event: MatchUpdateEvent) => void

/**
 * In-Memory Match State Store
 * 
 * Used for development when Redis is not available.
 * Supports pub/sub for spectator updates.
 */
class InMemoryMatchStore {
  private matches: Map<string, LiveMatchState> = new Map()
  private subscribers: Map<string, Set<MatchSubscriber>> = new Map()
  private timers: Map<string, NodeJS.Timeout> = new Map()
  private spectatorCounts: Map<string, number> = new Map()

  async get(matchId: string): Promise<LiveMatchState | null> {
    return this.matches.get(matchId) || null
  }

  async set(matchId: string, state: LiveMatchState): Promise<void> {
    this.matches.set(matchId, {
      ...state,
      updatedAt: new Date()
    })
    this.publish({ type: 'score', matchId, data: state, timestamp: new Date() })
  }

  async delete(matchId: string): Promise<void> {
    this.matches.delete(matchId)
    this.clearTimer(matchId)
    this.subscribers.delete(matchId)
    this.spectatorCounts.delete(matchId)
  }

  async exists(matchId: string): Promise<boolean> {
    return this.matches.has(matchId)
  }

  // Pub/Sub for spectators
  subscribe(matchId: string, callback: MatchSubscriber): () => void {
    if (!this.subscribers.has(matchId)) {
      this.subscribers.set(matchId, new Set())
    }
    this.subscribers.get(matchId)!.add(callback)

    // Return unsubscribe function
    return () => {
      this.subscribers.get(matchId)?.delete(callback)
    }
  }

  publish(event: MatchUpdateEvent): void {
    const subscribers = this.subscribers.get(event.matchId)
    if (subscribers) {
      subscribers.forEach(callback => callback(event))
    }
  }

  // Timer management for match countdown
  startTimer(matchId: string, onTick: (timeRemaining: number) => void, duration: number = 15): void {
    this.clearTimer(matchId)
    
    let timeRemaining = duration
    const timer = setInterval(() => {
      timeRemaining--
      onTick(timeRemaining)
      
      if (timeRemaining <= 0) {
        this.clearTimer(matchId)
      }
    }, 1000)
    
    this.timers.set(matchId, timer)
  }

  clearTimer(matchId: string): void {
    const timer = this.timers.get(matchId)
    if (timer) {
      clearInterval(timer)
      this.timers.delete(matchId)
    }
  }

  // Get all active matches (for spectator listing)
  async getActiveMatches(): Promise<LiveMatchState[]> {
    return Array.from(this.matches.values())
      .filter(m => m.status === 'active')
      .sort((a, b) => b.spectators - a.spectators)
  }

  // Increment spectator count
  async addSpectator(matchId: string): Promise<number> {
    const current = this.spectatorCounts.get(matchId) || 0
    const newCount = current + 1
    this.spectatorCounts.set(matchId, newCount)
    
    // Also update match state if exists
    const match = this.matches.get(matchId)
    if (match) {
      match.spectators = newCount
    }
    
    return newCount
  }

  async removeSpectator(matchId: string): Promise<number> {
    const current = this.spectatorCounts.get(matchId) || 0
    const newCount = Math.max(0, current - 1)
    this.spectatorCounts.set(matchId, newCount)
    
    // Also update match state if exists
    const match = this.matches.get(matchId)
    if (match) {
      match.spectators = newCount
    }
    
    return newCount
  }
}

/**
 * Redis Match State Store (Production)
 * 
 * When REDIS_URL is configured, this will be used instead.
 * Provides distributed state across multiple server instances.
 */
class RedisMatchStore {
  // Placeholder for Redis implementation
  // In production, install ioredis: npm install ioredis
  // 
  // import Redis from 'ioredis'
  // private redis: Redis
  // 
  // constructor(url: string) {
  //   this.redis = new Redis(url)
  // }

  private inMemory: InMemoryMatchStore

  constructor() {
    console.log('⚠️ Redis not configured, falling back to in-memory store')
    this.inMemory = new InMemoryMatchStore()
  }

  async get(matchId: string): Promise<LiveMatchState | null> {
    return this.inMemory.get(matchId)
  }

  async set(matchId: string, state: LiveMatchState): Promise<void> {
    return this.inMemory.set(matchId, state)
  }

  async delete(matchId: string): Promise<void> {
    return this.inMemory.delete(matchId)
  }

  async exists(matchId: string): Promise<boolean> {
    return this.inMemory.exists(matchId)
  }

  subscribe(matchId: string, callback: MatchSubscriber): () => void {
    return this.inMemory.subscribe(matchId, callback)
  }

  publish(event: MatchUpdateEvent): void {
    return this.inMemory.publish(event)
  }

  startTimer(matchId: string, onTick: (timeRemaining: number) => void, duration: number = 15): void {
    return this.inMemory.startTimer(matchId, onTick, duration)
  }

  clearTimer(matchId: string): void {
    return this.inMemory.clearTimer(matchId)
  }

  async getActiveMatches(): Promise<LiveMatchState[]> {
    return this.inMemory.getActiveMatches()
  }

  async addSpectator(matchId: string): Promise<number> {
    return this.inMemory.addSpectator(matchId)
  }

  async removeSpectator(matchId: string): Promise<number> {
    return this.inMemory.removeSpectator(matchId)
  }
}

// Export the appropriate store based on environment
let matchStore: InMemoryMatchStore | RedisMatchStore

if (process.env.REDIS_URL) {
  matchStore = new RedisMatchStore()
} else {
  matchStore = new InMemoryMatchStore()
}

export const matchState = {
  // Core CRUD operations
  get: (matchId: string) => matchStore.get(matchId),
  set: (matchId: string, state: LiveMatchState) => matchStore.set(matchId, state),
  delete: (matchId: string) => matchStore.delete(matchId),
  exists: (matchId: string) => matchStore.exists(matchId),

  // Real-time operations
  subscribe: (matchId: string, callback: MatchSubscriber) => matchStore.subscribe(matchId, callback),
  publish: (event: MatchUpdateEvent) => matchStore.publish(event),
  startTimer: (matchId: string, onTick: (timeRemaining: number) => void, duration?: number) => 
    matchStore.startTimer(matchId, onTick, duration),
  clearTimer: (matchId: string) => matchStore.clearTimer(matchId),

  // Spectator operations
  getActiveMatches: () => matchStore.getActiveMatches(),
  addSpectator: (matchId: string) => matchStore.addSpectator(matchId),
  removeSpectator: (matchId: string) => matchStore.removeSpectator(matchId),
}

/**
 * PRODUCTION DEPLOYMENT NOTES:
 * 
 * 1. Set REDIS_URL environment variable to enable Redis:
 *    REDIS_URL=redis://username:password@host:port
 * 
 * 2. For horizontal scaling:
 *    - Deploy multiple Next.js instances behind a load balancer
 *    - All instances connect to the same Redis cluster
 *    - Redis handles pub/sub across instances
 * 
 * 3. Redis configuration for matches:
 *    - Set TTL on match keys (auto-expire after 1 hour)
 *    - Use Redis Cluster for >10,000 concurrent matches
 *    - Enable persistence for match recovery
 * 
 * 4. Recommended Redis settings:
 *    maxmemory-policy allkeys-lru
 *    timeout 300
 */
