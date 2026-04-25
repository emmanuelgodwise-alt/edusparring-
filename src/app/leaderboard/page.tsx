'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Trophy, Medal, Crown, Globe, Search, ChevronRight,
  ArrowLeft, TrendingUp, Flame, Star, Menu, Home, Brain,
  Video, Users, Swords
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { CountrySelector } from '@/components/ui/LanguageSelector';
import Link from 'next/link';
import { GlobalSearch, SearchTrigger, useGlobalSearch } from '@/components/navigation';

// Country flag mapping
const FLAGS: Record<string, string> = {
  US: '🇺🇸', ES: '🇪🇸', FR: '🇫🇷', DE: '🇩🇪', CN: '🇨🇳', JP: '🇯🇵', KR: '🇰🇷',
  IN: '🇮🇳', BR: '🇧🇷', MX: '🇲🇽', GB: '🇬🇧', SA: '🇸🇦', AE: '🇦🇪', RU: '🇷🇺', AU: '🇦🇺', CA: '🇨🇦'
};

// Mock leaderboard data
const MOCK_LEADERBOARD = [
  { rank: 1, id: '1', name: 'QuantumMind', knowledgeRating: 2450, country: 'US', wins: 156, streak: 12, isGlobalChampion: true },
  { rank: 2, id: '2', name: 'NeuralNinja', knowledgeRating: 2380, country: 'CN', wins: 142, streak: 8 },
  { rank: 3, id: '3', name: 'CosmicScholar', knowledgeRating: 2320, country: 'JP', wins: 138, streak: 5 },
  { rank: 4, id: '4', name: 'EinsteinJr', knowledgeRating: 2280, country: 'DE', wins: 125, streak: 3 },
  { rank: 5, id: '5', name: 'NewtonStar', knowledgeRating: 2240, country: 'GB', wins: 118, streak: 7 },
  { rank: 6, id: '6', name: 'TeslaMind', knowledgeRating: 2190, country: 'RU', wins: 112, streak: 4 },
  { rank: 7, id: '7', name: 'CurieDreams', knowledgeRating: 2150, country: 'FR', wins: 105, streak: 6 },
  { rank: 8, id: '8', name: 'DarwinPro', knowledgeRating: 2100, country: 'AU', wins: 98, streak: 2 },
  { rank: 9, id: '9', name: 'HawkingWay', knowledgeRating: 2060, country: 'US', wins: 92, streak: 1 },
  { rank: 10, id: '10', name: 'GalileoX', knowledgeRating: 2020, country: 'IT', wins: 88, streak: 3 },
  { rank: 11, id: '11', name: 'FeynmanFan', knowledgeRating: 1980, country: 'US', wins: 82, streak: 0 },
  { rank: 12, id: '12', name: 'MaxwellPro', knowledgeRating: 1940, country: 'KR', wins: 78, streak: 5 },
  { rank: 13, id: '13', name: 'BohrMaster', knowledgeRating: 1900, country: 'DE', wins: 72, streak: 2 },
  { rank: 14, id: '14', name: 'PlanckPower', knowledgeRating: 1860, country: 'IN', wins: 68, streak: 1 },
  { rank: 15, id: '15', name: 'CurieSoul', knowledgeRating: 1820, country: 'BR', wins: 64, streak: 4 },
  { rank: 16, id: '16', name: 'FaradayX', knowledgeRating: 1780, country: 'GB', wins: 60, streak: 2 },
  { rank: 17, id: '17', name: 'AristotleJR', knowledgeRating: 1740, country: 'GR', wins: 55, streak: 0 },
  { rank: 18, id: '18', name: 'SocratesPro', knowledgeRating: 1700, country: 'GR', wins: 52, streak: 3 },
  { rank: 19, id: '19', name: 'PlatoMind', knowledgeRating: 1660, country: 'GR', wins: 48, streak: 1 },
  { rank: 20, id: '20', name: 'EuclidFan', knowledgeRating: 1620, country: 'GR', wins: 45, streak: 0 },
];

const SUBJECTS = ['All', 'Math', 'Physics', 'Chemistry', 'Biology', 'History', 'Geography'];

