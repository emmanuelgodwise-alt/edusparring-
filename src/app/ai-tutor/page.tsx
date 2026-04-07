'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain, Video, BookOpen, Target, Trophy, Clock, Sparkles,
  ChevronRight, Star, Zap, TrendingUp, Lightbulb, ArrowLeft,
  Bot, Play, Swords, Timer, CheckCircle, XCircle, AlertCircle,
  Volume2, VolumeX, RotateCcw, Medal, Flame
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { AITutor, AITutorWidget } from '@/components/ai/AITutor';
import { RecommendationsDisplay, RecommendationsWidget } from '@/components/ai/Recommendations';
import { AdaptiveDifficultyDisplay, useAdaptiveDifficulty } from '@/components/ai/AdaptiveDifficulty';
import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';

// Bot difficulty settings
const BOT_DIFFICULTIES = {
  easy: { name: 'Easy Bot', accuracy: 0.5, speed: 3000, emoji: '🤖', color: 'text-green-400' },
  medium: { name: 'Medium Bot', accuracy: 0.7, speed: 2000, emoji: '🤖', color: 'text-yellow-400' },
  hard: { name: 'Hard Bot', accuracy: 0.85, speed: 1500, emoji: '🤖', color: 'text-orange-400' },
  expert: { name: 'Expert Bot', accuracy: 0.95, speed: 1000, emoji: '🤖', color: 'text-red-400' }
};

// Sample questions for bot battles
const SAMPLE_QUESTIONS: Record<string, Array<{question: string, options: string[], correct: number}>> = {
  Math: [
    { question: 'What is the derivative of x²?', options: ['x', '2x', '2x²', 'x²'], correct: 1 },
    { question: 'Solve: 3x + 7 = 22', options: ['x = 3', 'x = 5', 'x = 7', 'x = 4'], correct: 1 },
    { question: 'What is √144?', options: ['10', '11', '12', '13'], correct: 2 },
    { question: 'What is 15% of 200?', options: ['25', '30', '35', '40'], correct: 1 },
    { question: 'Simplify: (x³)²', options: ['x⁵', 'x⁶', 'x⁹', '2x³'], correct: 1 },
  ],
  Physics: [
    { question: 'What is the SI unit of force?', options: ['Joule', 'Newton', 'Watt', 'Pascal'], correct: 1 },
    { question: 'What is the speed of light (approx)?', options: ['3×10⁶ m/s', '3×10⁸ m/s', '3×10¹⁰ m/s', '3×10⁵ m/s'], correct: 1 },
    { question: 'F = ma is which law?', options: ['First', 'Second', 'Third', 'Fourth'], correct: 1 },
    { question: 'What is the unit of electric current?', options: ['Volt', 'Ohm', 'Ampere', 'Watt'], correct: 2 },
    { question: 'What does E = mc² represent?', options: ['Kinetic Energy', 'Mass-Energy Equivalence', 'Potential Energy', 'Momentum'], correct: 1 },
  ],
  Chemistry: [
    { question: 'What is the atomic number of Carbon?', options: ['4', '6', '8', '12'], correct: 1 },
    { question: 'What is H₂O commonly known as?', options: ['Hydrogen', 'Water', 'Oxygen', 'Hydroxide'], correct: 1 },
    { question: 'What is the pH of pure water?', options: ['0', '7', '14', '1'], correct: 1 },
    { question: 'What gas do plants release?', options: ['CO₂', 'N₂', 'O₂', 'H₂'], correct: 2 },
    { question: 'NaCl is the formula for?', options: ['Sugar', 'Salt', 'Baking Soda', 'Bleach'], correct: 1 },
  ],
  Biology: [
    { question: 'What is the powerhouse of the cell?', options: ['Nucleus', 'Ribosome', 'Mitochondria', 'Golgi'], correct: 2 },
    { question: 'DNA stands for?', options: ['Dioxyribo Nucleic Acid', 'Deoxyribo Nucleic Acid', 'Diribo Nucleic Acid', 'Deoxyribo Nitrogen Acid'], correct: 1 },
    { question: 'How many chromosomes do humans have?', options: ['23', '46', '44', '48'], correct: 1 },
    { question: 'What is the basic unit of life?', options: ['Tissue', 'Organ', 'Cell', 'Organism'], correct: 2 },
    { question: 'Photosynthesis occurs in?', options: ['Roots', 'Stem', 'Leaves', 'Flowers'], correct: 2 },
  ],
  History: [
    { question: 'In which year did World War II end?', options: ['1943', '1944', '1945', '1946'], correct: 2 },
    { question: 'Who was the first US President?', options: ['Lincoln', 'Washington', 'Jefferson', 'Adams'], correct: 1 },
    { question: 'The Great Wall is located in?', options: ['Japan', 'Korea', 'China', 'Mongolia'], correct: 2 },
    { question: 'When did the French Revolution begin?', options: ['1779', '1789', '1799', '1809'], correct: 1 },
    { question: 'Who discovered America?', options: ['Magellan', 'Columbus', 'Vespucci', 'Cook'], correct: 1 },
  ],
  Geography: [
    { question: 'What is the largest continent?', options: ['Africa', 'North America', 'Asia', 'Europe'], correct: 2 },
    { question: 'Which is the longest river?', options: ['Amazon', 'Nile', 'Yangtze', 'Mississippi'], correct: 1 },
    { question: 'What is the capital of Australia?', options: ['Sydney', 'Melbourne', 'Canberra', 'Perth'], correct: 2 },
    { question: 'Mount Everest is in which range?', options: ['Alps', 'Andes', 'Himalayas', 'Rockies'], correct: 2 },
    { question: 'How many oceans are there?', options: ['3', '4', '5', '6'], correct: 2 },
  ],
};

