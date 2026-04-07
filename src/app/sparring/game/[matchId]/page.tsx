'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import {
  Send, User, CheckCircle2, XCircle,
  HelpCircle, Trophy, RotateCcw, Target, Volume2, VolumeX, Clock, Swords
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

// Subject icons
const subjectIcons: Record<string, string> = {
  Math: '📐', Physics: '⚛️', Chemistry: '🧪', Biology: '🧬',
  History: '📜', Geography: '🌍', Literature: '📚', Economics: '💰',
  ComputerScience: '💻', Civics: '⚖️', English: '📖',
};

interface GameState {
  matchId: string;
  opponent: { id: string; name: string; knowledgeRating: number };
  subject: string;
  difficulty: string;
  currentRound: number;
  totalRounds: number;
  playerScore: number;
  opponentScore: number;
  isPlayerTurn: boolean;
  currentQuestion: { text: string; options: string[]; correct: string } | null;
  timeLeft: number;
  messages: Array<{ id: string; type: string; content: string; sender: string; isCorrect?: boolean }>;
  status: 'active' | 'ended';
  winner: 'player' | 'opponent' | 'draw' | null;
}

const QUESTIONS_BANK: Record<string, Array<{ text: string; options: string[]; correct: string }>> = {
  Math: [
    { text: 'What is 15 × 8?', options: ['A. 120', 'B. 115', 'C. 130', 'D. 125'], correct: 'A' },
    { text: 'What is the square root of 144?', options: ['A. 10', 'B. 11', 'C. 12', 'D. 13'], correct: 'C' },
    { text: 'What is 25% of 80?', options: ['A. 15', 'B. 20', 'C. 25', 'D. 30'], correct: 'B' },
    { text: 'What is 2³ (2 cubed)?', options: ['A. 6', 'B. 8', 'C. 9', 'D. 16'], correct: 'B' },
    { text: 'Solve: 3x + 5 = 20', options: ['A. x = 3', 'B. x = 4', 'C. x = 5', 'D. x = 6'], correct: 'C' },
  ],
  Physics: [
    { text: 'What is the speed of light?', options: ['A. 3×10⁶ m/s', 'B. 3×10⁸ m/s', 'C. 3×10¹⁰ m/s', 'D. 3×10⁵ m/s'], correct: 'B' },
    { text: 'What is the unit of force?', options: ['A. Joule', 'B. Watt', 'C. Newton', 'D. Pascal'], correct: 'C' },
    { text: 'What is F=ma?', options: ['A. Ohms Law', 'B. Newtons 2nd Law', 'C. Einsteins Equation', 'D. Hookes Law'], correct: 'B' },
  ],
  Chemistry: [
    { text: 'What is H₂O?', options: ['A. Hydrogen', 'B. Oxygen', 'C. Water', 'D. Hydrogen Peroxide'], correct: 'C' },
    { text: 'What is the atomic number of Carbon?', options: ['A. 4', 'B. 6', 'C. 8', 'D. 12'], correct: 'B' },
    { text: 'What is the pH of pure water?', options: ['A. 5', 'B. 7', 'C. 9', 'D. 14'], correct: 'B' },
  ],
  Biology: [
    { text: 'What is the powerhouse of the cell?', options: ['A. Nucleus', 'B. Ribosome', 'C. Mitochondria', 'D. Golgi'], correct: 'C' },
    { text: 'How many chromosomes do humans have?', options: ['A. 23', 'B. 46', 'C. 48', 'D. 44'], correct: 'B' },
    { text: 'What gas do plants absorb?', options: ['A. Oxygen', 'B. Nitrogen', 'C. CO₂', 'D. Hydrogen'], correct: 'C' },
  ],
};

function getQuestion(subject: string) {
  const bank = QUESTIONS_BANK[subject] || QUESTIONS_BANK.Math;
  return bank[Math.floor(Math.random() * bank.length)];
}

