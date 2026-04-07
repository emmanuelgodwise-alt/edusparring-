'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Users, Loader2 } from 'lucide-react'
import { FriendList } from '@/components/social/FriendList'

const DEMO_USER_ID = 'demo-user-1'

interface User {
  id: string
  name: string
  email: string
}

export default function FriendsPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUser()
  }, [])

  const fetchUser = async () => {
    try {
      const response = await fetch('/api/user')
      const data = await response.json()
      setUser(data.user || { id: DEMO_USER_ID, name: 'Demo User', email: 'demo@example.com' })
    } catch (error) {
      console.error('Error fetching user:', error)
      setUser({ id: DEMO_USER_ID, name: 'Demo User', email: 'demo@example.com' })
    } finally {
      setLoading(false)
    }
  }

  const handleStartChat = (friendId: string) => {
    router.push(`/social/chat/${friendId}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-lg border-b border-slate-700">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push('/social')}
            className="text-slate-400 hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-400" />
            <h1 className="text-xl font-bold text-white">Friends</h1>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        <div className="bg-slate-800/30 border border-slate-700 rounded-xl overflow-hidden h-[calc(100vh-160px)]">
          <FriendList 
            userId={user?.id || DEMO_USER_ID}
            onStartChat={handleStartChat}
            showActions={true}
          />
        </div>
      </main>
    </div>
  )
}
