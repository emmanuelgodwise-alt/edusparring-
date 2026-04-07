'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp, TrendingDown, Minus, Zap, Target, Brain, AlertCircle,
  CheckCircle, Clock, BarChart3, ChevronUp, ChevronDown, Gauge
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import type { DifficultyAdjustment, PerformanceMetrics } from '@/types/ai';

// Adaptive Difficulty Hook
export function useAdaptiveDifficulty(
  userId: string,
  subject: string
) {
  const [difficulty, setDifficulty] = useState(5); // 1-10 scale
  const [performance, setPerformance] = useState<PerformanceMetrics>({
    recentAccuracy: 0.5,
    averageResponseTime: 15,
    streakCorrect: 0,
    streakIncorrect: 0,
    totalSessions: 0,
    improvementRate: 0,
  });
  const [adjustmentReason, setAdjustmentReason] = useState('');

  // Calculate new difficulty based on performance
  const calculateNewDifficulty = useCallback((
    currentDifficulty: number,
    metrics: PerformanceMetrics
  ): { newDifficulty: number; reason: string } => {
    let adjustment = 0;
    let reason = '';

    // Streak-based adjustment
    if (metrics.streakCorrect >= 5) {
      adjustment += 1;
      reason = `Great streak! ${metrics.streakCorrect} correct answers in a row.`;
    } else if (metrics.streakCorrect >= 3) {
      adjustment += 0.5;
      reason = `Building momentum! ${metrics.streakCorrect} correct answers.`;
    } else if (metrics.streakIncorrect >= 3) {
      adjustment -= 1;
      reason = `Let's slow down. ${metrics.streakIncorrect} incorrect answers.`;
    }

    // Accuracy-based adjustment
    if (metrics.recentAccuracy > 0.85 && metrics.totalSessions >= 5) {
      adjustment += 0.5;
      reason = reason || 'High accuracy! Ready for more challenge.';
    } else if (metrics.recentAccuracy < 0.5 && metrics.totalSessions >= 3) {
      adjustment -= 0.5;
      reason = reason || 'Need more practice at current level.';
    }

    // Response time adjustment
    if (metrics.averageResponseTime < 8 && metrics.recentAccuracy > 0.7) {
      adjustment += 0.3;
      reason = reason || 'Answering quickly and accurately!';
    } else if (metrics.averageResponseTime > 25) {
      adjustment -= 0.2;
      reason = reason || 'Taking time to think - adjusting for comprehension.';
    }

    // Improvement rate adjustment
    if (metrics.improvementRate > 0.1) {
      adjustment += 0.3;
    } else if (metrics.improvementRate < -0.1) {
      adjustment -= 0.3;
    }

    // Calculate new difficulty (clamped 1-10)
    const newDifficulty = Math.max(1, Math.min(10, currentDifficulty + adjustment));

    return { newDifficulty: Math.round(newDifficulty * 10) / 10, reason };
  }, []);

  // Record answer result
  const recordAnswer = useCallback((correct: boolean, responseTime: number) => {
    setPerformance(prev => {
      const newTotal = prev.totalSessions + 1;
      const newAccuracy = (prev.recentAccuracy * prev.totalSessions + (correct ? 1 : 0)) / newTotal;
      const newAvgTime = (prev.averageResponseTime * prev.totalSessions + responseTime) / newTotal;
      
      return {
        recentAccuracy: newAccuracy,
        averageResponseTime: newAvgTime,
        streakCorrect: correct ? prev.streakCorrect + 1 : 0,
        streakIncorrect: correct ? 0 : prev.streakIncorrect + 1,
        totalSessions: newTotal,
        improvementRate: newAccuracy - prev.recentAccuracy,
      };
    });
  }, []);

  // Adjust difficulty based on current performance
  useEffect(() => {
    if (performance.totalSessions < 3) return; // Wait for enough data

    const { newDifficulty, reason } = calculateNewDifficulty(difficulty, performance);
    
    if (Math.abs(newDifficulty - difficulty) >= 0.5) {
      setDifficulty(newDifficulty);
      setAdjustmentReason(reason);
      
      // Clear adjustment reason after a delay
      setTimeout(() => setAdjustmentReason(''), 5000);
    }
  }, [performance, difficulty, calculateNewDifficulty]);

  // Get difficulty label
  const getDifficultyLabel = (diff: number): string => {
    if (diff <= 2) return 'Beginner';
    if (diff <= 4) return 'Elementary';
    if (diff <= 6) return 'Intermediate';
    if (diff <= 8) return 'Advanced';
    return 'Expert';
  };

  // Get difficulty color
  const getDifficultyColor = (diff: number): string => {
    if (diff <= 2) return 'text-green-400';
    if (diff <= 4) return 'text-lime-400';
    if (diff <= 6) return 'text-yellow-400';
    if (diff <= 8) return 'text-orange-400';
    return 'text-red-400';
  };

  return {
    difficulty,
    performance,
    adjustmentReason,
    recordAnswer,
    getDifficultyLabel,
    getDifficultyColor,
    setDifficulty,
  };
}

