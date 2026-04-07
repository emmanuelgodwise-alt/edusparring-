'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, Target, BookOpen, Video, Trophy, Clock, TrendingUp,
  ChevronRight, Lightbulb, Brain, Zap, Star, RefreshCw, Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Recommendation, LearningPath, LearningProfile } from '@/types/ai';

// Recommendations Hook
export function useRecommendations(userId: string, subjects: string[]) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [learningPath, setLearningPath] = useState<LearningPath | null>(null);
  const [loading, setLoading] = useState(true);

  // Generate recommendations based on user profile
  useEffect(() => {
    const generateRecommendations = async () => {
      setLoading(true);
      
      // Simulate API call - in production, this would call /api/ai/recommendations
      const mockRecommendations: Recommendation[] = [
        {
          id: '1',
          type: 'practice',
          subject: 'Math',
          topic: 'Quadratic Equations',
          title: 'Practice Quadratic Equations',
          description: 'Review solving quadratic equations using the quadratic formula.',
          reason: 'Based on your recent performance, practicing this topic will strengthen your algebra skills.',
          priority: 'high',
          relevanceScore: 0.92,
          estimatedDuration: 15,
          actionUrl: '/sparring?subject=Math&topic=Quadratic%20Equations',
          createdAt: new Date().toISOString(),
        },
        {
          id: '2',
          type: 'video',
          subject: 'Physics',
          topic: 'Newton\'s Laws',
          title: 'Watch: Newton\'s Laws Explained',
          description: 'A comprehensive video explaining all three laws of motion.',
          reason: 'You expressed interest in mechanics. This video covers foundational concepts.',
          priority: 'medium',
          relevanceScore: 0.85,
          estimatedDuration: 20,
          actionUrl: '/videos?topic=Newton%27s%20Laws',
          createdAt: new Date().toISOString(),
        },
        {
          id: '3',
          type: 'review',
          subject: 'Chemistry',
          topic: 'Periodic Table',
          title: 'Review Periodic Table Trends',
          description: 'Refresh your knowledge of periodic trends and element properties.',
          reason: 'It\'s been 5 days since you last practiced this topic. Spaced repetition helps retention!',
          priority: 'medium',
          relevanceScore: 0.78,
          estimatedDuration: 10,
          createdAt: new Date().toISOString(),
        },
        {
          id: '4',
          type: 'challenge',
          subject: 'Math',
          topic: 'Problem Solving',
          title: 'Daily Challenge: Math Olympiad',
          description: 'Test your skills with today\'s featured challenge problem.',
          reason: 'You\'re ready for advanced problems! Challenge yourself to level up.',
          priority: 'high',
          relevanceScore: 0.88,
          estimatedDuration: 25,
          actionUrl: '/sparring?mode=challenge',
          createdAt: new Date().toISOString(),
        },
      ];

      setRecommendations(mockRecommendations);
      
      // Mock learning path
      setLearningPath({
        id: 'lp1',
        userId,
        title: 'Master Algebra Fundamentals',
        description: 'Build a strong foundation in algebraic concepts',
        subject: 'Math',
        targetGoal: 'Complete mastery of algebra fundamentals',
        currentProgress: 45,
        estimatedDaysToComplete: 21,
        milestones: [
          { id: 'm1', title: 'Linear Equations', description: 'Master solving linear equations', targetLevel: 80, requiredTopics: ['Linear Equations'], completed: true, completedAt: new Date().toISOString() },
          { id: 'm2', title: 'Quadratic Equations', description: 'Master solving quadratic equations', targetLevel: 75, requiredTopics: ['Quadratic Equations'], completed: false },
          { id: 'm3', title: 'Systems of Equations', description: 'Master solving systems of equations', targetLevel: 70, requiredTopics: ['Systems of Equations'], completed: false },
        ],
        recommendedDaily: [
          { type: 'practice', subject: 'Math', topic: 'Quadratic Equations', duration: 15, difficulty: 5, reason: 'Continue your streak' },
          { type: 'video', subject: 'Math', topic: 'Factoring', duration: 10, difficulty: 4, reason: 'Related to current topic' },
        ],
        createdAt: new Date().toISOString(),
      });
      
      setLoading(false);
    };

    generateRecommendations();
  }, [userId, subjects.join(',')]);

  const refreshRecommendations = () => {
    setLoading(true);
    // Re-fetch recommendations
    setTimeout(() => setLoading(false), 1000);
  };

  return { recommendations, learningPath, loading, refreshRecommendations };
}

// Recommendations Display Component
interface RecommendationsDisplayProps {
  userId: string;
  subjects?: string[];
  limit?: number;
}

