'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/components/AuthProvider';

export interface StreakData {
  current: number;
  best: number;
  lastLogin: string | null;
  streakFreeze: number;
  milestones: number[];
  totalRewards: number;
}

export interface LoginBonus {
  dayInCycle: number;
  points: number;
  bonus?: { type: string; value: number };
  claimed: boolean;
}

export interface Quest {
  id: string;
  type: string;
  title: string;
  description: string;
  target: number;
  progress: number;
  completed: boolean;
  claimed: boolean;
  pointsReward: number;
  bonusReward: { type: string; value: number } | null;
  expiresAt: string;
}

export function useGamification() {
  const { user } = useAuth();
  const [streak, setStreak] = useState<StreakData | null>(null);
  const [loginBonus, setLoginBonus] = useState<LoginBonus | null>(null);
  const [quests, setQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(true);
  const [isNewDay, setIsNewDay] = useState(false);

  // Fetch streak data
  const fetchStreak = useCallback(async () => {
    if (!user?.id) return;

    try {
      const res = await fetch(`/api/streak?userId=${user.id}`);
      const data = await res.json();
      
      if (data.success) {
        setStreak(data.streak);
        setLoginBonus(data.loginBonus);
        setIsNewDay(data.isNewDay);
      }
    } catch (error) {
      console.error('Failed to fetch streak:', error);
    }
  }, [user?.id]);

  // Fetch quests
  const fetchQuests = useCallback(async () => {
    if (!user?.id) return;

    try {
      const res = await fetch(`/api/quests?userId=${user.id}`);
      const data = await res.json();
      
      if (data.success) {
        setQuests(data.quests);
      }
    } catch (error) {
      console.error('Failed to fetch quests:', error);
    }
  }, [user?.id]);

  // Initial fetch
  useEffect(() => {
    if (user?.id) {
      Promise.all([fetchStreak(), fetchQuests()]).finally(() => {
        setLoading(false);
      });
    }
  }, [user?.id, fetchStreak, fetchQuests]);

  // Claim login bonus
  const claimLoginBonus = useCallback(async () => {
    if (!user?.id) return false;

    try {
      const res = await fetch('/api/streak', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id }),
      });
      const data = await res.json();
      
      if (data.success) {
        setLoginBonus(prev => prev ? { ...prev, claimed: true } : null);
        return data;
      }
      return false;
    } catch (error) {
      console.error('Failed to claim bonus:', error);
      return false;
    }
  }, [user?.id]);

  // Update quest progress
  const updateQuestProgress = useCallback(async (questType: string, increment: number = 1) => {
    if (!user?.id) return;

    try {
      const res = await fetch('/api/quests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, questType, increment }),
      });
      const data = await res.json();
      
      if (data.success && data.quest) {
        setQuests(prev => 
          prev.map(q => q.id === data.quest.id ? data.quest : q)
        );
        return data.justCompleted;
      }
    } catch (error) {
      console.error('Failed to update quest:', error);
    }
    return false;
  }, [user?.id]);

  // Claim quest reward
  const claimQuestReward = useCallback(async (questId: string) => {
    if (!user?.id) return false;

    try {
      const res = await fetch('/api/quests', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questId, userId: user.id }),
      });
      const data = await res.json();
      
      if (data.success) {
        setQuests(prev => 
          prev.map(q => q.id === questId ? { ...q, claimed: true } : q)
        );
        return data;
      }
      return false;
    } catch (error) {
      console.error('Failed to claim quest:', error);
      return false;
    }
  }, [user?.id]);

  // Get milestone emoji
  const getMilestoneEmoji = (days: number): string => {
    if (days >= 365) return '🏆';
    if (days >= 180) return '💎';
    if (days >= 90) return '🥇';
    if (days >= 60) return '🥈';
    if (days >= 30) return '🥉';
    if (days >= 14) return '⭐';
    if (days >= 7) return '🔥';
    return '✨';
  };

  // Get streak tier
  const getStreakTier = (days: number): { name: string; color: string; nextMilestone: number } => {
    const milestones = [7, 14, 30, 60, 90, 180, 365];
    const nextMilestone = milestones.find(m => m > days) || milestones[milestones.length - 1];
    
    if (days >= 365) return { name: 'Legendary', color: 'text-yellow-400', nextMilestone: 365 };
    if (days >= 180) return { name: 'Diamond', color: 'text-cyan-400', nextMilestone: 365 };
    if (days >= 90) return { name: 'Platinum', color: 'text-purple-400', nextMilestone: 180 };
    if (days >= 60) return { name: 'Gold', color: 'text-yellow-400', nextMilestone: 90 };
    if (days >= 30) return { name: 'Silver', color: 'text-gray-400', nextMilestone: 60 };
    if (days >= 14) return { name: 'Bronze', color: 'text-amber-600', nextMilestone: 30 };
    if (days >= 7) return { name: 'Rising', color: 'text-orange-400', nextMilestone: 14 };
    return { name: 'Starter', color: 'text-gray-500', nextMilestone: 7 };
  };

  return {
    streak,
    loginBonus,
    quests,
    loading,
    isNewDay,
    claimLoginBonus,
    updateQuestProgress,
    claimQuestReward,
    getMilestoneEmoji,
    getStreakTier,
    refreshStreak: fetchStreak,
    refreshQuests: fetchQuests,
  };
}
