'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send, Bot, User, ChevronRight, CheckCircle2, XCircle,
  Brain, MessageCircle, Sparkles, Trophy, RotateCcw, HelpCircle,
  Zap, Target, BookOpen, Volume2, Star, TrendingUp, VolumeX, History,
  Users, Globe, Swords
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import soundManager from '@/lib/sound-manager';

// Types
type SparringTurn = 'player_ask' | 'system_ask' | 'player_answer' | 'coaching' | 'ended';
type Difficulty = 'easy' | 'medium' | 'hard';

interface SparringMessage {
  id: string;
  role: 'player' | 'system';
  type: 'question' | 'answer' | 'coaching';
  content: string;
  isCorrect?: boolean;
  points?: number;
}

interface SparringState {
  turn: SparringTurn;
  roundNumber: number;
  playerScore: number;
  systemScore: number;
  messages: SparringMessage[];
  currentQuestion: {
    question: string;
    options: string[];
    questionId: string;
    correctAnswer: string;
  } | null;
  coaching: string | null;
  subject: string;
  difficulty: Difficulty;
}

// Score popup notification
interface ScorePopup {
  id: string;
  points: number;
  isPlayer: boolean;
  message: string;
}

// Subject icons
const subjectIcons: Record<string, string> = {
  Math: '📐', Physics: '⚛️', Chemistry: '🧪', Biology: '🧬',
  History: '📜', Geography: '🌍', Literature: '📚', Economics: '💰',
  ComputerScience: '💻', Civics: '⚖️', English: '📖',
};

// Subject display names
const subjectNames: Record<string, string> = {
  Math: 'Math', Physics: 'Physics', Chemistry: 'Chemistry', Biology: 'Biology',
  History: 'History', Geography: 'Geography', Literature: 'Literature', Economics: 'Economics',
  ComputerScience: 'Computer Science', Civics: 'Civics', English: 'English',
};

const subjects = ['Math', 'Physics', 'Chemistry', 'Biology', 'History', 'Geography', 'Literature', 'Economics', 'ComputerScience', 'Civics', 'English'];
const maxRounds = 10;

// Difficulty settings
const DIFFICULTY_CONFIG = {
  easy: { points: 10, label: 'Easy', color: 'text-green-400', bg: 'bg-green-500/20', border: 'border-green-500/30' },
  medium: { points: 15, label: 'Medium', color: 'text-yellow-400', bg: 'bg-yellow-500/20', border: 'border-yellow-500/30' },
  hard: { points: 25, label: 'Hard', color: 'text-red-400', bg: 'bg-red-500/20', border: 'border-red-500/30' }
};