export default function GlobalLeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState(MOCK_LEADERBOARD);
  const [selectedCountry, setSelectedCountry] = useState('all');
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { isOpen: searchOpen, openSearch, closeSearch } = useGlobalSearch();

  // Filter leaderboard
  const filteredLeaderboard = leaderboard.filter(player => {
    const matchesCountry = selectedCountry === 'all' || player.country === selectedCountry;
    const matchesSearch = player.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCountry && matchesSearch;
  });

  // Get rank badge
  const getRankBadge = (rank: number) => {
    if (rank === 1) return <Crown className="w-6 h-6 text-yellow-400" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-300" />;
    if (rank === 3) return <Medal className="w-6 h-6 text-amber-600" />;
    return <span className="text-lg font-bold text-gray-400">#{rank}</span>;
  };

  // Get tier color
  const getTierColor = (kr: number) => {
    if (kr >= 2000) return 'text-yellow-400';
    if (kr >= 1500) return 'text-purple-400';
    if (kr >= 1000) return 'text-blue-400';
    return 'text-green-400';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 text-white pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-black/30 border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/sparring">
                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <Link href="/" className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-purple-400" />
                <div>
                  <h1 className="text-base font-bold">Leaderboard</h1>
                  <p className="text-[10px] text-gray-400 hidden sm:block">Top players worldwide</p>
                </div>
              </Link>
            </div>

            {/* Desktop: Search + Country Selector */}
            <div className="hidden md:flex items-center gap-3">
              <SearchTrigger onClick={openSearch} />
              <CountrySelector 
                currentCountry={selectedCountry}
                onCountryChange={(c) => setSelectedCountry(c)}
              />
            </div>

            {/* Mobile: Search + Hamburger */}
            <div className="flex md:hidden items-center gap-2">
              <SearchTrigger onClick={openSearch} />
              <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white hover:bg-white/10">
                    <Menu className="w-5 h-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[280px] bg-slate-950 border-white/10 text-white p-0">
                  <div className="h-full flex flex-col">
                    <div className="p-4 border-b border-white/10 bg-gradient-to-r from-purple-900/30 to-cyan-900/30">
                      <SheetHeader>
                        <SheetTitle className="text-white">Leaderboard Menu</SheetTitle>
                      </SheetHeader>
                      <div className="mt-4">
                        <CountrySelector 
                          currentCountry={selectedCountry}
                          onCountryChange={(c) => setSelectedCountry(c)}
                        />
                      </div>
                    </div>
                    <nav className="flex-1 p-2">
                      <Link href="/" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-300 hover:bg-white/5 hover:text-white transition-all">
                        <Home className="w-5 h-5" />
                        <span>Home</span>
                      </Link>
                      <Link href="/sparring" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-300 hover:bg-white/5 hover:text-white transition-all">
                        <Swords className="w-5 h-5" />
                        <span>Sparring</span>
                      </Link>
                      <Link href="/ai-tutor" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-300 hover:bg-white/5 hover:text-white transition-all">
                        <Brain className="w-5 h-5" />
                        <span>AI Tutor</span>
                      </Link>
                      <Link href="/videos" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-300 hover:bg-white/5 hover:text-white transition-all">
                        <Video className="w-5 h-5" />
                        <span>Videos</span>
                      </Link>
                      <Link href="/social" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-300 hover:bg-white/5 hover:text-white transition-all">
                        <Users className="w-5 h-5" />
                        <span>Social</span>
                      </Link>
                    </nav>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Top 3 Podium */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {/* 2nd Place */}
          <div className="order-1 pt-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-b from-gray-500/20 to-transparent rounded-t-3xl pt-12 pb-4 text-center border border-gray-500/30"
            >
              <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center text-xl font-bold mb-2">
                {filteredLeaderboard[1]?.name.charAt(0)}
              </div>
              <p className="font-semibold truncate px-2">{filteredLeaderboard[1]?.name}</p>
              <p className="text-2xl font-bold text-gray-300">{filteredLeaderboard[1]?.knowledgeRating}</p>
              <Badge className="mt-1 bg-gray-500/20 text-gray-300">2nd</Badge>
              <p className="text-xs mt-2 text-gray-400">
                {FLAGS[filteredLeaderboard[1]?.country || 'US'] || '🌍'} {filteredLeaderboard[1]?.country}
              </p>
            </motion.div>
          </div>

          {/* 1st Place */}
          <div className="order-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-b from-yellow-500/20 to-transparent rounded-t-3xl pt-8 pb-4 text-center border border-yellow-500/30 relative"
            >
              {filteredLeaderboard[0]?.isGlobalChampion && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <motion.div
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Crown className="w-8 h-8 text-yellow-400" />
                  </motion.div>
                </div>
              )}
              <div className="w-[72px] h-[72px] mx-auto rounded-full bg-gradient-to-br from-yellow-400 to-amber-600 flex items-center justify-center text-2xl font-bold mb-2">
                {filteredLeaderboard[0]?.name.charAt(0)}
              </div>
              <p className="font-semibold truncate px-2 text-lg">{filteredLeaderboard[0]?.name}</p>
              <p className="text-3xl font-bold text-yellow-400">{filteredLeaderboard[0]?.knowledgeRating}</p>
              <Badge className="mt-1 bg-yellow-500/30 text-yellow-400">🏆 Champion</Badge>
              <p className="text-xs mt-2 text-gray-400">
                {FLAGS[filteredLeaderboard[0]?.country || 'US'] || '🌍'} {filteredLeaderboard[0]?.country}
              </p>
            </motion.div>
          </div>

          {/* 3rd Place */}
          <div className="order-3 pt-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-b from-amber-600/20 to-transparent rounded-t-3xl pt-10 pb-4 text-center border border-amber-600/30"
            >
              <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-lg font-bold mb-2">
                {filteredLeaderboard[2]?.name.charAt(0)}
              </div>
              <p className="font-semibold truncate px-2">{filteredLeaderboard[2]?.name}</p>
              <p className="text-xl font-bold text-amber-400">{filteredLeaderboard[2]?.knowledgeRating}</p>
              <Badge className="mt-1 bg-amber-500/20 text-amber-400">3rd</Badge>
              <p className="text-xs mt-2 text-gray-400">
                {FLAGS[filteredLeaderboard[2]?.country || 'US'] || '🌍'} {filteredLeaderboard[2]?.country}
              </p>
            </motion.div>
          </div>
        </div>

        {/* Subject Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-4 scrollbar-hide">
          <Button
            onClick={() => setSelectedCountry('all')}
            variant={selectedCountry === 'all' ? 'default' : 'outline'}
            className={`whitespace-nowrap ${selectedCountry === 'all' ? 'bg-purple-600' : 'border-white/20'}`}
          >
            <Globe className="w-4 h-4 mr-2" />
            All Countries
          </Button>
          {SUBJECTS.slice(1, 5).map((subject) => (
            <Button
              key={subject}
              onClick={() => setSelectedSubject(subject)}
              variant={selectedSubject === subject ? 'default' : 'outline'}
              className={`whitespace-nowrap ${selectedSubject === subject ? 'bg-purple-600' : 'border-white/20'}`}
            >
              {subject}
            </Button>
          ))}
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search players..."
            className="pl-9 bg-white/5 border-white/10 focus:border-purple-500"
          />
        </div>

        {/* Leaderboard List */}
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-0">
            <div className="divide-y divide-white/5">
              {filteredLeaderboard.slice(3).map((player, index) => (
                <motion.div
                  key={player.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.02 }}
                  className="flex items-center gap-4 p-4 hover:bg-white/5 transition-colors"
                >
                  {/* Rank */}
                  <div className="w-12 text-center">
                    <span className="text-lg font-bold text-gray-400">#{player.rank}</span>
                  </div>

                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-sm font-bold">
                    {player.name.charAt(0)}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold truncate">{player.name}</p>
                      {player.isGlobalChampion && (
                        <Crown className="w-4 h-4 text-yellow-400" />
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <span>{FLAGS[player.country] || '🌍'} {player.country}</span>
                      <span className="flex items-center gap-1">
                        <Flame className="w-3 h-3 text-orange-400" />
                        {player.streak}
                      </span>
                    </div>
                  </div>

                  {/* Score */}
                  <div className="text-right">
                    <p className={`text-xl font-bold ${getTierColor(player.knowledgeRating)}`}>
                      {player.knowledgeRating}
                    </p>
                    <p className="text-xs text-gray-400">{player.wins} wins</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Stats Summary */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <Card className="bg-white/5 border-white/10 text-center">
            <CardContent className="py-4">
              <Trophy className="w-6 h-6 mx-auto text-yellow-400 mb-2" />
              <p className="text-2xl font-bold">{leaderboard.length}</p>
              <p className="text-xs text-gray-400">Total Players</p>
            </CardContent>
          </Card>
          <Card className="bg-white/5 border-white/10 text-center">
            <CardContent className="py-4">
              <Globe className="w-6 h-6 mx-auto text-purple-400 mb-2" />
              <p className="text-2xl font-bold">{new Set(leaderboard.map(p => p.country)).size}</p>
              <p className="text-xs text-gray-400">Countries</p>
            </CardContent>
          </Card>
          <Card className="bg-white/5 border-white/10 text-center">
            <CardContent className="py-4">
              <TrendingUp className="w-6 h-6 mx-auto text-green-400 mb-2" />
              <p className="text-2xl font-bold">{Math.round(leaderboard.reduce((a, b) => a + b.knowledgeRating, 0) / leaderboard.length)}</p>
              <p className="text-xs text-gray-400">Avg. Rating</p>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Global Search */}
      <GlobalSearch isOpen={searchOpen} onClose={closeSearch} />
    </div>
  );
}
