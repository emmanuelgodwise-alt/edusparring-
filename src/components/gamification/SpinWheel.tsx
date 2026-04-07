'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Gift, Sparkles, Star, X, ChevronRight, Coins, Crown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/components/AuthProvider';

interface Prize {
  id: string;
  name: string;
  type: string;
  value: number;
  rarity: string;
  probability: number;
  icon: string;
  color: string;
}

interface SpinWheelData {
  prizes: Prize[];
  spinStatus: {
    freeSpins: number;
    premiumSpins: number;
    consecutiveDays: number;
  };
  recentSpins: any[];
}

export function SpinWheel() {
  const { user } = useAuth();
  const [data, setData] = useState<SpinWheelData | null>(null);
  const [loading, setLoading] = useState(true);
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [showResult, setShowResult] = useState<Prize | null>(null);
  const wheelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user?.id) {
      fetchSpinWheel();
    }
  }, [user?.id]);

  const fetchSpinWheel = async () => {
    try {
      const res = await fetch(`/api/spin-wheel?userId=${user?.id}`);
      const json = await res.json();
      if (json.success) {
        setData(json);
      }
    } catch (error) {
      console.error('Failed to fetch spin wheel:', error);
    } finally {
      setLoading(false);
    }
  };

  const spin = async () => {
    if (!user?.id || spinning || !data?.spinStatus.freeSpins) return;

    setSpinning(true);
    setShowResult(null);

    try {
      const res = await fetch('/api/spin-wheel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, isPremium: false }),
      });
      const json = await res.json();

      if (json.success) {
        // Animate the wheel
        setRotation(prev => prev + json.spinAngle);
        
        // Show result after animation
        setTimeout(() => {
          setShowResult(json.prize);
          fetchSpinWheel(); // Refresh data
        }, 5000);
      }
    } catch (error) {
      console.error('Failed to spin:', error);
    } finally {
      setTimeout(() => setSpinning(false), 5000);
    }
  };

  if (loading) {
    return (
      <Card className="bg-white/5 border-white/10">
        <CardContent className="p-4">
          <div className="animate-pulse flex items-center justify-center h-64">
            <div className="w-48 h-48 rounded-full bg-white/10" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data) return null;

  const { prizes, spinStatus } = data;

  // Rarity colors for display
  const rarityColors: Record<string, string> = {
    common: 'text-gray-400',
    uncommon: 'text-green-400',
    rare: 'text-blue-400',
    epic: 'text-purple-400',
    legendary: 'text-yellow-400',
  };

  const rarityBgColors: Record<string, string> = {
    common: 'bg-gray-500/20 border-gray-500/30',
    uncommon: 'bg-green-500/20 border-green-500/30',
    rare: 'bg-blue-500/20 border-blue-500/30',
    epic: 'bg-purple-500/20 border-purple-500/30',
    legendary: 'bg-yellow-500/20 border-yellow-500/30',
  };

  return (
    <Card className="bg-gradient-to-br from-pink-900/30 to-purple-900/30 border-pink-500/20">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-pink-400" />
            Daily Spin Wheel
          </CardTitle>
          <div className="flex items-center gap-2">
            {spinStatus.consecutiveDays > 0 && (
              <span className="text-xs text-gray-400 flex items-center gap-1">
                <Star className="w-3 h-3 text-yellow-400" />
                {spinStatus.consecutiveDays} day streak
              </span>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        {/* Wheel Container */}
        <div className="relative mb-4">
          {/* Pointer */}
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-20">
            <div className="w-0 h-0 border-l-[12px] border-r-[12px] border-t-[20px] border-l-transparent border-r-transparent border-t-white drop-shadow-lg" />
          </div>

          {/* Wheel */}
          <motion.div
            ref={wheelRef}
            animate={{ rotate: rotation }}
            transition={{ duration: 5, ease: [0.2, 0.8, 0.2, 1] }}
            className="relative w-64 h-64 rounded-full border-4 border-white/30 shadow-2xl overflow-hidden"
            style={{
              background: 'conic-gradient(' + prizes.map((prize, i) => {
                const startAngle = (i / prizes.length) * 360;
                const endAngle = ((i + 1) / prizes.length) * 360;
                return `${prize.color} ${startAngle}deg ${endAngle}deg`;
              }).join(', ') + ')',
            }}
          >
            {/* Prize Labels */}
            {prizes.map((prize, i) => {
              const angle = (i / prizes.length) * 360 + (360 / prizes.length) / 2;
              const radian = (angle - 90) * (Math.PI / 180);
              const radius = 80;
              const x = 128 + radius * Math.cos(radian);
              const y = 128 + radius * Math.sin(radian);

              return (
                <div
                  key={prize.id}
                  className="absolute text-2xl drop-shadow-lg"
                  style={{
                    left: `${x}px`,
                    top: `${y}px`,
                    transform: 'translate(-50%, -50%)',
                  }}
                >
                  {prize.icon}
                </div>
              );
            })}

            {/* Center Circle */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 border-4 border-white/50 flex items-center justify-center shadow-inner">
              <Gift className="w-8 h-8 text-white" />
            </div>
          </motion.div>
        </div>

        {/* Spin Button */}
        <Button
          onClick={spin}
          disabled={spinning || !spinStatus.freeSpins}
          size="lg"
          className={`w-full py-6 text-lg font-bold ${
            spinStatus.freeSpins
              ? 'bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500'
              : 'bg-gray-600 cursor-not-allowed'
          }`}
        >
          {spinning ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            >
              <Sparkles className="w-5 h-5 mr-2" />
            </motion.div>
          ) : spinStatus.freeSpins ? (
            <>
              <Gift className="w-5 h-5 mr-2" />
              SPIN NOW! ({spinStatus.freeSpins} free)
            </>
          ) : (
            <>
              <Coins className="w-5 h-5 mr-2" />
              No Spins Left
            </>
          )}
        </Button>

        {/* Premium Spins */}
        {spinStatus.premiumSpins > 0 && (
          <Button
            variant="outline"
            className="w-full mt-2 border-yellow-500/30 bg-yellow-500/10 text-yellow-400"
          >
            <Crown className="w-4 h-4 mr-2" />
            Premium Spin ({spinStatus.premiumSpins})
          </Button>
        )}

        {/* Prize Legend */}
        <div className="mt-4 w-full">
          <p className="text-xs text-gray-400 mb-2">Possible Prizes:</p>
          <div className="flex flex-wrap gap-1">
            {prizes.slice(0, 6).map((prize) => (
              <span
                key={prize.id}
                className={`text-xs px-2 py-0.5 rounded-full border ${rarityBgColors[prize.rarity]} ${rarityColors[prize.rarity]}`}
              >
                {prize.icon} {prize.name}
              </span>
            ))}
            {prizes.length > 6 && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-gray-400">
                +{prizes.length - 6} more
              </span>
            )}
          </div>
        </div>

        {/* Result Modal */}
        <AnimatePresence>
          {showResult && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
              onClick={() => setShowResult(null)}
            >
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className={`p-8 rounded-2xl border-2 text-center max-w-sm ${
                  rarityBgColors[showResult.rarity]
                }`}
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 0.5 }}
                  className="text-6xl mb-4"
                >
                  {showResult.icon}
                </motion.div>
                <h3 className="text-2xl font-bold mb-2">{showResult.name}</h3>
                <p className={`text-sm mb-4 ${rarityColors[showResult.rarity]}`}>
                  {showResult.rarity.charAt(0).toUpperCase() + showResult.rarity.slice(1)} Prize!
                </p>
                <Button
                  onClick={() => setShowResult(null)}
                  className="bg-gradient-to-r from-purple-600 to-pink-600"
                >
                  Awesome!
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}

// Compact button version for dashboard
export function SpinWheelButton() {
  const { user } = useAuth();
  const [spinStatus, setSpinStatus] = useState<{ freeSpins: number } | null>(null);

  useEffect(() => {
    if (user?.id) {
      fetch(`/api/spin-wheel?userId=${user.id}`)
        .then(res => res.json())
        .then(json => json.success && setSpinStatus(json.spinStatus))
        .catch(console.error);
    }
  }, [user?.id]);

  if (!spinStatus || !spinStatus.freeSpins) return null;

  return (
    <button className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-500/30 text-pink-400 animate-pulse">
      <Sparkles className="w-4 h-4" />
      <span className="text-sm font-medium">Free Spin!</span>
    </button>
  );
}
