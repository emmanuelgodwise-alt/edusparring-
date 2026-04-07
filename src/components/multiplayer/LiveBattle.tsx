'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Swords, Users, Clock, Trophy, Target, Zap, Eye, MessageCircle,
  ChevronRight, Radio, Crown, Flame, Star, AlertCircle,
  CheckCircle, XCircle, Loader2, Volume2, VolumeX
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { LiveBattle, BattlePlayer, BattleRound, BattleQuestion } from '@/types/multiplayer';

// Hook for real-time battle state
export function useLiveBattle(battleId: string, playerId: string) {
  const [battle, setBattle] = useState<LiveBattle | null>(null);
  const [currentRound, setCurrentRound] = useState<BattleRound | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isConnected, setIsConnected] = useState(false);

  // Simulate WebSocket connection (in production, use actual WebSocket)
  useEffect(() => {
    // Mock initial battle state
    const mockBattle: LiveBattle = {
      id: battleId,
      status: 'active',
      players: [
        {
          id: playerId,
          name: 'You',
          knowledgeRating: 850,
          score: 0,
          correctAnswers: 0,
          wrongAnswers: 0,
          averageResponseTime: 0,
          streak: 0,
          isReady: true,
          disconnected: false,
        },
        {
          id: 'opponent-1',
          name: 'Opponent',
          knowledgeRating: 820,
          score: 0,
          correctAnswers: 0,
          wrongAnswers: 0,
          averageResponseTime: 0,
          streak: 0,
          isReady: true,
          disconnected: false,
        },
      ],
      currentRound: 1,
      totalRounds: 5,
      subject: 'Math',
      difficulty: 5,
      spectators: 42,
      isRanked: true,
    };

    setBattle(mockBattle);
    setIsConnected(true);

    // Simulate polling for updates
    const interval = setInterval(() => {
      // In production, this would be WebSocket messages
      setBattle(prev => prev ? { ...prev, spectators: prev.spectators + Math.floor(Math.random() * 3) - 1 } : null);
    }, 5000);

    return () => clearInterval(interval);
  }, [battleId, playerId]);

  // Timer for current question
  useEffect(() => {
    if (battle?.status === 'active' && currentRound && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => Math.max(0, prev - 1));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [battle?.status, currentRound, timeLeft]);

  const submitAnswer = useCallback((answer: string) => {
    if (!battle || selectedAnswer) return;
    setSelectedAnswer(answer);
    // In production, send to WebSocket
  }, [battle, selectedAnswer]);

  const startNextRound = useCallback((question: BattleQuestion) => {
    setCurrentRound({
      roundNumber: battle?.currentRound || 1,
      question,
      playerAnswers: {},
      correctAnswer: question.correctAnswer,
      startedAt: new Date().toISOString(),
    });
    setTimeLeft(question.timeLimit);
    setSelectedAnswer(null);
  }, [battle]);

  return {
    battle,
    currentRound,
    selectedAnswer,
    timeLeft,
    isConnected,
    submitAnswer,
    startNextRound,
    setSelectedAnswer,
  };
}

// Live Battle Arena Component
interface LiveBattleArenaProps {
  battleId: string;
  playerId: string;
  onBattleEnd?: (result: { won: boolean; score: number }) => void;
}

