'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Question } from '@/store/useAppStore';
import { Loader2 } from 'lucide-react';

interface QuestionCardProps {
  question: Question;
  roundNumber: number;
  totalRounds: number;
  onAnswer: (answer: string) => void;
  selectedAnswer?: string | null;
  showResult?: boolean;
  isCorrect?: boolean;
  disabled?: boolean;
  isLoading?: boolean;
}

export function QuestionCard({
  question,
  roundNumber,
  totalRounds,
  onAnswer,
  selectedAnswer,
  showResult = false,
  isCorrect,
  disabled = false,
  isLoading = false,
}: QuestionCardProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'hard':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'expert':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <Card className="relative overflow-hidden bg-gradient-to-br from-gray-900/90 to-gray-800/90 border border-purple-500/20 backdrop-blur-xl">
      {/* Header */}
      <div className="p-4 border-b border-gray-700/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-purple-500/20 text-purple-400 border-purple-500/30">
            Round {roundNumber}/{totalRounds}
          </Badge>
          <Badge variant="outline" className={getDifficultyColor(question.difficulty)}>
            {question.difficulty}
          </Badge>
        </div>
        <Badge variant="outline" className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
          {question.subject}
        </Badge>
      </div>

      {/* Question Text */}
      <div className="p-6">
        <motion.h3
          key={question.text}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xl font-semibold text-white leading-relaxed"
        >
          {question.text}
        </motion.h3>
      </div>

      {/* Options */}
      <div className="p-6 pt-0 space-y-3">
        {question.options.map((option, index) => {
          const isSelected = selectedAnswer === option;
          const isCorrectOption = showResult && option === question.correctAnswer;
          const isWrongSelection = showResult && isSelected && !isCorrect;

          return (
            <motion.div
              key={option}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Button
                variant="outline"
                disabled={disabled || isLoading}
                onClick={() => !showResult && onAnswer(option)}
                className={cn(
                  'w-full justify-start text-left h-auto py-4 px-5 transition-all duration-300',
                  'hover:border-purple-500/50 hover:bg-purple-500/10',
                  'disabled:cursor-not-allowed',
                  // Default state
                  !showResult && isSelected && 'border-cyan-500 bg-cyan-500/20',
                  // Show result states
                  isCorrectOption && 'border-green-500 bg-green-500/20 text-green-400',
                  isWrongSelection && 'border-red-500 bg-red-500/20 text-red-400 line-through',
                  !showResult && 'border-gray-700 bg-gray-800/50 text-gray-200'
                )}
              >
                <span className="flex items-center gap-3 w-full">
                  <span
                    className={cn(
                      'flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold shrink-0',
                      isCorrectOption
                        ? 'bg-green-500 text-white'
                        : isWrongSelection
                        ? 'bg-red-500 text-white'
                        : isSelected
                        ? 'bg-cyan-500 text-white'
                        : 'bg-gray-700 text-gray-300'
                    )}
                  >
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className="flex-1">{option}</span>
                </span>
              </Button>
            </motion.div>
          );
        })}
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center rounded-lg">
          <div className="flex items-center gap-2 text-cyan-400">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span>Processing...</span>
          </div>
        </div>
      )}

      {/* Result Overlay */}
      {showResult && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={cn(
            'absolute inset-x-0 bottom-0 p-4',
            isCorrect ? 'bg-green-500/20' : 'bg-red-500/20'
          )}
        >
          <p
            className={cn(
              'text-sm font-medium',
              isCorrect ? 'text-green-400' : 'text-red-400'
            )}
          >
            {isCorrect ? '✓ Correct!' : '✗ Incorrect'}
          </p>
          {question.explanation && (
            <p className="text-xs text-gray-400 mt-1">{question.explanation}</p>
          )}
        </motion.div>
      )}
    </Card>
  );
}
