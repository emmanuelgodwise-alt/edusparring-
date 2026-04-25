'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Trophy, Swords, ChevronLeft, Medal, Crown, TrendingUp,
  Target, Calendar, Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

interface LeaderboardEntry {
  rank: number;
  playerId: string;
  displayName: string;
  totalScore: number;
  wins: number;
  losses: number;
  draws: number;
  gamesPlayed: number;
  winRate: number;
}

interface LeaderboardData {
  leaderboard: LeaderboardEntry[];
  period: string;
  currentPlayer: LeaderboardEntry | null;
  stats: {
    totalPlayers: number;
    totalGames: number;
    period: string;
  };
}

const periodLabels: Record<string, string> = {
  all_time: 'All Time',
  monthly: 'This Month',
  weekly: 'This Week',
  daily: 'Today'
};

const getMedalIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return <Crown className="w-6 h-6 text-yellow-400" />;
    case 2:
      return <Medal className="w-6 h-6 text-gray-300" />;
    case 3:
      return <Medal className="w-6 h-6 text-amber-600" />;
    default:
      return null;
  }
};

const getRankStyle = (rank: number) => {
  switch (rank) {
    case 1:
      return 'bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border-yellow-500/30';
    case 2:
      return 'bg-gradient-to-r from-gray-400/20 to-gray-300/20 border-gray-400/30';
    case 3:
      return 'bg-gradient-to-r from-amber-600/20 to-amber-500/20 border-amber-600/30';
    default:
      return 'bg-white/5 border-white/10';
  }
};

export default function SparringLeaderboardPage() {
  const [data, setData] = useState<LeaderboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [period, setPeriod] = useState('all_time');

  useEffect(() => {
    fetchLeaderboard();
  }, [period]);

  const fetchLeaderboard = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/sparring/leaderboard?playerId=guest&period=${period}&limit=50`);
      const result = await res.json();
      if (result.success) {
        setData(result);
      }
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 text-white flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        >
          <Trophy className="w-12 h-12 text-yellow-400" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 text-white pb-24">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-black/30 border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/sparring">
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                <ChevronLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold flex items-center gap-2">
                <Trophy className="w-6 h-6 text-yellow-400" />
                Leaderboard
              </h1>
              <p className="text-sm text-gray-400">Top sparring champions</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-4xl">
        {data && (
          <>
            {/* Period Filter */}
            <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
              {['all_time', 'monthly', 'weekly', 'daily'].map(p => (
                <Button
                  key={p}
                  variant={period === p ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPeriod(p)}
                  className={period === p 
                    ? 'bg-purple-600 hover:bg-purple-500' 
                    : 'border-white/20 text-gray-300'
                  }
                >
                  {p === 'daily' && <Calendar className="w-3 h-3 mr-1" />}
                  {periodLabels[p]}
                </Button>
              ))}
            </div>

            {/* Stats Bar */}
            <div className="flex items-center justify-between mb-6 p-3 bg-white/5 rounded-xl border border-white/10">
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-xs text-gray-400">Players</p>
                  <p className="text-lg font-bold">{data.stats.totalPlayers}</p>
                </div>
                <div className="w-px h-8 bg-white/10" />
                <div>
                  <p className="text-xs text-gray-400">Games</p>
                  <p className="text-lg font-bold">{data.stats.totalGames}</p>
                </div>
              </div>
              <Badge variant="outline" className="border-purple-500/30 text-purple-400">
                {periodLabels[data.period]}
              </Badge>
            </div>

            {/* Current Player Card */}
            {data.currentPlayer && (
              <Card className="bg-purple-500/20 border-purple-500/30 backdrop-blur mb-6">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-purple-500/30 flex items-center justify-center">
                        <span className="font-bold text-purple-400">#{data.currentPlayer.rank}</span>
                      </div>
                      <div>
                        <p className="font-semibold">Your Ranking</p>
                        <p className="text-xs text-gray-400">{data.currentPlayer.gamesPlayed} games played</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-purple-400">{data.currentPlayer.totalScore}</p>
                      <p className="text-xs text-gray-400">points</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mt-3 text-sm">
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-4 h-4 text-green-400" />
                      <span className="text-green-400">{data.currentPlayer.wins}W</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-red-400">{data.currentPlayer.losses}L</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Target className="w-4 h-4 text-cyan-400" />
                      <span>{data.currentPlayer.winRate}% win rate</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Leaderboard List */}
            <div className="space-y-2">
              {data.leaderboard.map((entry, index) => (
                <motion.div
                  key={entry.playerId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                >
                  <Card className={`backdrop-blur ${getRankStyle(entry.rank)} border`}>
                    <CardContent className="p-3">
                      <div className="flex items-center gap-3">
                        {/* Rank */}
                        <div className="w-10 flex items-center justify-center">
                          {getMedalIcon(entry.rank) || (
                            <span className="text-lg font-bold text-gray-400">#{entry.rank}</span>
                          )}
                        </div>

                        {/* Player Info */}
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold">{entry.displayName}</p>
                            {entry.rank <= 3 && (
                              <Star className="w-4 h-4 text-yellow-400" />
                            )}
                          </div>
                          <div className="flex items-center gap-3 text-xs text-gray-400">
                            <span className="text-green-400">{entry.wins}W</span>
                            <span className="text-red-400">{entry.losses}L</span>
                            <span>{entry.gamesPlayed} games</span>
                          </div>
                        </div>

                        {/* Score */}
                        <div className="text-right">
                          <p className="text-xl font-bold">{entry.totalScore}</p>
                          <p className="text-xs text-gray-400">points</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Empty State */}
            {data.leaderboard.length === 0 && (
              <div className="text-center py-12">
                <Trophy className="w-16 h-16 mx-auto text-gray-500 mb-4" />
                <h3 className="text-xl font-semibold mb-2">No games yet!</h3>
                <p className="text-gray-400 mb-4">Be the first to spar and top the leaderboard!</p>
                <Link href="/sparring">
                  <Button className="bg-gradient-to-r from-purple-600 to-cyan-600">
                    <Swords className="w-4 h-4 mr-2" />
                    Start Sparring
                  </Button>
                </Link>
              </div>
            )}
          </>
        )}
      </main>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 backdrop-blur-xl bg-black/50 border-t border-white/10 p-4">
        <div className="container mx-auto max-w-4xl">
          <Link href="/sparring" className="block">
            <Button className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500">
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back to Sparring
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
