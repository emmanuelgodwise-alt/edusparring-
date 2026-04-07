'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Crown, Star, Gift, Lock, Check, ChevronUp, Zap, Clock,
  Diamond, Award, Sparkles, ShoppingCart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/components/AuthProvider';

interface SeasonPassData {
  seasonPass: {
    id: string;
    name: string;
    description: string;
    totalTiers: number;
    premiumPrice: number;
    daysRemaining: number;
  };
  progress: {
    currentXp: number;
    maxXp: number;
    currentTier: number;
    xpProgress: number;
    tierProgress: number;
    isPremium: boolean;
  };
  rewards: {
    free: any[];
    premium: any[];
    freeClaimed: number[];
    premiumClaimed: number[];
    availableFree: any[];
    availablePremium: any[];
  };
}

export function SeasonPass() {
  const { user } = useAuth();
  const [data, setData] = useState<SeasonPassData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTier, setSelectedTier] = useState<number | null>(null);
  const [claiming, setClaiming] = useState(false);

  useEffect(() => {
    if (user?.id) {
      fetchSeasonPass();
    }
  }, [user?.id]);

  const fetchSeasonPass = async () => {
    try {
      const res = await fetch(`/api/season-pass?userId=${user?.id}`);
      const json = await res.json();
      if (json.success) {
        setData(json);
      }
    } catch (error) {
      console.error('Failed to fetch season pass:', error);
    } finally {
      setLoading(false);
    }
  };

  const claimReward = async (tier: number, isPremium: boolean) => {
    if (!user?.id || claiming) return;
    
    setClaiming(true);
    try {
      const res = await fetch('/api/season-pass', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, tier, isPremium }),
      });
      const json = await res.json();
      if (json.success) {
        // Refresh data
        fetchSeasonPass();
      }
    } catch (error) {
      console.error('Failed to claim reward:', error);
    } finally {
      setClaiming(false);
    }
  };

  if (loading) {
    return (
      <Card className="bg-white/5 border-white/10">
        <CardContent className="p-4">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-white/10 rounded w-40" />
            <div className="h-4 bg-white/10 rounded w-full" />
            <div className="h-32 bg-white/10 rounded" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data) return null;

  const { seasonPass, progress, rewards } = data;

  // Generate visible tiers (current ± 3)
  const visibleTiers = [];
  const startTier = Math.max(1, progress.currentTier - 2);
  const endTier = Math.min(seasonPass.totalTiers, progress.currentTier + 3);
  for (let i = startTier; i <= endTier; i++) {
    visibleTiers.push(i);
  }

  return (
    <Card className="bg-gradient-to-br from-purple-900/30 to-cyan-900/30 border-purple-500/20">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Crown className="w-5 h-5 text-yellow-400" />
            {seasonPass.name}
          </CardTitle>
          <Badge variant="outline" className="bg-purple-500/20 border-purple-500/30 text-purple-300">
            <Clock className="w-3 h-3 mr-1" />
            {seasonPass.daysRemaining} days
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl font-bold">Tier {progress.currentTier}</span>
              <Badge className="bg-gradient-to-r from-purple-600 to-cyan-600">
                <Star className="w-3 h-3 mr-1" />
                {progress.currentXp.toLocaleString()} XP
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span>Tier {progress.currentTier}</span>
              <Progress value={progress.tierProgress} className="w-24 h-1.5" />
              <span>Tier {Math.min(progress.currentTier + 1, seasonPass.totalTiers)}</span>
            </div>
          </div>
          
          {!progress.isPremium && (
            <Button
              size="sm"
              className="bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-500 hover:to-amber-500"
            >
              <ShoppingCart className="w-4 h-4 mr-1" />
              Premium ${seasonPass.premiumPrice}
            </Button>
          )}
        </div>

        {/* Overall Progress */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-gray-400">
            <span>Season Progress</span>
            <span>{progress.xpProgress.toFixed(1)}%</span>
          </div>
          <Progress value={progress.xpProgress} className="h-2" />
        </div>

        {/* Available Rewards */}
        {rewards.availableFree.length > 0 && (
          <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
            <p className="text-sm text-green-400 flex items-center gap-2 mb-2">
              <Gift className="w-4 h-4" />
              {rewards.availableFree.length} reward{rewards.availableFree.length > 1 ? 's' : ''} to claim!
            </p>
            <div className="flex flex-wrap gap-2">
              {rewards.availableFree.slice(0, 3).map((reward: any) => (
                <Button
                  key={reward.tier}
                  size="sm"
                  onClick={() => claimReward(reward.tier, false)}
                  disabled={claiming}
                  className="bg-green-600 hover:bg-green-500 text-xs"
                >
                  {reward.icon} {reward.name}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Tier Grid */}
        <div className="relative">
          {/* Current Tier Indicator */}
          <div 
            className="absolute left-0 right-0 bg-purple-500/20 border-y border-purple-500/30 z-0"
            style={{ 
              top: `${((progress.currentTier - startTier) / (endTier - startTier + 1)) * 100}%`,
              height: `${100 / (endTier - startTier + 1)}%`
            }}
          />

          <div className="space-y-2 relative z-10">
            {visibleTiers.map((tier) => {
              const freeReward = rewards.free.find((r: any) => r.tier === tier);
              const premiumReward = rewards.premium.find((r: any) => r.tier === tier);
              const freeClaimed = rewards.freeClaimed.includes(tier);
              const premiumClaimed = rewards.premiumClaimed.includes(tier);
              const isLocked = tier > progress.currentTier;
              const isCurrent = tier === progress.currentTier;

              return (
                <motion.div
                  key={tier}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`flex items-center gap-2 p-2 rounded-lg ${
                    isCurrent ? 'bg-purple-500/20 border border-purple-500/30' : 'bg-white/5'
                  } ${isLocked ? 'opacity-50' : ''}`}
                >
                  {/* Tier Number */}
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold ${
                    isLocked ? 'bg-gray-700' : freeClaimed ? 'bg-green-600' : 'bg-purple-600'
                  }`}>
                    {freeClaimed ? <Check className="w-5 h-5" /> : tier}
                  </div>

                  {/* Free Reward */}
                  {freeReward && (
                    <div className={`flex-1 flex items-center gap-2 p-2 rounded-lg ${
                      freeClaimed ? 'bg-green-500/20' : 'bg-white/5'
                    }`}>
                      <span className="text-lg">{freeReward.icon}</span>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{freeReward.name}</p>
                        <p className="text-xs text-gray-400">Free</p>
                      </div>
                      {!isLocked && !freeClaimed && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => claimReward(tier, false)}
                          disabled={claiming}
                          className="text-green-400 hover:text-green-300"
                        >
                          Claim
                        </Button>
                      )}
                    </div>
                  )}

                  {/* Premium Reward */}
                  {premiumReward && (
                    <div className={`flex-1 flex items-center gap-2 p-2 rounded-lg ${
                      premiumClaimed ? 'bg-yellow-500/20' : 'bg-yellow-500/10'
                    } border border-yellow-500/20`}>
                      <span className="text-lg">{premiumReward.icon}</span>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{premiumReward.name}</p>
                        <p className="text-xs text-yellow-400">Premium</p>
                      </div>
                      {progress.isPremium && !isLocked && !premiumClaimed && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => claimReward(tier, true)}
                          disabled={claiming}
                          className="text-yellow-400 hover:text-yellow-300"
                        >
                          Claim
                        </Button>
                      )}
                      {!progress.isPremium && (
                        <Lock className="w-4 h-4 text-yellow-400" />
                      )}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Premium Upgrade CTA */}
        {!progress.isPremium && (
          <div className="p-4 rounded-lg bg-gradient-to-r from-yellow-600/20 to-amber-600/20 border border-yellow-500/30">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-500 to-amber-500 flex items-center justify-center">
                <Diamond className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-yellow-400">Upgrade to Premium Pass</h4>
                <p className="text-sm text-gray-400">Unlock exclusive rewards, cosmetics, and more!</p>
              </div>
              <Button className="bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-500 hover:to-amber-500">
                ${seasonPass.premiumPrice}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Compact version for dashboard
export function SeasonPassCompact() {
  const { user } = useAuth();
  const [data, setData] = useState<SeasonPassData | null>(null);

  useEffect(() => {
    if (user?.id) {
      fetch(`/api/season-pass?userId=${user.id}`)
        .then(res => res.json())
        .then(json => json.success && setData(json))
        .catch(console.error);
    }
  }, [user?.id]);

  if (!data) return null;

  const { progress, rewards } = data;

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-500/20 rounded-full border border-purple-500/30">
        <Crown className="w-4 h-4 text-yellow-400" />
        <span className="text-sm font-medium">Tier {progress.currentTier}</span>
      </div>
      {rewards.availableFree.length > 0 && (
        <button className="flex items-center gap-1 px-3 py-1.5 bg-green-500/20 rounded-full border border-green-500/30 text-green-400">
          <Gift className="w-4 h-4" />
          <span className="text-sm font-medium">{rewards.availableFree.length}</span>
        </button>
      )}
    </div>
  );
}