export default function AITutorPage() {
  const { user, isAuthenticated } = useAuth();
  const [selectedSubject, setSelectedSubject] = useState('Math');
  const [activeTab, setActiveTab] = useState('tutor');

  const { difficulty, performance, adjustmentReason } = useAdaptiveDifficulty(
    user?.id || 'guest',
    selectedSubject
  );

  // Play with Bot states
  const [botDifficulty, setBotDifficulty] = useState<keyof typeof BOT_DIFFICULTIES>('medium');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [questions, setQuestions] = useState<Array<{question: string, options: string[], correct: number}>>([]);
  const [playerScore, setPlayerScore] = useState(0);
  const [botScore, setBotScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [botAnswer, setBotAnswer] = useState<{answered: boolean, correct: boolean, choice: number} | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Timer for questions
  useEffect(() => {
    if (!isPlaying || showResult || gameOver) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleTimeUp();
          return 15;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPlaying, showResult, gameOver, currentQuestion]);

  const startGame = useCallback(() => {
    const subjectQuestions = SAMPLE_QUESTIONS[selectedSubject] || SAMPLE_QUESTIONS.Math;
    const shuffled = [...subjectQuestions].sort(() => Math.random() - 0.5);
    setQuestions(shuffled);
    setCurrentQuestion(0);
    setPlayerScore(0);
    setBotScore(0);
    setIsPlaying(true);
    setGameOver(false);
    setTimeLeft(15);
    setSelectedAnswer(null);
    setShowResult(false);
    setBotAnswer(null);
  }, [selectedSubject]);

  const handleTimeUp = useCallback(() => {
    if (selectedAnswer === null) {
      // Player didn't answer in time
      simulateBotAnswer();
      setShowResult(true);
      setTimeout(() => nextQuestion(), 2000);
    }
  }, [selectedAnswer, currentQuestion]);

  const simulateBotAnswer = useCallback(() => {
    const botSettings = BOT_DIFFICULTIES[botDifficulty];
    const isCorrect = Math.random() < botSettings.accuracy;
    const randomChoice = Math.floor(Math.random() * 4);

    setTimeout(() => {
      setBotAnswer({
        answered: true,
        correct: isCorrect,
        choice: isCorrect ? questions[currentQuestion]?.correct : randomChoice
      });
      if (isCorrect) {
        setBotScore(prev => prev + 1);
      }
    }, botSettings.speed);
  }, [botDifficulty, currentQuestion, questions]);

  const handleAnswer = useCallback((answerIndex: number) => {
    if (showResult || selectedAnswer !== null) return;

    setSelectedAnswer(answerIndex);
    const isCorrect = answerIndex === questions[currentQuestion]?.correct;

    if (isCorrect) {
      setPlayerScore(prev => prev + 1);
    }

    simulateBotAnswer();
    setShowResult(true);

    setTimeout(() => {
      nextQuestion();
    }, 2500);
  }, [showResult, selectedAnswer, questions, currentQuestion, botDifficulty]);

  const nextQuestion = useCallback(() => {
    if (currentQuestion >= questions.length - 1) {
      setGameOver(true);
      setIsPlaying(false);
    } else {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setBotAnswer(null);
      setTimeLeft(15);
    }
  }, [currentQuestion, questions.length]);

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
              <Brain className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold mb-4">AI Study Assistant</h1>
            <p className="text-gray-400 mb-8">
              Get personalized tutoring, adaptive learning, and smart recommendations powered by AI.
            </p>
            <Link href="/auth/signin">
              <Button className="bg-gradient-to-r from-purple-600 to-cyan-600">
                Sign In to Start Learning
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

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
                <Brain className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  AI Study Center
                </h1>
                <p className="text-xs text-gray-400">Personalized learning powered by AI</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white"
            >
              <option value="Math">Math</option>
              <option value="Physics">Physics</option>
              <option value="Chemistry">Chemistry</option>
              <option value="Biology">Biology</option>
              <option value="History">History</option>
              <option value="Geography">Geography</option>
            </select>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-white/10 border border-white/20 p-1 h-auto">
            <TabsTrigger 
              value="tutor" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-purple-700 data-[state=active]:text-white text-gray-300 px-4 py-2 rounded-md transition-all"
            >
              <Brain className="w-4 h-4 mr-2" />
              AI Tutor
            </TabsTrigger>
            <TabsTrigger 
              value="bot" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-600 data-[state=active]:to-cyan-700 data-[state=active]:text-white text-gray-300 px-4 py-2 rounded-md transition-all"
            >
              <Bot className="w-4 h-4 mr-2" />
              Play with Bot
            </TabsTrigger>
            <TabsTrigger 
              value="recommendations" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-purple-700 data-[state=active]:text-white text-gray-300 px-4 py-2 rounded-md transition-all"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Recommendations
            </TabsTrigger>
            <TabsTrigger 
              value="progress" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-purple-700 data-[state=active]:text-white text-gray-300 px-4 py-2 rounded-md transition-all"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              My Progress
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tutor" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Main Tutor */}
              <div className="lg:col-span-2">
                <AITutor
                  subject={selectedSubject}
                  userId={user?.id}
                />
              </div>

              {/* Side Panel */}
              <div className="space-y-4">
                <AdaptiveDifficultyDisplay
                  difficulty={difficulty}
                  performance={performance}
                  adjustmentReason={adjustmentReason}
                  showDetails
                />

                <Card className="bg-white/5 border-white/10">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Lightbulb className="w-4 h-4 text-yellow-400" />
                      Quick Tips
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm text-gray-400">
                    <p>• Ask specific questions for better explanations</p>
                    <p>• Request practice problems to test your knowledge</p>
                    <p>• Ask "why" to understand underlying concepts</p>
                    <p>• Request real-world examples for context</p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-900/30 to-cyan-900/30 border-purple-500/20">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <Zap className="w-5 h-5 text-yellow-400" />
                      <span className="font-medium">Daily Goal</span>
                    </div>
                    <p className="text-sm text-gray-400 mb-3">
                      Complete 3 tutoring sessions today to maintain your streak!
                    </p>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-purple-500/20 text-purple-400">1/3 completed</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="bot" className="space-y-6">
            {!isPlaying && !gameOver ? (
              /* Pre-game setup */
              <div className="max-w-2xl mx-auto">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center mb-8"
                >
                  <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center">
                    <Bot className="w-12 h-12 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold mb-2">Play with Bot</h2>
                  <p className="text-gray-400">Challenge an AI opponent and test your knowledge!</p>
                </motion.div>

                {/* Subject Selection */}
                <Card className="bg-white/5 border-white/10 mb-6">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-purple-400" />
                      Select Subject
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-2">
                      {Object.keys(SAMPLE_QUESTIONS).map((subject) => (
                        <Button
                          key={subject}
                          variant={selectedSubject === subject ? "default" : "outline"}
                          className={selectedSubject === subject
                            ? "bg-gradient-to-r from-purple-600 to-cyan-600"
                            : "border-white/20 text-white hover:bg-white/10"
                          }
                          onClick={() => setSelectedSubject(subject)}
                        >
                          {subject}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Difficulty Selection */}
                <Card className="bg-white/5 border-white/10 mb-6">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Swords className="w-5 h-5 text-cyan-400" />
                      Select Difficulty
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-3">
                      {Object.entries(BOT_DIFFICULTIES).map(([key, value]) => (
                        <Button
                          key={key}
                          variant={botDifficulty === key ? "default" : "outline"}
                          className={`h-auto py-3 flex-col ${botDifficulty === key
                            ? "bg-gradient-to-r from-purple-600 to-cyan-600"
                            : "border-white/20 text-white hover:bg-white/10"
                          }`}
                          onClick={() => setBotDifficulty(key as keyof typeof BOT_DIFFICULTIES)}
                        >
                          <span className="text-2xl mb-1">{value.emoji}</span>
                          <span className="font-medium">{value.name}</span>
                          <span className={`text-xs ${value.color}`}>
                            {Math.round(value.accuracy * 100)}% accuracy
                          </span>
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Start Button */}
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    onClick={startGame}
                    className="w-full h-14 text-lg bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700"
                  >
                    <Play className="w-5 h-5 mr-2" />
                    Start Battle
                  </Button>
                </motion.div>

                {/* Game Rules */}
                <Card className="bg-white/5 border-white/10 mt-6">
                  <CardContent className="p-4">
                    <h3 className="font-medium mb-3 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-yellow-400" />
                      How It Works
                    </h3>
                    <ul className="space-y-2 text-sm text-gray-400">
                      <li className="flex items-start gap-2">
                        <span className="text-purple-400">•</span>
                        Answer 5 questions before the bot does
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-purple-400">•</span>
                        You have 15 seconds per question
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-purple-400">•</span>
                        Higher difficulty = smarter bot
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-purple-400">•</span>
                        Beat the bot to earn XP and improve your rating
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            ) : gameOver ? (
              /* Game Over Screen */
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-lg mx-auto text-center"
              >
                <Card className="bg-white/5 border-white/10 overflow-hidden">
                  <div className={`h-2 ${playerScore > botScore ? 'bg-gradient-to-r from-green-500 to-emerald-500' : playerScore < botScore ? 'bg-gradient-to-r from-red-500 to-orange-500' : 'bg-gradient-to-r from-yellow-500 to-amber-500'}`} />
                  <CardContent className="p-8">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring" }}
                    >
                      {playerScore > botScore ? (
                        <>
                          <Trophy className="w-20 h-20 mx-auto mb-4 text-yellow-400" />
                          <h2 className="text-3xl font-bold mb-2">You Win! 🎉</h2>
                          <p className="text-gray-400 mb-6">Congratulations! You beat the bot!</p>
                        </>
                      ) : playerScore < botScore ? (
                        <>
                          <XCircle className="w-20 h-20 mx-auto mb-4 text-red-400" />
                          <h2 className="text-3xl font-bold mb-2">Bot Wins</h2>
                          <p className="text-gray-400 mb-6">Better luck next time!</p>
                        </>
                      ) : (
                        <>
                          <Medal className="w-20 h-20 mx-auto mb-4 text-yellow-400" />
                          <h2 className="text-3xl font-bold mb-2">It's a Tie!</h2>
                          <p className="text-gray-400 mb-6">Great minds think alike!</p>
                        </>
                      )}
                    </motion.div>

                    {/* Score Display */}
                    <div className="flex justify-center items-center gap-8 mb-8">
                      <div className="text-center">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center mb-2 mx-auto">
                          <span className="text-2xl">👤</span>
                        </div>
                        <p className="text-sm text-gray-400">You</p>
                        <p className="text-3xl font-bold">{playerScore}</p>
                      </div>
                      <div className="text-2xl text-gray-500">vs</div>
                      <div className="text-center">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-cyan-700 flex items-center justify-center mb-2 mx-auto">
                          <Bot className="w-8 h-8 text-white" />
                        </div>
                        <p className="text-sm text-gray-400">{BOT_DIFFICULTIES[botDifficulty].name}</p>
                        <p className="text-3xl font-bold">{botScore}</p>
                      </div>
                    </div>

                    {/* XP Earned */}
                    {playerScore > botScore && (
                      <div className="bg-gradient-to-r from-yellow-500/20 to-amber-500/20 rounded-lg p-4 mb-6">
                        <div className="flex items-center justify-center gap-2">
                          <Zap className="w-5 h-5 text-yellow-400" />
                          <span className="font-medium">+{playerScore * 20} XP Earned!</span>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        className="flex-1 border-white/20 text-white hover:bg-white/10"
                        onClick={() => setGameOver(false)}
                      >
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Play Again
                      </Button>
                      <Button
                        className="flex-1 bg-gradient-to-r from-purple-600 to-cyan-600"
                        onClick={() => {
                          setGameOver(false);
                          setActiveTab('tutor');
                        }}
                      >
                        Back to Tutor
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              /* Active Game */
              <div className="max-w-3xl mx-auto">
                {/* Score Header */}
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center">
                      <span className="text-xl">👤</span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">You</p>
                      <p className="text-2xl font-bold">{playerScore}</p>
                    </div>
                  </div>

                  <div className="text-center">
                    <Badge className="bg-white/10 text-white mb-2">
                      Question {currentQuestion + 1}/{questions.length}
                    </Badge>
                    <div className="flex items-center gap-1">
                      <Timer className={`w-5 h-5 ${timeLeft <= 5 ? 'text-red-400 animate-pulse' : 'text-cyan-400'}`} />
                      <span className={`text-xl font-bold ${timeLeft <= 5 ? 'text-red-400' : 'text-white'}`}>
                        {timeLeft}s
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-sm text-gray-400">{BOT_DIFFICULTIES[botDifficulty].name}</p>
                      <p className="text-2xl font-bold">{botScore}</p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-cyan-700 flex items-center justify-center">
                      <Bot className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>

                {/* Timer Progress */}
                <Progress
                  value={(timeLeft / 15) * 100}
                  className="h-2 mb-6 bg-white/10"
                />

                {/* Question Card */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentQuestion}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                  >
                    <Card className="bg-white/5 border-white/10 mb-6">
                      <CardContent className="p-6">
                        <h3 className="text-xl font-medium mb-6">
                          {questions[currentQuestion]?.question}
                        </h3>

                        <div className="grid grid-cols-2 gap-3">
                          {questions[currentQuestion]?.options.map((option, index) => {
                            const isCorrect = index === questions[currentQuestion]?.correct;
                            const isSelected = selectedAnswer === index;
                            const isBotChoice = botAnswer?.choice === index;

                            let buttonClass = "border-white/20 text-white hover:bg-white/10";

                            if (showResult) {
                              if (isCorrect) {
                                buttonClass = "bg-green-500/20 border-green-500 text-green-400";
                              } else if (isSelected && !isCorrect) {
                                buttonClass = "bg-red-500/20 border-red-500 text-red-400";
                              } else if (isBotChoice && !isCorrect) {
                                buttonClass = "bg-orange-500/20 border-orange-500 text-orange-400";
                              }
                            }

                            return (
                              <Button
                                key={index}
                                variant="outline"
                                className={`h-auto py-4 text-left justify-start ${buttonClass}`}
                                onClick={() => handleAnswer(index)}
                                disabled={showResult}
                              >
                                <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center mr-3 text-sm">
                                  {String.fromCharCode(65 + index)}
                                </span>
                                <span className="flex-1">{option}</span>
                                {showResult && isCorrect && (
                                  <CheckCircle className="w-5 h-5 text-green-400 ml-2" />
                                )}
                                {showResult && isSelected && !isCorrect && (
                                  <XCircle className="w-5 h-5 text-red-400 ml-2" />
                                )}
                              </Button>
                            );
                          })}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </AnimatePresence>

                {/* Bot Status */}
                {showResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-center gap-2 text-sm"
                  >
                    {botAnswer?.answered ? (
                      botAnswer.correct ? (
                        <>
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          <span className="text-green-400">Bot answered correctly!</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4 text-red-400" />
                          <span className="text-red-400">Bot got it wrong!</span>
                        </>
                      )
                    ) : (
                      <span className="text-gray-400 animate-pulse">Bot is thinking...</span>
                    )}
                  </motion.div>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="recommendations" className="space-y-6">
            <RecommendationsDisplay
              userId={user?.id || 'guest'}
              subjects={[selectedSubject]}
            />
          </TabsContent>

          <TabsContent value="progress" className="space-y-6">
            {/* Learning Stats */}
            <div className="grid md:grid-cols-4 gap-4">
              <Card className="bg-white/5 border-white/10">
                <CardContent className="p-4 text-center">
                  <Trophy className="w-8 h-8 mx-auto mb-2 text-yellow-400" />
                  <p className="text-2xl font-bold">847</p>
                  <p className="text-xs text-gray-400">KR Rating</p>
                </CardContent>
              </Card>
              <Card className="bg-white/5 border-white/10">
                <CardContent className="p-4 text-center">
                  <Target className="w-8 h-8 mx-auto mb-2 text-green-400" />
                  <p className="text-2xl font-bold">72%</p>
                  <p className="text-xs text-gray-400">Accuracy</p>
                </CardContent>
              </Card>
              <Card className="bg-white/5 border-white/10">
                <CardContent className="p-4 text-center">
                  <Clock className="w-8 h-8 mx-auto mb-2 text-cyan-400" />
                  <p className="text-2xl font-bold">4.2h</p>
                  <p className="text-xs text-gray-400">Study Time (Week)</p>
                </CardContent>
              </Card>
              <Card className="bg-white/5 border-white/10">
                <CardContent className="p-4 text-center">
                  <Star className="w-8 h-8 mx-auto mb-2 text-purple-400" />
                  <p className="text-2xl font-bold">12</p>
                  <p className="text-xs text-gray-400">Day Streak</p>
                </CardContent>
              </Card>
            </div>

            {/* Subject Progress */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-lg">Subject Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {['Math', 'Physics', 'Chemistry', 'Biology'].map((subject) => (
                  <div key={subject} className="flex items-center gap-4">
                    <div className="w-24 text-sm font-medium">{subject}</div>
                    <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-cyan-500"
                        style={{ width: `${Math.random() * 60 + 20}%` }}
                      />
                    </div>
                    <div className="w-16 text-right text-sm text-gray-400">
                      {Math.floor(Math.random() * 60 + 20)}%
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Adaptive Difficulty Panel */}
            <AdaptiveDifficultyDisplay
              difficulty={difficulty}
              performance={performance}
              showDetails
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