// Adaptive Difficulty Display Component
interface AdaptiveDifficultyDisplayProps {
  difficulty: number;
  performance: PerformanceMetrics;
  adjustmentReason?: string;
  showDetails?: boolean;
}

export function AdaptiveDifficultyDisplay({
  difficulty,
  performance,
  adjustmentReason,
  showDetails = false,
}: AdaptiveDifficultyDisplayProps) {
  const getLabel = (diff: number) => {
    if (diff <= 2) return 'Beginner';
    if (diff <= 4) return 'Elementary';
    if (diff <= 6) return 'Intermediate';
    if (diff <= 8) return 'Advanced';
    return 'Expert';
  };

  const getColor = (diff: number) => {
    if (diff <= 2) return 'text-green-400';
    if (diff <= 4) return 'text-lime-400';
    if (diff <= 6) return 'text-yellow-400';
    if (diff <= 8) return 'text-orange-400';
    return 'text-red-400';
  };

  const getBarColor = (diff: number) => {
    if (diff <= 2) return 'bg-green-500';
    if (diff <= 4) return 'bg-lime-500';
    if (diff <= 6) return 'bg-yellow-500';
    if (diff <= 8) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <Card className="bg-white/5 border-white/10">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Gauge className="w-5 h-5 text-purple-400" />
            <span className="font-medium text-white">Difficulty</span>
          </div>
          <Badge className={`${getColor(difficulty)} bg-transparent border-current`}>
            {getLabel(difficulty)}
          </Badge>
        </div>

        {/* Difficulty Bar */}
        <div className="relative h-3 bg-white/10 rounded-full overflow-hidden mb-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(difficulty / 10) * 100}%` }}
            transition={{ duration: 0.5 }}
            className={`absolute h-full ${getBarColor(difficulty)}`}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-bold text-white drop-shadow">
              {difficulty.toFixed(1)}/10
            </span>
          </div>
        </div>

        {/* Adjustment Notification */}
        <AnimatePresence>
          {adjustmentReason && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-2 mt-2 p-2 bg-purple-500/20 rounded-lg"
            >
              <Zap className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-purple-300">{adjustmentReason}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Performance Details */}
        {showDetails && (
          <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-white/10">
            <div>
              <p className="text-xs text-gray-400">Accuracy</p>
              <p className={`font-semibold ${performance.recentAccuracy > 0.7 ? 'text-green-400' : performance.recentAccuracy > 0.5 ? 'text-yellow-400' : 'text-red-400'}`}>
                {(performance.recentAccuracy * 100).toFixed(0)}%
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Avg. Time</p>
              <p className="font-semibold text-white">
                {performance.averageResponseTime.toFixed(1)}s
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Streak</p>
              <div className="flex items-center gap-1">
                {performance.streakCorrect > 0 ? (
                  <>
                    <CheckCircle className="w-3 h-3 text-green-400" />
                    <span className="font-semibold text-green-400">{performance.streakCorrect}</span>
                  </>
                ) : performance.streakIncorrect > 0 ? (
                  <>
                    <AlertCircle className="w-3 h-3 text-red-400" />
                    <span className="font-semibold text-red-400">{performance.streakIncorrect}</span>
                  </>
                ) : (
                  <span className="text-gray-500">—</span>
                )}
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-400">Sessions</p>
              <p className="font-semibold text-white">{performance.totalSessions}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Difficulty Indicator for Battle UI
export function DifficultyIndicator({ difficulty }: { difficulty: number }) {
  const getColor = (diff: number) => {
    if (diff <= 3) return 'from-green-500 to-emerald-500';
    if (diff <= 5) return 'from-yellow-500 to-amber-500';
    if (diff <= 7) return 'from-orange-500 to-red-500';
    return 'from-red-500 to-rose-500';
  };

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-full border border-white/10">
      <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${getColor(difficulty)}`} />
      <Target className="w-4 h-4 text-gray-400" />
      <span className="text-sm font-medium">
        {difficulty <= 3 ? 'Easy' : difficulty <= 5 ? 'Medium' : difficulty <= 7 ? 'Hard' : 'Expert'}
      </span>
    </div>
  );
}

// Learning Zone Indicator
export function LearningZoneIndicator({ accuracy }: { accuracy: number }) {
  const getZone = (acc: number) => {
    if (acc < 0.5) return { zone: 'Panic Zone', color: 'text-red-400', bg: 'bg-red-500/20', icon: TrendingDown };
    if (acc < 0.8) return { zone: 'Learning Zone', color: 'text-green-400', bg: 'bg-green-500/20', icon: TrendingUp };
    return { zone: 'Comfort Zone', color: 'text-yellow-400', bg: 'bg-yellow-500/20', icon: Minus };
  };

  const { zone, color, bg, icon: Icon } = getZone(accuracy);

  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${bg}`}>
      <Icon className={`w-4 h-4 ${color}`} />
      <span className={`text-sm font-medium ${color}`}>{zone}</span>
    </div>
  );
}
