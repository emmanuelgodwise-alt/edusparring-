/**
 * Friend Challenge Modal Component
 * 
 * Modal for challenging friends to matches and handling incoming challenges
 */

'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Swords, Clock, Check, AlertCircle, Loader2 } from 'lucide-react'
import { useFriendChallenge } from '@/hooks/useMultiplayer'

// ===============================
// TYPES
// ===============================

interface Friend {
  id: string
  name: string
  avatar?: string
  knowledgeRating: number
  status: 'online' | 'offline' | 'in-match'
}

interface FriendChallengeModalProps {
  isOpen: boolean
  onClose: () => void
  userId: string
  userName: string
  friends: Friend[]
  onChallengeAccepted?: (matchId: string) => void
}

// ===============================
// INCOMING CHALLENGE MODAL
// ===============================

interface IncomingChallengeProps {
  challenge: {
    challengeId: string
    from: { id: string; name: string }
    subject: string
    difficulty: string
  }
  onAccept: () => void
  onDecline: () => void
}

export function IncomingChallengeModal({ challenge, onAccept, onDecline }: IncomingChallengeProps) {
  const [timeLeft, setTimeLeft] = useState(30)

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          onDecline()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [onDecline])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
    >
      <div className="bg-gradient-to-br from-purple-900 to-slate-900 rounded-2xl p-6 max-w-sm w-full border border-purple-500/30">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Swords className="w-5 h-5 text-purple-400" />
            Challenge Request
          </h2>
          <div className="flex items-center gap-1 text-yellow-400">
            <Clock className="w-4 h-4" />
            <span className="text-sm font-medium">{timeLeft}s</span>
          </div>
        </div>

        {/* Challenger Info */}
        <div className="bg-white/5 rounded-xl p-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center">
              <span className="text-xl font-bold text-white">
                {challenge.from.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <p className="text-white font-medium">{challenge.from.name}</p>
              <p className="text-sm text-gray-400">wants to challenge you!</p>
            </div>
          </div>
        </div>

        {/* Match Details */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-white/5 rounded-lg p-3">
            <p className="text-xs text-gray-400 uppercase">Subject</p>
            <p className="text-white font-medium capitalize">{challenge.subject}</p>
          </div>
          <div className="bg-white/5 rounded-lg p-3">
            <p className="text-xs text-gray-400 uppercase">Difficulty</p>
            <p className="text-white font-medium capitalize">{challenge.difficulty}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onDecline}
            className="flex-1 py-3 bg-gray-600 text-white rounded-xl font-medium hover:bg-gray-700"
          >
            Decline
          </button>
          <button
            onClick={onAccept}
            className="flex-1 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-medium hover:opacity-90"
          >
            Accept
          </button>
        </div>
      </div>
    </motion.div>
  )
}

// ===============================
// CHALLENGE FRIEND MODAL
// ===============================