export function RecommendationsDisplay({ 
  userId, 
  subjects = ['Math', 'Physics', 'Chemistry'],
  limit = 4 
}: RecommendationsDisplayProps) {
  const { recommendations, learningPath, loading, refreshRecommendations } = useRecommendations(userId, subjects);
  const [filter, setFilter] = useState<'all' | 'practice' | 'video' | 'review' | 'challenge'>('all');

  const filteredRecommendations = useMemo(() => {
    let filtered = recommendations;
    if (filter !== 'all') {
      filtered = filtered.filter(r => r.type === filter);
    }
    return filtered.slice(0, limit);
  }, [recommendations, filter, limit]);

  const getTypeIcon = (type: Recommendation['type']) => {
    switch (type) {
      case 'practice': return Target;
      case 'video': return Video;
      case 'lesson': return BookOpen;
      case 'challenge': return Trophy;
      case 'review': return RefreshCw;
      default: return Sparkles;
    }
  };

  const getTypeColor = (type: Recommendation['type']) => {
    switch (type) {
      case 'practice': return 'text-blue-400 bg-blue-500/20';
      case 'video': return 'text-purple-400 bg-purple-500/20';
      case 'lesson': return 'text-cyan-400 bg-cyan-500/20';
      case 'challenge': return 'text-yellow-400 bg-yellow-500/20';
      case 'review': return 'text-green-400 bg-green-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getPriorityBadge = (priority: Recommendation['priority']) => {
    switch (priority) {
      case 'high': return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Priority</Badge>;
      case 'medium': return null;
      case 'low': return <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">Optional</Badge>;
    }
  };

  if (loading) {
    return (
      <Card className="bg-white/5 border-white/10">
        <CardContent className="p-4">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 bg-white/10 rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Learning Path Progress */}
      {learningPath && (
        <Card className="bg-gradient-to-br from-purple-900/30 to-cyan-900/30 border-purple-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-400" />
              Your Learning Path
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-white">{learningPath.title}</h4>
              <span className="text-sm text-purple-400">{learningPath.currentProgress}%</span>
            </div>
            <Progress value={learningPath.currentProgress} className="h-2 mb-4" />
            
            {/* Milestones */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {learningPath.milestones.map((milestone, index) => (
                <div
                  key={milestone.id}
                  className={`flex-shrink-0 px-3 py-2 rounded-lg ${
                    milestone.completed
                      ? 'bg-green-500/20 border border-green-500/30'
                      : index === learningPath.milestones.findIndex(m => !m.completed)
                      ? 'bg-purple-500/20 border border-purple-500/30'
                      : 'bg-white/5 border border-white/10'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {milestone.completed ? (
                      <Star className="w-4 h-4 text-green-400 fill-current" />
                    ) : (
                      <span className="w-4 h-4 rounded-full border-2 border-gray-400 flex items-center justify-center text-xs">
                        {index + 1}
                      </span>
                    )}
                    <span className={`text-sm ${milestone.completed ? 'text-green-400' : 'text-gray-300'}`}>
                      {milestone.title}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Daily Recommendation */}
            {learningPath.recommendedDaily[0] && (
              <div className="mt-4 p-3 bg-white/5 rounded-lg">
                <p className="text-xs text-gray-400 mb-1">Recommended Today</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm text-white">{learningPath.recommendedDaily[0].topic}</span>
                    <span className="text-xs text-gray-400">({learningPath.recommendedDaily[0].duration} min)</span>
                  </div>
                  <Button size="sm" className="bg-purple-500 hover:bg-purple-600">
                    Start
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Personalized Recommendations */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-400" />
              For You
            </CardTitle>
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-gray-400">
                    <Filter className="w-4 h-4 mr-1" />
                    {filter === 'all' ? 'All' : filter}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setFilter('all')}>All</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilter('practice')}>Practice</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilter('video')}>Videos</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilter('review')}>Review</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilter('challenge')}>Challenges</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button
                variant="ghost"
                size="icon"
                onClick={refreshRecommendations}
                disabled={loading}
                className="text-gray-400"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <AnimatePresence>
            {filteredRecommendations.map((rec, index) => {
              const TypeIcon = getTypeIcon(rec.type);
              const typeColor = getTypeColor(rec.type);
              
              return (
                <motion.div
                  key={rec.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer group"
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${typeColor}`}>
                      <TypeIcon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-white group-hover:text-purple-400 transition-colors">
                          {rec.title}
                        </h4>
                        {getPriorityBadge(rec.priority)}
                      </div>
                      <p className="text-sm text-gray-400 line-clamp-2">{rec.description}</p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {rec.estimatedDuration} min
                        </span>
                        <span>{rec.subject}</span>
                        {rec.topic && <span>• {rec.topic}</span>}
                      </div>
                      {/* AI Reason */}
                      <div className="mt-2 p-2 bg-purple-500/10 rounded text-xs text-purple-300 flex items-start gap-1">
                        <Lightbulb className="w-3 h-3 flex-shrink-0 mt-0.5" />
                        {rec.reason}
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-purple-400 transition-colors" />
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
}

// Compact Recommendations Widget
export function RecommendationsWidget({ userId }: { userId: string }) {
  const { recommendations, loading } = useRecommendations(userId, ['Math']);

  if (loading) {
    return (
      <Card className="bg-white/5 border-white/10">
        <CardContent className="p-4">
          <div className="animate-pulse h-16 bg-white/10 rounded" />
        </CardContent>
      </Card>
    );
  }

  const topRec = recommendations[0];

  return (
    <Card className="bg-gradient-to-br from-purple-900/30 to-cyan-900/30 border-purple-500/20">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span className="text-sm font-medium text-purple-400">Recommended for You</span>
        </div>
        {topRec && (
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-white">{topRec.title}</h4>
              <p className="text-xs text-gray-400">{topRec.reason.slice(0, 50)}...</p>
            </div>
            <Button size="sm" className="bg-purple-500 hover:bg-purple-600">
              {topRec.estimatedDuration} min
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
