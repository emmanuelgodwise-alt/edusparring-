'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Swords, Trophy, Radio, Users, Calendar, ChevronRight, ArrowLeft,
  Zap, Target, Crown, Star, Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MatchmakingQueue } from '@/components/multiplayer/LiveBattle';
import { TournamentsList } from '@/components/multiplayer/Tournament';
import { LiveMatchList } from '@/components/multiplayer/SpectatorMode';
import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';
import type { LiveBattle } from '@/types/multiplayer';

export default function MultiplayerPage() {
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('arena');
  const [selectedSubject, setSelectedSubject] = useState('Math');
  const [inMatch, setInMatch] = useState(false);
  const [currentBattle, setCurrentBattle] = useState<LiveBattle | null>(null);

  // Mock live battles for display
  const liveBattles: LiveBattle[] = [
    {
      id: 'b1',
      status: 'active',
      players: [
        { id: 'p1', name: 'AlphaScholar', knowledgeRating: 1250, score: 45, correctAnswers: 3, wrongAnswers: 1, averageResponseTime: 8, streak: 2, isReady: true, disconnected: false },
        { id: 'p2', name: 'QuantumMind', knowledgeRating: 1180, score: 38, correctAnswers: 2, wrongAnswers: 2, averageResponseTime: 10, streak: 0, isReady: true, disconnected: false },
      ],
      currentRound: 4,
      totalRounds: 5,
      subject: 'Math',
      difficulty: 6,
      spectators: 127,
      isRanked: true,
    },
  ];

  const subjects = ['Math', 'Physics', 'Chemistry', 'Biology', 'History', 'Geography'];

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 text-white">
        <div className="container mx-auto px-4 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto"
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center">
              <Swords className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold mb-4">Multiplayer Arena</h1>
            <p className="text-gray-400 mb-8">
              Compete in real-time battles, join tournaments, and climb the leaderboards!
            </p>
            <Link href="/auth/signin">
              <Button className="bg-gradient-to-r from-purple-600 to-cyan-600">
                Sign In to Compete
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  const handleMatchFound = (match: { battleId: string; opponent: any }) => {
    setInMatch(true);
    setCurrentBattle({
      id: match.battleId,
      status: 'active',
      players: [
        {
          id: user?.id || 'player',
          name: user?.name || 'You',
          knowledgeRating: 850,
          score: 0,
          correctAnswers: 0,
          wrongAnswers: 0,
          averageResponseTime: 0,
          streak: 0,
          isReady: true,
          disconnected: false,
        },
        match.opponent,
      ],
      currentRound: 1,
      totalRounds: 5,
      subject: selectedSubject,
      difficulty: 5,
      spectators: 0,
      isRanked: true,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-black/30 border-b border-white/10">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center">
                <Swords className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  Multiplayer Arena
                </h1>
                <p className="text-xs text-gray-400">Compete • Win • Rank Up</p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-full border border-white/10">
              <Crown className="w-4 h-4 text-yellow-400" />
              <span className="text-sm font-medium">850 KR</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-full border border-white/10">
              <Trophy className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-medium">12 Wins</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-white/5 border border-white/10">
            <TabsTrigger value="arena" className="data-[state=active]:bg-purple-500/20">
              <Zap className="w-4 h-4 mr-2" />
              Battle Arena
            </TabsTrigger>
            <TabsTrigger value="spectate" className="data-[state=active]:bg-purple-500/20">
              <Eye className="w-4 h-4 mr-2" />
              Spectate
            </TabsTrigger>
            <TabsTrigger value="tournaments" className="data-[state=active]:bg-purple-500/20">
              <Trophy className="w-4 h-4 mr-2" />
              Tournaments
            </TabsTrigger>
          </TabsList>

          <TabsContent value="arena" className="space-y-6">
            {/* Subject Selection */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Choose Your Battle</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                  {subjects.map((subject) => (
                    <Button
                      key={subject}
                      variant={selectedSubject === subject ? 'default' : 'outline'}
                      onClick={() => setSelectedSubject(subject)}
                      className={selectedSubject === subject 
                        ? 'bg-gradient-to-r from-purple-500 to-cyan-500' 
                        : 'border-white/20'
                      }
                    >
                      {subject}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Matchmaking */}
            <div className="grid md:grid-cols-2 gap-6">
              <MatchmakingQueue
                subject={selectedSubject}
                onMatchFound={handleMatchFound}
              />

              {/* Stats Card */}
              <Card className="bg-gradient-to-br from-yellow-900/20 to-orange-900/20 border-yellow-500/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-400" />
                    Your Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-green-400">12</p>
                    <p className="text-sm text-gray-400">Wins</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-red-400">5</p>
                    <p className="text-sm text-gray-400">Losses</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-yellow-400">71%</p>
                    <p className="text-sm text-gray-400">Win Rate</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-cyan-400">5</p>
                    <p className="text-sm text-gray-400">Best Streak</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Tips */}
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-4">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Target className="w-4 h-4 text-purple-400" />
                  Battle Tips
                </h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>• Answer quickly for bonus points - faster responses earn more!</li>
                  <li>• Maintain a streak to multiply your score</li>
                  <li>• Check your opponent's KR to gauge their skill level</li>
                  <li>• Ranked battles affect your Knowledge Rating</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="spectate" className="space-y-6">
            <LiveMatchList onSelectMatch={(matchId) => console.log('Spectate match:', matchId)} />
          </TabsContent>

          <TabsContent value="tournaments" className="space-y-6">
            <TournamentsList />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
