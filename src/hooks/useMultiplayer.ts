/**
 * Multiplayer React Hooks
 * 
 * Custom hooks for real-time multiplayer features
 */

'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { sparringSocket, MatchFoundData, GameEndData, QuestionData, PresenceData, FriendChallengeData } from '@/lib/sparring-socket'

// ===============================
// TYPES
// ===============================

export interface MatchState {
  matchId: string | null
  opponent: { id: string; name: string; knowledgeRating?: number } | null
  subject: string | null
  difficulty: string | null
  status: 'idle' | 'matchmaking' | 'waiting' | 'playing' | 'ended'
  currentRound: number
  yourScore: number
  opponentScore: number
  yourTurn: boolean
  isQuestioner: boolean
  currentQuestion: QuestionData | null
  spectatorCount: number
}

export interface OnlineUser {
  userId: string
  userName: string
  status: string
  currentActivity: string
}

// ===============================
// useMultiplayer HOOK
// ===============================

export function useMultiplayer(userId: string | null) {
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!userId) return

    const connectSocket = async () => {
      setIsConnecting(true)
      try {
        await sparringSocket.connect()
        setIsConnected(true)
        setError(null)
      } catch (err) {
        setError('Failed to connect to game server')
        console.error('Socket connection error:', err)
      } finally {
        setIsConnecting(false)
      }
    }

    connectSocket()

    return () => {
      // Don't disconnect on unmount - let the app manage lifecycle
    }
  }, [userId])

  const connect = useCallback(async () => {
    if (isConnected) return true
    setIsConnecting(true)
    try {
      await sparringSocket.connect()
      setIsConnected(true)
      setError(null)
      return true
    } catch (err) {
      setError('Failed to connect')
      return false
    } finally {
      setIsConnecting(false)
    }
  }, [isConnected])

  return { isConnected, isConnecting, error, connect }
}

// ===============================
// useMatchmaking HOOK
// ===============================

export function useMatchmaking(userId: string | null) {
  const [isInQueue, setIsInQueue] = useState(false)
  const [queueSize, setQueueSize] = useState(0)
  const [matchFound, setMatchFound] = useState<MatchFoundData | null>(null)
  const [searchTime, setSearchTime] = useState(0)

  const searchIntervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (!userId) return

    sparringSocket.setCallbacks({
      onQueueStatus: (data) => {
        setQueueSize(data.playersInQueue)
      },
      onMatchFound: (data) => {
        setIsInQueue(false)
        setMatchFound(data)
        if (searchIntervalRef.current) {
          clearInterval(searchIntervalRef.current)
        }
      }
    })

    return () => {
      if (searchIntervalRef.current) {
        clearInterval(searchIntervalRef.current)
      }
    }
  }, [userId])

  const joinQueue = useCallback((player: { id: string; name: string; knowledgeRating: number }, subject: string, difficulty: string) => {
    if (!userId) return false

    const result = sparringSocket.joinQueue({
      player,
      subject,
      difficulty
    })

    if (result) {
      setIsInQueue(true)
      setSearchTime(0)
      searchIntervalRef.current = setInterval(() => {
        setSearchTime(prev => prev + 1)
      }, 1000)
    }

    return result
  }, [userId])

  const leaveQueue = useCallback(() => {
    sparringSocket.leaveQueue()
    setIsInQueue(false)
    setSearchTime(0)
    if (searchIntervalRef.current) {
      clearInterval(searchIntervalRef.current)
    }
  }, [])

  const clearMatchFound = useCallback(() => {
    setMatchFound(null)
  }, [])

  return {
    isInQueue,
    queueSize,
    matchFound,
    searchTime,
    joinQueue,
    leaveQueue,
    clearMatchFound
  }
}

// ===============================
// useLiveBattle HOOK
// ===============================

