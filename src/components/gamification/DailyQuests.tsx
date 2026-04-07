'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { 
  Target, Gift, CheckCircle, Clock, ChevronRight, Sparkles, Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useGamification, type Quest } from '@/hooks/useGamification';

interface DailyQuestsProps {
  compact?: boolean;
}

export function DailyQuests({ compact = false }: DailyQuestsProps) {
  const { quests, loading, claimQuestReward } = useGamification();

  if (loading) {
    return (
      <Card className="bg-white/5 border-white/10">
        <CardContent className="p-4">
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-white/10 rounded w-24" />
            <div className="h-16 bg-white/10 rounded" />
            <div className="h-16 bg-white/10 rounded" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (quests.length === 0) {
    return null;
  }

  const completedQuests = quests.filter(q => q.completed);
  const pendingClaims = quests.filter(q => q.completed && !q.claimed);
  const inProgressQuests = quests.filter(q => !q.completed);

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        {pendingClaims.length > 0 && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-green-500/20 border border-green-500/30 text-green-400"
          >
            <Gift className="w-4 h-4" />
            <span className="text-sm font-medium">{pendingClaims.length}</span>
          </motion.button>
        )}
        <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
          <Target className="w-4 h-4 text-purple-400" />
          <span className="text-sm font-medium">{completedQuests.length}/{quests.length}</span>
        </div>
      </div>
    );
  }

  return (
    <Card className="bg-white/5 border-white/10">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Target className="w-5 h-5 text-purple-400" />
            Daily Quests
          </span>
          <span className="text-sm font-normal text-gray-400">
            {completedQuests.length}/{quests.length} completed
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <AnimatePresence>
          {quests.map((quest, index) => (
            <QuestCard 
              key={quest.id} 
              quest={quest} 
              index={index}
              onClaim={async () => {
                await claimQuestReward(quest.id);
              }}
            />
          ))}
        </AnimatePresence>

        {pendingClaims.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 rounded-lg bg-green-500/10 border border-green-500/20"
          >
            <p className="text-sm text-green-400 flex items-center gap-2">
              <Gift className="w-4 h-4" />
              You have {pendingClaims.length} reward{pendingClaims.length > 1 ? 's' : ''} to claim!
            </p>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}

// Individual Quest Card
function QuestCard({ 
  quest, 
  index,
  onClaim 
}: { 
  quest: Quest; 
  index: number;
  onClaim: () => void;
}) {
  const progress = Math.min((quest.progress / quest.target) * 100, 100);
  const isComplete = quest.completed;
  const canClaim = isComplete && !quest.claimed;
  const claimed = quest.claimed;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`p-3 rounded-lg border transition-all ${
        claimed
          ? 'bg-green-500/10 border-green-500/20'
          : canClaim
          ? 'bg-yellow-500/10 border-yellow-500/30'
          : 'bg-white/5 border-white/10'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-medium text-sm">{quest.title}</h4>
            {claimed && (
              <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
            )}
          </div>
          <p className="text-xs text-gray-400 mb-2">{quest.description}</p>
          
          {!isComplete && (
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400">Progress</span>
                <span className="font-medium">{quest.progress}/{quest.target}</span>
              </div>
              <Progress value={progress} className="h-1.5" />
            </div>
          )}
        </div>

        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-1 text-yellow-400">
            <Sparkles className="w-3 h-3" />
            <span className="text-sm font-bold">+{quest.pointsReward}</span>
          </div>

          {canClaim && (
            <Button
              size="sm"
              onClick={onClaim}
              className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 text-xs py-1 px-3"
            >
              <Gift className="w-3 h-3 mr-1" />
              Claim
            </Button>
          )}
        </div>
      </div>

      {/* Expiry warning */}
      {!isComplete && (
        <div className="mt-2 flex items-center gap-1 text-xs text-gray-500">
          <Clock className="w-3 h-3" />
          <span>Resets at midnight</span>
        </div>
      )}
    </motion.div>
  );
}

// Export compact badge version
export const QuestsBadge = () => <DailyQuests compact />;