export default function FriendChallengeModal({ 
  isOpen, 
  onClose, 
  userId, 
  userName,
  friends,
  onChallengeAccepted 
}: FriendChallengeModalProps) {
  const { pendingChallenge, challengeSent, challengeError, sendChallenge, acceptChallenge, declineChallenge, clearChallenge } = useFriendChallenge(userId)
  
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null)
  const [selectedSubject, setSelectedSubject] = useState('mathematics')
  const [selectedDifficulty, setSelectedDifficulty] = useState('medium')

  const subjects = ['mathematics', 'science', 'history', 'geography', 'literature', 'physics', 'chemistry', 'biology']
  const difficulties = ['easy', 'medium', 'hard', 'expert']

  const onlineFriends = friends.filter(f => f.status === 'online')

  const handleSendChallenge = () => {
    if (!selectedFriend) return
    
    sendChallenge(
      selectedFriend.id,
      userName,
      selectedSubject,
      selectedDifficulty
    )
  }

  const handleAcceptChallenge = () => {
    if (pendingChallenge) {
      acceptChallenge(pendingChallenge.challengeId)
      onChallengeAccepted?.(pendingChallenge.challengeId)
    }
  }

  const handleDeclineChallenge = () => {
    if (pendingChallenge) {
      declineChallenge(pendingChallenge.challengeId)
    }
  }

  // Show incoming challenge
  if (pendingChallenge && !challengeSent) {
    return (
      <IncomingChallengeModal
        challenge={pendingChallenge}
        onAccept={handleAcceptChallenge}
        onDecline={handleDeclineChallenge}
      />
    )
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-gradient-to-br from-slate-900 to-purple-900 rounded-2xl p-6 max-w-md w-full border border-purple-500/30"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Swords className="w-5 h-5 text-purple-400" />
                Challenge a Friend
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Challenge Sent State */}
            {challengeSent ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Loader2 className="w-8 h-8 text-yellow-400 animate-spin" />
                </div>
                <p className="text-white font-medium mb-2">Challenge Sent!</p>
                <p className="text-gray-400 text-sm">Waiting for {selectedFriend?.name}'s response...</p>
                
                {challengeError && (
                  <div className="mt-4 bg-red-500/20 text-red-400 rounded-lg p-3 text-sm">
                    {challengeError}
                  </div>
                )}
                
                <button
                  onClick={() => {
                    clearChallenge()
                    setSelectedFriend(null)
                  }}
                  className="mt-4 px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <>
                {/* Friend Selection */}
                <div className="mb-4">
                  <label className="block text-sm text-gray-400 mb-2">Select Friend</label>
                  {onlineFriends.length === 0 ? (
                    <div className="bg-white/5 rounded-xl p-4 text-center">
                      <p className="text-gray-400">No friends online</p>
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {onlineFriends.map(friend => (
                        <button
                          key={friend.id}
                          onClick={() => setSelectedFriend(friend)}
                          className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                            selectedFriend?.id === friend.id 
                              ? 'bg-purple-500/30 border border-purple-500' 
                              : 'bg-white/5 border border-transparent hover:bg-white/10'
                          }`}
                        >
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                            <span className="font-bold text-white">{friend.name.charAt(0)}</span>
                          </div>
                          <div className="text-left">
                            <p className="text-white font-medium">{friend.name}</p>
                            <p className="text-xs text-gray-400">KR: {friend.knowledgeRating}</p>
                          </div>
                          <div className="ml-auto flex items-center gap-1">
                            <div className="w-2 h-2 bg-green-500 rounded-full" />
                            <span className="text-xs text-green-400">Online</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Subject Selection */}
                <div className="mb-4">
                  <label className="block text-sm text-gray-400 mb-2">Subject</label>
                  <select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white capitalize focus:outline-none focus:border-purple-500"
                  >
                    {subjects.map(subject => (
                      <option key={subject} value={subject} className="bg-slate-800 capitalize">
                        {subject}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Difficulty Selection */}
                <div className="mb-6">
                  <label className="block text-sm text-gray-400 mb-2">Difficulty</label>
                  <div className="grid grid-cols-4 gap-2">
                    {difficulties.map(diff => (
                      <button
                        key={diff}
                        onClick={() => setSelectedDifficulty(diff)}
                        className={`py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                          selectedDifficulty === diff 
                            ? 'bg-purple-500 text-white' 
                            : 'bg-white/5 text-gray-400 hover:bg-white/10'
                        }`}
                      >
                        {diff}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Error */}
                {challengeError && (
                  <div className="mb-4 bg-red-500/20 text-red-400 rounded-lg p-3 text-sm flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    {challengeError}
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={onClose}
                    className="flex-1 py-3 bg-gray-600 text-white rounded-xl font-medium hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSendChallenge}
                    disabled={!selectedFriend}
                    className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:opacity-90 disabled:opacity-50"
                  >
                    Send Challenge
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
