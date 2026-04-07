'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Award, Target, Trophy, Star, CheckCircle, ArrowRight,
  Zap, Shield, Users, Clock, TrendingUp, BadgeCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Link from 'next/link';

// Qualification requirements
const QUALIFICATION_PATHS = [
  {
    title: 'Academic Excellence',
    icon: Trophy,
    requirements: [
      { name: 'Knowledge Rating 1200+', description: 'Demonstrate consistent learning', target: 1200 },
      { name: '50+ Match Wins', description: 'Show competitive spirit', target: 50 },
      { name: '65% Win Rate', description: 'Prove your knowledge mastery', target: 65 },
    ],
    reward: 'Access to Standard Positions',
    tier: 'Silver',
  },
  {
    title: 'Leadership Track',
    icon: Star,
    requirements: [
      { name: 'Knowledge Rating 1400+', description: 'Advanced academic standing', target: 1400 },
      { name: '100+ Match Wins', description: 'Experienced competitor', target: 100 },
      { name: '70% Win Rate', description: 'Expert-level knowledge', target: 70 },
      { name: 'Mentor Badge', description: 'Help other students learn', target: 1 },
    ],
    reward: 'Access to Premium Positions + Priority Applications',
    tier: 'Gold',
  },
  {
    title: 'Elite Achievement',
    icon: Award,
    requirements: [
      { name: 'Knowledge Rating 1600+', description: 'Top-tier academic excellence', target: 1600 },
      { name: '200+ Match Wins', description: 'Master competitor', target: 200 },
      { name: '75% Win Rate', description: 'Elite knowledge mastery', target: 75 },
      { name: 'Helper Badge Level 3', description: 'Dedicated mentor', target: 3 },
      { name: 'Safe Chatter Badge', description: 'Community trust', target: 1 },
    ],
    reward: 'Access to Exclusive Positions + Fast-Track Applications + Career Coaching',
    tier: 'Platinum',
  },
];

// Mock user stats
const USER_STATS = {
  kr: 1450,
  wins: 85,
  winRate: 72,
  badges: ['safe_chatter', 'kind_friend', 'helper'],
  helperBadgeLevel: 2,
};

