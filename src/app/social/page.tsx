'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, MessageCircle, Trophy, Bell, Search, Plus,
  UserPlus, Check, X, Send, Loader2, ArrowLeft, Home,
  Heart, MessageSquare, Share2, Clock, Crown, Flame, Star,
  BookOpen, Shield, Heart as WellnessIcon, Zap, GraduationCap,
  ChevronRight, Radio, Swords
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Demo data
const DEMO_USER = {
  id: 'user-1',
  name: 'Alex Scholar',
  email: 'alex@edusparring.com',
  knowledgeRating: 1250,
  avatar: null,
  country: 'US',
  language: 'en',
  isVerified: true
};

const DEMO_FRIENDS = [
  { id: 'f1', name: 'Jordan', knowledgeRating: 1180, status: 'online', country: 'ES' },
  { id: 'f2', name: 'Taylor', knowledgeRating: 1320, status: 'in_match', country: 'FR' },
  { id: 'f3', name: 'Morgan', knowledgeRating: 950, status: 'offline', country: 'DE' },
  { id: 'f4', name: 'Casey', knowledgeRating: 1400, status: 'online', country: 'CN' },
];

const DEMO_ACTIVITIES = [
  {
    id: 'a1',
    type: 'match_result',
    user: { name: 'Jordan', knowledgeRating: 1180 },
    content: 'Won a Physics match against QuantumMind',
    timestamp: new Date(Date.now() - 3600000),
    likes: 12,
    comments: 3
  },
  {
    id: 'a2',
    type: 'achievement',
    user: { name: 'Taylor', knowledgeRating: 1320 },
    content: 'Earned "Quick Thinker" badge!',
    timestamp: new Date(Date.now() - 7200000),
    likes: 25,
    comments: 7
  },
  {
    id: 'a3',
    type: 'study_circle',
    user: { name: 'Morgan', knowledgeRating: 950 },
    content: 'Created a new study circle: AP Chemistry Help',
    timestamp: new Date(Date.now() - 14400000),
    likes: 8,
    comments: 2
  },
  {
    id: 'a4',
    type: 'tutoring',
    user: { name: 'Casey', knowledgeRating: 1400 },
    content: 'Completed a tutoring session with Alex',
    timestamp: new Date(Date.now() - 18000000),
    likes: 15,
    comments: 4
  },
  {
    id: 'a5',
    type: 'character',
    user: { name: 'Jordan', knowledgeRating: 1180 },
    content: 'Earned the "Helper" character badge!',
    timestamp: new Date(Date.now() - 21600000),
    likes: 32,
    comments: 8
  }
];

const QUICK_LINKS = [
  { id: 'circles', label: 'Study Circles', icon: Users, href: '/social/circles', color: 'from-purple-500 to-indigo-500' },
  { id: 'tutoring', label: 'Peer Tutoring', icon: GraduationCap, href: '/social/tutoring', color: 'from-cyan-500 to-blue-500' },
  { id: 'character', label: 'Character', icon: Trophy, href: '/character', color: 'from-yellow-500 to-orange-500' },
  { id: 'wellness', label: 'Wellness', icon: Heart, href: '/wellness', color: 'from-pink-500 to-rose-500' },
  { id: 'safety', label: 'Safety Center', icon: Shield, href: '/safety', color: 'from-green-500 to-teal-500' },
];

const COUNTRY_FLAGS: Record<string, string> = {
  US: '🇺🇸', ES: '🇪🇸', FR: '🇫🇷', DE: '🇩🇪', CN: '🇨🇳', JP: '🇯🇵', BR: '🇧🇷', IN: '🇮🇳', GB: '🇬🇧'
};

