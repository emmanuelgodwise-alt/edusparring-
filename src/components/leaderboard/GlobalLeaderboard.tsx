'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, Crown, Medal, Flame, Globe, 
  ChevronDown, ChevronUp, Flag
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CountrySelector } from '@/components/ui/LanguageSelector';
import { getCountryFlag, TranslationStrings } from '@/lib/i18n';

interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  avatar?: string;
  country?: string;
  countryFlag: string;
  knowledgeRating: number;
  points: number;
  totalWins: number;
  totalLosses: number;
  winRate: number;
  currentStreak: number;
  bestStreak: number;
  isGlobalChampion: boolean;
  badges: string[];
}

interface GlobalLeaderboardProps {
  translations: TranslationStrings;
}

export function GlobalLeaderboard({ translations }: GlobalLeaderboardProps) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [podium, setPodium] = useState<LeaderboardEntry[]>([]);
  const [countryStats, setCountryStats] = useState<Array<{
    code: string;
    flag: string;
    playerCount: number;
    avgRating: number;
    totalWins: number;
    winRate: number;
  }>>([]);
  const [countryFilter, setCountryFilter] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCountryStats, setShowCountryStats] = useState(false);

  const t = translations;

  useEffect(() => {
    fetchLeaderboard();
  }, [countryFilter]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const url = countryFilter 
        ? `/api/leaderboard/global?country=${countryFilter}`
        : '/api/leaderboard/global';
      const res = await fetch(url);
      const data = await res.json();
      
      if (data.success) {
        setLeaderboard(data.leaderboard);
        setPodium(data.podium);
        setCountryStats(data.countryStats);
      }
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return { icon: Crown, color: 'text-yellow-400', bg: 'bg-yellow-500/20', label: '🥇' };
    if (rank === 2) return { icon: Medal, color: 'text-gray-300', bg: 'bg-gray-400/20', label: '🥈' };
    if (rank === 3) return { icon: Medal, color: 'text-amber-600', bg: 'bg-amber-600/20', label: '🥉' };
    return null;
  };

  const getBadgeDisplay = (badges: string[], streak: number) => {
    const badgeElements: JSX.Element[] = [];
    
    if (badges.includes('global_champion')) {
      badgeElements.push(
        <Badge key="champion" className="bg-gradient-to-r from-yellow-500 to-amber-500 text-black text-xs">
          👑 {t.leaderboard.globalChampion}
        </Badge>
      );
    }
    
    if (streak >= 10) {
      badgeElements.push(
        <Badge key="streak" className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs">
          🔥 {streak} {t.leaderboard.streak}
        </Badge>
      );
    } else if (streak >= 5) {
      badgeElements.push(
        <Badge key="fire" className="bg-orange-500/20 text-orange-400 text-xs">
          🔥 On Fire
        </Badge>
      );
    }
    
    return badgeElements;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Globe className="w-6 h-6 text-cyan-400" />
          <h2 className="text-2xl font-bold text-white">{t.leaderboard.global} {t.leaderboard.title}</h2>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Country Filter */}
          <div className="w-48">
            <CountrySelector
              currentCountry={countryFilter}
              onCountryChange={(code) => setCountryFilter(code === 'all' ? null : code)}
            />
          </div>
        </div>
      </div>

      {/* Podium */}
      {podium.length > 0 && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          {/* 2nd Place */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="order-1 pt-8"
          >
            <Card className="bg-gradient-to-br from-gray-500/20 to-gray-700/20 border-gray-500/30 text-center">
              <CardContent className="pt-6 pb-4">
                <div className="text-4xl mb-2">🥈</div>
                <div className="text-2xl mb-2">{podium[1]?.countryFlag || '🌍'}</div>
                <h3 className="font-bold text-white truncate">{podium[1]?.name || '-'}</h3>
                <p className="text-gray-400 text-sm">{podium[1]?.knowledgeRating || 0} KR</p>
              </CardContent>
            </Card>
          </motion.div>

          {/* 1st Place */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="order-2"
          >
            <Card className="bg-gradient-to-br from-yellow-500/30 to-amber-600/30 border-yellow-500/50 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-yellow-500/10 to-transparent" />
              <CardContent className="pt-6 pb-4 relative z-10">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-5xl mb-2"
                >
                  👑
                </motion.div>
                <div className="text-3xl mb-2">{podium[0]?.countryFlag || '🌍'}</div>
                <h3 className="font-bold text-white text-lg truncate">{podium[0]?.name || '-'}</h3>
                <p className="text-yellow-400 font-bold">{podium[0]?.knowledgeRating || 0} KR</p>
                {podium[0]?.isGlobalChampion && (
                  <Badge className="mt-2 bg-gradient-to-r from-yellow-500 to-amber-500 text-black">
                    🏆 {t.leaderboard.globalChampion}
                  </Badge>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* 3rd Place */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="order-3 pt-12"
          >
            <Card className="bg-gradient-to-br from-amber-600/20 to-amber-800/20 border-amber-600/30 text-center">
              <CardContent className="pt-6 pb-4">
                <div className="text-4xl mb-2">🥉</div>
                <div className="text-2xl mb-2">{podium[2]?.countryFlag || '🌍'}</div>
                <h3 className="font-bold text-white truncate">{podium[2]?.name || '-'}</h3>
                <p className="text-gray-400 text-sm">{podium[2]?.knowledgeRating || 0} KR</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}

      {/* Leaderboard Table */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2 text-white">
            <Trophy className="w-5 h-5 text-yellow-400" />
            {t.leaderboard.rank}ings
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-gray-400">
              {t.common.loading}
            </div>
          ) : leaderboard.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              {t.leaderboard.noPlayers}
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
              {leaderboard.map((entry, index) => {
                const rankBadge = getRankBadge(entry.rank);
                
                return (
                  <motion.div
                    key={entry.userId}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${
                      entry.rank <= 3 
                        ? 'bg-white/5 border border-white/10' 
                        : 'hover:bg-white/5'
                    }`}
                  >
                    {/* Rank */}
                    <div className="w-8 text-center">
                      {rankBadge ? (
                        <span className="text-2xl">{rankBadge.label}</span>
                      ) : (
                        <span className="text-gray-400 font-medium">#{entry.rank}</span>
                      )}
                    </div>

                    {/* Country Flag */}
                    <span className="text-2xl">{entry.countryFlag}</span>

                    {/* Player Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-white truncate">{entry.name}</span>
                        {entry.badges.includes('global_champion') && (
                          <Crown className="w-4 h-4 text-yellow-400" />
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <span>{entry.totalWins}W / {entry.totalLosses}L</span>
                        <span>•</span>
                        <span>{entry.winRate}% WR</span>
                      </div>
                    </div>

                    {/* Badges */}
                    <div className="hidden sm:flex gap-1">
                      {getBadgeDisplay(entry.badges, entry.currentStreak)}
                    </div>

                    {/* Rating */}
                    <div className="text-right">
                      <div className="font-bold text-purple-400">{entry.knowledgeRating}</div>
                      <div className="text-xs text-gray-400">KR</div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Country Statistics */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <button
            onClick={() => setShowCountryStats(!showCountryStats)}
            className="flex items-center justify-between w-full"
          >
            <CardTitle className="text-lg flex items-center gap-2 text-white">
              <Flag className="w-5 h-5 text-cyan-400" />
              Country Rankings
            </CardTitle>
            {showCountryStats ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </button>
        </CardHeader>
        <AnimatePresence>
          {showCountryStats && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <CardContent className="pt-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {countryStats.slice(0, 12).map((country, index) => (
                    <div
                      key={country.code}
                      className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/10"
                    >
                      <span className="text-2xl">{country.flag}</span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-white">{country.code}</span>
                          <span className="text-xs text-gray-400">#{index + 1}</span>
                        </div>
                        <div className="text-xs text-gray-400">
                          {country.playerCount} players • {country.avgRating} avg KR
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </div>
  );
}
