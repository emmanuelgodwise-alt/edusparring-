'use client';

import { motion } from 'framer-motion';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface TimerProps {
  time: number;
  maxTime?: number;
  isRunning?: boolean;
}

export function Timer({ time, maxTime = 15, isRunning = true }: TimerProps) {
  const percentage = (time / maxTime) * 100;
  const isLow = time <= 5;
  const isCritical = time <= 3;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-400">Time Remaining</span>
        <motion.span
          key={time}
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={cn(
            'text-2xl font-bold tabular-nums',
            isCritical ? 'text-red-500' : isLow ? 'text-yellow-500' : 'text-cyan-400'
          )}
        >
          {time}s
        </motion.span>
      </div>
      <div className="relative">
        <Progress
          value={percentage}
          className={cn(
            'h-3 bg-gray-800 rounded-full overflow-hidden',
            isRunning && isCritical && 'animate-pulse'
          )}
          indicatorClassName={cn(
            'transition-all duration-1000',
            isCritical
              ? 'bg-gradient-to-r from-red-600 to-red-400'
              : isLow
              ? 'bg-gradient-to-r from-yellow-600 to-yellow-400'
              : 'bg-gradient-to-r from-cyan-600 to-cyan-400'
          )}
        />
        {isCritical && (
          <motion.div
            className="absolute inset-0 rounded-full bg-red-500/20"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 0.5, repeat: Infinity }}
          />
        )}
      </div>
    </div>
  );
}
