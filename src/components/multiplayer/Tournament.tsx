'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy, Crown, Users, Clock, Calendar, ChevronRight, ChevronLeft,
  Star, Zap, Target, Award, Medal, Radio, Eye, ArrowRight, CheckCircle,
  XCircle, Loader2, Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { Tournament, TournamentParticipant, TournamentRound, TournamentMatch } from '@/types/multiplayer';

// Mock tournament data
const mockTournaments: Tournament[] = [
  {
    id: 't1',
    name: 'Math Olympiad Championship',
    description: 'The ultimate mathematics competition for elite students',
    subject: 'Math',
    startDate: new Date(Date.now() + 86400000).toISOString(),
    endDate: new Date(Date.now() + 86400000 * 3).toISOString(),
    maxParticipants: 64,
    currentParticipants: 58,
    prizePool: 10000,
    entryFee: 0,
    minRating: 800,
    maxRating: 1500,
    status: 'upcoming',
    rounds: [],
    participants: [],
    bracket: undefined,
    rules: ['Single elimination', '5 questions per round', '15 seconds per question'],
    isOfficial: true,
    sponsors: ['EduSparring', 'Math Society'],
  },
  {
    id: 't2',
    name: 'Physics Grand Slam',
    description: 'Test your physics knowledge against the best',
    subject: 'Physics',
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 86400000 * 2).toISOString(),
    maxParticipants: 32,
    currentParticipants: 32,
    prizePool: 5000,
    entryFee: 100,
    minRating: 700,
    status: 'active',
    rounds: [],
    participants: [],
    bracket: undefined,
    rules: ['Double elimination', 'Advanced difficulty'],
    isOfficial: true,
    sponsors: [],
  },
  {
    id: 't3',
    name: 'Chemistry Weekly Cup',
    description: 'Weekly chemistry competition',
    subject: 'Chemistry',
    startDate: new Date(Date.now() - 86400000).toISOString(),
    endDate: new Date().toISOString(),
    maxParticipants: 16,
    currentParticipants: 16,
    prizePool: 1000,
    entryFee: 0,
    minRating: 0,
    status: 'completed',
    rounds: [],
    participants: [],
    bracket: {
      rounds: [
        {
          roundNumber: 1,
          name: 'Round of 16',
          matches: [],
        },
        {
          roundNumber: 2,
          name: 'Quarter Finals',
          matches: [],
        },
        {
          roundNumber: 3,
          name: 'Semi Finals',
          matches: [],
        },
        {
          roundNumber: 4,
          name: 'Finals',
          matches: [],
        },
      ],
      champion: 'ChemMaster_99',
    },
    rules: ['Single elimination'],
    isOfficial: false,
    sponsors: [],
  },
];

