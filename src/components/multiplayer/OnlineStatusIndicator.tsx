/**
 * Online Status Indicator Component
 * 
 * Shows online/offline status with activity indicator
 */

'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Crown, Gamepad2, Users, MessageCircle, Search } from 'lucide-react'

// ===============================
// TYPES
// ===============================

interface OnlineStatusProps {
  status: 'online' | 'offline' | 'away'
  currentActivity?: string
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
}

// ===============================
// MAIN COMPONENT
// ===============================

export default function OnlineStatusIndicator({ 
  status, 
  currentActivity,
  size = 'md',
  showLabel = true 
}: OnlineStatusProps) {
  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4'
  }

  const statusColors = {
    online: 'bg-green-500',
    offline: 'bg-gray-500',
    away: 'bg-yellow-500'
  }

  const getActivityIcon = () => {
    switch (currentActivity) {
      case 'in-match':
        return <Gamepad2 className="w-3 h-3 text-green-400" />
      case 'matchmaking':
        return <Search className="w-3 h-3 text-yellow-400" />
      case 'browsing':
        return <Users className="w-3 h-3 text-blue-400" />
      case 'chatting':
        return <MessageCircle className="w-3 h-3 text-purple-400" />
      case 'spectating':
        return <Crown className="w-3 h-3 text-orange-400" />
      default:
        return null
    }
  }

  const getActivityLabel = () => {
    switch (currentActivity) {
      case 'in-match':
        return 'In Match'
      case 'matchmaking':
        return 'Finding Match'
      case 'browsing':
        return 'Online'
      case 'chatting':
        return 'Chatting'
      case 'spectating':
        return 'Spectating'
      default:
        return status === 'online' ? 'Online' : status === 'away' ? 'Away' : 'Offline'
    }
  }

  return (
    <div className="flex items-center gap-1.5">
      {/* Status Dot */}
      <div className="relative">
        <div className={`${sizeClasses[size]} ${statusColors[status]} rounded-full`}>
          {status === 'online' && (
            <motion.div
              className={`absolute inset-0 ${statusColors[status]} rounded-full`}
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          )}
        </div>
        
        {/* Activity Icon */}
        {currentActivity && getActivityIcon() && (
          <div className="absolute -bottom-1 -right-1 bg-slate-800 rounded-full p-0.5">
            {getActivityIcon()}
          </div>
        )}
      </div>

      {/* Label */}
      {showLabel && (
        <span className={`text-xs ${
          status === 'online' ? 'text-green-400' : 
          status === 'away' ? 'text-yellow-400' : 
          'text-gray-500'
        }`}>
          {getActivityLabel()}
        </span>
      )}
    </div>
  )
}

// ===============================
// FRIEND STATUS BADGE
// ===============================

interface FriendStatusBadgeProps {
  name: string
  avatar?: string
  knowledgeRating: number
  status: 'online' | 'offline' | 'away'
  currentActivity?: string
  onClick?: () => void
  showChallenge?: boolean
  onChallenge?: () => void
}

export function FriendStatusBadge({ 
  name, 
  avatar, 
  knowledgeRating, 
  status,
  currentActivity,
  onClick,
  showChallenge = true,
  onChallenge
}: FriendStatusBadgeProps) {
  const isOnline = status === 'online'
  const isInMatch = currentActivity === 'in-match'

  return (
    <div 
      className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
        onClick ? 'cursor-pointer hover:bg-white/10' : ''
      } ${!isOnline ? 'opacity-60' : ''}`}
      onClick={onClick}
    >
      {/* Avatar */}
      <div className="relative">
        <div className={`w-10 h-10 bg-gradient-to-br ${
          isOnline ? 'from-blue-500 to-cyan-500' : 'from-gray-500 to-gray-600'
        } rounded-full flex items-center justify-center`}>
          {avatar ? (
            <img src={avatar} alt={name} className="w-full h-full rounded-full object-cover" />
          ) : (
            <span className="font-bold text-white">{name.charAt(0).toUpperCase()}</span>
          )}
        </div>
        
        {/* Status Indicator */}
        <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-slate-900 ${
          isOnline ? 'bg-green-500' : 'bg-gray-500'
        }`}>
          {isOnline && (
            <motion.div
              className="absolute inset-0 bg-green-500 rounded-full"
              animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          )}
        </div>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-white font-medium truncate">{name}</p>
        <p className="text-xs text-gray-400">KR: {knowledgeRating}</p>
      </div>

      {/* Status & Action */}
      <div className="flex items-center gap-2">
        <OnlineStatusIndicator 
          status={status} 
          currentActivity={currentActivity}
          size="sm"
          showLabel={false}
        />
        
        {showChallenge && isOnline && !isInMatch && onChallenge && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onChallenge()
            }}
            className="px-3 py-1 bg-purple-500/20 text-purple-400 text-xs font-medium rounded-lg hover:bg-purple-500/30"
          >
            Challenge
          </button>
        )}
      </div>
    </div>
  )
}

// ===============================
// ONLINE FRIENDS LIST
// ===============================

interface OnlineFriendsListProps {
  friends: {
    id: string
    name: string
    avatar?: string
    knowledgeRating: number
    status: 'online' | 'offline' | 'away'
    currentActivity?: string
  }[]
  onFriendClick?: (friendId: string) => void
  onChallenge?: (friendId: string) => void
  maxVisible?: number
}

export function OnlineFriendsList({ 
  friends, 
  onFriendClick, 
  onChallenge,
  maxVisible = 5 
}: OnlineFriendsListProps) {
  const onlineFriends = friends.filter(f => f.status === 'online').slice(0, maxVisible)
  const offlineCount = friends.filter(f => f.status !== 'online').length

  return (
    <div className="bg-white/5 rounded-xl p-3">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-white">Online Friends</h3>
        <span className="text-xs text-green-400">{onlineFriends.length} online</span>
      </div>

      {onlineFriends.length === 0 ? (
        <div className="text-center py-4">
          <Users className="w-8 h-8 text-gray-500 mx-auto mb-2" />
          <p className="text-sm text-gray-400">No friends online</p>
        </div>
      ) : (
        <>
          <div className="space-y-1">
            {onlineFriends.map(friend => (
              <FriendStatusBadge
                key={friend.id}
                name={friend.name}
                avatar={friend.avatar}
                knowledgeRating={friend.knowledgeRating}
                status={friend.status}
                currentActivity={friend.currentActivity}
                onClick={() => onFriendClick?.(friend.id)}
                onChallenge={() => onChallenge?.(friend.id)}
              />
            ))}
          </div>

          {offlineCount > 0 && (
            <p className="text-xs text-gray-500 mt-3 text-center">
              +{offlineCount} offline
            </p>
          )}
        </>
      )}
    </div>
  )
}
