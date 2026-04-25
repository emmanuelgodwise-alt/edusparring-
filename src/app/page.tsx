'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy, Target, Zap, Users, BarChart3, User, Settings,
  Crown, Flame, Star, Clock, CheckCircle2, XCircle, ChevronRight,
  Play, Medal, TrendingUp, Award, Brain, BookOpen, Sparkles, Menu, X,
  Eye, Calendar, MapPin, Edit2, Save, Bell, Volume2, Vibrate, Moon, Sun,
  Shield, LogOut, HelpCircle, Info, ChevronDown, Heart, MessageCircle,
  Globe, Lock, UserPlus, UserMinus, Search, Radio, Swords, ArrowRight, LogIn, UserCheck, Zap as ZapIcon, Video, Bot
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useAppStore, type User as UserType, type Question, type CoachingFeedback, type Tournament, type Friend, type LiveMatch } from '@/store/useAppStore';
import { useAuth } from '@/components/AuthProvider';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { StreakDisplay, DailyQuests, SeasonPass, SpinWheel, SpinWheelButton, SeasonPassCompact } from '@/components/gamification';
import { VideoWidget, VideoSuggestions } from '@/components/video';
import { AITutorWidget } from '@/components/ai';
import { GlobalSearch, SearchTrigger, useGlobalSearch } from '@/components/navigation';
import { MobileHeader } from '@/components/navigation/MobileHeader';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Subject icons mapping
const subjectIcons: Record<string, string> = {
  Math: '📐',
  Physics: '⚛️',
  Chemistry: '🧪',
  Biology: '🧬',
  History: '📜',
  Geography: '🌍',
  Literature: '📚',
  Computer: '💻'
};

// KR Tier helper
function getKRTier(kr: number): { tier: string; color: string; nextTier: string; progress: number } {
  if (kr < 1000) return { tier: 'Beginner', color: 'text-gray-400', nextTier: 'Intermediate', progress: (kr - 800) / 200 * 100 };
  if (kr < 1400) return { tier: 'Intermediate', color: 'text-green-400', nextTier: 'Advanced', progress: (kr - 1000) / 400 * 100 };
  if (kr < 1800) return { tier: 'Advanced', color: 'text-blue-400', nextTier: 'Elite', progress: (kr - 1400) / 400 * 100 };
  return { tier: 'Elite', color: 'text-yellow-400', nextTier: 'Legend', progress: Math.min(100, (kr - 1800) / 200 * 100) };
}

// Landing Page for non-authenticated users
function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 text-white">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-black/30 border-b border-white/10">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Swords className="w-8 h-8 text-purple-400" />
            </motion.div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              EduSparring
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/auth/signin">
              <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-white/10">
                Sign In
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500">
                Get Started
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative container mx-auto px-4 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="mb-8"
          >
            <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center shadow-2xl shadow-purple-500/30">
              <Swords className="w-12 h-12 text-white" />
            </div>
          </motion.div>

          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-purple-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
              Turn Knowledge Into
            </span>
            <br />
            <span className="text-white">Competitive Battles</span>
          </h1>

          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Practice lessons, prepare for exams, and compete with students worldwide in real-time knowledge battles.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button size="lg" className="w-full sm:w-auto py-6 px-8 text-lg font-semibold bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 shadow-lg shadow-purple-500/25">
                Start Learning Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/auth/signin">
              <Button size="lg" variant="outline" className="w-full sm:w-auto py-6 px-8 text-lg border-white/20 bg-white/5 hover:bg-white/10">
                I Have an Account
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: Zap,
              title: 'Real-Time Battles',
              description: 'Compete head-to-head with students worldwide in exciting 15-second question rounds.',
              color: 'from-purple-500 to-fuchsia-500'
            },
            {
              icon: Trophy,
              title: 'Climb the Ranks',
              description: 'Earn Knowledge Rating (KR) points and climb from Beginner to Elite tier.',
              color: 'from-yellow-500 to-orange-500'
            },
            {
              icon: Brain,
              title: 'AI-Powered Learning',
              description: 'Get personalized coaching feedback powered by advanced AI after every match.',
              color: 'from-cyan-500 to-blue-500'
            },
            {
              icon: Globe,
              title: 'Global Community',
              description: 'Connect with students from around the world. Make friends and challenge them.',
              color: 'from-green-500 to-emerald-500'
            },
            {
              icon: Award,
              title: 'Tournaments',
              description: 'Join exciting tournaments with prize pools and become a champion.',
              color: 'from-red-500 to-pink-500'
            },
            {
              icon: BookOpen,
              title: 'Multiple Subjects',
              description: 'Math, Physics, Chemistry, Biology, History, Geography, and more.',
              color: 'from-indigo-500 to-purple-500'
            }
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors h-full">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { label: 'Active Students', value: '10K+' },
            { label: 'Questions Answered', value: '1M+' },
            { label: 'Countries', value: '50+' },
            { label: 'Subjects', value: '8' }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <p className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                {stat.value}
              </p>
              <p className="text-gray-400 mt-2">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <Card className="bg-gradient-to-r from-purple-900/50 to-cyan-900/50 border-purple-500/20 text-center">
          <CardContent className="py-12">
            <h2 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h2>
            <p className="text-gray-400 mb-8 max-w-xl mx-auto">
              Join thousands of students who are already learning and competing on EduSparring.
            </p>
            <Link href="/auth/signup">
              <Button size="lg" className="py-6 px-8 text-lg font-semibold bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 shadow-lg shadow-purple-500/25">
                Create Free Account
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-semibold text-white mb-3">Platform</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/ai-tutor" className="hover:text-purple-400">AI Tutor</Link></li>
                <li><Link href="/multiplayer" className="hover:text-purple-400">Multiplayer</Link></li>
                <li><Link href="/videos" className="hover:text-purple-400">Video Lessons</Link></li>
                <li><Link href="/careers" className="hover:text-purple-400">Careers</Link></li>
                <li><Link href="/social" className="hover:text-purple-400">Social</Link></li>
                <li><Link href="/sparring" className="hover:text-purple-400">Sparring</Link></li>
                <li><Link href="/leaderboard" className="hover:text-purple-400">Leaderboard</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-3">Safety</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/safety" className="hover:text-purple-400">Safety Features</Link></li>
                <li><Link href="/trust" className="hover:text-purple-400">Trust & Security</Link></li>
                <li><Link href="/verify" className="hover:text-purple-400">Student Verification</Link></li>
                <li><Link href="/guardian" className="hover:text-purple-400">Guardian Dashboard</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-3">Partners</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/institutions" className="hover:text-purple-400">Schools & Governments</Link></li>
                <li><Link href="/employer" className="hover:text-purple-400">Employer Partners</Link></li>
                <li><Link href="/schools" className="hover:text-purple-400">School Partnership</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-3">Pricing</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/pricing" className="hover:text-purple-400">Plans & Pricing</Link></li>
                <li><Link href="/pricing#students" className="hover:text-purple-400">Student Plans</Link></li>
                <li><Link href="/institutions#pricing" className="hover:text-purple-400">Institutional Plans</Link></li>
              </ul>
            </div>
          </div>
          <div className="text-center text-gray-400 pt-4 border-t border-white/10">
            <p>&copy; 2024 EduSparring. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Main App Component