// Tournament Card Component
export function TournamentCard({ 
  tournament, 
  onJoin,
  onView 
}: { 
  tournament: Tournament; 
  onJoin?: () => void;
  onView?: () => void;
}) {
  const getStatusColor = (status: Tournament['status']) => {
    switch (status) {
      case 'upcoming': return 'text-yellow-400 bg-yellow-500/20';
      case 'active': return 'text-green-400 bg-green-500/20';
      case 'completed': return 'text-gray-400 bg-gray-500/20';
      case 'cancelled': return 'text-red-400 bg-red-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const spotsLeft = tournament.maxParticipants - tournament.currentParticipants;
  const isFull = spotsLeft === 0;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="cursor-pointer"
      onClick={onView}
    >
      <Card className={`overflow-hidden ${
        tournament.isOfficial 
          ? 'bg-gradient-to-br from-yellow-900/20 to-orange-900/20 border-yellow-500/30' 
          : 'bg-white/5 border-white/10'
      }`}>
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                {tournament.isOfficial && (
                  <Badge className="bg-yellow-500/20 text-yellow-400">
                    <Star className="w-3 h-3 mr-1" />
                    Official
                  </Badge>
                )}
                <Badge className={getStatusColor(tournament.status)}>
                  {tournament.status.charAt(0).toUpperCase() + tournament.status.slice(1)}
                </Badge>
              </div>
              <CardTitle className="text-lg">{tournament.name}</CardTitle>
              <CardDescription className="text-gray-400">
                {tournament.description}
              </CardDescription>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 text-yellow-400">
                <Trophy className="w-4 h-4" />
                <span className="font-bold">{tournament.prizePool.toLocaleString()}</span>
              </div>
              <p className="text-xs text-gray-400">prize pool</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <p className="text-lg font-bold">{tournament.currentParticipants}/{tournament.maxParticipants}</p>
              <p className="text-xs text-gray-400">Players</p>
            </div>
            <div>
              <p className="text-lg font-bold">{tournament.subject}</p>
              <p className="text-xs text-gray-400">Subject</p>
            </div>
            <div>
              <p className="text-lg font-bold">
                {tournament.entryFee > 0 ? `${tournament.entryFee}` : 'Free'}
              </p>
              <p className="text-xs text-gray-400">Entry</p>
            </div>
          </div>

          {/* Progress */}
          {tournament.status === 'upcoming' && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Registration</span>
                <span className={isFull ? 'text-red-400' : 'text-green-400'}>
                  {isFull ? 'Full' : `${spotsLeft} spots left`}
                </span>
              </div>
              <Progress 
                value={(tournament.currentParticipants / tournament.maxParticipants) * 100} 
                className="h-1"
              />
            </div>
          )}

          {/* Date */}
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Calendar className="w-4 h-4" />
            <span>
              {new Date(tournament.startDate).toLocaleDateString()} - {new Date(tournament.endDate).toLocaleDateString()}
            </span>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            {tournament.status === 'upcoming' && !isFull && (
              <Button 
                onClick={(e) => { e.stopPropagation(); onJoin?.(); }}
                className="flex-1 bg-gradient-to-r from-purple-500 to-cyan-500"
              >
                <Zap className="w-4 h-4 mr-2" />
                Register Now
              </Button>
            )}
            {tournament.status === 'active' && (
              <Button 
                onClick={(e) => { e.stopPropagation(); onView?.(); }}
                className="flex-1 bg-green-500/20 text-green-400 hover:bg-green-500/30"
              >
                <Eye className="w-4 h-4 mr-2" />
                Watch Live
              </Button>
            )}
            {tournament.status === 'completed' && (
              <Button 
                onClick={(e) => { e.stopPropagation(); onView?.(); }}
                variant="outline" 
                className="flex-1 border-white/20"
              >
                <Trophy className="w-4 h-4 mr-2" />
                View Results
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Tournament Bracket Display
export function TournamentBracket({ tournament }: { tournament: Tournament }) {
  const [selectedMatch, setSelectedMatch] = useState<TournamentMatch | null>(null);

  // Generate mock bracket data
  const generateMockBracket = () => {
    const rounds: TournamentRound[] = [];
    const numRounds = Math.ceil(Math.log2(tournament.maxParticipants));
    const roundNames = ['Round of 64', 'Round of 32', 'Round of 16', 'Quarter Finals', 'Semi Finals', 'Finals'];

    for (let r = 0; r < numRounds; r++) {
      const matchesInRound = Math.pow(2, numRounds - r - 1);
      const matches: TournamentMatch[] = [];

      for (let m = 0; m < matchesInRound; m++) {
        const isCompleted = r < 2 || (r === 2 && m < matchesInRound / 2);
        matches.push({
          id: `m-${r}-${m}`,
          roundNumber: r + 1,
          position: m + 1,
          player1: {
            id: `p-${r}-${m}-1`,
            userId: `user-${r}-${m}-1`,
            name: r === 0 ? `Player ${m * 2 + 1}` : `Winner M${r - 1}-${Math.floor(m / 2) * 2 + 1}`,
            knowledgeRating: 800 + Math.floor(Math.random() * 400),
            seed: m * 2 + 1,
            wins: Math.floor(Math.random() * 3),
            losses: Math.floor(Math.random() * 2),
            draws: 0,
            points: Math.floor(Math.random() * 1000),
            eliminated: isCompleted && Math.random() > 0.5,
          },
          player2: {
            id: `p-${r}-${m}-2`,
            userId: `user-${r}-${m}-2`,
            name: r === 0 ? `Player ${m * 2 + 2}` : `Winner M${r - 1}-${Math.floor(m / 2) * 2 + 2}`,
            knowledgeRating: 800 + Math.floor(Math.random() * 400),
            seed: m * 2 + 2,
            wins: Math.floor(Math.random() * 3),
            losses: Math.floor(Math.random() * 2),
            draws: 0,
            points: Math.floor(Math.random() * 1000),
            eliminated: isCompleted && Math.random() > 0.5,
          },
          winner: isCompleted ? `user-${r}-${m}-${Math.random() > 0.5 ? 1 : 2}` : undefined,
          status: isCompleted ? 'completed' : 'pending',
        });
      }

      rounds.push({
        roundNumber: r + 1,
        name: roundNames[r] || `Round ${r + 1}`,
        matches,
      });
    }

    return rounds;
  };

  const bracket = tournament.bracket || { rounds: generateMockBracket(), champion: undefined };

  return (
    <Card className="bg-white/5 border-white/10 overflow-hidden">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl">{tournament.name}</CardTitle>
            <p className="text-sm text-gray-400">{tournament.subject} • {tournament.status}</p>
          </div>
          {bracket.champion && (
            <Badge className="bg-yellow-500/20 text-yellow-400 text-base px-4 py-1">
              <Crown className="w-4 h-4 mr-2" />
              Champion: {bracket.champion}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <div className="flex gap-8 min-w-max pb-4">
            {bracket.rounds.map((round, roundIndex) => (
              <div key={round.roundNumber} className="flex flex-col gap-4">
                {/* Round Header */}
                <div className="text-center mb-2">
                  <h4 className="font-semibold text-white">{round.name}</h4>
                  <p className="text-xs text-gray-400">{round.matches.length} matches</p>
                </div>

                {/* Matches */}
                <div className="flex flex-col gap-4" style={{ 
                  justifyContent: `space-around`,
                  minHeight: `${Math.pow(2, bracket.rounds.length) * 60}px`
                }}>
                  {round.matches.map((match) => (
                    <motion.div
                      key={match.id}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => setSelectedMatch(match)}
                      className={`cursor-pointer p-3 rounded-lg border transition-all ${
                        match.status === 'completed'
                          ? 'bg-white/5 border-white/10'
                          : match.status === 'in_progress'
                          ? 'bg-green-500/10 border-green-500/30'
                          : 'bg-white/5 border-white/10 opacity-60'
                      }`}
                    >
                      {/* Player 1 */}
                      <div className={`flex items-center gap-2 p-2 rounded ${
                        match.winner === match.player1?.userId ? 'bg-green-500/20' : ''
                      }`}>
                        <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs">
                          {match.player1?.seed}
                        </div>
                        <span className="flex-1 text-sm truncate">{match.player1?.name}</span>
                        {match.winner === match.player1?.userId && (
                          <CheckCircle className="w-4 h-4 text-green-400" />
                        )}
                      </div>

                      <div className="text-center text-xs text-gray-500 py-1">vs</div>

                      {/* Player 2 */}
                      <div className={`flex items-center gap-2 p-2 rounded ${
                        match.winner === match.player2?.userId ? 'bg-green-500/20' : ''
                      }`}>
                        <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs">
                          {match.player2?.seed}
                        </div>
                        <span className="flex-1 text-sm truncate">{match.player2?.name}</span>
                        {match.winner === match.player2?.userId && (
                          <CheckCircle className="w-4 h-4 text-green-400" />
                        )}
                      </div>

                      {/* Match Status */}
                      {match.status === 'in_progress' && (
                        <div className="mt-2 flex items-center justify-center gap-1 text-xs text-green-400">
                          <Radio className="w-3 h-3 animate-pulse" />
                          Live
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Tournament Leaderboard
export function TournamentLeaderboard({ tournament }: { tournament: Tournament }) {
  // Mock leaderboard data
  const leaderboard = [
    { rank: 1, name: 'Champion_X', points: 2450, wins: 5, losses: 0 },
    { rank: 2, name: 'RunnerUp_Pro', points: 2100, wins: 4, losses: 1 },
    { rank: 3, name: 'Semifinal_Ace', points: 1800, wins: 3, losses: 2 },
    { rank: 4, name: 'Semifinal_Star', points: 1750, wins: 3, losses: 2 },
    { rank: 5, name: 'Quarter_Fighter', points: 1500, wins: 2, losses: 2 },
  ];

  return (
    <Card className="bg-white/5 border-white/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-400" />
          Tournament Standings
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {leaderboard.map((entry, index) => (
            <motion.div
              key={entry.rank}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex items-center gap-3 p-3 rounded-lg ${
                entry.rank <= 3 ? 'bg-yellow-500/10' : 'bg-white/5'
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                entry.rank === 1 ? 'bg-yellow-500 text-black' :
                entry.rank === 2 ? 'bg-gray-300 text-black' :
                entry.rank === 3 ? 'bg-orange-500 text-white' :
                'bg-white/10 text-gray-400'
              }`}>
                {entry.rank <= 3 ? <Medal className="w-5 h-5" /> : entry.rank}
              </div>
              <div className="flex-1">
                <p className="font-medium">{entry.name}</p>
                <p className="text-xs text-gray-400">
                  {entry.wins}W - {entry.losses}L
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold text-purple-400">{entry.points}</p>
                <p className="text-xs text-gray-400">points</p>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Tournaments List Component
export function TournamentsList() {
  const [tournaments, setTournaments] = useState(mockTournaments);
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);

  const activeTournaments = tournaments.filter(t => t.status === 'active');
  const upcomingTournaments = tournaments.filter(t => t.status === 'upcoming');
  const completedTournaments = tournaments.filter(t => t.status === 'completed');

  if (selectedTournament) {
    return (
      <div className="space-y-6">
        <Button
          variant="ghost"
          onClick={() => setSelectedTournament(null)}
          className="text-gray-400"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back to Tournaments
        </Button>
        <TournamentBracket tournament={selectedTournament} />
        <TournamentLeaderboard tournament={selectedTournament} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Active Tournaments */}
      {activeTournaments.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Radio className="w-5 h-5 text-green-400 animate-pulse" />
            Live Now
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {activeTournaments.map(t => (
              <TournamentCard
                key={t.id}
                tournament={t}
                onView={() => setSelectedTournament(t)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Upcoming Tournaments */}
      {upcomingTournaments.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-yellow-400" />
            Upcoming
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {upcomingTournaments.map(t => (
              <TournamentCard
                key={t.id}
                tournament={t}
                onJoin={() => console.log('Join tournament:', t.id)}
                onView={() => setSelectedTournament(t)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Completed Tournaments */}
      {completedTournaments.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-gray-400" />
            Completed
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {completedTournaments.map(t => (
              <TournamentCard
                key={t.id}
                tournament={t}
                onView={() => setSelectedTournament(t)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
