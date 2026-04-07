'use client'

import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  Heart, MessageCircle, Share2, Trophy, Target, 
  TrendingUp, Users, Loader2, ChevronDown, ChevronUp, Send
} from 'lucide-react'
import { RARITY_COLORS } from '@/lib/achievements'

interface ActivityUser {
  id: string
  name: string
  avatar?: string
  knowledgeRating: number
}

interface ActivityComment {
  id: string
  userId: string
  content: string
  createdAt: Date | string
  user: {
    id: string
    name: string
    avatar?: string
  }
}

interface Activity {
  id: string
  userId: string
  type: string
  content: string
  matchId?: string | null
  visibility: string
  likesCount: number
  commentsCount: number
  createdAt: Date | string
  user: ActivityUser
  likes: Array<{ userId: string }>
  comments: ActivityComment[]
  isLiked?: boolean
}

interface ActivityFeedProps {
  userId: string
  type?: 'friends' | 'all' | 'user'
  targetUserId?: string
  className?: string
}

export function ActivityFeed({ userId, type = 'friends', targetUserId, className }: ActivityFeedProps) {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set())
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({})
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  useEffect(() => {
    fetchActivities()
  }, [userId, type, targetUserId])

  const fetchActivities = async (offset = 0) => {
    if (offset === 0) setLoading(true)
    else setLoadingMore(true)

    try {
      const params = new URLSearchParams({
        userId,
        type,
        limit: '20',
        offset: offset.toString()
      })
      
      if (targetUserId) {
        params.set('targetUserId', targetUserId)
      }

      const response = await fetch(`/api/social/feed?${params}`)
      const data = await response.json()
      
      if (offset === 0) {
        setActivities(data.activities || [])
      } else {
        setActivities(prev => [...prev, ...(data.activities || [])])
      }
      
      setHasMore((data.activities || []).length === 20)
    } catch (error) {
      console.error('Error fetching activities:', error)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  const handleLike = async (activityId: string) => {
    try {
      const response = await fetch('/api/social/feed', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'like',
          activityId,
          userId
        })
      })
      
      const data = await response.json()
      
      setActivities(prev => prev.map(a => {
        if (a.id === activityId) {
          return {
            ...a,
            isLiked: data.liked,
            likesCount: data.liked ? a.likesCount + 1 : a.likesCount - 1,
            likes: data.liked 
              ? [...a.likes, { userId }]
              : a.likes.filter(l => l.userId !== userId)
          }
        }
        return a
      }))
    } catch (error) {
      console.error('Error toggling like:', error)
    }
  }

  const handleComment = async (activityId: string) => {
    const content = commentInputs[activityId]
    if (!content?.trim()) return

    try {
      const response = await fetch('/api/social/feed', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'comment',
          activityId,
          userId,
          content
        })
      })
      
      const data = await response.json()
      
      if (data.success && data.comment) {
        setActivities(prev => prev.map(a => {
          if (a.id === activityId) {
            return {
              ...a,
              comments: [...a.comments, data.comment],
              commentsCount: a.commentsCount + 1
            }
          }
          return a
        }))
        setCommentInputs(prev => ({ ...prev, [activityId]: '' }))
      }
    } catch (error) {
      console.error('Error adding comment:', error)
    }
  }

  const toggleComments = (activityId: string) => {
    setExpandedComments(prev => {
      const next = new Set(prev)
      if (next.has(activityId)) {
        next.delete(activityId)
      } else {
        next.add(activityId)
      }
      return next
    })
  }

  // Parse activity content
  const parseContent = (activity: Activity) => {
    try {
      return JSON.parse(activity.content)
    } catch {
      return {}
    }
  }

  // Get activity icon and color
  const getActivityStyle = (type: string) => {
    switch (type) {
      case 'match_result':
        return { icon: Trophy, color: 'text-amber-400', bg: 'bg-amber-500/20' }
      case 'achievement_earned':
        return { icon: Target, color: 'text-purple-400', bg: 'bg-purple-500/20' }
      case 'leaderboard_change':
        return { icon: TrendingUp, color: 'text-cyan-400', bg: 'bg-cyan-500/20' }
      case 'friend_activity':
        return { icon: Users, color: 'text-green-400', bg: 'bg-green-500/20' }
      default:
        return { icon: Trophy, color: 'text-slate-400', bg: 'bg-slate-500/20' }
    }
  }

  // Format time
  const formatTime = (date: Date | string) => {
    const d = new Date(date)
    const now = new Date()
    const diff = now.getTime() - d.getTime()
    
    if (diff < 60000) return 'Just now'
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`
    if (diff < 604800000) return `${Math.floor(diff / 86400000)}d ago`
    return d.toLocaleDateString([], { month: 'short', day: 'numeric' })
  }

  // Render activity card
  const renderActivityContent = (activity: Activity) => {
    const content = parseContent(activity)
    
    switch (activity.type) {
      case 'match_result':
        return (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400" />
              <span className="font-semibold text-white">
                {content.won ? 'Victory!' : content.isDraw ? 'Draw' : 'Defeat'}
              </span>
            </div>
            <p className="text-slate-300">
              {content.won ? 'Won' : 'Lost'} against <span className="text-white font-medium">{content.opponentName}</span>
            </p>
            <div className="flex items-center gap-4 text-sm">
              <span className={cn(
                'font-bold',
                content.won ? 'text-green-400' : 'text-red-400'
              )}>
                {content.playerScore} - {content.opponentScore}
              </span>
              <Badge variant="secondary" className="bg-slate-700 text-slate-300">
                {content.subject}
              </Badge>
              {content.krChange && (
                <span className={cn(
                  content.krChange > 0 ? 'text-green-400' : 'text-red-400'
                )}>
                  KR {content.krChange > 0 ? '+' : ''}{content.krChange}
                </span>
              )}
            </div>
          </div>
        )
        
      case 'achievement_earned':
        const rarityColors = RARITY_COLORS[content.rarity as keyof typeof RARITY_COLORS] || RARITY_COLORS.common
        return (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{content.achievementIcon}</span>
              <div>
                <p className="font-semibold text-white">Achievement Unlocked!</p>
                <p className={cn('font-medium', rarityColors.text)}>{content.achievementName}</p>
              </div>
            </div>
            <Badge className={cn(rarityColors.bg, rarityColors.text, rarityColors.border, 'border')}>
              {content.rarity?.toUpperCase()}
            </Badge>
          </div>
        )
        
      case 'leaderboard_change':
        return (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-cyan-400" />
              <span className="font-semibold text-white">Leaderboard Update</span>
            </div>
            <p className="text-slate-300">
              {content.direction === 'up' ? 'Moved up' : 'Moved down'} to rank <span className="text-white font-bold">#{content.newRank}</span>
              {content.category && <span className="text-slate-400"> in {content.category}</span>}
            </p>
          </div>
        )
        
      default:
        return (
          <p className="text-slate-300">{content.message || 'Shared an activity'}</p>
        )
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <Loader2 className="w-6 h-6 animate-spin text-purple-500" />
      </div>
    )
  }

  return (
    <div className={cn('space-y-4', className)}>
      {activities.length === 0 ? (
        <div className="text-center py-8 text-slate-400">
          <Trophy className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>No activities yet</p>
          <p className="text-sm mt-1">Activities from friends will appear here</p>
        </div>
      ) : (
        <>
          {activities.map((activity) => {
            const style = getActivityStyle(activity.type)
            const Icon = style.icon
            
            return (
              <div
                key={activity.id}
                className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden"
              >
                {/* Header */}
                <div className="flex items-center gap-3 p-4 pb-2">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={activity.user.avatar} />
                    <AvatarFallback className="bg-purple-600">
                      {activity.user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-white">{activity.user.name}</span>
                      <div className={cn('w-6 h-6 rounded-full flex items-center justify-center', style.bg)}>
                        <Icon className={cn('w-3 h-3', style.color)} />
                      </div>
                    </div>
                    <span className="text-xs text-slate-400">{formatTime(activity.createdAt)}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="px-4 pb-3">
                  {renderActivityContent(activity)}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4 px-4 py-2 border-t border-slate-700/50">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      'gap-1 text-slate-400 hover:text-red-400',
                      activity.isLiked && 'text-red-400'
                    )}
                    onClick={() => handleLike(activity.id)}
                  >
                    <Heart className={cn('w-4 h-4', activity.isLiked && 'fill-current')} />
                    <span>{activity.likesCount || 0}</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1 text-slate-400 hover:text-cyan-400"
                    onClick={() => toggleComments(activity.id)}
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>{activity.commentsCount || 0}</span>
                    {expandedComments.has(activity.id) ? (
                      <ChevronUp className="w-3 h-3" />
                    ) : (
                      <ChevronDown className="w-3 h-3" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1 text-slate-400 hover:text-purple-400"
                  >
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>

                {/* Comments */}
                {expandedComments.has(activity.id) && (
                  <div className="border-t border-slate-700/50 p-4 space-y-3">
                    {activity.comments.length > 0 && (
                      <div className="space-y-2">
                        {activity.comments.map((comment) => (
                          <div key={comment.id} className="flex gap-2">
                            <Avatar className="w-6 h-6">
                              <AvatarImage src={comment.user.avatar} />
                              <AvatarFallback className="bg-slate-600 text-xs">
                                {comment.user.name.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 bg-slate-700/50 rounded-lg px-3 py-1">
                              <span className="text-sm font-medium text-white">{comment.user.name}</span>
                              <p className="text-sm text-slate-300">{comment.content}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {/* Add comment */}
                    <div className="flex gap-2">
                      <Input
                        placeholder="Write a comment..."
                        value={commentInputs[activity.id] || ''}
                        onChange={(e) => setCommentInputs(prev => ({ ...prev, [activity.id]: e.target.value }))}
                        className="flex-1 bg-slate-700 border-slate-600 h-8 text-sm"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault()
                            handleComment(activity.id)
                          }
                        }}
                      />
                      <Button
                        size="sm"
                        className="h-8 bg-purple-600 hover:bg-purple-700"
                        onClick={() => handleComment(activity.id)}
                        disabled={!commentInputs[activity.id]?.trim()}
                      >
                        <Send className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )
          })}

          {/* Load more */}
          {hasMore && (
            <div className="flex justify-center py-4">
              <Button
                variant="outline"
                className="border-slate-600 text-slate-300"
                onClick={() => fetchActivities(activities.length)}
                disabled={loadingMore}
              >
                {loadingMore ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : null}
                Load More
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
