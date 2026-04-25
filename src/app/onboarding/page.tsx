'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Swords, Trophy, Crown, Users, Shield, Brain, Video, MessageCircle,
  ChevronRight, ChevronLeft, SkipForward, Zap, Target, Flame, Star,
  Globe, BookOpen, Award, Heart, Check, ArrowRight, Bot, Radio
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/components/AuthProvider';

const ONBOARDING_STEPS = [
  {
    id: 'welcome',
    title: 'Welcome to EduSparring',
    subtitle: 'Your journey to knowledge mastery begins here',
    icon: Swords,
    color: 'from-purple-500 to-cyan-500',
    content: [
      {
        title: 'A Safe Haven for Students',
        description: 'EduSparring is more than just exam prep—it\'s a global community where students connect, learn, and grow together in a safe, moderated environment.',
        icon: Heart
      },
      {
        title: 'Learn Through Competition',
        description: 'Turn studying into exciting knowledge battles. Compete with students worldwide or practice with our AI bot to sharpen your skills.',
        icon: Trophy
      },
      {
        title: 'Track Your Progress',
        description: 'Watch yourself grow from Beginner to Elite with our unique Knowledge Rating system. Every battle makes you stronger.',
        icon: TrendingUp
      }
    ]
  },
  {
    id: 'sparring',
    title: 'Sparring: The Heart of EduSparring',
    subtitle: 'Challenge yourself, challenge others',
    icon: Swords,
    color: 'from-red-500 to-orange-500',
    content: [
      {
        title: 'What is Sparring?',
        description: 'Sparring is a real-time knowledge battle where you answer questions against an opponent. Each round tests your speed and accuracy. The faster and more accurate you are, the more points you earn!',
        icon: Zap
      },
      {
        title: 'Play with Bot',
        description: 'Not ready to face a real opponent? Practice with our AI bot! It adapts to your skill level and helps you improve without pressure. Perfect for warming up or learning new subjects.',
        icon: Bot
      },
      {
        title: 'Play with Students',
        description: 'Ready for real competition? Match with students from around the world! Our matchmaking pairs you with opponents of similar skill for fair, exciting battles.',
        icon: Users
      }
    ]
  },
  {
    id: 'kr',
    title: 'Knowledge Rating (KR) System',
    subtitle: 'Your score, your rank, your journey',
    icon: Crown,
    color: 'from-yellow-500 to-amber-500',
    content: [
      {
        title: 'How KR Works',
        description: 'Like chess ratings, your Knowledge Rating (KR) reflects your skill level. Win battles to gain KR points, and watch yourself climb from Beginner (800) all the way to Elite (1800+)!',
        icon: TrendingUp
      },
      {
        title: 'KR Tiers',
        description: 'Beginner (800-999): You\'re just starting! | Intermediate (1000-1399): Building confidence! | Advanced (1400-1799): Serious contender! | Elite (1800+): Top of the class!',
        icon: Award
      },
      {
        title: 'Subject-Specific KR',
        description: 'Your KR is tracked per subject. Master Math, dominate Physics, or become an all-around champion. Each subject shows your true expertise.',
        icon: Target
      }
    ]
  },
  {
    id: 'connection',
    title: 'Connecting with Students',
    subtitle: 'Make friends, find rivals, build community',
    icon: Users,
    color: 'from-cyan-500 to-blue-500',
    content: [
      {
        title: 'Find Opponents',
        description: 'Browse online players, see their KR and subjects, and challenge them to a battle. Or use Quick Match to find an opponent automatically!',
        icon: Search
      },
      {
        title: 'Friend System',
        description: 'Add friends, see when they\'re online, and challenge them anytime. Build your study circle and grow together!',
        icon: UserPlus
      },
      {
        title: 'Spectate Matches',
        description: 'Watch live battles between other students! Learn from their strategies and see how top players approach questions.',
        icon: Eye
      }
    ]
  },
  {
    id: 'safety',
    title: 'Your Safety Matters',
    subtitle: 'Learn and compete in a protected environment',
    icon: Shield,
    color: 'from-green-500 to-emerald-500',
    content: [
      {
        title: 'Verified Students Only',
        description: 'All users are verified students. No adults pretending to be kids, no strangers—just a community of learners like you.',
        icon: Check
      },
      {
        title: 'AI Moderation',
        description: 'Our AI monitors all chats and content to prevent bullying, harassment, and inappropriate behavior. Stay focused on learning!',
        icon: Brain
      },
      {
        title: 'Guardian Connection',
        description: 'Parents can link to your account to see your progress (not your chats). They get weekly reports and can set limits if needed.',
        icon: Heart
      }
    ]
  },
  {
    id: 'features',
    title: 'More Than Just Sparring',
    subtitle: 'Everything you need to excel',
    icon: Star,
    color: 'from-purple-500 to-pink-500',
    content: [
      {
        title: 'AI Tutor',
        description: 'Get personalized tutoring in any subject. Ask questions, get explanations, and receive practice problems tailored to your weak areas.',
        icon: Brain
      },
      {
        title: 'Video Lessons',
        description: 'Watch curated educational videos on topics you\'re struggling with. Short, focused lessons that fit your schedule.',
        icon: Video
      },
      {
        title: 'Social Hub',
        description: 'Join study circles, find peer tutors, share achievements, and connect with students worldwide who share your interests.',
        icon: MessageCircle
      },
      {
        title: 'Tournaments & Leagues',
        description: 'Compete in weekly tournaments and seasonal leagues. Win prizes, earn badges, and make your mark on the global leaderboard!',
        icon: Trophy
      }
    ]
  },
  {
    id: 'ready',
    title: 'Ready to Begin?',
    subtitle: 'Your first spar awaits!',
    icon: Zap,
    color: 'from-purple-600 to-cyan-600',
    content: [
      {
        title: 'Start with Bot Practice',
        description: 'We recommend starting with a few bot matches to get comfortable with the sparring format before challenging real students.',
        icon: Bot
      },
      {
        title: 'Choose Your Subject',
        description: 'Pick a subject you\'re confident in for your first battle. You can always explore other subjects as you improve!',
        icon: BookOpen
      },
      {
        title: 'Have Fun!',
        description: 'Remember: every champion started as a beginner. Learn from each battle, celebrate your wins, and grow from your losses. Enjoy the journey!',
        icon: Flame
      }
    ]
  }
];

