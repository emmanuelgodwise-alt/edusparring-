'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  History, Trophy, XCircle, Minus, ChevronRight, Clock, Target,
  Flame, Star, TrendingUp, TrendingDown, ArrowLeft, Filter,
  Calendar, Zap, Bot, Users, Brain
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';

// Types
interface MatchRecord {
  id: string;
  playerScore: number;
  opponentScore: number;
  opponent: string;
  subject: string;
  difficulty: 'easy' | 'medium' | 'hard';
  result: 'win' | 'loss' | 'draw';
  date: string;
  duration: number;
  roundsPlayed: number;
  correctAnswers: number;
  xpEarned: number;
  matchType: 'bot' | 'player';
}

interface MatchStats {
  totalMatches: number;
  wins: number;
  losses: number;
  draws: number;
  winRate: number;
  averageScore: number;
  favoriteSubject: string;
  currentStreak: number;
}

// Subject icons
const subjectIcons: Record<string, string> = {
  Math: '📐', Physics: '⚛️', Chemistry: '🧪', Biology: '🧬',
  History: '📜', Geography: '🌍', Literature: '📚', Economics: '💰',
  ComputerScience: '💻', Civics: '⚖️', English: '📖'
};

// Difficulty config
const difficultyConfig = {
  easy: { label: 'Easy', color: 'text-green-400', bg: 'bg-green-500/20' },
  medium: { label: 'Medium', color: 'text-yellow-400', bg: 'bg-yellow-500/20' },
  hard: { label: 'Hard', color: 'text-red-400', bg: 'bg-red-500/20' }
};