export default function Home() {
  const router = useRouter();
  const { user: authUser, isAuthenticated, isLoading: authLoading } = useAuth();
  const {
    user, setUser, isLoading, setIsLoading, activeTab, setActiveTab,
    match, setMatch, isSearchingMatch, setSearchingMatch,
    showMatchResult, setShowMatchResult, coachingFeedback, setCoachingFeedback,
    showCoachingFeedback, setShowCoachingFeedback, leaderboard, setLeaderboard,
    leaderboardCategory, setLeaderboardCategory, addNotification,
    selectedSubject, setSelectedSubject, settings, updateSettings,
    tournaments, setTournaments, liveMatches, setLiveMatches,
    showFriendsModal, setShowFriendsModal, friends, setFriends
  } = useAppStore();

  const [checkingOnboarding, setCheckingOnboarding] = useState(false);
  const { isOpen: searchOpen, openSearch, closeSearch } = useGlobalSearch();

  // Immediately set loading to false on mount - show content right away
  // This ensures the landing page is visible even if auth is slow
  useEffect(() => {
    // Small delay to prevent flash, then show content
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);
    return () => clearTimeout(timer);
  }, [setIsLoading]);

  // When auth finishes loading, update loading state
  useEffect(() => {
    if (!authLoading) {
      setIsLoading(false);
    }
  }, [authLoading, setIsLoading]);

  // Initialize user from auth when authenticated
  useEffect(() => {
    if (isAuthenticated && authUser) {
      // Check localStorage first for onboarding status (works for both authenticated and anonymous users)
      const localStorageOnboarding = typeof window !== 'undefined' 
        ? localStorage.getItem('edusparring_onboarding_completed') 
        : null;
      
      // Fetch full user data from database
      const fetchUserData = async () => {
        try {
          const res = await fetch(`/api/user?email=${authUser.email}`);
          const data = await res.json();
          if (data.success && data.user) {
            setUser(data.user);
            
            // Check onboarding status - only redirect if:
            // - NOT completed in DB
            // - NOT skipped 5+ times (user is familiar with app)
            // - NOT completed in localStorage
            const skipCount = data.user.onboardingSkipCount ?? 0;
            const hasSkippedEnough = skipCount >= 5;
            
            if (!data.user.hasCompletedOnboarding && !hasSkippedEnough && localStorageOnboarding !== 'true') {
              router.push('/onboarding');
              return;
            }
          } else {
            // Create basic user from auth data
            setUser({
              id: authUser.id || '',
              email: authUser.email || '',
              name: authUser.name || 'Scholar',
              knowledgeRating: authUser.knowledgeRating || 800,
              level: 'High School',
              points: 0,
              totalWins: 0,
              totalLosses: 0,
              currentStreak: 0,
              bestStreak: 0,
              country: undefined,
              language: 'en',
              bio: undefined,
              avatar: authUser.image || undefined,
              subjects: [],
              achievements: [],
            });
            // Only redirect to onboarding if not completed in localStorage
            if (localStorageOnboarding !== 'true') {
              router.push('/onboarding');
              return;
            }
          }
        } catch (error) {
          console.error('Failed to fetch user data:', error);
          // Set user from auth data
          setUser({
            id: authUser.id || '',
            email: authUser.email || '',
            name: authUser.name || 'Scholar',
            knowledgeRating: authUser.knowledgeRating || 800,
            level: 'High School',
            points: 0,
            totalWins: 0,
            totalLosses: 0,
            currentStreak: 0,
            bestStreak: 0,
            country: undefined,
            language: 'en',
            bio: undefined,
            avatar: authUser.image || undefined,
            subjects: [],
            achievements: [],
          });
        } finally {
          setCheckingOnboarding(false);
        }
      };
      fetchUserData();
    } else {
      setCheckingOnboarding(false);
    }
  }, [isAuthenticated, authUser, setUser, router]);

  // Initialize mock data
  useEffect(() => {
    setTournaments([
      {
        id: 't1',
        name: 'Math Olympiad 2026',
        description: 'Annual mathematics competition',
        subject: 'Math',
        startDate: new Date(Date.now() + 86400000 * 2).toISOString(),
        endDate: new Date(Date.now() + 86400000 * 5).toISOString(),
        maxParticipants: 64,
        currentParticipants: 48,
        prizePool: 5000,
        status: 'upcoming'
      },
      {
        id: 't2',
        name: 'Physics Championship',
        subject: 'Physics',
        startDate: new Date(Date.now()).toISOString(),
        endDate: new Date(Date.now() + 86400000 * 3).toISOString(),
        maxParticipants: 32,
        currentParticipants: 32,
        prizePool: 2500,
        status: 'active'
      },
      {
        id: 't3',
        name: 'EduSparring World Cup',
        description: 'The ultimate knowledge battle',
        startDate: new Date(Date.now() + 86400000 * 7).toISOString(),
        endDate: new Date(Date.now() + 86400000 * 14).toISOString(),
        maxParticipants: 128,
        currentParticipants: 89,
        prizePool: 25000,
        status: 'upcoming'
      }
    ] as Tournament[]);

    setLiveMatches([
      {
        id: 'lm1',
        player1Name: 'AlphaScholar',
        player2Name: 'QuantumMind',
        player1Score: 45,
        player2Score: 38,
        currentRound: 4,
        totalRounds: 5,
        subject: 'Math',
        spectatorCount: 127
      },
      {
        id: 'lm2',
        player1Name: 'NeoGenius',
        player2Name: 'CyberWhiz',
        player1Score: 30,
        player2Score: 30,
        currentRound: 3,
        totalRounds: 5,
        subject: 'Physics',
        spectatorCount: 84
      }
    ] as LiveMatch[]);

    setFriends([
      { id: 'f1', name: 'Alex', knowledgeRating: 1250, status: 'online' },
      { id: 'f2', name: 'Jordan', knowledgeRating: 1180, status: 'in_match', currentSubject: 'Math' },
      { id: 'f3', name: 'Taylor', knowledgeRating: 1320, status: 'offline' },
      { id: 'f4', name: 'Morgan', knowledgeRating: 950, status: 'online' }
    ] as Friend[]);
  }, [setTournaments, setLiveMatches, setFriends]);

  // Fetch leaderboard when tab changes
  useEffect(() => {
    if (activeTab === 'leaderboard') {
      fetchLeaderboard(leaderboardCategory);
    }
  }, [activeTab, leaderboardCategory]);

  const fetchLeaderboard = async (category: string) => {
    try {
      const res = await fetch(`/api/community/leaderboard?category=${category}&limit=20`);
      const data = await res.json();
      if (data.success) {
        setLeaderboard(data.leaderboard);
      }
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
    }
  };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
  };

  // Show loading state only if we're still initializing
  // Don't wait for auth - show landing page quickly for better UX
  if (isLoading || (isAuthenticated && checkingOnboarding)) {
    return <LoadingScreen />;
  }

  // Show landing page if not authenticated
  if (!isAuthenticated) {
    return <LandingPage />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 text-white">
      {/* Header - Using MobileHeader with Hamburger Menu */}
      <MobileHeader
        user={user ? {
          id: user.id,
          name: user.name,
          email: user.email,
          knowledgeRating: user.knowledgeRating,
          points: user.points,
          currentStreak: user.currentStreak,
          avatar: user.avatar,
        } : null}
        title="EduSparring"
        actions={liveMatches.length > 0 ? [
          {
            label: `${liveMatches.length} Live Battles`,
            icon: <Radio className="w-5 h-5 text-red-400 animate-pulse" />,
            href: '/multiplayer',
          }
        ] : []}
      />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <AnimatePresence mode="wait">
          {match && match.status === 'active' ? (
            <BattleArena />
          ) : (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {activeTab === 'home' && <HomePage onStartMatch={startQuickMatch} isSearching={isSearchingMatch} />}
              {activeTab === 'dashboard' && <Dashboard user={user} />}
              {activeTab === 'leaderboard' && <LeaderboardView />}
              {activeTab === 'profile' && <ProfileView user={user} />}
              {activeTab === 'settings' && <SettingsView />}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      {!match && (
        <nav className="fixed bottom-0 left-0 right-0 backdrop-blur-xl bg-black/50 border-t border-white/10">
          <div className="container mx-auto px-4 py-2">
            <div className="flex items-center justify-around">
              {[
                { id: 'home', icon: Trophy, label: 'Battle' },
                { id: 'dashboard', icon: BarChart3, label: 'Stats' },
                { id: 'leaderboard', icon: Trophy, label: 'Ranks' },
                { id: 'profile', icon: User, label: 'Profile' }
              ].map(({ id, icon: Icon, label }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id as typeof activeTab)}
                  className={`flex flex-col items-center gap-1 py-2 px-4 rounded-xl transition-all ${
                    activeTab === id
                      ? 'text-purple-400 bg-purple-500/20'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs font-medium">{label}</span>
                </button>
              ))}
            </div>
          </div>
        </nav>
      )}

      {/* Match Result Modal */}
      <AnimatePresence>
        {showMatchResult && match && (
          <MatchResultModal
            match={match}
            user={user}
            onClose={() => {
              setShowMatchResult(false);
              setActiveTab('home');
            }}
            onViewFeedback={() => {
              setShowMatchResult(false);
              setShowCoachingFeedback(true);
            }}
          />
        )}
      </AnimatePresence>

      {/* Coaching Feedback Modal */}
      <AnimatePresence>
        {showCoachingFeedback && coachingFeedback && (
          <CoachingFeedbackModal
            feedback={coachingFeedback}
            subject={selectedSubject}
            onClose={() => {
              setShowCoachingFeedback(false);
              setActiveTab('home');
            }}
          />
        )}
      </AnimatePresence>

      {/* Friends Modal */}
      <AnimatePresence>
        {showFriendsModal && (
          <FriendsModal onClose={() => setShowFriendsModal(false)} />
        )}
      </AnimatePresence>

      {/* Global Search */}
      <GlobalSearch isOpen={searchOpen} onClose={closeSearch} />
    </div>
  );

  async function startQuickMatch() {
    if (!user) return;

    setSearchingMatch(true);

    try {
      const res = await fetch('/api/matchmaking/quick-match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerId: user.id, subject: selectedSubject })
      });
      const data = await res.json();

      if (data.success) {
        const battleRes = await fetch(`/api/battle/${data.matchId}?playerId=${user.id}`);
        const battleData = await battleRes.json();

        if (battleData.success) {
          setMatch({
            id: data.matchId,
            opponent: {
              id: data.opponent.id,
              name: data.opponent.name,
              knowledgeRating: data.opponent.knowledgeRating,
              score: 0
            },
            mode: 'quick',
            status: 'active',
            totalRounds: 5,
            currentRound: 1,
            playerScore: 0,
            opponentScore: 0,
            difficulty: 'medium',
            currentQuestion: battleData.battle.currentQuestion,
            rounds: [],
            timeLeft: 15
          });
          setActiveTab('battle');
        }
      }
    } catch (error) {
      console.error('Failed to start match:', error);
      addNotification('Failed to start match. Please try again.', 'error');
    } finally {
      setSearchingMatch(false);
    }
  }
}

// Loading Screen
function LoadingScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center">
      <motion.div
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="flex flex-col items-center gap-4"
      >
        <Swords className="w-16 h-16 text-purple-400" />
        <p className="text-xl font-semibold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
          Loading EduSparring...
        </p>
      </motion.div>
    </div>
  );
}

// Home Page Component - Sparring Centered
function HomePage({ onStartMatch, isSearching }: { onStartMatch: () => void; isSearching: boolean }) {
  const { user, selectedSubject, setSelectedSubject, tournaments, liveMatches } = useAppStore();
  const subjects = ['Math', 'Physics', 'Chemistry', 'Biology', 'History', 'Geography'];

  return (
    <div className="space-y-6 pb-20">
      {/* Hero Section - Sparring Focused */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-4"
      >
        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="mb-2"
        >
          <Swords className="w-16 h-16 text-purple-400 mx-auto" />
        </motion.div>
        
        <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent mb-1">
          Ready to Spar?
        </h1>
        
        <p className="text-sm text-gray-400">
          Challenge the Bot or find a Student to battle!
        </p>
      </motion.div>

      {/* User Stats */}
      {user && (
        <div className="grid grid-cols-3 gap-2">
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-2 text-center">
              <Crown className="w-5 h-5 mx-auto mb-1 text-yellow-400" />
              <p className="text-base font-bold">{user.knowledgeRating}</p>
              <p className="text-[10px] text-gray-400">KR Rating</p>
            </CardContent>
          </Card>
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-2 text-center">
              <Target className="w-5 h-5 mx-auto mb-1 text-green-400" />
              <p className="text-base font-bold">{user.totalWins}</p>
              <p className="text-[10px] text-gray-400">Wins</p>
            </CardContent>
          </Card>
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-2 text-center">
              <Flame className="w-5 h-5 mx-auto mb-1 text-orange-400" />
              <p className="text-base font-bold">{user.currentStreak}</p>
              <p className="text-[10px] text-gray-400">Streak</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* MAIN SPARRING SECTION - Featured Prominently */}
      <Card className="bg-gradient-to-br from-purple-900/30 to-cyan-900/30 border-purple-500/30 overflow-hidden">
        <CardHeader className="pb-2 text-center">
          <CardTitle className="text-xl flex items-center justify-center gap-2">
            <Swords className="w-6 h-6 text-purple-400" />
            Sparring Arena
          </CardTitle>
          <p className="text-sm text-gray-400">Choose your battle mode</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Subject Selection */}
          <div className="space-y-2">
            <p className="text-xs text-gray-400 text-center">Select Subject</p>
            <div className="flex flex-wrap justify-center gap-2">
              {subjects.map((subject) => (
                <motion.button
                  key={subject}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedSubject(subject)}
                  className={`px-3 py-1.5 rounded-full text-sm border transition-all ${
                    selectedSubject === subject
                      ? 'bg-purple-500/30 border-purple-500 text-white'
                      : 'bg-white/5 border-white/10 hover:border-purple-500/50 text-gray-300'
                  }`}
                >
                  {subjectIcons[subject]} {subject}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Two Main Sparring Buttons */}
          <div className="grid grid-cols-1 gap-3">
            {/* Play with Bot - Primary */}
            <Link href="/ai-tutor">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  className="w-full py-8 text-lg font-semibold bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 border-0 shadow-lg shadow-cyan-500/25"
                >
                  <Bot className="w-6 h-6 mr-3" />
                  Play with Bot
                  <span className="ml-2 text-xs opacity-75">Practice Mode</span>
                </Button>
              </motion.div>
            </Link>

            {/* Play with Student - Secondary */}
            <Link href="/multiplayer">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  className="w-full py-8 text-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 border-0 shadow-lg shadow-purple-500/25"
                >
                  <Users className="w-6 h-6 mr-3" />
                  Play with Student
                  <span className="ml-2 text-xs opacity-75">Live Match</span>
                </Button>
              </motion.div>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-4 gap-2">
        <Link href="/leaderboard">
          <Card className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors cursor-pointer">
            <CardContent className="p-2 text-center">
              <Trophy className="w-4 h-4 mx-auto mb-1 text-yellow-400" />
              <p className="text-[10px] text-gray-400">Ranks</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/ai-tutor">
          <Card className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors cursor-pointer">
            <CardContent className="p-2 text-center">
              <Brain className="w-4 h-4 mx-auto mb-1 text-purple-400" />
              <p className="text-[10px] text-gray-400">AI Tutor</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/videos">
          <Card className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors cursor-pointer">
            <CardContent className="p-2 text-center">
              <Video className="w-4 h-4 mx-auto mb-1 text-red-400" />
              <p className="text-[10px] text-gray-400">Videos</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/social">
          <Card className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors cursor-pointer">
            <CardContent className="p-2 text-center">
              <Users className="w-4 h-4 mx-auto mb-1 text-cyan-400" />
              <p className="text-[10px] text-gray-400">Social</p>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Daily Streak & Quests Section */}
      <div className="space-y-3">
        <StreakDisplay />
        <DailyQuests />
      </div>

      {/* Live Matches */}
      {liveMatches.length > 0 && (
        <Card className="bg-gradient-to-br from-red-900/20 to-orange-900/20 border-red-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Radio className="w-5 h-5 text-red-400 animate-pulse" />
              Live Matches
              <Badge variant="outline" className="ml-auto bg-red-500/20 border-red-500/30 text-red-400">
                {liveMatches.length} Live
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {liveMatches.map((match) => (
              <motion.div
                key={match.id}
                whileHover={{ scale: 1.01 }}
                className="flex items-center justify-between p-3 bg-black/30 rounded-xl border border-white/5"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium">{match.player1Name}</span>
                    <span className="text-xs text-gray-400">vs</span>
                    <span className="text-sm font-medium">{match.player2Name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <span>{match.player1Score} - {match.player2Score}</span>
                    <span>•</span>
                    <span>Round {match.currentRound}/{match.totalRounds}</span>
                    <span>•</span>
                    <span>{match.subject}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <Eye className="w-3 h-3" />
                    {match.spectatorCount}
                  </div>
                  <Button size="sm" variant="outline" className="border-white/20 bg-white/5">
                    Spectate
                  </Button>
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      )}

      {tournaments.length > 0 && (
        <Card className="bg-white/5 border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-400" />
              Tournaments
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {tournaments.slice(0, 3).map((tournament) => (
              <motion.div
                key={tournament.id}
                whileHover={{ scale: 1.01 }}
                className="p-4 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 rounded-xl border border-white/5"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-semibold">{tournament.name}</h4>
                    <p className="text-sm text-gray-400 flex items-center gap-2">
                      {tournament.subject && (
                        <>
                          <span>{subjectIcons[tournament.subject]} {tournament.subject}</span>
                          <span>•</span>
                        </>
                      )}
                      <span>{tournament.currentParticipants}/{tournament.maxParticipants} players</span>
                    </p>
                  </div>
                  <Badge variant="outline" className={
                    tournament.status === 'active' 
                      ? 'bg-green-500/20 border-green-500/30 text-green-400'
                      : 'bg-yellow-500/20 border-yellow-500/30 text-yellow-400'
                  }>
                    {tournament.status === 'active' ? 'Live' : 'Upcoming'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-yellow-400">
                    <Trophy className="w-4 h-4" />
                    <span className="font-semibold">{tournament.prizePool.toLocaleString()} pts</span>
                  </div>
                  <Button size="sm" className="bg-gradient-to-r from-purple-600 to-cyan-600">
                    {tournament.status === 'active' ? 'Watch' : 'Join'}
                  </Button>
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      )}

      <Card className="bg-gradient-to-br from-purple-900/30 to-cyan-900/30 border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-lg">How to Play</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { step: 1, text: 'Select a subject and find an opponent' },
            { step: 2, text: 'Answer questions before time runs out' },
            { step: 3, text: 'Earn points for correct answers' },
            { step: 4, text: 'Climb the leaderboard and become a champion!' }
          ].map(({ step, text }) => (
            <div key={step} className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-purple-500/30 flex items-center justify-center text-xs font-bold">
                {step}
              </div>
              <p className="text-sm text-gray-300">{text}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

// Battle Arena Component
function BattleArena() {
  const {
    user, match, setMatch, setTimeLeft, addRound,
    setShowMatchResult, setCoachingFeedback, updateMatchScore
  } = useAppStore();

  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackData, setFeedbackData] = useState<{
    isCorrect: boolean;
    opponentCorrect: boolean;
    explanation: string;
  } | null>(null);
  
  const autoSubmitTriggeredRef = useRef(false);

  const handleMatchEnd = useCallback(async (winnerId?: string) => {
    if (!match || !user) return;

    try {
      const res = await fetch('/api/ai/coaching-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ matchId: match.id, playerId: user.id })
      });
      const data = await res.json();

      if (data.success) {
        setCoachingFeedback(data.feedback);
      }

      setMatch({
        ...match,
        status: 'completed',
        winner: winnerId === user.id ? 'player' : winnerId ? 'opponent' : 'draw'
      });
      setShowMatchResult(true);
    } catch (error) {
      console.error('Failed to get feedback:', error);
    }
  }, [match, user, setCoachingFeedback, setMatch, setShowMatchResult]);

  const handleSubmitAnswer = useCallback(async (answer: string | null) => {
    if (!match || !user || hasAnswered) return;

    setHasAnswered(true);
    setSelectedAnswer(answer);

    try {
      const res = await fetch(`/api/battle/${match.id}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playerId: user.id,
          answer: answer || '',
          timeTaken: 15 - (match.timeLeft || 15)
        })
      });
      const data = await res.json();

      if (data.success) {
        const result = data.result;
        
        setFeedbackData({
          isCorrect: result.playerCorrect,
          opponentCorrect: result.opponentCorrect,
          explanation: result.explanation
        });

        updateMatchScore(
          match.playerScore + result.playerPoints,
          match.opponentScore + result.opponentPoints
        );

        addRound({
          roundNumber: match.currentRound,
          question: match.currentQuestion!,
          playerAnswer: answer || '',
          opponentAnswer: result.opponentAnswer,
          playerCorrect: result.playerCorrect,
          opponentCorrect: result.opponentCorrect,
          pointsAwarded: result.playerPoints
        });

        setShowFeedback(true);

        if (result.matchEnded) {
          setTimeout(() => {
            handleMatchEnd(result.winner);
          }, 2000);
        }
      }
    } catch (error) {
      console.error('Failed to submit answer:', error);
    }
  }, [match, user, hasAnswered, updateMatchScore, addRound, handleMatchEnd]);

  const handleNextRound = useCallback(async () => {
    if (!match || !user) return;

    setShowFeedback(false);
    setHasAnswered(false);
    setSelectedAnswer(null);
    autoSubmitTriggeredRef.current = false;

    try {
      const res = await fetch(`/api/battle/${match.id}?playerId=${user.id}`);
      const data = await res.json();

      if (data.success) {
        setMatch({
          ...match,
          currentRound: match.currentRound + 1,
          currentQuestion: data.battle.currentQuestion,
          timeLeft: 15
        });
      }
    } catch (error) {
      console.error('Failed to get next question:', error);
    }
  }, [match, user, setMatch]);

  useEffect(() => {
    if (!match || match.status !== 'active' || hasAnswered) return;

    const timer = setInterval(() => {
      setTimeLeft((match.timeLeft || 15) - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [match?.timeLeft, match?.status, hasAnswered, setTimeLeft]);

  useEffect(() => {
    if (match?.timeLeft === 0 && !hasAnswered && !autoSubmitTriggeredRef.current) {
      autoSubmitTriggeredRef.current = true;
      const timeoutId = setTimeout(() => {
        handleSubmitAnswer(null);
      }, 0);
      return () => clearTimeout(timeoutId);
    }
  }, [match?.timeLeft, hasAnswered, handleSubmitAnswer]);

  if (!match || !match.currentQuestion) {
    return <LoadingScreen />;
  }

  const question = match.currentQuestion;
  const timeLeft = match.timeLeft || 15;
  const timeProgress = (timeLeft / 15) * 100;

  return (
    <div className="pb-20 space-y-4">
      <div className="flex items-center justify-between p-4 bg-black/30 rounded-xl border border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-sm font-bold">
            {user?.name.charAt(0)}
          </div>
          <div>
            <p className="font-semibold">{user?.name}</p>
            <p className="text-xs text-gray-400">{match.playerScore} pts</p>
          </div>
        </div>

        <div className="text-center">
          <Badge variant="outline" className="bg-purple-500/20 border-purple-500/30">
            Round {match.currentRound}/{match.totalRounds}
          </Badge>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="font-semibold">{match.opponent.name}</p>
            <p className="text-xs text-gray-400">{match.opponentScore} pts</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center text-sm">
            🤖
          </div>
        </div>
      </div>

      <div className="relative">
        <Progress
          value={timeProgress}
          className={`h-2 ${timeLeft <= 5 ? 'bg-red-900/50' : 'bg-purple-900/50'}`}
        />
        <div className={`text-center mt-2 ${timeLeft <= 5 ? 'text-red-400' : 'text-gray-400'}`}>
          <Clock className="w-4 h-4 inline mr-1" />
          {timeLeft}s
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-br from-purple-900/40 to-cyan-900/40 rounded-2xl p-6 border border-purple-500/20"
      >
        <div className="flex items-center gap-2 mb-4">
          <Badge variant="outline" className="bg-purple-500/20">
            {question.difficulty}
          </Badge>
          <Badge variant="outline" className="bg-cyan-500/20">
            {question.pointsValue} pts
          </Badge>
        </div>

        <h3 className="text-xl font-semibold mb-6 leading-relaxed">
          {question.text}
        </h3>

        {!showFeedback ? (
          <div className="grid gap-3">
            {question.options?.map((option, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => !hasAnswered && handleSubmitAnswer(option.charAt(0))}
                disabled={hasAnswered}
                className={`p-4 rounded-xl text-left border transition-all ${
                  selectedAnswer === option.charAt(0)
                    ? 'bg-purple-500/30 border-purple-500'
                    : 'bg-white/5 border-white/10 hover:border-purple-500/50'
                } ${hasAnswered ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <span className="font-medium">{option}</span>
              </motion.button>
            ))}
          </div>
        ) : (
          <FeedbackView
            feedback={feedbackData!}
            selectedAnswer={selectedAnswer}
            correctAnswer={question.correctAnswer}
            options={question.options || []}
            onContinue={handleNextRound}
            isLastRound={match.currentRound >= match.totalRounds}
          />
        )}
      </motion.div>
    </div>
  );
}

// Feedback View Component
function FeedbackView({
  feedback,
  selectedAnswer,
  correctAnswer,
  options,
  onContinue,
  isLastRound
}: {
  feedback: { isCorrect: boolean; opponentCorrect: boolean; explanation: string };
  selectedAnswer: string | null;
  correctAnswer: string;
  options: string[];
  onContinue: () => void;
  isLastRound: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="grid gap-2">
        {options.map((option, index) => {
          const letter = option.charAt(0);
          const isSelected = selectedAnswer === letter;
          const isCorrect = letter === correctAnswer;

          return (
            <div
              key={index}
              className={`p-4 rounded-xl border ${
                isCorrect
                  ? 'bg-green-500/20 border-green-500'
                  : isSelected
                  ? 'bg-red-500/20 border-red-500'
                  : 'bg-white/5 border-white/10'
              }`}
            >
              <div className="flex items-center justify-between">
                <span>{option}</span>
                {isCorrect && <CheckCircle2 className="w-5 h-5 text-green-400" />}
                {isSelected && !isCorrect && <XCircle className="w-5 h-5 text-red-400" />}
              </div>
            </div>
          );
        })}
      </div>

      <div className={`p-4 rounded-xl ${
        feedback.isCorrect
          ? 'bg-green-500/20 border border-green-500/30'
          : 'bg-red-500/20 border border-red-500/30'
      }`}>
        <div className="flex items-center gap-2 mb-2">
          {feedback.isCorrect ? (
            <>
              <CheckCircle2 className="w-5 h-5 text-green-400" />
              <span className="font-semibold text-green-400">Correct!</span>
            </>
          ) : (
            <>
              <XCircle className="w-5 h-5 text-red-400" />
              <span className="font-semibold text-red-400">Incorrect</span>
            </>
          )}
        </div>
        <p className="text-sm text-gray-300">{feedback.explanation}</p>
      </div>

      <div className="text-center text-sm text-gray-400">
        Opponent {feedback.opponentCorrect ? 'answered correctly ✓' : 'answered incorrectly ✗'}
      </div>

      <Button
        onClick={onContinue}
        className="w-full py-5 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500"
      >
        {isLastRound ? 'See Results' : 'Next Question'}
        <ChevronRight className="w-4 h-4 ml-2" />
      </Button>
    </motion.div>
  );
}

// Match Result Modal
function MatchResultModal({
  match,
  user,
  onClose,
  onViewFeedback
}: {
  match: any;
  user: UserType | null;
  onClose: () => void;
  onViewFeedback: () => void;
}) {
  const won = match.winner === 'player';
  const draw = match.winner === 'draw';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-md bg-gradient-to-br from-slate-900 to-purple-950 rounded-2xl p-6 border border-purple-500/20"
      >
        <div className="text-center mb-6">
          {won ? (
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 0.5, repeat: 3 }}
            >
              <Trophy className="w-20 h-20 mx-auto text-yellow-400" />
            </motion.div>
          ) : draw ? (
            <Medal className="w-20 h-20 mx-auto text-gray-400" />
          ) : (
            <Target className="w-20 h-20 mx-auto text-gray-400" />
          )}

          <h2 className={`text-2xl font-bold mt-4 ${
            won ? 'text-yellow-400' : draw ? 'text-gray-400' : 'text-gray-300'
          }`}>
            {won ? 'Victory!' : draw ? "It's a Draw!" : 'Defeat'}
          </h2>
        </div>

        <div className="flex items-center justify-around p-4 bg-black/30 rounded-xl mb-6">
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-lg font-bold mx-auto mb-2">
              {user?.name.charAt(0)}
            </div>
            <p className="font-semibold">{user?.name}</p>
            <p className="text-2xl font-bold text-green-400">{match.playerScore}</p>
          </div>

          <div className="text-2xl font-bold text-gray-500">VS</div>

          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center text-lg mx-auto mb-2">
              🤖
            </div>
            <p className="font-semibold">{match.opponent.name}</p>
            <p className="text-2xl font-bold text-red-400">{match.opponentScore}</p>
          </div>
        </div>

        <div className="space-y-3">
          <Button
            onClick={onViewFeedback}
            className="w-full py-5 bg-gradient-to-r from-purple-600 to-cyan-600"
          >
            <Brain className="w-4 h-4 mr-2" />
            View Performance Analysis
          </Button>
          <Button
            onClick={onClose}
            variant="outline"
            className="w-full py-5 border-white/20 bg-white/5"
          >
            Return Home
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Coaching Feedback Modal
function CoachingFeedbackModal({
  feedback,
  subject,
  onClose
}: {
  feedback: CoachingFeedback;
  subject?: string;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-lg bg-gradient-to-br from-slate-900 to-purple-950 rounded-2xl p-6 border border-purple-500/20 my-8"
      >
        <div className="text-center mb-6">
          <Brain className="w-16 h-16 mx-auto text-purple-400 mb-2" />
          <h2 className="text-2xl font-bold">Performance Analysis</h2>
          <p className="text-gray-400 text-sm mt-1">AI-powered coaching feedback</p>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-white/5 rounded-xl">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              Strengths
            </h3>
            <p className="text-sm text-gray-300">{feedback.strengths}</p>
          </div>

          <div className="p-4 bg-white/5 rounded-xl">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <Target className="w-4 h-4 text-red-400" />
              Areas to Improve
            </h3>
            <p className="text-sm text-gray-300">{feedback.weaknesses}</p>
          </div>

          <div className="p-4 bg-white/5 rounded-xl">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-cyan-400" />
              Study Tips
            </h3>
            <p className="text-sm text-gray-300">{feedback.recommendations?.join('. ') || 'Keep practicing!'}</p>
          </div>

          {/* Video Suggestions */}
          {subject && (
            <VideoSuggestions 
              subject={subject} 
              showAfterBattle={true}
            />
          )}
        </div>

        <Button onClick={onClose} className="w-full mt-6 py-5 bg-gradient-to-r from-purple-600 to-cyan-600">
          Continue
        </Button>
      </motion.div>
    </motion.div>
  );
}

// Friends Modal
function FriendsModal({ onClose }: { onClose: () => void }) {
  const { friends } = useAppStore();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-md bg-gradient-to-br from-slate-900 to-purple-950 rounded-2xl p-6 border border-purple-500/20"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-400" />
            Friends
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3 max-h-96 overflow-y-auto">
          {friends.map((friend) => (
            <div
              key={friend.id}
              className="flex items-center justify-between p-3 bg-white/5 rounded-xl"
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-sm font-bold">
                    {friend.name.charAt(0)}
                  </div>
                  <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-slate-900 ${
                    friend.status === 'online' ? 'bg-green-500' :
                    friend.status === 'in_match' ? 'bg-yellow-500' : 'bg-gray-500'
                  }`} />
                </div>
                <div>
                  <p className="font-medium">{friend.name}</p>
                  <p className="text-xs text-gray-400">
                    {friend.status === 'in_match' 
                      ? `In ${friend.currentSubject} match` 
                      : friend.status.charAt(0).toUpperCase() + friend.status.slice(1)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {friend.knowledgeRating} KR
                </Badge>
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                  <MessageCircle className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <Button className="w-full mt-6" variant="outline">
          <UserPlus className="w-4 h-4 mr-2" />
          Add Friend
        </Button>
      </motion.div>
    </motion.div>
  );
}

// Dashboard Component
function Dashboard({ user }: { user: UserType | null }) {
  const krTier = user ? getKRTier(user.knowledgeRating) : null;

  return (
    <div className="space-y-6 pb-20">
      <div className="text-center py-6">
        <h2 className="text-2xl font-bold mb-2">Your Dashboard</h2>
        <p className="text-gray-400">Track your progress and performance</p>
      </div>

      {krTier && (
        <Card className="bg-gradient-to-r from-purple-900/50 to-cyan-900/50 border-purple-500/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-gray-400">Knowledge Rating</p>
                <p className="text-3xl font-bold">{user?.knowledgeRating}</p>
              </div>
              <Badge className={`${krTier.color} bg-white/10`}>
                {krTier.tier}
              </Badge>
            </div>
            <Progress value={krTier.progress} className="h-2" />
            <p className="text-xs text-gray-400 mt-2">
              {krTier.progress.toFixed(0)}% to {krTier.nextTier}
            </p>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-4 text-center">
            <Target className="w-8 h-8 mx-auto mb-2 text-green-400" />
            <p className="text-2xl font-bold">{user?.totalWins || 0}</p>
            <p className="text-sm text-gray-400">Wins</p>
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-4 text-center">
            <XCircle className="w-8 h-8 mx-auto mb-2 text-red-400" />
            <p className="text-2xl font-bold">{user?.totalLosses || 0}</p>
            <p className="text-sm text-gray-400">Losses</p>
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-4 text-center">
            <Flame className="w-8 h-8 mx-auto mb-2 text-orange-400" />
            <p className="text-2xl font-bold">{user?.currentStreak || 0}</p>
            <p className="text-sm text-gray-400">Current Streak</p>
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-4 text-center">
            <Star className="w-8 h-8 mx-auto mb-2 text-yellow-400" />
            <p className="text-2xl font-bold">{user?.bestStreak || 0}</p>
            <p className="text-sm text-gray-400">Best Streak</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Leaderboard View
function LeaderboardView() {
  const { leaderboard, leaderboardCategory, setLeaderboardCategory } = useAppStore();

  return (
    <div className="space-y-6 pb-20">
      <div className="text-center py-6">
        <h2 className="text-2xl font-bold mb-2">Leaderboard</h2>
        <p className="text-gray-400">See how you rank against other players</p>
      </div>

      <Tabs value={leaderboardCategory} onValueChange={setLeaderboardCategory}>
        <TabsList className="w-full grid grid-cols-3">
          <TabsTrigger value="global">Global</TabsTrigger>
          <TabsTrigger value="country">Country</TabsTrigger>
          <TabsTrigger value="friends">Friends</TabsTrigger>
        </TabsList>
        <TabsContent value={leaderboardCategory} className="mt-4">
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-0">
              <div className="divide-y divide-white/10">
                {leaderboard.length > 0 ? leaderboard.map((entry, index) => (
                  <div key={entry.userId} className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                      <span className={`w-8 text-center font-bold ${
                        index === 0 ? 'text-yellow-400' :
                        index === 1 ? 'text-gray-300' :
                        index === 2 ? 'text-orange-400' : 'text-gray-500'
                      }`}>
                        #{index + 1}
                      </span>
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-sm font-bold">
                        {entry.name?.charAt(0) || '?'}
                      </div>
                      <div>
                        <p className="font-medium">{entry.name || 'Unknown'}</p>
                        <p className="text-xs text-gray-400">{entry.points} pts</p>
                      </div>
                    </div>
                    <Badge variant="outline">{entry.rank}</Badge>
                  </div>
                )) : (
                  <div className="p-8 text-center text-gray-400">
                    No leaderboard data available
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Profile View
function ProfileView({ user }: { user: UserType | null }) {
  const krTier = user ? getKRTier(user.knowledgeRating) : null;

  return (
    <div className="space-y-6 pb-20">
      <div className="text-center py-6">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-3xl font-bold mx-auto mb-4">
          {user?.name?.charAt(0) || '?'}
        </div>
        <h2 className="text-2xl font-bold">{user?.name || 'Unknown'}</h2>
        <p className="text-gray-400">{user?.email}</p>
        {krTier && (
          <Badge className={`mt-2 ${krTier.color} bg-white/10`}>
            {krTier.tier} • {user?.knowledgeRating} KR
          </Badge>
        )}
      </div>

      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-lg">Statistics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between">
            <span className="text-gray-400">Total Points</span>
            <span className="font-medium">{user?.points?.toLocaleString() || 0}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Win Rate</span>
            <span className="font-medium">
              {user?.totalWins && user.totalWins + (user.totalLosses || 0) > 0
                ? ((user.totalWins / (user.totalWins + (user.totalLosses || 0))) * 100).toFixed(1)
                : 0}%
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Country</span>
            <span className="font-medium">{user?.country || 'Not set'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Level</span>
            <span className="font-medium">{user?.level || 'High School'}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Settings View
function SettingsView() {
  const { settings, updateSettings } = useAppStore();

  return (
    <div className="space-y-6 pb-20">
      <div className="text-center py-6">
        <h2 className="text-2xl font-bold mb-2">Settings</h2>
        <p className="text-gray-400">Customize your experience</p>
      </div>

      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Bell className="w-5 h-5 text-purple-400" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Push Notifications</p>
              <p className="text-sm text-gray-400">Get notified about matches</p>
            </div>
            <Switch
              checked={settings.notifications}
              onCheckedChange={(checked) => updateSettings({ notifications: checked })}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Email Notifications</p>
              <p className="text-sm text-gray-400">Weekly progress reports</p>
            </div>
            <Switch
              checked={settings.notifications}
              onCheckedChange={(checked) => updateSettings({ notifications: checked })}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Volume2 className="w-5 h-5 text-purple-400" />
            Sound & Vibration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Sound Effects</p>
              <p className="text-sm text-gray-400">Play sounds during matches</p>
            </div>
            <Switch
              checked={settings.sounds}
              onCheckedChange={(checked) => updateSettings({ sounds: checked })}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Vibration</p>
              <p className="text-sm text-gray-400">Haptic feedback</p>
            </div>
            <Switch
              checked={settings.vibrations}
              onCheckedChange={(checked) => updateSettings({ vibrations: checked })}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Globe className="w-5 h-5 text-purple-400" />
            Language
          </CardTitle>
        </CardHeader>
        <CardContent>
          <select
            value={settings.language}
            onChange={(e) => updateSettings({ language: e.target.value })}
            className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white"
          >
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="fr">Français</option>
            <option value="zh">中文</option>
            <option value="ar">العربية</option>
            <option value="hi">हिंदी</option>
            <option value="pt">Português</option>
          </select>
        </CardContent>
      </Card>

      {/* Help & Onboarding */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-purple-400" />
            Help & Getting Started
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Link href="/onboarding">
            <Button
              variant="outline"
              className="w-full justify-between border-white/20 bg-white/5 hover:bg-white/10"
            >
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4" />
                <span>View Onboarding Guide</span>
              </div>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </Link>
          <p className="text-xs text-gray-400 text-center">
            Review how EduSparring works and learn about all features
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
