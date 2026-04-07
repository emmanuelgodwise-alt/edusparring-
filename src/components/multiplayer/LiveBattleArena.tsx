/**
 * LiveBattleArena Component
 * 
 * Real-time multiplayer battle arena with synchronized gameplay
 */

'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Swords, Users, Eye, Clock, Trophy, Zap, MessageCircle,
  ChevronRight, CheckCircle, XCircle, AlertTriangle, RotateCcw
} from 'lucide-react'
import { useLiveBattle, useMultiplayer } from '@/hooks/useMultiplayer'
import { MatchFoundData, QuestionData } from '@/lib/sparring-socket'

// ===============================
// TYPES
// ===============================

interface LiveBattleArenaProps {
  matchData: MatchFoundData
  currentPlayer: {
    id: string
    name: string
    knowledgeRating: number
  }
  onGameEnd?: (result: { won: boolean; score: number }) => void
  onLeave?: () => void
}

interface Question {
  id: string
  text: string
  options: string[]
  correctAnswer: string
  subject: string
  difficulty: string
}

// ===============================
// MAIN COMPONENT
// ===============================

export default function LiveBattleArena({ 
  matchData, 
  currentPlayer,
  onGameEnd,
  onLeave 
}: LiveBattleArenaProps) {
  const { matchState, opponentReady, gameEnded, opponentDisconnected, rematchRequested,
    initMatch, playerReady, sendQuestion, submitAnswer, nextRound, endGame,
    requestRematch, declineRematch } = useLiveBattle(matchData.matchId, currentPlayer.id)

  const [playerReadyState, setPlayerReadyState] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [answerResult, setAnswerResult] = useState<{ isCorrect: boolean; correctAnswer: string } | null>(null)
  const [timer, setTimer] = useState(30)
  const [isMyTurnToAsk, setIsMyTurnToAsk] = useState(false)
  const [showQuestionCreator, setShowQuestionCreator] = useState(false)
  const [chatOpen, setChatOpen] = useState(false)
  const [chatMessages, setChatMessages] = useState<{ from: string; text: string }[]>([])

  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const TOTAL_ROUNDS = 5

  // Initialize match
  useEffect(() => {
    initMatch(matchData)
    // First player to join asks first (alternating)
    setIsMyTurnToAsk(true)
  }, [matchData, initMatch])

  // Timer for answering questions
  useEffect(() => {
    if (matchState.status === 'playing' && matchState.currentQuestion && !selectedAnswer) {
      timerRef.current = setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) {
            // Time's up - auto-submit wrong
            handleTimeUp()
            return 30
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [matchState.currentQuestion, selectedAnswer, matchState.status])

  // Handle game end
  useEffect(() => {
    if (gameEnded) {
      onGameEnd?.({
        won: gameEnded.youWon,
        score: gameEnded.yourScore
      })
    }
  }, [gameEnded, onGameEnd])

  const handleTimeUp = useCallback(() => {
    if (matchState.currentQuestion && !selectedAnswer) {
      // Auto-submit incorrect answer
      submitAnswer('', false, 0)
      setAnswerResult({ isCorrect: false, correctAnswer: matchState.currentQuestion.correctAnswer || '' })
      setTimeout(() => {
        setAnswerResult(null)
        setSelectedAnswer(null)
        nextRound()
      }, 2000)
    }
  }, [matchState.currentQuestion, selectedAnswer, submitAnswer, nextRound])

  const handleReady = () => {
    setPlayerReadyState(true)
    playerReady()
  }

  const handleAnswerSelect = (answer: string) => {
    if (!matchState.currentQuestion || selectedAnswer) return

    setSelectedAnswer(answer)
    const isCorrect = answer === matchState.currentQuestion.correctAnswer
    const points = isCorrect ? 15 : 0

    submitAnswer(answer, isCorrect, points)
    setAnswerResult({ isCorrect, correctAnswer: matchState.currentQuestion.correctAnswer || '' })

    // After showing result, move to next round
    setTimeout(() => {
      setAnswerResult(null)
      setSelectedAnswer(null)
      setTimer(30)
      
      if (matchState.currentRound < TOTAL_ROUNDS) {
        nextRound()
        // Alternate turns
        setIsMyTurnToAsk(!isMyTurnToAsk)
      } else {
        endGame()
      }
    }, 2000)
  }

  const handleCreateQuestion = (question: Question) => {
    sendQuestion({
      id: question.id,
      text: question.text,
      options: question.options,
      correctAnswer: question.correctAnswer
    })
    setShowQuestionCreator(false)
    setIsMyTurnToAsk(false)
  }

  // ===============================
  // RENDER STATES
  // ===============================

  // Waiting for players
  if (matchState.status === 'waiting') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 max-w-md w-full text-center"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Swords className="w-10 h-10 text-white" />
          </div>
          
          <h2 className="text-2xl font-bold text-white mb-2">Match Found!</h2>
          <p className="text-gray-400 mb-6">Get ready to spar</p>

          <div className="flex items-center justify-center gap-4 mb-8">
            {/* Player 1 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mb-2">
                <span className="text-xl font-bold text-white">
                  {currentPlayer.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <p className="text-white font-medium">{currentPlayer.name}</p>
              <p className="text-xs text-gray-400">KR: {currentPlayer.knowledgeRating}</p>
            </div>

            <span className="text-2xl font-bold text-purple-400">VS</span>

            {/* Player 2 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center mb-2">
                <span className="text-xl font-bold text-white">
                  {matchState.opponent?.name?.charAt(0).toUpperCase() || '?'}
                </span>
              </div>
              <p className="text-white font-medium">{matchState.opponent?.name || 'Opponent'}</p>
              <p className="text-xs text-gray-400">KR: {matchState.opponent?.knowledgeRating || '???'}</p>
            </div>
          </div>

          {/* Ready Status */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center justify-between bg-white/5 rounded-lg p-3">
              <span className="text-gray-300">{currentPlayer.name}</span>
              {playerReadyState ? (
                <span className="flex items-center gap-1 text-green-400">
                  <CheckCircle className="w-4 h-4" /> Ready
                </span>
              ) : (
                <button
                  onClick={handleReady}
                  className="px-4 py-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-white text-sm font-medium hover:opacity-90"
                >
                  Ready
                </button>
              )}
            </div>
            <div className="flex items-center justify-between bg-white/5 rounded-lg p-3">
              <span className="text-gray-300">{matchState.opponent?.name}</span>
              {opponentReady ? (
                <span className="flex items-center gap-1 text-green-400">
                  <CheckCircle className="w-4 h-4" /> Ready
                </span>
              ) : (
                <span className="text-yellow-400">Waiting...</span>
              )}
            </div>
          </div>

          {opponentDisconnected && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-4">
              <p className="text-red-300 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Opponent disconnected
              </p>
            </div>
          )}
        </motion.div>
      </div>
    )
  }

  // Game ended
  if (matchState.status === 'ended' || gameEnded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 max-w-md w-full text-center"
        >
          <div className={`w-24 h-24 ${gameEnded?.youWon ? 'bg-gradient-to-br from-yellow-400 to-orange-500' : 'bg-gradient-to-br from-gray-500 to-gray-600'} rounded-full flex items-center justify-center mx-auto mb-6`}>
            <Trophy className={`w-12 h-12 ${gameEnded?.youWon ? 'text-white' : 'text-gray-300'}`} />
          </div>
          
          <h2 className="text-3xl font-bold text-white mb-2">
            {gameEnded?.youWon ? 'Victory!' : gameEnded?.yourScore === gameEnded?.opponentScore ? 'Draw!' : 'Defeat'}
          </h2>
          
          <p className="text-gray-400 mb-6">
            {gameEnded?.youWon ? 'Excellent performance!' : 'Better luck next time!'}
          </p>

          {/* Scores */}
          <div className="flex items-center justify-center gap-8 mb-8">
            <div className="text-center">
              <p className="text-4xl font-bold text-white">{gameEnded?.yourScore || 0}</p>
              <p className="text-sm text-gray-400">{currentPlayer.name}</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-white">{gameEnded?.opponentScore || 0}</p>
              <p className="text-sm text-gray-400">{matchState.opponent?.name}</p>
            </div>
          </div>

          {/* Rematch */}
          {rematchRequested ? (
            <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-4 mb-4">
              <p className="text-yellow-300 mb-3">Opponent wants a rematch!</p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => requestRematch()}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600"
                >
                  Accept
                </button>
                <button
                  onClick={() => declineRematch(matchData.matchId)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700"
                >
                  Decline
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => requestRematch()}
              className="flex items-center justify-center gap-2 w-full py-3 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 mb-3"
            >
              <RotateCcw className="w-5 h-5" />
              Request Rematch
            </button>
          )}

          <button
            onClick={onLeave}
            className="w-full py-3 bg-white/10 text-white rounded-xl font-medium hover:bg-white/20"
          >
            Leave Match
          </button>
        </motion.div>
      </div>
    )
  }

  // Active game
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-black/30 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Player 1 */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                <span className="font-bold text-white">{currentPlayer.name.charAt(0)}</span>
              </div>
              <div>
                <p className="text-white font-medium">{currentPlayer.name}</p>
                <p className="text-2xl font-bold text-blue-400">{matchState.yourScore}</p>
              </div>
            </div>

            {/* Round Info */}
            <div className="text-center">
              <p className="text-xs text-gray-400 uppercase tracking-wider">Round</p>
              <p className="text-2xl font-bold text-white">{matchState.currentRound}/{TOTAL_ROUNDS}</p>
            </div>

            {/* Player 2 */}
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-white font-medium">{matchState.opponent?.name}</p>
                <p className="text-2xl font-bold text-red-400">{matchState.opponentScore}</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center">
                <span className="font-bold text-white">{matchState.opponent?.name?.charAt(0) || '?'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Game Area */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Spectator Count */}
        {matchState.spectatorCount > 0 && (
          <div className="flex items-center justify-center gap-2 text-gray-400 mb-4">
            <Eye className="w-4 h-4" />
            <span>{matchState.spectatorCount} watching</span>
          </div>
        )}

        {/* Question Creator (when it's your turn to ask) */}
        {isMyTurnToAsk && !matchState.currentQuestion && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/10 backdrop-blur-xl rounded-2xl p-6"
          >
            <h3 className="text-xl font-bold text-white mb-4">Create a Question</h3>
            <QuestionCreator 
              subject={matchData.subject}
              difficulty={matchData.difficulty}
              onSubmit={handleCreateQuestion}
              onCancel={() => setIsMyTurnToAsk(false)}
            />
          </motion.div>
        )}

        {/* Waiting for opponent's question */}
        {!isMyTurnToAsk && !matchState.currentQuestion && (
          <div className="text-center py-12">
            <div className="animate-pulse">
              <div className="w-16 h-16 bg-purple-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Swords className="w-8 h-8 text-purple-400" />
              </div>
            </div>
            <p className="text-gray-400">Waiting for {matchState.opponent?.name}'s question...</p>
          </div>
        )}

        {/* Question Display */}
        {matchState.currentQuestion && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/10 backdrop-blur-xl rounded-2xl p-6"
          >
            {/* Timer */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Clock className={`w-5 h-5 ${timer <= 10 ? 'text-red-400' : 'text-gray-400'}`} />
                <span className={`text-xl font-bold ${timer <= 10 ? 'text-red-400' : 'text-white'}`}>
                  {timer}s
                </span>
              </div>
              <span className="text-sm text-gray-400 capitalize">{matchData.subject}</span>
            </div>

            {/* Question */}
            <h3 className="text-xl font-medium text-white mb-6">
              {matchState.currentQuestion.text}
            </h3>

            {/* Options */}
            <div className="grid grid-cols-2 gap-3">
              {matchState.currentQuestion.options.map((option, index) => {
                const isSelected = selectedAnswer === option
                const isCorrect = answerResult && option === answerResult.correctAnswer
                const isWrong = answerResult && isSelected && !answerResult.isCorrect

                return (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(option)}
                    disabled={!!selectedAnswer}
                    className={`p-4 rounded-xl text-left transition-all ${
                      isCorrect 
                        ? 'bg-green-500/30 border-2 border-green-500' 
                        : isWrong 
                          ? 'bg-red-500/30 border-2 border-red-500'
                          : isSelected 
                            ? 'bg-purple-500/30 border-2 border-purple-500'
                            : 'bg-white/5 border-2 border-white/10 hover:border-white/30'
                    } ${!selectedAnswer ? 'cursor-pointer' : 'cursor-default'}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white font-medium">
                        {String.fromCharCode(65 + index)}
                      </span>
                      <span className="text-white">{option}</span>
                      {isCorrect && <CheckCircle className="w-5 h-5 text-green-400 ml-auto" />}
                      {isWrong && <XCircle className="w-5 h-5 text-red-400 ml-auto" />}
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Answer Result */}
            {answerResult && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-4 p-4 rounded-xl ${answerResult.isCorrect ? 'bg-green-500/20' : 'bg-red-500/20'}`}
              >
                <p className={answerResult.isCorrect ? 'text-green-400' : 'text-red-400'}>
                  {answerResult.isCorrect ? '✓ Correct! +15 points' : `✗ Wrong! The answer was: ${answerResult.correctAnswer}`}
                </p>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Disconnection Warning */}
        {opponentDisconnected && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-yellow-500/20 border border-yellow-500/50 rounded-xl p-4 mt-4"
          >
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-yellow-400" />
              <div>
                <p className="text-yellow-300 font-medium">Opponent Disconnected</p>
                <p className="text-yellow-400/70 text-sm">They have 30 seconds to reconnect</p>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Chat Toggle */}
      <button
        onClick={() => setChatOpen(!chatOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-purple-600 rounded-full flex items-center justify-center shadow-lg hover:bg-purple-700 transition-colors"
      >
        <MessageCircle className="w-6 h-6 text-white" />
      </button>

      {/* Chat Panel */}
      <AnimatePresence>
        {chatOpen && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="fixed right-0 top-0 h-full w-80 bg-slate-900/95 backdrop-blur-lg border-l border-white/10 p-4"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-bold">Chat</h3>
              <button onClick={() => setChatOpen(false)} className="text-gray-400 hover:text-white">
                ✕
              </button>
            </div>
            <div className="h-[calc(100%-60px)] overflow-y-auto">
              {chatMessages.length === 0 ? (
                <p className="text-gray-500 text-sm text-center">No messages yet</p>
              ) : (
                chatMessages.map((msg, i) => (
                  <div key={i} className={`mb-2 ${msg.from === currentPlayer.name ? 'text-right' : 'text-left'}`}>
                    <span className={`inline-block px-3 py-1 rounded-lg ${msg.from === currentPlayer.name ? 'bg-purple-600' : 'bg-gray-700'} text-white text-sm`}>
                      {msg.text}
                    </span>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ===============================
// QUESTION CREATOR SUB-COMPONENT
// ===============================

function QuestionCreator({ 
  subject, 
  difficulty, 
  onSubmit, 
  onCancel 
}: { 
  subject: string
  difficulty: string
  onSubmit: (q: Question) => void
  onCancel: () => void 
}) {
  const [question, setQuestion] = useState('')
  const [options, setOptions] = useState(['', '', '', ''])
  const [correctIndex, setCorrectIndex] = useState(0)

  const handleSubmit = () => {
    if (!question.trim() || options.some(o => !o.trim())) return

    onSubmit({
      id: `q-${Date.now()}`,
      text: question,
      options,
      correctAnswer: options[correctIndex],
      subject,
      difficulty
    })
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm text-gray-400 mb-1">Question</label>
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Enter your question..."
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
        />
      </div>

      <div>
        <label className="block text-sm text-gray-400 mb-2">Options (select correct answer)</label>
        <div className="space-y-2">
          {options.map((opt, i) => (
            <div key={i} className="flex items-center gap-2">
              <button
                onClick={() => setCorrectIndex(i)}
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${correctIndex === i ? 'border-green-500 bg-green-500/20' : 'border-white/30'}`}
              >
                {correctIndex === i && <div className="w-3 h-3 bg-green-500 rounded-full" />}
              </button>
              <input
                type="text"
                value={opt}
                onChange={(e) => {
                  const newOpts = [...options]
                  newOpts[i] = e.target.value
                  setOptions(newOpts)
                }}
                placeholder={`Option ${String.fromCharCode(65 + i)}`}
                className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          onClick={onCancel}
          className="flex-1 py-3 bg-gray-600 text-white rounded-xl font-medium hover:bg-gray-700"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={!question.trim() || options.some(o => !o.trim())}
          className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:opacity-90 disabled:opacity-50"
        >
          Send Question
        </button>
      </div>
    </div>
  )
}
