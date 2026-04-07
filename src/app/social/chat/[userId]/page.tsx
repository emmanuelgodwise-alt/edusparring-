'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { ChatWindow } from '@/components/social/ChatWindow'

const DEMO_USER_ID = 'demo-user-1'

interface User {
  id: string
  name: string
  email: string
}

interface FriendInfo {
  id: string
  name: string
  avatar?: string
  knowledgeRating: number
  isOnline: boolean
}

export default function ChatPage() {
  const params = useParams()
  const router = useRouter()
  const friendId = params.userId as string
  
  const [user, setUser] = useState<User | null>(null)
  const [friend, setFriend] = useState<FriendInfo | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUserAndFriend()
  }, [friendId])

  const fetchUserAndFriend = async () => {
    try {
      // Get current user
      const userResponse = await fetch('/api/user')
      const userData = await userResponse.json()
      const currentUser = userData.user || { id: DEMO_USER_ID, name: 'Demo User', email: 'demo@example.com' }
      setUser(currentUser)

      // Get friend info
      // For demo, create a mock friend if not found
      setFriend({
        id: friendId,
        name: `Friend ${friendId.slice(0, 4)}`,
        knowledgeRating: 1200 + Math.floor(Math.random() * 400),
        isOnline: Math.random() > 0.5
      })
    } catch (error) {
      console.error('Error fetching data:', error)
      setUser({ id: DEMO_USER_ID, name: 'Demo User', email: 'demo@example.com' })
      setFriend({
        id: friendId,
        name: 'Friend',
        knowledgeRating: 1200,
        isOnline: true
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
      </div>
    )
  }

  if (!user || !friend) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center">
        <p className="text-white">Error loading chat</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      {/* Chat Window */}
      <ChatWindow 
        userId={user.id}
        friend={friend}
        onBack={() => router.push('/social')}
        className="h-screen"
      />
    </div>
  )
}