export function LiveBattleArena({ battleId, playerId, onBattleEnd }: LiveBattleArenaProps) {
  const {
    battle,
    currentRound,
    selectedAnswer,
    timeLeft,
    isConnected,
    submitAnswer,
  } = useLiveBattle(battleId, playerId);

  const [showResult, setShowResult] = useState(false);

  // Mock question for demo
  const mockQuestion: BattleQuestion = {
    id: 'q1',
    question: 'What is the derivative of x²?',
    options: ['x', '2x', '2', 'x²'],
    correctAnswer: '2x',
    difficulty: 5,
    subject: 'Math',
    topic: 'Calculus',
    timeLimit: 15,
    points: 100,
  };

  if (!battle) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
        <span className="ml-3 text-gray-400">Connecting to battle...</span>
      </div>
    );
  }

  const opponent = battle.players.find(p => p.id !== playerId);
  const player = battle.players.find(p => p.id === playerId);

  return (
    <div className="space-y-4">
      {/* Connection Status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className="text-xs text-gray-400">{isConnected ? 'Connected' : 'Reconnecting...'}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <Eye className="w-3 h-3" />
          {battle.spectators} watching
        </div>
      </div>

      {/* Battle Header */}
      <Card className="bg-gradient-to-r from-purple-900/30 to-cyan-900/30 border-purple-500/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Swords className="w-5 h-5 text-purple-400" />
              <span className="font-semibold">{battle.subject} Battle</span>
              {battle.isRanked && (
                <Badge className="bg-yellow-500/20 text-yellow-400">
                  <Crown className="w-3 h-3 mr-1" />
                  Ranked
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="border-white/20">
                Round {battle.currentRound}/{battle.totalRounds}
              </Badge>
              <div className="flex items-center gap-1 text-xs text-gray-400">
                <Clock className="w-3 h-3" />
                {battle.status === 'active' ? 'In Progress' : battle.status}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Players Score Display */}
      <div className="grid grid-cols-3 gap-4">
        {/* Player */}
        <Card className={`${selectedAnswer === mockQuestion.correctAnswer ? 'border-green-500/50 bg-green-500/10' : 'bg-white/5'} border-white/10`}>
          <CardContent className="p-4 text-center">
            <Avatar className="w-12 h-12 mx-auto mb-2">
              <AvatarFallback className="bg-gradient-to-br from-green-500 to-emerald-600">
                {player?.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <p className="font-semibold">{player?.name}</p>
            <p className="text-xs text-gray-400">{player?.knowledgeRating} KR</p>
            <p className="text-3xl font-bold text-green-400 mt-2">{player?.score}</p>
            {player?.streak > 0 && (
              <div className="flex items-center justify-center gap-1 mt-1">
                <Flame className="w-3 h-3 text-orange-400" />
                <span className="text-xs text-orange-400">{player.streak}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* VS */}
        <div className="flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto mb-2">
              <Swords className="w-6 h-6 text-purple-400" />
            </div>
            <span className="text-sm font-bold text-gray-400">VS</span>
          </div>
        </div>

        {/* Opponent */}
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-4 text-center">
            <Avatar className="w-12 h-12 mx-auto mb-2">
              <AvatarFallback className="bg-gradient-to-br from-red-500 to-orange-600">
                {opponent?.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <p className="font-semibold">{opponent?.name}</p>
            <p className="text-xs text-gray-400">{opponent?.knowledgeRating} KR</p>
            <p className="text-3xl font-bold text-red-400 mt-2">{opponent?.score}</p>
          </CardContent>
        </Card>
      </div>

      {/* Question Card */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Question {battle.currentRound}</CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-purple-500/30 text-purple-400">
                {mockQuestion.topic}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Timer */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Time Remaining</span>
            <span className={`text-lg font-bold ${timeLeft <= 5 ? 'text-red-400' : 'text-white'}`}>
              {timeLeft}s
            </span>
          </div>
          <Progress 
            value={(timeLeft / mockQuestion.timeLimit) * 100} 
            className={`h-2 ${timeLeft <= 5 ? 'bg-red-500/20' : ''}`}
          />

          {/* Question */}
          <p className="text-lg font-medium py-4">{mockQuestion.question}</p>

          {/* Options */}
          <div className="grid grid-cols-2 gap-3">
            {mockQuestion.options.map((option, index) => {
              const isSelected = selectedAnswer === option;
              const isCorrect = option === mockQuestion.correctAnswer;
              const showFeedback = selectedAnswer !== null;

              return (
                <motion.button
                  key={option}
                  whileHover={{ scale: selectedAnswer ? 1 : 1.02 }}
                  whileTap={{ scale: selectedAnswer ? 1 : 0.98 }}
                  onClick={() => !selectedAnswer && submitAnswer(option)}
                  disabled={selectedAnswer !== null}
                  className={`p-4 rounded-xl text-left transition-all ${
                    showFeedback && isCorrect
                      ? 'bg-green-500/30 border-green-500 text-green-400'
                      : showFeedback && isSelected && !isCorrect
                      ? 'bg-red-500/30 border-red-500 text-red-400'
                      : isSelected
                      ? 'bg-purple-500/30 border-purple-500'
                      : 'bg-white/5 border-white/10 hover:border-purple-500/50'
                  } border`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm font-medium">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span className="flex-1">{option}</span>
                    {showFeedback && isCorrect && <CheckCircle className="w-5 h-5 text-green-400" />}
                    {showFeedback && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-red-400" />}
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Points */}
          <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
            <Target className="w-4 h-4" />
            {mockQuestion.points} points • {mockQuestion.difficulty}/10 difficulty
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Matchmaking Queue Component
export function MatchmakingQueue({ 
  subject, 
  onMatchFound 
}: { 
  subject: string; 
  onMatchFound: (match: { battleId: string; opponent: BattlePlayer }) => void;
}) {
  const [isSearching, setIsSearching] = useState(false);
  const [searchTime, setSearchTime] = useState(0);
  const [playersFound, setPlayersFound] = useState(0);

  useEffect(() => {
    if (isSearching) {
      const timer = setInterval(() => {
        setSearchTime(prev => prev + 1);
        setPlayersFound(prev => Math.min(prev + Math.floor(Math.random() * 3), 100));
      }, 1000);

      // Simulate match found after 3-8 seconds
      const matchTimer = setTimeout(() => {
        onMatchFound({
          battleId: `battle-${Date.now()}`,
          opponent: {
            id: 'opponent-1',
            name: 'Scholar_X',
            knowledgeRating: 845,
            score: 0,
            correctAnswers: 0,
            wrongAnswers: 0,
            averageResponseTime: 0,
            streak: 0,
            isReady: true,
            disconnected: false,
          },
        });
        setIsSearching(false);
      }, 3000 + Math.random() * 5000);

      return () => {
        clearInterval(timer);
        clearTimeout(matchTimer);
      };
    }
  }, [isSearching, onMatchFound]);

  const startSearch = () => {
    setIsSearching(true);
    setSearchTime(0);
    setPlayersFound(0);
  };

  const cancelSearch = () => {
    setIsSearching(false);
    setSearchTime(0);
    setPlayersFound(0);
  };

  return (
    <Card className="bg-white/5 border-white/10">
      <CardContent className="p-6">
        {!isSearching ? (
          <div className="text-center">
            <Swords className="w-12 h-12 mx-auto mb-4 text-purple-400" />
            <h3 className="text-lg font-semibold mb-2">Find an Opponent</h3>
            <p className="text-sm text-gray-400 mb-4">
              Battle in real-time with players worldwide
            </p>
            <Button
              onClick={startSearch}
              className="bg-gradient-to-r from-purple-500 to-cyan-500 w-full"
            >
              <Zap className="w-4 h-4 mr-2" />
              Quick Match: {subject}
            </Button>
          </div>
        ) : (
          <div className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="w-16 h-16 mx-auto mb-4"
            >
              <Swords className="w-16 h-16 text-purple-400" />
            </motion.div>
            <h3 className="text-lg font-semibold mb-2">Finding Opponent...</h3>
            <p className="text-sm text-gray-400 mb-4">
              Searching in {subject} • {searchTime}s elapsed
            </p>
            <div className="flex items-center justify-center gap-2 text-xs text-gray-500 mb-4">
              <Users className="w-3 h-3" />
              {playersFound} players in queue
            </div>
            <Button variant="outline" onClick={cancelSearch} className="border-white/20">
              Cancel
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Live Battle Card (for listings)
export function LiveBattleCard({ 
  battle, 
  onClick 
}: { 
  battle: LiveBattle; 
  onClick?: () => void;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      onClick={onClick}
      className="cursor-pointer"
    >
      <Card className={`overflow-hidden ${
        battle.status === 'active' 
          ? 'bg-gradient-to-r from-red-900/20 to-purple-900/20 border-red-500/30' 
          : 'bg-white/5 border-white/10'
      }`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              {battle.status === 'active' && (
                <Badge className="bg-red-500/20 text-red-400 animate-pulse">
                  <Radio className="w-3 h-3 mr-1" />
                  LIVE
                </Badge>
              )}
              <span className="text-sm font-medium">{battle.subject}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <Eye className="w-3 h-3" />
              {battle.spectators}
            </div>
          </div>

          {/* Players */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-gradient-to-br from-green-500 to-emerald-600 text-xs">
                  {battle.players[0]?.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{battle.players[0]?.name}</p>
                <p className="text-xs text-gray-400">{battle.players[0]?.score} pts</p>
              </div>
            </div>

            <span className="text-lg font-bold text-gray-500">vs</span>

            <div className="flex items-center gap-2">
              <div className="text-right">
                <p className="text-sm font-medium">{battle.players[1]?.name}</p>
                <p className="text-xs text-gray-400">{battle.players[1]?.score} pts</p>
              </div>
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-gradient-to-br from-red-500 to-orange-600 text-xs">
                  {battle.players[1]?.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>

          <div className="flex items-center justify-between mt-3 text-xs text-gray-400">
            <span>Round {battle.currentRound}/{battle.totalRounds}</span>
            {battle.isRanked && (
              <Badge variant="outline" className="border-yellow-500/30 text-yellow-400">
                <Crown className="w-3 h-3 mr-1" />
                Ranked
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