export default function SocialHubPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('feed');
  const [user] = useState(DEMO_USER);
  const [friends, setFriends] = useState(DEMO_FRIENDS);
  const [activities, setActivities] = useState(DEMO_ACTIVITIES);
  const [searchQuery, setSearchQuery] = useState('');

  const onlineFriends = friends.filter(f => f.status === 'online').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 text-white pb-20">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-lg border-b border-slate-700">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                <Home className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-lg font-bold">Social Hub</h1>
              <p className="text-xs text-gray-400">{onlineFriends} friends online</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {user.isVerified && (
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                ✓ Verified
              </Badge>
            )}
            <Button variant="ghost" size="icon" className="relative text-gray-400">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-4">
        {/* Quick Links Grid */}
        <div className="grid grid-cols-5 gap-2 mb-4">
          {QUICK_LINKS.map((link) => (
            <Link key={link.id} href={link.href}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex flex-col items-center gap-1"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${link.color} flex items-center justify-center`}>
                  <link.icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-[10px] text-gray-400 text-center">{link.label}</span>
              </motion.div>
            </Link>
          ))}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5 bg-slate-800/50 border border-slate-700 mb-4">
            <TabsTrigger value="feed" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white p-2">
              <MessageSquare className="w-4 h-4" />
              <span className="hidden sm:inline ml-1">Feed</span>
            </TabsTrigger>
            <TabsTrigger value="circles" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white p-2">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline ml-1">Circles</span>
            </TabsTrigger>
            <TabsTrigger value="tutoring" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white p-2">
              <GraduationCap className="w-4 h-4" />
              <span className="hidden sm:inline ml-1">Tutoring</span>
            </TabsTrigger>
            <TabsTrigger value="wellness" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white p-2">
              <Heart className="w-4 h-4" />
              <span className="hidden sm:inline ml-1">Wellness</span>
            </TabsTrigger>
            <TabsTrigger value="safety" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white p-2">
              <Shield className="w-4 h-4" />
              <span className="hidden sm:inline ml-1">Safety</span>
            </TabsTrigger>
          </TabsList>

          {/* Activity Feed */}
          <TabsContent value="feed" className="mt-0 space-y-3">
            {/* Post Composer */}
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-sm font-bold">
                    {user.name.charAt(0)}
                  </div>
                  <Input
                    placeholder="Share an achievement or ask a question..."
                    className="bg-white/5 border-white/10"
                  />
                  <Button size="sm" className="bg-purple-600">
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Activity Items */}
            {activities.map((activity) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="bg-slate-800/30 border-slate-700">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-sm font-bold">
                        {activity.user.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-white">{activity.user.name}</span>
                          {activity.type === 'achievement' && (
                            <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 text-xs">
                              <Trophy className="w-3 h-3 mr-1" />
                              Achievement
                            </Badge>
                          )}
                          {activity.type === 'study_circle' && (
                            <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 text-xs">
                              <Users className="w-3 h-3 mr-1" />
                              Study Circle
                            </Badge>
                          )}
                          {activity.type === 'tutoring' && (
                            <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30 text-xs">
                              <GraduationCap className="w-3 h-3 mr-1" />
                              Tutoring
                            </Badge>
                          )}
                          {activity.type === 'character' && (
                            <Badge className="bg-pink-500/20 text-pink-400 border-pink-500/30 text-xs">
                              <Heart className="w-3 h-3 mr-1" />
                              Character
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-300">{activity.content}</p>
                        <p className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                          <Clock className="w-3 h-3" />
                          {formatTime(activity.timestamp)}
                        </p>
                        
                        {/* Actions */}
                        <div className="flex items-center gap-4 mt-3">
                          <button className="flex items-center gap-1 text-gray-400 hover:text-red-400 transition-colors">
                            <Heart className="w-4 h-4" />
                            <span className="text-xs">{activity.likes}</span>
                          </button>
                          <button className="flex items-center gap-1 text-gray-400 hover:text-cyan-400 transition-colors">
                            <MessageCircle className="w-4 h-4" />
                            <span className="text-xs">{activity.comments}</span>
                          </button>
                          <button className="flex items-center gap-1 text-gray-400 hover:text-purple-400 transition-colors">
                            <Share2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </TabsContent>

          {/* Circles Preview */}
          <TabsContent value="circles" className="mt-0">
            <Card className="bg-white/5 border-white/10 mb-4">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium">Your Study Circles</h3>
                  <Link href="/social/circles">
                    <Button variant="ghost" size="sm" className="text-purple-400">
                      View All
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </div>
                <div className="grid gap-2">
                  {[
                    { name: 'Math Olympiad Prep', members: 8, subject: 'Math' },
                    { name: 'Physics Study Group', members: 5, subject: 'Physics' },
                  ].map((circle) => (
                    <div key={circle.name} className="flex items-center gap-3 p-2 bg-white/5 rounded-lg">
                      <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center text-sm">
                        {circle.subject === 'Math' ? '📐' : '⚛️'}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{circle.name}</p>
                        <p className="text-xs text-gray-400">{circle.members} members</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Link href="/social/circles">
              <Button className="w-full bg-gradient-to-r from-purple-600 to-cyan-600">
                <Plus className="w-4 h-4 mr-2" />
                Browse & Create Circles
              </Button>
            </Link>
          </TabsContent>

          {/* Tutoring Preview */}
          <TabsContent value="tutoring" className="mt-0">
            <Card className="bg-white/5 border-white/10 mb-4">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium">Upcoming Sessions</h3>
                  <Link href="/social/tutoring">
                    <Button variant="ghost" size="sm" className="text-cyan-400">
                      View All
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 p-2 bg-white/5 rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center text-sm">
                      📐
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Math with Taylor S.</p>
                      <p className="text-xs text-gray-400">Today, 4:00 PM</p>
                    </div>
                    <Button size="sm" className="bg-green-600">Join</Button>
                  </div>
                  <div className="flex items-center gap-3 p-2 bg-white/5 rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-sm">
                      ⚛️
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Physics with Jordan K.</p>
                      <p className="text-xs text-gray-400">Tomorrow, 3:00 PM</p>
                    </div>
                    <Badge variant="outline" className="border-white/20">Scheduled</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Link href="/social/tutoring">
              <Button className="w-full bg-gradient-to-r from-cyan-600 to-blue-600">
                <GraduationCap className="w-4 h-4 mr-2" />
                Find a Tutor or Offer Help
              </Button>
            </Link>
          </TabsContent>

          {/* Wellness Preview */}
          <TabsContent value="wellness" className="mt-0">
            <Card className="bg-gradient-to-r from-pink-900/30 to-purple-900/30 border-pink-500/20 mb-4">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-pink-500/20 flex items-center justify-center text-3xl">
                    😊
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-400">Today&apos;s Mood</p>
                    <p className="text-lg font-semibold">Feeling Good!</p>
                    <p className="text-xs text-gray-400">Last check-in: 2 hours ago</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-2 gap-3 mb-4">
              <Card className="bg-white/5 border-white/10">
                <CardContent className="p-3 text-center">
                  <Clock className="w-5 h-5 mx-auto mb-1 text-cyan-400" />
                  <p className="text-lg font-bold">1h 25m</p>
                  <p className="text-xs text-gray-400">Screen Time</p>
                </CardContent>
              </Card>
              <Card className="bg-white/5 border-white/10">
                <CardContent className="p-3 text-center">
                  <Zap className="w-5 h-5 mx-auto mb-1 text-yellow-400" />
                  <p className="text-lg font-bold">3</p>
                  <p className="text-xs text-gray-400">Focus Sessions</p>
                </CardContent>
              </Card>
            </div>

            <Link href="/wellness">
              <Button className="w-full bg-gradient-to-r from-pink-600 to-purple-600">
                <Heart className="w-4 h-4 mr-2" />
                Open Wellness Dashboard
              </Button>
            </Link>
          </TabsContent>

          {/* Safety Preview */}
          <TabsContent value="safety" className="mt-0">
            <Card className="bg-gradient-to-r from-green-900/30 to-teal-900/30 border-green-500/20 mb-4">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                    <Shield className="w-6 h-6 text-green-400" />
                  </div>
                  <div>
                    <p className="font-semibold">You&apos;re Safe!</p>
                    <p className="text-sm text-gray-400">No safety issues detected</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-3">
              <Card className="bg-white/5 border-white/10">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-400" />
                      <span className="text-sm">Verified Student</span>
                    </div>
                    <Badge className="bg-green-500/20 text-green-400">Active</Badge>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white/5 border-white/10">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-purple-400" />
                      <span className="text-sm">Guardian Connected</span>
                    </div>
                    <Badge className="bg-purple-500/20 text-purple-400">1 linked</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Link href="/safety">
              <Button variant="outline" className="w-full mt-4 border-green-500/30 text-green-400">
                <Shield className="w-4 h-4 mr-2" />
                Open Safety Center
              </Button>
            </Link>
          </TabsContent>
        </Tabs>

        {/* Friends Online Section */}
        <Card className="bg-white/5 border-white/10 mt-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Users className="w-4 h-4 text-cyan-400" />
              Friends Online ({onlineFriends})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {friends.filter(f => f.status === 'online').map((friend) => (
                <motion.div
                  key={friend.id}
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-full cursor-pointer hover:bg-white/10"
                >
                  <div className="relative">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xs font-bold">
                      {friend.name.charAt(0)}
                    </div>
                    <div className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full border border-slate-800" />
                  </div>
                  <span className="text-xs">{friend.name}</span>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 backdrop-blur-xl bg-black/50 border-t border-white/10">
        <div className="max-w-2xl mx-auto px-4 py-2">
          <div className="flex items-center justify-around">
            {[
              { id: 'feed', icon: MessageSquare, label: 'Feed' },
              { id: 'circles', icon: Users, label: 'Circles' },
              { id: 'tutoring', icon: GraduationCap, label: 'Tutoring' },
              { id: 'wellness', icon: Heart, label: 'Wellness' },
              { id: 'safety', icon: Shield, label: 'Safety' }
            ].map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={cn(
                  "flex flex-col items-center gap-1 py-2 px-3 rounded-xl transition-all",
                  activeTab === id
                    ? "text-purple-400 bg-purple-500/20"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs font-medium">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>
    </div>
  );
}

function formatTime(date: Date): string {
  const diff = Date.now() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}