function TrendingUp({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>;
}

function Search({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>;
}

function Eye({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>;
}

function UserPlus({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="8.5" cy="7" r="4" /><line x1="20" y1="8" x2="20" y2="14" /><line x1="23" y1="11" x2="17" y2="11" /></svg>;
}

export default function OnboardingPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [isCompleting, setIsCompleting] = useState(false);

  const step = ONBOARDING_STEPS[currentStep];
  const progress = ((currentStep + 1) / ONBOARDING_STEPS.length) * 100;
  const isLastStep = currentStep === ONBOARDING_STEPS.length - 1;
  const isFirstStep = currentStep === 0;

  const handleNext = () => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
      // Scroll to top when navigating to next step
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      // Scroll to top when navigating to previous step
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSkip = async () => {
    // For non-authenticated users, save to localStorage
    if (!isAuthenticated) {
      localStorage.setItem('edusparring_onboarding_completed', 'true');
      router.push('/');
      return;
    }
    
    setIsCompleting(true);
    try {
      // Track the skip - increment skip count
      await fetch('/api/user/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'skip' })
      });
      // Also save to localStorage as backup
      localStorage.setItem('edusparring_onboarding_completed', 'true');
      router.push('/');
    } catch (error) {
      console.error('Failed to skip onboarding:', error);
      localStorage.setItem('edusparring_onboarding_completed', 'true');
      router.push('/');
    }
  };

  const handleComplete = async () => {
    // For non-authenticated users, save to localStorage
    if (!isAuthenticated) {
      localStorage.setItem('edusparring_onboarding_completed', 'true');
      router.push('/');
      return;
    }

    setIsCompleting(true);
    try {
      // Mark onboarding as fully completed (not skipped)
      await fetch('/api/user/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'complete' })
      });
      // Also save to localStorage as backup
      localStorage.setItem('edusparring_onboarding_completed', 'true');
      router.push('/');
    } catch (error) {
      console.error('Failed to complete onboarding:', error);
      localStorage.setItem('edusparring_onboarding_completed', 'true');
      router.push('/');
    }
  };

  // If not authenticated, still show onboarding but with different completion behavior
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 text-white overflow-hidden">
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

          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400">
              Step {currentStep + 1} of {ONBOARDING_STEPS.length}
            </span>
            <Button
              variant="ghost"
              onClick={handleSkip}
              className="text-gray-400 hover:text-white hover:bg-white/10"
            >
              <SkipForward className="w-4 h-4 mr-2" />
              Skip
            </Button>
          </div>
        </div>
        <Progress value={progress} className="h-1 rounded-none bg-white/10" />
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={step.id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
          >
            {/* Step Header */}
            <div className="text-center space-y-4">
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className={`w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-xl`}
              >
                <step.icon className="w-10 h-10 text-white" />
              </motion.div>
              <motion.h2
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-3xl md:text-4xl font-bold"
              >
                {step.title}
              </motion.h2>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-lg text-gray-400"
              >
                {step.subtitle}
              </motion.p>
            </div>

            {/* Step Content Cards */}
            <div className="grid gap-4">
              {step.content.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  <Card className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center shrink-0`}>
                          <item.icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="space-y-1">
                          <h3 className="text-lg font-semibold">{item.title}</h3>
                          <p className="text-gray-400 leading-relaxed">{item.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-8">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={isFirstStep}
                className={`px-6 py-3 border-white/20 bg-white/5 hover:bg-white/10 ${isFirstStep ? 'opacity-0' : ''}`}
              >
                <ChevronLeft className="w-5 h-5 mr-2" />
                Previous
              </Button>

              {isLastStep ? (
                <Button
                  onClick={handleComplete}
                  disabled={isCompleting}
                  className="px-8 py-3 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-lg font-semibold shadow-lg shadow-purple-500/25"
                >
                  {isCompleting ? (
                    <>
                      <div className="w-5 h-5 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Starting...
                    </>
                  ) : (
                    <>
                      Let's Go!
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  className="px-8 py-3 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-lg font-semibold shadow-lg shadow-purple-500/25"
                >
                  Next
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              )}
            </div>

            {/* Step Indicators */}
            <div className="flex justify-center gap-2 pt-4">
              {ONBOARDING_STEPS.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentStep(index);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentStep
                      ? 'w-8 bg-gradient-to-r from-purple-500 to-cyan-500'
                      : index < currentStep
                      ? 'bg-purple-500'
                      : 'bg-white/20'
                  }`}
                />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