export function useLiveBattle(matchId: string | null, userId: string | null) {
  const [matchState, setMatchState] = useState<MatchState>({
    matchId: null,
    opponent: null,
    subject: null,
    difficulty: null,
    status: 'idle',
    currentRound: 1,
    yourScore: 0,
    opponentScore: 0,
    yourTurn: false,
    isQuestioner: false,
    currentQuestion: null,
    spectatorCount: 0
  })
  const [opponentReady, setOpponentReady] = useState(false)
  const [gameEnded, setGameEnded] = useState<GameEndData | null>(null)
  const [opponentDisconnected, setOpponentDisconnected] = useState(false)
  const [rematchRequested, setRematchRequested] = useState(false)

  // Initialize match
  const initMatch = useCallback((data: MatchFoundData) => {
    setMatchState({
      matchId: data.matchId,
      opponent: data.opponent,
      subject: data.subject,
      difficulty: data.difficulty,
      status: 'waiting',
      currentRound: 1,
      yourScore: 0,
      opponentScore: 0,
      yourTurn: false,
      isQuestioner: false,
      currentQuestion: null,
      spectatorCount: 0
    })
    setOpponentReady(false)
    setGameEnded(null)
    setOpponentDisconnected(false)
    setRematchRequested(false)
  }, [])

  // Set up event listeners
  useEffect(() => {
    sparringSocket.setCallbacks({
      onOpponentReady: () => {
        setOpponentReady(true)
      },
      onMatchStart: (data) => {
        setMatchState(prev => ({
          ...prev,
          status: 'playing',
          matchId: data.matchId
        }))
      },
      onQuestionReceived: (data) => {
        setMatchState(prev => ({
          ...prev,
          currentQuestion: data.question,
          yourTurn: true,
          isQuestioner: false
        }))
      },
      onAnswerReceived: (data) => {
        // Opponent answered
        if (data.isCorrect) {
          setMatchState(prev => ({
            ...prev,
            opponentScore: prev.opponentScore + (data.isCorrect ? 15 : 0)
          }))
        }
      },
      onScoresUpdated: (data) => {
        setMatchState(prev => ({
          ...prev,
          yourScore: data.player1Score,
          opponentScore: data.player2Score
        }))
      },
      onNewRound: (data) => {
        setMatchState(prev => ({
          ...prev,
          currentRound: data.round,
          yourScore: data.player1Score,
          opponentScore: data.player2Score,
          currentQuestion: null,
          yourTurn: false
        }))
      },
      onGameEnded: (data) => {
        setMatchState(prev => ({
          ...prev,
          status: 'ended'
        }))
        setGameEnded(data)
      },
      onOpponentDisconnected: () => {
        setOpponentDisconnected(true)
      },
      onOpponentReconnected: () => {
        setOpponentDisconnected(false)
      },
      onOpponentForfeited: () => {
        setOpponentDisconnected(true)
        setMatchState(prev => ({
          ...prev,
          status: 'ended'
        }))
        setGameEnded({
          winner: 'you',
          yourScore: matchState.yourScore,
          opponentScore: matchState.opponentScore,
          youWon: true
        })
      },
      onSpectatorCount: (count) => {
        setMatchState(prev => ({
          ...prev,
          spectatorCount: count
        }))
      },
      onRematchRequested: () => {
        setRematchRequested(true)
      },
      onRematchDeclined: () => {
        setRematchRequested(false)
      }
    })
  }, [matchState.yourScore, matchState.opponentScore])

  // Actions
  const playerReady = useCallback(() => {
    if (matchId) {
      sparringSocket.playerReady(matchId)
    }
  }, [matchId])

  const sendQuestion = useCallback((question: QuestionData) => {
    if (matchId) {
      sparringSocket.sendQuestion(matchId, question)
      setMatchState(prev => ({
        ...prev,
        isQuestioner: true,
        yourTurn: false
      }))
    }
  }, [matchId])

  const submitAnswer = useCallback((answer: string, isCorrect: boolean, points?: number) => {
    if (matchId) {
      sparringSocket.submitAnswer(matchId, answer, isCorrect, points)
      if (isCorrect) {
        setMatchState(prev => ({
          ...prev,
          yourScore: prev.yourScore + (points || 15)
        }))
      }
    }
  }, [matchId])

  const nextRound = useCallback(() => {
    if (matchId) {
      sparringSocket.roundComplete(matchId)
    }
  }, [matchId])

  const endGame = useCallback(() => {
    if (matchId) {
      sparringSocket.endGame(matchId)
    }
  }, [matchId])

  const requestRematch = useCallback(() => {
    if (matchId) {
      sparringSocket.requestRematch(matchId)
    }
  }, [matchId])

  const declineRematch = useCallback(() => {
    if (matchId) {
      sparringSocket.declineRematch(matchId)
    }
  }, [matchId])

  return {
    matchState,
    opponentReady,
    gameEnded,
    opponentDisconnected,
    rematchRequested,
    initMatch,
    playerReady,
    sendQuestion,
    submitAnswer,
    nextRound,
    endGame,
    requestRematch,
    declineRematch
  }
}

// ===============================
// usePresence HOOK
// ===============================

export function usePresence(userId: string | null) {
  const [onlineFriends, setOnlineFriends] = useState<OnlineUser[]>([])
  const [presenceUpdates, setPresenceUpdates] = useState<PresenceData | null>(null)

  useEffect(() => {
    if (!userId) return

    sparringSocket.setCallbacks({
      onPresenceUpdate: (data) => {
        setPresenceUpdates(data)
        // Update online friends list
        setOnlineFriends(prev => {
          const index = prev.findIndex(f => f.userId === data.userId)
          if (data.status === 'offline') {
            return prev.filter(f => f.userId !== data.userId)
          } else if (index !== -1) {
            const updated = [...prev]
            updated[index] = { ...updated[index], status: data.status, currentActivity: data.currentActivity || '' }
            return updated
          }
          return prev
        })
      },
      onOnlineFriendsList: (friends) => {
        setOnlineFriends(friends)
      }
    })
  }, [userId])

  const setOnline = useCallback((userName: string, knowledgeRating: number) => {
    if (userId) {
      sparringSocket.setUserOnline({ userId, userName, knowledgeRating })
    }
  }, [userId])

  const updateActivity = useCallback((activity: string) => {
    sparringSocket.updateActivity(activity)
  }, [])

  const fetchOnlineFriends = useCallback((friendIds: string[]) => {
    sparringSocket.getOnlineFriends(friendIds)
  }, [])

  return {
    onlineFriends,
    presenceUpdates,
    setOnline,
    updateActivity,
    fetchOnlineFriends
  }
}

