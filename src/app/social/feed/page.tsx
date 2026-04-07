'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ArrowLeft, Rss, Globe, Users, Loader2 } from 'lucide-react'
import { ActivityFeed } from '@/components/social/ActivityFeed'

const DEMO_USER_ID = 'demo-user-1'

interface User {
  id: string
  name: string
  email: string
}

export default function FeedPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [feedType, setFeedType] = useState<'friends' | 'all'>('friends')
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
            <Rss className="w-5 h-5 text-purple-400" />
            <h1 className="text-xl font-bold text-white">Activity Feed</h1>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Feed Type Tabs */}
        <Tabs value={feedType} onValueChange={(v) => setFeedType(v as 'friends' | 'all')} className="mb-6">
          <TabsList className="bg-slate-800/50 border border-slate-700">
            <TabsTrigger 
              value="friends"
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
            >
              <Users className="w-4 h-4 mr-2" />
              Friends
            </TabsTrigger>
            <TabsTrigger 
              value="all"
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
            >
              <Globe className="w-4 h-4 mr-2" />
              Public
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Activity Feed */}
        <ActivityFeed 
          userId={user?.id || DEMO_USER_ID}
          type={feedType}
        />
      </main>
    </div>
  )
}