// Format duration
function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Format date
function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function MatchHistoryPage() {
  const [matches, setMatches] = useState<MatchRecord[]>([]);
  const [stats, setStats] = useState<MatchStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'wins' | 'losses'>('all');
  const [subjectFilter, setSubjectFilter] = useState<string>('all');

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await fetch('/api/match-history');
      const data = await response.json();
      setMatches(data.matches || []);
      setStats(data.stats || null);
    } catch (error) {
      console.error('Failed to fetch history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter matches
  const filteredMatches = matches.filter(match => {
    if (filter === 'wins' && match.result !== 'win') return false;
    if (filter === 'losses' && match.result !== 'loss') return false;
    if (subjectFilter !== 'all' && match.subject !== subjectFilter) return false;
    return true;
  });

  // Get unique subjects for filter
  const subjects = ['all', ...new Set(matches.map(m => m.subject))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 text-white pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-black/30 border-b border-white/10">
        <div className="max-w-2xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/sparring">
                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <History className="w-6 h-6 text-purple-400" />
                <div>
                  <h1 className="text-lg font-bold">Match History</h1>
                  <p className="text-xs text-gray-400">Your sparring record</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            >
              <Brain className="w-10 h-10 text-purple-400" />
            </motion.div>
          </div>
        ) : (
          <>
            {/* Stats Overview */}
            {stats && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6"
              >
                <Card className="bg-white/5 border-white/10 overflow-hidden">
                  <div className="grid grid-cols-4 divide-x divide-white/10">
                    <div className="p-4 text-center">
                      <Trophy className="w-5 h-5 mx-auto text-yellow-400 mb-1" />
                      <p className="text-2xl font-bold text-green-400">{stats.wins}</p>
                      <p className="text-xs text-gray-400">Wins</p>
                    </div>
                    <div className="p-4 text-center">
                      <XCircle className="w-5 h-5 mx-auto text-red-400 mb-1" />
                      <p className="text-2xl font-bold text-red-400">{stats.losses}</p>
                      <p className="text-xs text-gray-400">Losses</p>
                    </div>
                    <div className="p-4 text-center">
                      <Target className="w-5 h-5 mx-auto text-purple-400 mb-1" />
                      <p className="text-2xl font-bold text-purple-400">{stats.winRate}%</p>
                      <p className="text-xs text-gray-400">Win Rate</p>
                    </div>
                    <div className="p-4 text-center">
                      <Flame className="w-5 h-5 mx-auto text-orange-400 mb-1" />
                      <p className="text-2xl font-bold text-orange-400">{stats.currentStreak}</p>
                      <p className="text-xs text-gray-400">Streak</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}

            {/* Filters */}
            <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
              <Button
                onClick={() => setFilter('all')}
                variant={filter === 'all' ? 'default' : 'outline'}
                size="sm"
                className={`whitespace-nowrap ${filter === 'all' ? 'bg-purple-600' : 'border-white/20'}`}
              >
                All Matches
              </Button>
              <Button
                onClick={() => setFilter('wins')}
                variant={filter === 'wins' ? 'default' : 'outline'}
                size="sm"
                className={`whitespace-nowrap ${filter === 'wins' ? 'bg-green-600' : 'border-white/20'}`}
              >
                <Trophy className="w-4 h-4 mr-1" />
                Wins
              </Button>
              <Button
                onClick={() => setFilter('losses')}
                variant={filter === 'losses' ? 'default' : 'outline'}
                size="sm"
                className={`whitespace-nowrap ${filter === 'losses' ? 'bg-red-600' : 'border-white/20'}`}
              >
                <XCircle className="w-4 h-4 mr-1" />
                Losses
              </Button>
            </div>

            {/* Subject Filter */}
            <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
              {subjects.map((subject) => (
                <Button
                  key={subject}
                  onClick={() => setSubjectFilter(subject)}
                  variant={subjectFilter === subject ? 'default' : 'outline'}
                  size="sm"
                  className={`whitespace-nowrap ${subjectFilter === subject ? 'bg-cyan-600' : 'border-white/20'}`}
                >
                  {subject === 'all' ? '📚 All' : `${subjectIcons[subject] || '📖'} ${subject}`}
                </Button>
              ))}
            </div>

            {/* Match List */}
            <div className="space-y-3">
              <AnimatePresence>
                {filteredMatches.map((match, index) => (
                  <motion.div
                    key={match.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.03 }}
                  >
                    <Card className={`bg-white/5 border-white/10 hover:bg-white/10 transition-all cursor-pointer ${
                      match.result === 'win' ? 'border-l-4 border-l-green-500' :
                      match.result === 'loss' ? 'border-l-4 border-l-red-500' :
                      'border-l-4 border-l-gray-500'
                    }`}>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          {/* Result Icon */}
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                            match.result === 'win' ? 'bg-green-500/20' :
                            match.result === 'loss' ? 'bg-red-500/20' :
                            'bg-gray-500/20'
                          }`}>
                            {match.result === 'win' ? (
                              <Trophy className="w-6 h-6 text-green-400" />
                            ) : match.result === 'loss' ? (
                              <XCircle className="w-6 h-6 text-red-400" />
                            ) : (
                              <Minus className="w-6 h-6 text-gray-400" />
                            )}
                          </div>

                          {/* Match Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-lg">{subjectIcons[match.subject] || '📖'}</span>
                              <span className="font-semibold truncate">{match.subject}</span>
                              <Badge className={`${difficultyConfig[match.difficulty].bg} ${difficultyConfig[match.difficulty].color} text-xs`}>
                                {difficultyConfig[match.difficulty].label}
                              </Badge>
                              <Badge variant="outline" className="text-xs border-white/20">
                                {match.matchType === 'bot' ? <Bot className="w-3 h-3 mr-1" /> : <Users className="w-3 h-3 mr-1" />}
                                {match.opponent}
                              </Badge>
                            </div>
                            
                            <div className="flex items-center gap-4 text-sm text-gray-400">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {formatDuration(match.duration)}
                              </span>
                              <span className="flex items-center gap-1">
                                <Target className="w-3 h-3" />
                                {match.correctAnswers}/{match.roundsPlayed} correct
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {formatDate(match.date)}
                              </span>
                            </div>
                          </div>

                          {/* Score */}
                          <div className="text-right">
                            <div className="flex items-center gap-2 text-xl font-bold">
                              <span className={match.result === 'win' ? 'text-green-400' : 'text-white'}>
                                {match.playerScore}
                              </span>
                              <span className="text-gray-500">-</span>
                              <span className={match.result === 'loss' ? 'text-red-400' : 'text-white'}>
                                {match.opponentScore}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-yellow-400">
                              <Star className="w-3 h-3" />
                              +{match.xpEarned} XP
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Empty State */}
            {filteredMatches.length === 0 && (
              <div className="text-center py-12">
                <History className="w-16 h-16 mx-auto text-gray-600 mb-4" />
                <p className="text-gray-400">No matches found</p>
                <p className="text-sm text-gray-500 mt-1">Try adjusting your filters</p>
              </div>
            )}

            {/* Quick Stats */}
            <Card className="bg-white/5 border-white/10 mt-6">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-cyan-400" />
                  Performance Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-xl bg-white/5">
                    <p className="text-sm text-gray-400 mb-1">Total Matches</p>
                    <p className="text-xl font-bold">{matches.length}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5">
                    <p className="text-sm text-gray-400 mb-1">Total XP Earned</p>
                    <p className="text-xl font-bold text-yellow-400">
                      {matches.reduce((sum, m) => sum + m.xpEarned, 0)}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5">
                    <p className="text-sm text-gray-400 mb-1">Total Time</p>
                    <p className="text-xl font-bold">
                      {Math.floor(matches.reduce((sum, m) => sum + m.duration, 0) / 60)} min
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5">
                    <p className="text-sm text-gray-400 mb-1">Favorite Subject</p>
                    <p className="text-xl font-bold">
                      {stats?.favoriteSubject || 'Math'} {subjectIcons[stats?.favoriteSubject || 'Math']}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </main>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 backdrop-blur-xl bg-black/50 border-t border-white/10 p-4">
        <div className="max-w-2xl mx-auto flex gap-3">
          <Link href="/sparring" className="flex-1">
            <Button className="w-full bg-gradient-to-r from-purple-600 to-cyan-600">
              <Zap className="w-4 h-4 mr-2" />
              New Sparring
            </Button>
          </Link>
          <Link href="/leaderboard" className="flex-1">
            <Button variant="outline" className="w-full border-white/20">
              <Trophy className="w-4 h-4 mr-2" />
              Leaderboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
