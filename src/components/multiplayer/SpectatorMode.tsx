/**
 * Spectator Mode Component
 * 
 * Watch live matches in real-time
 */

'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Eye, Users, Trophy, Clock, ChevronRight, 
  Play, Pause, Volume2, VolumeX, Maximize2,
  MessageCircle, ThumbsUp, Zap
} from 'lucide-react'
import { sparringSocket } from '@/lib/sparring-socket'

// ===============================
// TYPES
// ===============================

interface SpectatorMatch {
  matchId: string
  player1: { id: string; name: string; score: number; avatar?: string }
  player2: { id: string; name: string; score: number; avatar?: string }
  subject: string
  difficulty: string
  currentRound: number
  status: 'waiting' | 'active' | 'ended'
  spectatorCount: number
  startedAt?: number
}

interface SpectatorModeProps {
  matchId: string
  onLeave: () => void
}

// ===============================
// LIVE MATCH LIST
// ===============================

interface LiveMatchListProps {
  onSelectMatch: (matchId: string) => void
}

export function LiveMatchList({ onSelectMatch }: LiveMatchListProps) {
  const [liveMatches, setLiveMatches] = useState<SpectatorMatch[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch live matches
    const fetchMatches = async () => {
      try {
        const res = await fetch('/api/multiplayer/live-matches')
        const data = await res.json()
        setLiveMatches(data.matches || [])
      } catch (err) {
        console.error('Failed to fetch live matches:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchMatches()
    const interval = setInterval(fetchMatches, 5000)

    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full mx-auto mb-3" />
        <p className="text-gray-400">Finding live matches...</p>
      </div>
    )
  }

  if (liveMatches.length === 0) {
    return (
      <div className="text-center py-8">
        <Eye className="w-12 h-12 text-gray-500 mx-auto mb-3" />
        <p className="text-gray-400">No live matches right now</p>
        <p className="text-sm text-gray-500 mt-1">Check back later or start your own match!</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {liveMatches.map((match) => (
        <motion.button
          key={match.matchId}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => onSelectMatch(match.matchId)}
          className="w-full bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-4 transition-all"
        >
          <div className="flex items-center justify-between">
            {/* Players */}
            <div className="flex items-center gap-3">
              {/* Player 1 */}
              <div className="text-center">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mb-1">
                  <span className="font-bold text-white">{match.player1.name.charAt(0)}</span>
                </div>
                <p className="text-xs text-white font-medium">{match.player1.name}</p>
                <p className="text-sm font-bold text-blue-400">{match.player1.score}</p>
              </div>

              <span className="text-xl font-bold text-gray-500">VS</span>

              {/* Player 2 */}
              <div className="text-center">
                <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center mb-1">
                  <span className="font-bold text-white">{match.player2.name.charAt(0)}</span>
                </div>
                <p className="text-xs text-white font-medium">{match.player2.name}</p>
                <p className="text-sm font-bold text-red-400">{match.player2.score}</p>
              </div>
            </div>

            {/* Match Info */}
            <div className="text-right">
              <div className="flex items-center gap-2 justify-end mb-1">
                <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-xs rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                  LIVE
                </span>
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <Eye className="w-3 h-3" /> {match.spectatorCount}
                </span>
              </div>
              <p className="text-xs text-gray-400 capitalize">{match.subject}</p>
              <p className="text-xs text-gray-500">Round {match.currentRound}</p>
            </div>
          </div>
        </motion.button>
      ))}
    </div>
  )
}

// ===============================
// SPECTATOR VIEW
// ===============================

export default function SpectatorMode({ matchId, onLeave }: SpectatorModeProps) {
  const [matchData, setMatchData] = useState<SpectatorMatch | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState<{ text: string; options: string[] } | null>(null)
  const [isMuted, setIsMuted] = useState(false)
  const [chatMessages, setChatMessages] = useState<{ user: string; text: string }[]>([])
  const [chatInput, setChatInput] = useState('')
  const [reactions, setReactions] = useState<{ type: string; x: number; y: number }[]>([])

  useEffect(() => {
    // Connect and join match as spectator
    const connectAndJoin = async () => {
      try {
        await sparringSocket.connect()
        
        // Get spectator socket
        const socket = sparringSocket.getSocket()
        if (socket) {
          socket.emit('spectator:join-match', { matchId })
          
          // Listen for match events
          socket.on('match-state', (data) => {
            setMatchData(data)
          })
          
          socket.on('question-sent', (data) => {
            setCurrentQuestion(data.question)
          })
          
          socket.on('score-update', (data) => {
            setMatchData(prev => prev ? {
              ...prev,
              player1: { ...prev.player1, score: data.player1Score },
              player2: { ...prev.player2, score: data.player2Score }
            } : null)
          })
          
          socket.on('new-round', (data) => {
            setMatchData(prev => prev ? {
              ...prev,
              currentRound: data.round
            } : null)
            setCurrentQuestion(null)
          })
          
          socket.on('match-ended', (data) => {
            setMatchData(prev => prev ? { ...prev, status: 'ended' } : null)
          })

          socket.on('spectator-chat', (msg) => {
            setChatMessages(prev => [...prev, msg])
          })
        }
      } catch (err) {
        console.error('Failed to connect as spectator:', err)
      }
    }

    connectAndJoin()

    return () => {
      const socket = sparringSocket.getSocket()
      if (socket) {
        socket.emit('spectator:leave-match', { matchId })
      }
    }
  }, [matchId])

  const sendReaction = (type: string) => {
    const x = Math.random() * 80 + 10
    const y = Math.random() * 60 + 20
    setReactions(prev => [...prev, { type, x, y }])
    
    setTimeout(() => {
      setReactions(prev => prev.slice(1))
    }, 2000)
  }

  const sendChatMessage = () => {
    if (!chatInput.trim()) return
    
    const socket = sparringSocket.getSocket()
    if (socket) {
      socket.emit('spectator:chat', { matchId, text: chatInput })
      setChatInput('')
    }
  }

  if (!matchData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-10 h-10 border-2 border-purple-500 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-400">Joining match...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-black/30 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onLeave}
                className="text-gray-400 hover:text-white flex items-center gap-1"
              >
                ← Leave
              </button>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-xs rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                  LIVE
                </span>
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <Eye className="w-3 h-3" /> {matchData.spectatorCount} watching
                </span>
              </div>
            </div>

            <div className="text-center">
              <p className="text-xs text-gray-400 uppercase">Round</p>
              <p className="text-xl font-bold text-white">{matchData.currentRound}</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="p-2 text-gray-400 hover:text-white"
              >
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
              <button className="p-2 text-gray-400 hover:text-white">
                <Maximize2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Players */}
        <div className="flex items-center justify-between mb-8">
          {/* Player 1 */}
          <motion.div 
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="text-center"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-2xl font-bold text-white">{matchData.player1.name.charAt(0)}</span>
            </div>
            <p className="text-white font-medium">{matchData.player1.name}</p>
            <p className="text-3xl font-bold text-blue-400">{matchData.player1.score}</p>
          </motion.div>

          {/* VS */}
          <div className="text-center">
            <p className="text-4xl font-bold text-gray-500">VS</p>
            <p className="text-xs text-gray-400 mt-1 capitalize">{matchData.subject}</p>
          </div>

          {/* Player 2 */}
          <motion.div 
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="text-center"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-2xl font-bold text-white">{matchData.player2.name.charAt(0)}</span>
            </div>
            <p className="text-white font-medium">{matchData.player2.name}</p>
            <p className="text-3xl font-bold text-red-400">{matchData.player2.score}</p>
          </motion.div>
        </div>

        {/* Current Question */}
        {currentQuestion && matchData.status === 'active' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 mb-6"
          >
            <p className="text-lg text-white mb-4">{currentQuestion.text}</p>
            <div className="grid grid-cols-2 gap-3">
              {currentQuestion.options.map((opt, i) => (
                <div
                  key={i}
                  className="p-3 bg-white/5 rounded-xl text-white"
                >
                  {String.fromCharCode(65 + i)}. {opt}
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Match Ended */}
        {matchData.status === 'ended' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 text-center"
          >
            <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Match Ended!</h2>
            <p className="text-gray-400">Final scores shown above</p>
          </motion.div>
        )}

        {/* Reactions */}
        {reactions.map((r, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 0, y: -100 }}
            transition={{ duration: 2 }}
            className="absolute text-4xl"
            style={{ left: `${r.x}%`, top: `${r.y}%` }}
          >
            {r.type === 'fire' ? '🔥' : r.type === 'wow' ? '😮' : r.type === 'clap' ? '👏' : '💪'}
          </motion.div>
        ))}

        {/* Reaction Buttons */}
        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={() => sendReaction('fire')}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-xl"
          >
            🔥
          </button>
          <button
            onClick={() => sendReaction('wow')}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-xl"
          >
            😮
          </button>
          <button
            onClick={() => sendReaction('clap')}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-xl"
          >
            👏
          </button>
          <button
            onClick={() => sendReaction('strong')}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-xl"
          >
            💪
          </button>
        </div>

        {/* Spectator Chat */}
        <div className="bg-white/5 rounded-xl p-4">
          <h3 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
            <MessageCircle className="w-4 h-4" /> Spectator Chat
          </h3>
          <div className="h-32 overflow-y-auto mb-3 space-y-2">
            {chatMessages.map((msg, i) => (
              <p key={i} className="text-sm">
                <span className="text-purple-400">{msg.user}:</span>{' '}
                <span className="text-gray-300">{msg.text}</span>
              </p>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
              placeholder="Send a message..."
              className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-purple-500"
            />
            <button
              onClick={sendChatMessage}
              className="px-4 py-2 bg-purple-500 text-white rounded-lg text-sm font-medium hover:bg-purple-600"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