// Main Sparring Arena Component
export default function SparringArena() {
  const router = useRouter();
  const [showModeSelect, setShowModeSelect] = useState(true);
  const [selectedMode, setSelectedMode] = useState<'bot' | 'player' | null>(null);
  const [state, setState] = useState<SparringState>({
    turn: 'player_ask',
    roundNumber: 1,
    playerScore: 0,
    systemScore: 0,
    messages: [],
    currentQuestion: null,
    coaching: null,
    subject: 'Math',
    difficulty: 'medium'
  });

  const [playerQuestion, setPlayerQuestion] = useState('');
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showSubjectSelect, setShowSubjectSelect] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState('Math');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [scorePopups, setScorePopups] = useState<ScorePopup[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [matchStartTime, setMatchStartTime] = useState<number>(Date.now());

  // Toggle sound
  const toggleSound = () => {
    const newEnabled = !soundEnabled;
    setSoundEnabled(newEnabled);
    soundManager.setEnabled(newEnabled);
  };

  // Add score popup notification
  const addScorePopup = (points: number, isPlayer: boolean, message: string) => {
    const popup: ScorePopup = { id: Date.now().toString(), points, isPlayer, message };
    setScorePopups(prev => [...prev, popup]);
    setTimeout(() => { setScorePopups(prev => prev.filter(p => p.id !== popup.id)); }, 2500);
  };

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [state.messages]);

  // Handle mode selection
  const handleModeSelect = (mode: 'bot' | 'player') => {
    setSelectedMode(mode);
    if (mode === 'player') {
      router.push('/sparring/lobby');
    } else {
      setShowSubjectSelect(true);
    }
    setShowModeSelect(false);
  };

  // Start sparring with selected subject and difficulty
  const startSparring = async (subject: string, difficulty: Difficulty) => {
    setMatchStartTime(Date.now());
    setState({
      turn: 'player_ask',
      roundNumber: 1,
      playerScore: 0,
      systemScore: 0,
      messages: [{
        id: '1',
        role: 'system',
        type: 'coaching',
        content: `Welcome to ${subjectNames[subject]} Sparring! 🎯 You start by asking me a question. I'll try to answer, then I'll ask you one. Let's learn together!`
      }],
      currentQuestion: null,
      coaching: null,
      subject,
      difficulty
    });
    setShowSubjectSelect(false);
  };

  // Player asks a question
  const handlePlayerAsk = async () => {
    if (!playerQuestion.trim() || isLoading) return;
    setIsLoading(true);
    const questionText = playerQuestion;
    setPlayerQuestion('');

    const newMessage: SparringMessage = { id: Date.now().toString(), role: 'player', type: 'question', content: questionText };
    setState(prev => ({ ...prev, messages: [...prev.messages, newMessage] }));

    // Simulate bot answering
    setTimeout(() => {
      const isCorrect = Math.random() > 0.3;
      const pointsAwarded = isCorrect ? DIFFICULTY_CONFIG[state.difficulty].points : 0;
      
      const systemAnswer: SparringMessage = {
        id: (Date.now() + 1).toString(),
        role: 'system',
        type: 'answer',
        content: isCorrect ? `That's a great question! The answer is... (simulated correct response)` : `Hmm, I'm not sure about that one. Let me learn from you!`,
        isCorrect,
        points: pointsAwarded
      };

      setState(prev => ({ ...prev, systemScore: prev.systemScore + pointsAwarded, messages: [...prev.messages, systemAnswer] }));

      if (pointsAwarded > 0) addScorePopup(pointsAwarded, false, `Bot scored ${pointsAwarded} points!`);
      setTimeout(() => getSystemQuestion(), 1500);
      setIsLoading(false);
    }, 1000);
  };

  // Get question from system
  const getSystemQuestion = async () => {
    setIsLoading(true);
    const questions = [
      { question: "What is 2 + 2?", options: ["A. 3", "B. 4", "C. 5", "D. 6"], correctAnswer: "B" },
      { question: "What is the capital of France?", options: ["A. London", "B. Berlin", "C. Paris", "D. Madrid"], correctAnswer: "C" },
      { question: "Who wrote Romeo and Juliet?", options: ["A. Dickens", "B. Shakespeare", "C. Austen", "D. Twain"], correctAnswer: "B" },
    ];
    const randomQ = questions[Math.floor(Math.random() * questions.length)];

    setState(prev => ({
      ...prev,
      messages: [...prev.messages, { id: Date.now().toString(), role: 'system', type: 'question', content: randomQ.question }],
      currentQuestion: { question: randomQ.question, options: randomQ.options, questionId: Date.now().toString(), correctAnswer: randomQ.correctAnswer },
      turn: 'player_answer',
      coaching: null
    }));
    setIsLoading(false);
  };

  // Save match to history
  const saveMatchToHistory = async (finalState: SparringState) => {
    try {
      const duration = Math.floor((Date.now() - matchStartTime) / 1000);
      await fetch('/api/match-history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          player1Id: 'current-user',
          player1Score: finalState.playerScore,
          player2Score: finalState.systemScore,
          subject: finalState.subject,
          difficulty: finalState.difficulty,
          winner: finalState.playerScore > finalState.systemScore ? 'player1' : finalState.playerScore < finalState.systemScore ? 'player2' : null,
          matchType: 'bot',
          duration
        })
      });
    } catch (error) {
      console.error('Failed to save match:', error);
    }
  };

  // Player answers system's question
  const handlePlayerAnswer = async (answer: string) => {
    if (isLoading || !state.currentQuestion) return;
    setIsLoading(true);
    setSelectedAnswer(answer);

    const isCorrect = answer === state.currentQuestion.correctAnswer;
    const pointsEarned = isCorrect ? DIFFICULTY_CONFIG[state.difficulty].points : 0;

    setState(prev => {
      const newRound = prev.roundNumber + 1;
      const isEnded = newRound > maxRounds;
      const newState = {
        ...prev,
        playerScore: isCorrect ? prev.playerScore + pointsEarned : prev.playerScore,
        turn: isEnded ? 'ended' : 'player_ask',
        roundNumber: newRound,
        currentQuestion: null,
        messages: [...prev.messages, { id: Date.now().toString(), role: 'player', type: 'answer', content: `${answer}` }]
      };
      
      // Save to history when game ends
      if (isEnded) {
        saveMatchToHistory(newState);
      }
      
      return newState;
    });

    if (isCorrect) {
      soundManager.playCorrect();
      addScorePopup(pointsEarned, true, `You scored ${pointsEarned} points!`);
    } else {
      soundManager.playWrong();
    }

    setSelectedAnswer(null);
    setIsLoading(false);
  };

  // Reset sparring session
  const resetSparring = () => {
    if (state.turn === 'ended') {
      if (state.playerScore > state.systemScore) {
        soundManager.playVictory();
      } else if (state.playerScore < state.systemScore) {
        soundManager.playDefeat();
      }
    }
    setShowModeSelect(true);
    setShowSubjectSelect(false);
    setSelectedMode(null);
    setState({ turn: 'player_ask', roundNumber: 1, playerScore: 0, systemScore: 0, messages: [], currentQuestion: null, coaching: null, subject: 'Math', difficulty: 'medium' });
  };

  // Mode Selection Screen
  if (showModeSelect) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 text-white p-6">
        <div className="max-w-2xl mx-auto pt-10">
          {/* Hero with Brand Positioning */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
            {/* Logo */}
            <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 3, repeat: Infinity }} className="mb-3">
              <Swords className="w-[72px] h-[72px] text-purple-400 mx-auto" />
            </motion.div>
            
            {/* Brand Name */}
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent mb-2">
              EduSparring
            </h1>
            
            {/* Clarification 1: Social Positioning */}
            <p className="text-base text-purple-300 font-medium mb-1">
              A safe haven for students to connect worldwide
            </p>
            
            {/* Clarification 2: Educational Positioning */}
            <p className="text-sm text-gray-400">
              Practice lessons • Prepare for exams
            </p>
          </motion.div>

          {/* How it works */}
          <Card className="bg-white/5 border-white/10 backdrop-blur mb-6">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2"><HelpCircle className="w-5 h-5 text-cyan-400" />How Sparring Works</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-gray-300">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-purple-500/30 flex items-center justify-center text-xs font-bold shrink-0">1</div>
                <p><strong className="text-white">You Ask:</strong> Type a question. If the opponent answers correctly, they score points!</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-cyan-500/30 flex items-center justify-center text-xs font-bold shrink-0">2</div>
                <p><strong className="text-white">They Ask:</strong> Answer the question. If you're correct, you score!</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-yellow-500/30 flex items-center justify-center text-xs font-bold shrink-0">3</div>
                <p><strong className="text-white">Learn:</strong> Wrong answers get coaching explanations!</p>
              </div>
            </CardContent>
          </Card>

          {/* Mode Selection Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => handleModeSelect('bot')} className="p-6 rounded-2xl border-2 border-purple-500/30 bg-gradient-to-br from-purple-500/20 to-purple-900/20 hover:border-purple-500 transition-all text-left">
              <Bot className="w-12 h-12 text-purple-400 mb-4" />
              <h3 className="text-xl font-bold mb-2">Play vs Bot</h3>
              <p className="text-gray-400 text-sm">Practice with AI opponent. Perfect for learning!</p>
            </motion.button>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => handleModeSelect('player')} className="p-6 rounded-2xl border-2 border-cyan-500/30 bg-gradient-to-br from-cyan-500/20 to-cyan-900/20 hover:border-cyan-500 transition-all text-left">
              <Users className="w-12 h-12 text-cyan-400 mb-4" />
              <h3 className="text-xl font-bold mb-2">Play vs Player</h3>
              <p className="text-gray-400 text-sm">Challenge real students online!</p>
            </motion.button>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-3 gap-3 mt-6">
            <Link href="/sparring/history" className="block">
              <Card className="bg-white/5 border-white/10 backdrop-blur hover:bg-white/10 transition-colors cursor-pointer h-full">
                <CardContent className="p-4 text-center">
                  <History className="w-6 h-6 mx-auto text-cyan-400 mb-2" />
                  <p className="font-medium text-sm">History</p>
                  <p className="text-xs text-gray-400">Past Matches</p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/social" className="block">
              <Card className="bg-white/5 border-white/10 backdrop-blur hover:bg-white/10 transition-colors cursor-pointer h-full">
                <CardContent className="p-4 text-center">
                  <Users className="w-6 h-6 mx-auto text-purple-400 mb-2" />
                  <p className="font-medium text-sm">Social</p>
                  <p className="text-xs text-gray-400">Friends & Chat</p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/leaderboard" className="block">
              <Card className="bg-white/5 border-white/10 backdrop-blur hover:bg-white/10 transition-colors cursor-pointer h-full">
                <CardContent className="p-4 text-center">
                  <Globe className="w-6 h-6 mx-auto text-yellow-400 mb-2" />
                  <p className="font-medium text-sm">Leaderboard</p>
                  <p className="text-xs text-gray-400">Rankings</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Subject Selection Screen
  if (showSubjectSelect) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 text-white p-6">
        <div className="max-w-2xl mx-auto pt-10">
          <Button variant="ghost" onClick={() => { setShowModeSelect(true); setShowSubjectSelect(false); }} className="mb-4 text-gray-400 hover:text-white">← Back to Mode Selection</Button>
          <Card className="bg-white/5 border-white/10 backdrop-blur mb-6">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2"><BookOpen className="w-5 h-5 text-purple-400" />Choose Your Subject</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-4 gap-3">
                {subjects.map((subject) => (
                  <motion.button key={subject} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setSelectedSubject(subject)} className={`p-3 rounded-xl text-center border transition-all ${selectedSubject === subject ? 'bg-purple-500/30 border-purple-500 text-white' : 'bg-white/5 border-white/10 hover:border-purple-500/50 text-gray-300'}`}>
                    <span className="text-2xl">{subjectIcons[subject]}</span>
                    <p className="font-medium mt-1 text-sm leading-tight">{subjectNames[subject]}</p>
                  </motion.button>
                ))}
              </div>

              {/* Difficulty Selector */}
              <div className="space-y-2 mt-4">
                <p className="text-sm text-gray-400">Select Difficulty:</p>
                <div className="flex gap-2">
                  {(Object.keys(DIFFICULTY_CONFIG) as Difficulty[]).map((diff) => (
                    <motion.button key={diff} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setState(prev => ({ ...prev, difficulty: diff }))} className={`flex-1 py-3 px-4 rounded-xl border transition-all ${state.difficulty === diff ? `${DIFFICULTY_CONFIG[diff].bg} ${DIFFICULTY_CONFIG[diff].border} ${DIFFICULTY_CONFIG[diff].color}` : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/30'}`}>
                      <div className="text-sm font-medium">{DIFFICULTY_CONFIG[diff].label}</div>
                      <div className="text-xs opacity-70">+{DIFFICULTY_CONFIG[diff].points} pts</div>
                    </motion.button>
                  ))}
                </div>
              </div>

              <Button onClick={() => startSparring(selectedSubject, state.difficulty)} className="w-full py-6 text-lg font-semibold bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 mt-4">
                <Swords className="w-5 h-5 mr-2" />Start Sparring
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Main Sparring Interface
  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 text-white ${state.turn === 'ended' ? 'pb-64' : 'pb-40'}`}>
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-black/30 border-b border-white/10">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                <Swords className="w-8 h-8 text-purple-400" />
              </motion.div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg font-bold">{subjectNames[state.subject]} Sparring</h1>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${DIFFICULTY_CONFIG[state.difficulty].bg} ${DIFFICULTY_CONFIG[state.difficulty].border} ${DIFFICULTY_CONFIG[state.difficulty].color}`}>{DIFFICULTY_CONFIG[state.difficulty].label}</span>
                </div>
                <p className="text-xs text-gray-400">Round {state.roundNumber} of {maxRounds} • +{DIFFICULTY_CONFIG[state.difficulty].points} pts/correct</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={toggleSound} className="text-gray-400 hover:text-white">
                {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              </Button>
              <div className="flex items-center gap-3 bg-white/10 rounded-xl px-4 py-2 border border-white/10">
                <div className="text-center relative">
                  <p className="text-[10px] text-gray-400 uppercase tracking-wide">You</p>
                  <motion.p key={state.playerScore} initial={{ scale: 1.3, color: '#4ade80' }} animate={{ scale: 1, color: '#4ade80' }} className="text-xl font-bold text-green-400">{state.playerScore}</motion.p>
                </div>
                <div className="w-px h-8 bg-white/20" />
                <div className="text-center relative">
                  <p className="text-[10px] text-gray-400 uppercase tracking-wide">Bot</p>
                  <motion.p key={state.systemScore} initial={{ scale: 1.3, color: '#c084fc' }} animate={{ scale: 1, color: '#c084fc' }} className="text-xl font-bold text-purple-400">{state.systemScore}</motion.p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={resetSparring} className="text-gray-400 hover:text-white">
                <RotateCcw className="w-5 h-5" />
              </Button>
            </div>
          </div>
          <Progress value={(state.roundNumber / maxRounds) * 100} className="h-1 mt-2 bg-white/10" />
        </div>
      </header>

      {/* Messages */}
      <main className="container mx-auto px-4 py-4 max-w-2xl">
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {state.messages.map((msg) => (
              <motion.div key={msg.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className={`flex gap-3 ${msg.role === 'player' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'player' ? 'bg-gradient-to-br from-green-500 to-emerald-600' : 'bg-gradient-to-br from-purple-500 to-cyan-600'}`}>
                  {msg.role === 'player' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                </div>
                <div className={`max-w-[80%] ${msg.role === 'player' ? 'bg-green-500/20 border-green-500/30' : msg.type === 'coaching' ? 'bg-yellow-500/20 border-yellow-500/30' : 'bg-purple-500/20 border-purple-500/30'} rounded-2xl p-4 border`}>
                  {msg.type === 'question' && <div className="flex items-center gap-2 mb-2"><HelpCircle className="w-4 h-4 text-cyan-400" /><span className="text-xs text-cyan-400 font-medium">{msg.role === 'player' ? 'Your Question' : 'System Asks'}</span></div>}
                  {msg.type === 'answer' && <div className="flex items-center gap-2 mb-2">{msg.isCorrect !== false ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : <XCircle className="w-4 h-4 text-red-400" />}<span className="text-xs font-medium">{msg.role === 'player' ? 'Your Answer' : "System's Answer"}</span>{msg.points && <Badge variant="outline" className="ml-2 text-xs border-green-500 text-green-400">+{msg.points}</Badge>}</div>}
                  {msg.type === 'coaching' && <div className="flex items-center gap-2 mb-2"><Brain className="w-4 h-4 text-yellow-400" /><span className="text-xs text-yellow-400 font-medium">Coaching</span></div>}
                  <p className="text-gray-200 whitespace-pre-wrap">{msg.content}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {isLoading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-cyan-600 flex items-center justify-center"><Bot className="w-5 h-5" /></div>
              <div className="bg-purple-500/20 border-purple-500/30 rounded-2xl p-4 border">
                <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.5, repeat: Infinity }} className="flex items-center gap-2"><Sparkles className="w-4 h-4 text-purple-400" /><span className="text-purple-300">Thinking...</span></motion.div>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Score Popup Notifications */}
        <AnimatePresence>
          {scorePopups.map((popup) => (
            <motion.div key={popup.id} initial={{ opacity: 0, y: 50, scale: 0.8 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -30, scale: 0.8 }} className={`fixed bottom-32 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-xl shadow-2xl border-2 ${popup.isPlayer ? 'bg-green-500/90 border-green-400 text-white' : 'bg-purple-500/90 border-purple-400 text-white'}`}>
              <div className="flex items-center gap-2"><TrendingUp className="w-5 h-5" /><span className="font-bold text-lg">+{popup.points}</span><span className="text-sm opacity-90">{popup.message}</span></div>
            </motion.div>
          ))}
        </AnimatePresence>
      </main>

      {/* Bottom Input Area */}
      <div className="fixed bottom-0 left-0 right-0 backdrop-blur-xl bg-black/50 border-t border-white/10 p-4">
        <div className="container mx-auto max-w-2xl">
          {state.turn === 'player_answer' && state.currentQuestion && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
              <div className="flex items-center gap-2 mb-2"><Target className="w-4 h-4 text-cyan-400" /><span className="text-sm text-cyan-400 font-medium">Select your answer:</span></div>
              <div className="grid grid-cols-2 gap-2">
                {state.currentQuestion.options.map((option, index) => (
                  <motion.button key={index} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} onClick={() => handlePlayerAnswer(option.charAt(0))} disabled={isLoading} className={`p-3 rounded-xl text-left border transition-all text-sm ${selectedAnswer === option.charAt(0) ? 'bg-cyan-500/30 border-cyan-500 text-white' : 'bg-white/5 border-white/10 hover:border-cyan-500/50 text-gray-300'}`}>{option}</motion.button>
                ))}
              </div>
            </motion.div>
          )}
          {state.turn === 'player_ask' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
              <div className="flex items-center gap-2"><MessageCircle className="w-4 h-4 text-green-400" /><span className="text-sm text-green-400 font-medium">Your turn to ask:</span></div>
              <div className="flex gap-2">
                <Textarea value={playerQuestion} onChange={(e) => setPlayerQuestion(e.target.value)} placeholder={`Ask a ${state.subject} question...`} className="bg-white/5 border-white/10 focus:border-purple-500 min-h-[44px] max-h-32 resize-none" disabled={isLoading} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handlePlayerAsk(); } }} />
                <Button onClick={handlePlayerAsk} disabled={!playerQuestion.trim() || isLoading} className="bg-gradient-to-r from-purple-600 to-cyan-600 h-11"><Send className="w-5 h-5" /></Button>
              </div>
            </motion.div>
          )}
          {state.turn === 'ended' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-4">
              <Trophy className="w-12 h-12 mx-auto text-yellow-400 mb-2" />
              <h3 className="text-xl font-bold mb-1">{state.playerScore > state.systemScore ? '🎉 You Win!' : state.playerScore < state.systemScore ? 'Bot Wins!' : "It's a Draw!"}</h3>
              <p className="text-gray-400 mb-3 text-sm">Final: You {state.playerScore} - {state.systemScore} Bot</p>
              <Button onClick={resetSparring} className="bg-gradient-to-r from-purple-600 to-cyan-600"><RotateCcw className="w-4 h-4 mr-2" />Play Again</Button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