// ===============================
// useFriendChallenge HOOK
// ===============================

export function useFriendChallenge(userId: string | null) {
  const [pendingChallenge, setPendingChallenge] = useState<FriendChallengeData | null>(null)
  const [challengeSent, setChallengeSent] = useState(false)
  const [challengeError, setChallengeError] = useState<string | null>(null)

  useEffect(() => {
    if (!userId) return

    sparringSocket.setCallbacks({
      onFriendChallenge: (data) => {
        setPendingChallenge(data)
      },
      onChallengeDeclined: () => {
        setChallengeSent(false)
        setChallengeError('Challenge was declined')
      },
      onChallengeError: (data) => {
        setChallengeError(data.message)
        setChallengeSent(false)
      }
    })
  }, [userId])

  const sendChallenge = useCallback((toUserId: string, userName: string, subject: string, difficulty: string) => {
    if (!userId) return false
    setChallengeError(null)
    setChallengeSent(true)
    return sparringSocket.challengeFriend({
      fromUserId: userId,
      fromUserName: userName,
      toUserId,
      subject,
      difficulty
    })
  }, [userId])

  const acceptChallenge = useCallback((challengeId: string) => {
    sparringSocket.acceptChallenge(challengeId)
    setPendingChallenge(null)
  }, [])

  const declineChallenge = useCallback((challengeId: string) => {
    sparringSocket.declineChallenge(challengeId)
    setPendingChallenge(null)
  }, [])

  const clearChallenge = useCallback(() => {
    setPendingChallenge(null)
    setChallengeSent(false)
    setChallengeError(null)
  }, [])

  return {
    pendingChallenge,
    challengeSent,
    challengeError,
    sendChallenge,
    acceptChallenge,
    declineChallenge,
    clearChallenge
  }
}

// ===============================
// useSpectator HOOK
// ===============================

export function useSpectator() {
  const [isSpectating, setIsSpectating] = useState(false)
  const [currentMatchId, setCurrentMatchId] = useState<string | null>(null)
  const [spectatorData, setSpectatorData] = useState<{
    player1: { name: string; score: number }
    player2: { name: string; score: number }
    currentRound: number
    status: string
    subject: string
  } | null>(null)

  const socketRef = useRef<any>(null)

  useEffect(() => {
    // Get spectator namespace socket
    const socket = sparringSocket.getSocket()
    if (socket) {
      // We'll use the main socket for spectator events in this implementation
      socketRef.current = socket
    }
  }, [])

  const joinMatch = useCallback((matchId: string) => {
    if (socketRef.current) {
      socketRef.current.emit('spectator:join-match', { matchId })
      setIsSpectating(true)
      setCurrentMatchId(matchId)
    }
  }, [])

  const leaveMatch = useCallback(() => {
    if (socketRef.current && currentMatchId) {
      socketRef.current.emit('spectator:leave-match', { matchId: currentMatchId })
      setIsSpectating(false)
      setCurrentMatchId(null)
      setSpectatorData(null)
    }
  }, [currentMatchId])

  return {
    isSpectating,
    currentMatchId,
    spectatorData,
    joinMatch,
    leaveMatch
  }
}

// ===============================
// useChat HOOK
// ===============================

export function useChat(userId: string | null) {
  const [messages, setMessages] = useState<any[]>([])
  const [isTyping, setIsTyping] = useState(false)

  useEffect(() => {
    if (!userId) return

    sparringSocket.setCallbacks({
      onChatMessage: (message) => {
        setMessages(prev => [...prev, message])
      },
      onUserTyping: (data) => {
        setIsTyping(data.isTyping)
      }
    })

    // Join chat room
    sparringSocket.joinChat(userId)
  }, [userId])

  const sendMessage = useCallback((toUserId: string, content: string) => {
    const message = {
      id: `msg-${Date.now()}`,
      from: userId,
      to: toUserId,
      content,
      timestamp: Date.now()
    }
    sparringSocket.sendMessage(toUserId, message)
    setMessages(prev => [...prev, { ...message, isOwn: true }])
  }, [userId])

  const sendTypingIndicator = useCallback((toUserId: string, typing: boolean) => {
    sparringSocket.sendTyping(toUserId, typing)
  }, [])

  return {
    messages,
    isTyping,
    sendMessage,
    sendTypingIndicator
  }
}
