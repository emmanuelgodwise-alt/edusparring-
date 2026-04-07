'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  Search, UserPlus, MessageCircle, Gamepad2, 
  MoreVertical, UserX, Check, X, Clock, Loader2
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface Friend {
  id: string
  name: string
  avatar?: string
  knowledgeRating: number
  isOnline: boolean
  currentActivity?: string | null
  achievements: Array<{ id: string; name: string; icon: string }>
  friendshipId: string
  friendsSince: Date
}

interface FriendRequest {
  id: string
  from: {
    id: string
    name: string
    avatar?: string
    knowledgeRating: number
    achievements: Array<{ id: string; name: string; icon: string }>
  }
  createdAt: Date
}

interface SearchResult {
  id: string
  name: string
  email?: string
  avatar?: string
  knowledgeRating: number
  isOnline: boolean
  achievements: Array<{ id: string; name: string; icon: string }>
  friendship?: { id: string; status: string; isRequester: boolean } | null
}

interface FriendListProps {
  userId: string
  onSelectFriend?: (friend: Friend) => void
  onStartChat?: (friendId: string) => void
  showActions?: boolean
  compact?: boolean
}

export function FriendList({ 
  userId, 
  onSelectFriend,
  onStartChat,
  showActions = true,
  compact = false
}: FriendListProps) {
  const router = useRouter()
  const [friends, setFriends] = useState<Friend[]>([])
  const [requests, setRequests] = useState<FriendRequest[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'friends' | 'requests' | 'search'>('friends')

  // Fetch friends and requests
  useEffect(() => {
    fetchFriends()
  }, [userId])

  const fetchFriends = async () => {
    try {
      const response = await fetch(`/api/social/friends?userId=${userId}&type=all`)
      const data = await response.json()
      setFriends(data.friends || [])
      setRequests(data.requests || [])
    } catch (error) {
      console.error('Error fetching friends:', error)
    } finally {
      setLoading(false)
    }
  }

  // Search users
  useEffect(() => {
    if (searchQuery.length < 2) {
      setSearchResults([])
      return
    }

    const searchUsers = async () => {
      setIsSearching(true)
      try {
        const response = await fetch('/api/social/friends', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: searchQuery, userId })
        })
        const data = await response.json()
        setSearchResults(data.users || [])
      } catch (error) {
        console.error('Error searching users:', error)
      } finally {
        setIsSearching(false)
      }
    }

    const debounce = setTimeout(searchUsers, 300)
    return () => clearTimeout(debounce)
  }, [searchQuery, userId])

  // Send friend request
  const sendFriendRequest = async (accepterId: string) => {
    try {
      const response = await fetch('/api/social/friends', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'send',
          requesterId: userId,
          accepterId
        })
      })
      
      if (response.ok) {
        // Update search results
        setSearchResults(prev => 
          prev.map(u => u.id === accepterId 
            ? { ...u, friendship: { id: 'pending', status: 'pending', isRequester: true } }
            : u
          )
        )
      }
    } catch (error) {
      console.error('Error sending friend request:', error)
    }
  }

  // Accept friend request
  const acceptRequest = async (friendshipId: string) => {
    try {
      const response = await fetch('/api/social/friends', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'accept',
          friendshipId,
          requesterId: userId
        })
      })
      
      if (response.ok) {
        const data = await response.json()
        setRequests(prev => prev.filter(r => r.id !== friendshipId))
        if (data.friend) {
          setFriends(prev => [...prev, data.friend])
        }
      }
    } catch (error) {
      console.error('Error accepting request:', error)
    }
  }

  // Decline friend request
  const declineRequest = async (friendshipId: string) => {
    try {
      const response = await fetch('/api/social/friends', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'decline',
          friendshipId
        })
      })
      
      if (response.ok) {
        setRequests(prev => prev.filter(r => r.id !== friendshipId))
      }
    } catch (error) {
      console.error('Error declining request:', error)
    }
  }

  // Remove friend
  const removeFriend = async (friendshipId: string) => {
    try {
      const response = await fetch('/api/social/friends', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'remove',
          friendshipId
        })
      })
      
      if (response.ok) {
        setFriends(prev => prev.filter(f => f.friendshipId !== friendshipId))
      }
    } catch (error) {
      console.error('Error removing friend:', error)
    }
  }

  // Get KR tier
  const getKRTier = (kr: number) => {
    if (kr >= 1800) return { name: 'Elite', color: 'text-amber-400' }
    if (kr >= 1500) return { name: 'Advanced', color: 'text-purple-400' }
    if (kr >= 1200) return { name: 'Intermediate', color: 'text-cyan-400' }
    return { name: 'Beginner', color: 'text-slate-400' }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <Loader2 className="w-6 h-6 animate-spin text-purple-500" />
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Tabs */}
      <div className="flex gap-2 p-4 border-b border-slate-700">
        <Button
          variant={activeTab === 'friends' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('friends')}
          className={cn(activeTab === 'friends' && 'bg-purple-600 hover:bg-purple-700')}
        >
          Friends ({friends.length})
        </Button>
        <Button
          variant={activeTab === 'requests' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('requests')}
          className={cn(activeTab === 'requests' && 'bg-purple-600 hover:bg-purple-700')}
        >
          Requests
          {requests.length > 0 && (
            <Badge className="ml-2 bg-red-500 text-white">{requests.length}</Badge>
          )}
        </Button>
        <Button
          variant={activeTab === 'search' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('search')}
          className={cn(activeTab === 'search' && 'bg-purple-600 hover:bg-purple-700')}
        >
          <Search className="w-4 h-4 mr-1" />
          Find
        </Button>
      </div>

      {/* Search */}
      {activeTab === 'search' && (
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-slate-800 border-slate-700"
            />
            {isSearching && (
              <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-purple-500" />
            )}
          </div>
        </div>
      )}

      {/* Content */}
      <ScrollArea className="flex-1">
        {activeTab === 'friends' && (
          <div className="p-2">
            {friends.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                <UserPlus className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No friends yet</p>
                <Button 
                  variant="link" 
                  className="text-purple-400"
                  onClick={() => setActiveTab('search')}
                >
                  Find friends to add
                </Button>
              </div>
            ) : (
              friends.map((friend) => (
                <div
                  key={friend.id}
                  className={cn(
                    'flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800/50 transition-colors cursor-pointer',
                    compact && 'p-2'
                  )}
                  onClick={() => onSelectFriend?.(friend)}
                >
                  {/* Avatar with online status */}
                  <div className="relative">
                    <Avatar className={cn(compact ? 'w-8 h-8' : 'w-10 h-10')}>
                      <AvatarImage src={friend.avatar} />
                      <AvatarFallback className="bg-purple-600">
                        {friend.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    {/* Online indicator */}
                    <div className={cn(
                      'absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-slate-900',
                      friend.isOnline ? 'bg-green-500' : 'bg-slate-500'
                    )} />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-white truncate">{friend.name}</span>
                      {friend.isOnline && friend.currentActivity && (
                        <Badge variant="secondary" className="text-xs bg-purple-600/20 text-purple-300">
                          {friend.currentActivity === 'in_match' ? '🎮 In Match' : 
                           friend.currentActivity === 'in_queue' ? '🔍 Finding Match' : ''}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <span className={getKRTier(friend.knowledgeRating).color}>
                        KR: {friend.knowledgeRating}
                      </span>
                      {!compact && friend.achievements.length > 0 && (
                        <span className="text-sm">
                          {friend.achievements.slice(0, 3).map(a => a.icon).join(' ')}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  {showActions && (
                    <div className="flex items-center gap-1">
                      {onStartChat && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-slate-400 hover:text-purple-400"
                          onClick={(e) => {
                            e.stopPropagation()
                            onStartChat(friend.id)
                          }}
                        >
                          <MessageCircle className="w-4 h-4" />
                        </Button>
                      )}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-slate-400"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-slate-800 border-slate-700">
                          <DropdownMenuItem onClick={() => router.push(`/sparring/challenge/${friend.id}`)}>
                            <Gamepad2 className="w-4 h-4 mr-2" />
                            Challenge to Sparring
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-slate-700" />
                          <DropdownMenuItem 
                            className="text-red-400"
                            onClick={() => removeFriend(friend.friendshipId)}
                          >
                            <UserX className="w-4 h-4 mr-2" />
                            Remove Friend
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'requests' && (
          <div className="p-2">
            {requests.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                <Clock className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No pending requests</p>
              </div>
            ) : (
              requests.map((request) => (
                <div
                  key={request.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50 mb-2"
                >
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={request.from.avatar} />
                    <AvatarFallback className="bg-purple-600">
                      {request.from.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <span className="font-medium text-white truncate">{request.from.name}</span>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <span className={getKRTier(request.from.knowledgeRating).color}>
                        KR: {request.from.knowledgeRating}
                      </span>
                      {request.from.achievements.length > 0 && (
                        <span className="text-sm">
                          {request.from.achievements.slice(0, 3).map(a => a.icon).join(' ')}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 h-8"
                      onClick={() => acceptRequest(request.id)}
                    >
                      <Check className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-red-400 hover:bg-red-600/20 h-8"
                      onClick={() => declineRequest(request.id)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'search' && (
          <div className="p-2">
            {searchResults.length === 0 ? (
              searchQuery.length >= 2 ? (
                <div className="text-center py-8 text-slate-400">
                  <Search className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No users found</p>
                </div>
              ) : (
                <div className="text-center py-8 text-slate-400">
                  <p className="text-sm">Type at least 2 characters to search</p>
                </div>
              )
            ) : (
              searchResults.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800/50 transition-colors"
                >
                  <div className="relative">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback className="bg-purple-600">
                        {user.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className={cn(
                      'absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-slate-900',
                      user.isOnline ? 'bg-green-500' : 'bg-slate-500'
                    )} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <span className="font-medium text-white truncate">{user.name}</span>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <span className={getKRTier(user.knowledgeRating).color}>
                        KR: {user.knowledgeRating}
                      </span>
                      {user.achievements.length > 0 && (
                        <span className="text-sm">
                          {user.achievements.slice(0, 3).map(a => a.icon).join(' ')}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Add friend button */}
                  {user.friendship ? (
                    user.friendship.status === 'accepted' ? (
                      <Badge className="bg-green-600/20 text-green-400">Friends</Badge>
                    ) : user.friendship.status === 'pending' && user.friendship.isRequester ? (
                      <Badge className="bg-amber-600/20 text-amber-400">Pending</Badge>
                    ) : null
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-purple-500 text-purple-400 hover:bg-purple-500/20"
                      onClick={() => sendFriendRequest(user.id)}
                    >
                      <UserPlus className="w-4 h-4 mr-1" />
                      Add
                    </Button>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </ScrollArea>
    </div>
  )
}