export default function PvPGamePage() {
  const params = useParams();
  const router = useRouter();
  const matchId = params.matchId as string;
  
  const [isLoading, setIsLoading] = useState(true);
  const [playerQuestion, setPlayerQuestion] = useState('');
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const [gameState, setGameState] = useState<GameState>({
    matchId,
    opponent: { id: 'opponent-1', name: 'Opponent', knowledgeRating: 1200 },
    subject: 'Math',
    difficulty: 'medium',
    currentRound: 1,
    totalRounds: 5,
    playerScore: 0,
    opponentScore: 0,
    isPlayerTurn: true,
    currentQuestion: null,
    timeLeft: 30,
    messages: [],
    status: 'active',
    winner: null,
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [gameState.messages]);

  useEffect(() => {
    setTimeout(() => {
      setGameState(prev => ({
        ...prev,
        messages: [{
          id: '1',
          type: 'system',
          content: 'Match started! You ask first. Type a question for your opponent!',
          sender: 'system'
        }]
      }));
      setIsLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    if (gameState.status !== 'active' || isLoading) return;
    
    const timer = setInterval(() => {
      setGameState(prev => {
        if (prev.timeLeft <= 1) {
          if (!prev.isPlayerTurn && prev.currentQuestion) {
            return {
              ...prev,
              timeLeft: 30,
              currentRound: prev.currentRound + 1,
              currentQuestion: null,
              isPlayerTurn: true,
              messages: [...prev.messages, {
                id: Date.now().toString(),
                type: 'timeout',
                content: "Time's up! You didn't answer in time.",
                sender: 'system'
              }]
            };
          }
          return { ...prev, timeLeft: 30 };
        }
        return { ...prev, timeLeft: prev.timeLeft - 1 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState.status, isLoading]);

  const handleAskQuestion = () => {
    if (!playerQuestion.trim()) return;

    const newMsg = {
      id: Date.now().toString(),
      type: 'question',
      content: playerQuestion,
      sender: 'player'
    };

    setGameState(prev => ({
      ...prev,
      messages: [...prev.messages, newMsg],
      isPlayerTurn: false,
      timeLeft: 30
    }));

    setPlayerQuestion('');

    setTimeout(() => {
      const isCorrect = Math.random() > 0.4;
      const points = isCorrect ? 15 : 0;

      setGameState(prev => ({
        ...prev,
        opponentScore: prev.opponentScore + points,
        messages: [...prev.messages, {
          id: (Date.now() + 1).toString(),
          type: 'answer',
          content: isCorrect ? `I think the answer is... (correct!)` : `Hmm, I'm not sure... (wrong)`,
          sender: 'opponent',
          isCorrect
        }]
      }));

      setTimeout(() => {
        const q = getQuestion(gameState.subject);
        setGameState(prev => ({
          ...prev,
          currentQuestion: q,
          messages: [...prev.messages, {
            id: (Date.now() + 2).toString(),
            type: 'question',
            content: q.text,
            sender: 'opponent'
          }],
          timeLeft: 30
        }));
      }, 1500);
    }, 2000);
  };

  const handleAnswer = (answer: string) => {
    if (!gameState.currentQuestion) return;

    setSelectedAnswer(answer);
    const isCorrect = gameState.currentQuestion.correct === answer;
    const points = isCorrect ? 15 : 0;

    setGameState(prev => {
      const newRound = prev.currentRound + 1;
      const isEnded = newRound > prev.totalRounds;
      const newPlayerScore = prev.playerScore + points;

      let winner: 'player' | 'opponent' | 'draw' | null = null;
      if (isEnded) {
        if (newPlayerScore > prev.opponentScore) winner = 'player';
        else if (newPlayerScore < prev.opponentScore) winner = 'opponent';
        else winner = 'draw';
      }

      return {
        ...prev,
        playerScore: newPlayerScore,
        currentRound: newRound,
        currentQuestion: null,
        isPlayerTurn: true,
        status: isEnded ? 'ended' : 'active',
        winner,
        timeLeft: 30,
        messages: [...prev.messages, {
          id: Date.now().toString(),
          type: 'answer',
          content: `You answered ${answer}`,
          sender: 'player',
          isCorrect
        }]
      };
    });

    setTimeout(() => setSelectedAnswer(null), 500);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center">
        <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 2, repeat: Infinity }}>
          <Swords className="w-16 h-16 text-purple-400" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 text-white pb-32">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-black/30 border-b border-white/10">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Swords className="w-8 h-8 text-purple-400" />
              <div>
                <span className="text-lg font-bold">{subjectIcons[gameState.subject]} {gameState.subject}</span>
                <p className="text-xs text-gray-400">Round {gameState.currentRound} of {gameState.totalRounds}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => setSoundEnabled(!soundEnabled)} className="text-gray-400">
                {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              </Button>

              <div className="flex items-center gap-3 bg-white/10 rounded-xl px-4 py-2 border border-white/10">
                <div className="text-center">
                  <p className="text-[10px] text-gray-400">YOU</p>
                  <p className="text-xl font-bold text-green-400">{gameState.playerScore}</p>
                </div>
                <div className="w-px h-8 bg-white/20" />
                <div className="text-center">
                  <p className="text-[10px] text-gray-400">THEM</p>
                  <p className="text-xl font-bold text-purple-400">{gameState.opponentScore}</p>
                </div>
              </div>
            </div>
          </div>
          <Progress value={(gameState.currentRound / gameState.totalRounds) * 100} className="h-1 mt-2 bg-white/10" />
        </div>
      </header>

      {/* Timer */}
      <div className="sticky top-[72px] z-40 bg-black/50 backdrop-blur px-4 py-2 border-b border-white/10">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <span className="text-sm text-gray-400 flex items-center gap-1">
            <Clock className="w-4 h-4" />{gameState.timeLeft}s
          </span>
          <Progress 
            value={(gameState.timeLeft / 30) * 100} 
            className={`h-2 flex-1 mx-4 ${gameState.timeLeft <= 10 ? 'bg-red-900/50' : 'bg-purple-900/50'}`}
          />
          <span className="text-sm text-gray-400">
            {gameState.isPlayerTurn ? 'Your turn to ask' : gameState.currentQuestion ? 'Answer!' : 'Waiting...'}
          </span>
        </div>
      </div>

      {/* Messages */}
      <main className="px-4 py-4 max-w-lg mx-auto">
        <div className="space-y-3">
          {gameState.messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-2 ${msg.sender === 'player' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                msg.sender === 'player' ? 'bg-green-600' : msg.sender === 'system' ? 'bg-gray-600' : 'bg-purple-600'
              }`}>
                <User className="w-4 h-4" />
              </div>
              
              <div className={`max-w-[80%] rounded-2xl p-3 ${
                msg.sender === 'player' ? 'bg-green-500/20 border border-green-500/30' :
                msg.sender === 'system' ? 'bg-gray-500/20 border border-gray-500/30' :
                'bg-purple-500/20 border border-purple-500/30'
              }`}>
                {msg.type === 'question' && (
                  <div className="flex items-center gap-1 mb-1">
                    <HelpCircle className="w-3 h-3 text-cyan-400" />
                    <span className="text-xs text-cyan-400">Question</span>
                  </div>
                )}
                {msg.type === 'answer' && (
                  <div className="flex items-center gap-1 mb-1">
                    {msg.isCorrect ? <CheckCircle2 className="w-3 h-3 text-green-400" /> : <XCircle className="w-3 h-3 text-red-400" />}
                    <span className="text-xs">{msg.isCorrect ? 'Correct!' : 'Wrong!'}</span>
                  </div>
                )}
                <p className="text-sm">{msg.content}</p>
              </div>
            </motion.div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Bottom Input */}
      <div className="fixed bottom-0 left-0 right-0 backdrop-blur-xl bg-black/50 border-t border-white/10 p-4">
        <div className="max-w-lg mx-auto">
          {gameState.status === 'ended' ? (
            <div className="text-center py-4">
              <Trophy className="w-12 h-12 mx-auto text-yellow-400 mb-2" />
              <h3 className="text-xl font-bold">
                {gameState.winner === 'player' ? '🎉 You Win!' : gameState.winner === 'opponent' ? 'You Lose!' : "It's a Draw!"}
              </h3>
              <p className="text-gray-400 text-sm mb-3">Final: You {gameState.playerScore} - {gameState.opponentScore} Opponent</p>
              <Button onClick={() => router.push('/sparring')} className="bg-gradient-to-r from-purple-600 to-cyan-600">
                <RotateCcw className="w-4 h-4 mr-2" />Play Again
              </Button>
            </div>
          ) : gameState.isPlayerTurn ? (
            <div className="space-y-2">
              <p className="text-xs text-green-400">Your turn to ask:</p>
              <div className="flex gap-2">
                <input
                  value={playerQuestion}
                  onChange={(e) => setPlayerQuestion(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAskQuestion()}
                  placeholder="Type your question..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-purple-500 focus:outline-none"
                />
                <Button onClick={handleAskQuestion} disabled={!playerQuestion.trim()} className="bg-purple-600 hover:bg-purple-500">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ) : gameState.currentQuestion ? (
            <div className="space-y-2">
              <p className="text-xs text-cyan-400">Select your answer:</p>
              <div className="grid grid-cols-2 gap-2">
                {gameState.currentQuestion.options.map((option, i) => (
                  <button
                    key={i}
                    onClick={() => handleAnswer(option.charAt(0))}
                    className={`p-3 rounded-xl text-left text-sm border transition-all ${
                      selectedAnswer === option.charAt(0) ? 'bg-cyan-500/30 border-cyan-500' : 'bg-white/5 border-white/10 hover:border-cyan-500/50'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-center text-gray-400 text-sm">Waiting for opponent's question...</p>
          )}
        </div>
      </div>
    </div>
  );
}