export default function QualifyPage() {
  const [selectedPath, setSelectedPath] = useState<number | null>(null);

  const checkRequirement = (req: { target: number }, value: number) => {
    return value >= req.target;
  };

  const getProgress = (req: { target: number }, value: number) => {
    return Math.min(100, (value / req.target) * 100);
  };

  const checkPathQualification = (path: typeof QUALIFICATION_PATHS[0]) => {
    let completed = 0;
    path.requirements.forEach(req => {
      if (req.name.includes('Knowledge Rating')) {
        if (USER_STATS.kr >= req.target) completed++;
      } else if (req.name.includes('Match Wins')) {
        if (USER_STATS.wins >= req.target) completed++;
      } else if (req.name.includes('Win Rate')) {
        if (USER_STATS.winRate >= req.target) completed++;
      } else if (req.name.includes('Mentor Badge')) {
        if (USER_STATS.badges.includes('helper')) completed++;
      } else if (req.name.includes('Helper Badge')) {
        if (USER_STATS.helperBadgeLevel >= req.target) completed++;
      } else if (req.name.includes('Safe Chatter')) {
        if (USER_STATS.badges.includes('safe_chatter')) completed++;
      } else {
        completed++;
      }
    });
    return {
      completed,
      total: path.requirements.length,
      qualified: completed === path.requirements.length,
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 text-white">
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Badge className="mb-4 bg-purple-500/20 text-purple-300 border-purple-500/30">
              <Target className="w-3 h-3 mr-1" />
              Career Preparation
            </Badge>
            <h1 className="text-4xl font-bold mb-4">Qualify for Mock Jobs</h1>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Complete these requirements to unlock real-world work experiences. 
              Build your skills, earn recognition, and discover your dream career.
            </p>
          </motion.div>
        </div>

        {/* Your Current Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card className="bg-white/5 border-white/10 max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-purple-400" />
                Your Current Standing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-white/5 rounded-lg">
                  <p className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                    {USER_STATS.kr}
                  </p>
                  <p className="text-sm text-gray-400">Knowledge Rating</p>
                </div>
                <div className="text-center p-4 bg-white/5 rounded-lg">
                  <p className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                    {USER_STATS.wins}
                  </p>
                  <p className="text-sm text-gray-400">Match Wins</p>
                </div>
                <div className="text-center p-4 bg-white/5 rounded-lg">
                  <p className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                    {USER_STATS.winRate}%
                  </p>
                  <p className="text-sm text-gray-400">Win Rate</p>
                </div>
                <div className="text-center p-4 bg-white/5 rounded-lg">
                  <p className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                    {USER_STATS.badges.length}
                  </p>
                  <p className="text-sm text-gray-400">Badges Earned</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Qualification Paths */}
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {QUALIFICATION_PATHS.map((path, index) => {
            const status = checkPathQualification(path);
            const tierColors: Record<string, string> = {
              Silver: 'from-gray-400 to-gray-300',
              Gold: 'from-yellow-500 to-yellow-300',
              Platinum: 'from-cyan-400 to-purple-400',
            };

            return (
              <motion.div
                key={path.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.1 }}
              >
                <Card className={`bg-white/5 border-white/10 h-full flex flex-col ${status.qualified ? 'ring-2 ring-green-500/50' : ''}`}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${tierColors[path.tier]} flex items-center justify-center`}>
                        <path.icon className="w-6 h-6 text-slate-900" />
                      </div>
                      <Badge variant="outline" className={`
                        ${path.tier === 'Silver' ? 'border-gray-400 text-gray-400' : ''}
                        ${path.tier === 'Gold' ? 'border-yellow-400 text-yellow-400' : ''}
                        ${path.tier === 'Platinum' ? 'border-cyan-400 text-cyan-400' : ''}
                      `}>
                        {path.tier}
                      </Badge>
                    </div>
                    <CardTitle className="mt-3">{path.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    <div className="space-y-3 flex-1">
                      {path.requirements.map((req, i) => {
                        let isComplete = false;
                        let current = 0;
                        
                        if (req.name.includes('Knowledge Rating')) {
                          current = USER_STATS.kr;
                          isComplete = current >= req.target;
                        } else if (req.name.includes('Match Wins')) {
                          current = USER_STATS.wins;
                          isComplete = current >= req.target;
                        } else if (req.name.includes('Win Rate')) {
                          current = USER_STATS.winRate;
                          isComplete = current >= req.target;
                        } else if (req.name.includes('Mentor Badge')) {
                          isComplete = USER_STATS.badges.includes('helper');
                        } else if (req.name.includes('Helper Badge')) {
                          current = USER_STATS.helperBadgeLevel;
                          isComplete = current >= req.target;
                        } else if (req.name.includes('Safe Chatter')) {
                          isComplete = USER_STATS.badges.includes('safe_chatter');
                        }

                        return (
                          <div key={i} className="space-y-1">
                            <div className="flex items-center justify-between text-sm">
                              <span className={isComplete ? 'text-green-400' : 'text-gray-400'}>
                                {isComplete ? <CheckCircle className="w-4 h-4 mr-1 inline" /> : null}
                                {req.name}
                              </span>
                              {current > 0 && !req.name.includes('Badge') && (
                                <span className="text-xs text-gray-500">
                                  {current}/{req.target}
                                </span>
                              )}
                            </div>
                            {!req.name.includes('Badge') && (
                              <Progress 
                                value={getProgress(req, current)} 
                                className="h-1.5"
                              />
                            )}
                            <p className="text-xs text-gray-500">{req.description}</p>
                          </div>
                        );
                      })}
                    </div>

                    <div className="mt-4 pt-4 border-t border-white/10">
                      <p className="text-sm text-gray-400 mb-3">
                        <strong className="text-white">Reward:</strong> {path.reward}
                      </p>
                      {status.qualified ? (
                        <div className="flex items-center gap-2 text-green-400">
                          <CheckCircle className="w-5 h-5" />
                          <span className="font-medium">Qualified!</span>
                        </div>
                      ) : (
                        <p className="text-xs text-amber-400">
                          {status.completed}/{status.total} requirements completed
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
        >
          <Card className="bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border-purple-500/20 max-w-2xl mx-auto">
            <CardContent className="p-6">
              <Zap className="w-10 h-10 mx-auto mb-4 text-purple-400" />
              <h3 className="text-xl font-semibold mb-2">Keep Building Your Skills!</h3>
              <p className="text-gray-400 mb-4">
                Every match you win brings you closer to real-world opportunities. 
                Start sparring now to improve your qualifications.
              </p>
              <Link href="/sparring">
                <Button className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500">
                  Start Sparring
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
