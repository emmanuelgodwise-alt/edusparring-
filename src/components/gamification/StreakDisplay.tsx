'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Flame, Snowflake, Gift, Sparkles, CheckCircle, X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useGamification } from '@/hooks/useGamification';

interface StreakDisplayProps {
  compact?: boolean;
}

export function StreakDisplay({ compact = false }: StreakDisplayProps) {
  const { streak, loginBonus, loading, claimLoginBonus, getStreakTier } = useGamification();
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const [claimed, setClaimed] = useState(false);

  if (loading) {
    return (
      <Card className="bg-white/5 border-white/10">
        <CardContent className="p-4">
          <div className="animate-pulse flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/10" />
            <div className="flex-1">
              <div className="h-4 bg-white/10 rounded w-20 mb-2" />
              <div className="h-3 bg-white/10 rounded w-32" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!streak) return null;

  const tier = getStreakTier(streak.current);

  const handleClaim = async () => {
    if (!loginBonus || loginBonus.claimed) return;
    
    setClaiming(true);
    const result = await claimLoginBonus();
    setClaiming(false);
    
    if (result) {
      setClaimed(true);
      setTimeout(() => {
        setShowClaimModal(false);
        setClaimed(false);
      }, 2000);
    }
  };

  const getGradient = () => {
    if (streak.current >= 30) return 'from-yellow-500 to-orange-500';
    if (streak.current >= 14) return 'from-orange-500 to-red-500';
    if (streak.current >= 7) return 'from-red-500 to-pink-500';
    return 'from-gray-500 to-gray-400';
  };

  if (compact) {
    return (
      <>
        <button
          onClick={() => loginBonus && !loginBonus.claimed && setShowClaimModal(true)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all ${
            loginBonus && !loginBonus.claimed
              ? 'bg-purple-500/20 border-purple-500/30 cursor-pointer hover:bg-purple-500/30'
              : 'bg-white/5 border-white/10'
          }`}
        >
          <motion.div
            animate={streak.current >= 7 ? { scale: [1, 1.2, 1] } : {}}
            transition={{ duration: 0.5, repeat: streak.current >= 7 ? Infinity : 0, repeatDelay: 2 }}
          >
            <Flame className={`w-4 h-4 ${streak.current >= 7 ? 'text-orange-400' : 'text-gray-400'}`} />
          </motion.div>
          <span className="text-sm font-medium">{streak.current}</span>
          {loginBonus && !loginBonus.claimed && (
            <Gift className="w-3 h-3 text-purple-400 animate-pulse" />
          )}
        </button>

        <ClaimModal
          show={showClaimModal}
          onClose={() => setShowClaimModal(false)}
          loginBonus={loginBonus}
          claiming={claiming}
          claimed={claimed}
          onClaim={handleClaim}
        />
      </>
    );
  }

  return (
    <>
      <Card className="bg-white/5 border-white/10 overflow-hidden">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            {/* Streak Icon */}
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="relative"
            >
              <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${getGradient()} flex items-center justify-center`}>
                <Flame className="w-7 h-7 text-white" />
              </div>
              {streak.current >= 7 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1"
                >
                  <span className="text-lg">{streak.current >= 30 ? '🏆' : streak.current >= 14 ? '⭐' : '🔥'}</span>
                </motion.div>
              )}
            </motion.div>

            {/* Streak Info */}
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold">{streak.current} Day Streak</h3>
                <Badge variant="outline" className={`${tier.color} border-current`}>
                  {tier.name}
                </Badge>
              </div>
              <p className="text-sm text-gray-400">
                Best: {streak.best} days
                {streak.streakFreeze > 0 && (
                  <span className="ml-2 flex items-center gap-1 inline-flex text-cyan-400">
                    <Snowflake className="w-3 h-3" />
                    {streak.streakFreeze} freeze{streak.streakFreeze > 1 ? 's' : ''}
                  </span>
                )}
              </p>
            </div>

            {/* Login Bonus Button */}
            {loginBonus && !loginBonus.claimed && (
              <Button
                onClick={() => setShowClaimModal(true)}
                size="sm"
                className="bg-gradient-to-r from-purple-600 to-cyan-600"
              >
                <Gift className="w-4 h-4 mr-1" />
                Day {loginBonus.dayInCycle}
              </Button>
            )}
          </div>

          {/* Milestones */}
          <div className="mt-4 flex gap-2">
            {[7, 14, 30, 60, 90].map((milestone) => {
              const achieved = streak.milestones.includes(milestone);
              const current = streak.current >= milestone;
              return (
                <div
                  key={milestone}
                  className={`flex-1 text-center p-2 rounded-lg ${
                    achieved
                      ? 'bg-green-500/20 text-green-400'
                      : current
                      ? 'bg-yellow-500/20 text-yellow-400'
                      : 'bg-white/5 text-gray-500'
                  }`}
                >
                  <p className="text-lg font-bold">{milestone}</p>
                  <p className="text-xs">{milestone === 7 ? 'Week' : milestone >= 30 ? 'Month+' : 'Days'}</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <ClaimModal
        show={showClaimModal}
        onClose={() => setShowClaimModal(false)}
        loginBonus={loginBonus}
        claiming={claiming}
        claimed={claimed}
        onClaim={handleClaim}
      />
    </>
  );
}

// Claim Modal Component
function ClaimModal({ 
  show, 
  onClose, 
  loginBonus, 
  claiming, 
  claimed, 
  onClaim 
}: { 
  show: boolean; 
  onClose: () => void; 
  loginBonus: any;
  claiming: boolean;
  claimed: boolean;
  onClaim: () => void;
}) {
  if (!loginBonus) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm"
          >
            <Card className="bg-slate-900 border-white/10">
              <CardHeader className="text-center relative">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
                <CardTitle className="text-xl">Daily Login Bonus!</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-6">
                {claimed ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="py-8"
                  >
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
                      <CheckCircle className="w-8 h-8 text-green-400" />
                    </div>
                    <h3 className="text-xl font-bold text-green-400">Claimed!</h3>
                    <p className="text-gray-400 mt-2">See you tomorrow!</p>
                  </motion.div>
                ) : (
                  <>
                    <div>
                      <p className="text-gray-400 mb-4">Day {loginBonus.dayInCycle} of 7</p>
                      <div className="grid grid-cols-7 gap-1 mb-4">
                        {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                          <div
                            key={day}
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                              day < loginBonus.dayInCycle
                                ? 'bg-green-500/20 text-green-400'
                                : day === loginBonus.dayInCycle
                                ? 'bg-purple-500 text-white'
                                : 'bg-white/10 text-gray-500'
                            }`}
                          >
                            {day}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-white/5 rounded-lg">
                        <Sparkles className="w-6 h-6 mx-auto mb-2 text-yellow-400" />
                        <p className="text-2xl font-bold">+{loginBonus.points}</p>
                        <p className="text-xs text-gray-400">Points</p>
                      </div>
                      {loginBonus.bonus && (
                        <div className="p-4 bg-white/5 rounded-lg">
                          <Sparkles className="w-6 h-6 mx-auto mb-2 text-cyan-400" />
                          <p className="text-lg font-bold capitalize">{loginBonus.bonus.type.replace('_', ' ')}</p>
                          <p className="text-xs text-gray-400">Bonus</p>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        onClick={onClose}
                        className="flex-1 border-white/20 bg-white/5"
                      >
                        Later
                      </Button>
                      <Button
                        onClick={onClaim}
                        disabled={claiming}
                        className="flex-1 bg-gradient-to-r from-purple-600 to-cyan-600"
                      >
                        {claiming ? 'Claiming...' : 'Claim Reward'}
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Export compact badge version
export const StreakBadge = () => <StreakDisplay compact />;
