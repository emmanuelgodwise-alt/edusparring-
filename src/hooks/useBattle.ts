'use client';

import { useCallback, useEffect } from 'react';
import { useAppStore, getNextQuestion, submitAnswer, endMatch, startQuickMatch, startRankedMatch } from '@/store/useAppStore';

export function useBattle() {
  const {
    user,
    battle,
    isBattleLoading,
    setBattle,
    resetBattle,
    setBattleLoading,
    setCurrentQuestion,
    setTimer,
    addRoundResult,
    updateScore,
    updateUserStats,
    setLastFeedback,
    setShowConfetti,
    setNotification,
  } = useAppStore();

  // Start a quick match
  const startQuickBattle = useCallback(async () => {
    if (!user) return;

    try {
      setBattleLoading(true);
      setBattle({ status: 'searching' });

      const result = await startQuickMatch(user.id);

      setBattle({
        matchId: result.matchId,
        status: 'active',
        opponent: result.opponent,
        player: {
          id: user.id,
          name: user.name,
          avatar: user.avatar,
          kr: user.knowledgeRating,
          score: 0,
        },
        currentRound: 0,
        totalRounds: 5,
        matchType: 'quick',
        rounds: [],
      });
    } catch (error) {
      console.error('Error starting quick match:', error);
      setNotification({ type: 'error', message: 'Failed to start match' });
      resetBattle();
    } finally {
      setBattleLoading(false);
    }
  }, [user, setBattle, setBattleLoading, setNotification, resetBattle]);

  // Start a ranked match
  const startRankedBattle = useCallback(async () => {
    if (!user) return;

    try {
      setBattleLoading(true);
      setBattle({ status: 'searching' });

      const result = await startRankedMatch(user.id);

      setBattle({
        matchId: result.matchId,
        status: 'active',
        opponent: result.opponent,
        player: {
          id: user.id,
          name: user.name,
          avatar: user.avatar,
          kr: user.knowledgeRating,
          score: 0,
        },
        currentRound: 0,
        totalRounds: 5,
        matchType: 'ranked',
        rounds: [],
      });
    } catch (error) {
      console.error('Error starting ranked match:', error);
      setNotification({ type: 'error', message: 'Failed to start match' });
      resetBattle();
    } finally {
      setBattleLoading(false);
    }
  }, [user, setBattle, setBattleLoading, setNotification, resetBattle]);

  // Load the next question
  const loadNextQuestion = useCallback(async () => {
    if (!battle.matchId) return;

    try {
      setBattleLoading(true);
      const result = await getNextQuestion(battle.matchId);

      setCurrentQuestion(result.question);
      setTimer(15);
      setBattle({ currentRound: result.roundNumber });
    } catch (error) {
      console.error('Error loading question:', error);
      setNotification({ type: 'error', message: 'Failed to load question' });
    } finally {
      setBattleLoading(false);
    }
  }, [battle.matchId, setCurrentQuestion, setTimer, setBattle, setBattleLoading, setNotification]);

  // Submit an answer
  const answerQuestion = useCallback(
    async (answer: string, timeTaken: number) => {
      if (!battle.matchId || !user) return null;

      try {
        setBattleLoading(true);
        const result = await submitAnswer(battle.matchId, user.id, answer, timeTaken);

        addRoundResult(result.roundResult);
        updateScore(
          (battle.player?.score || 0) + result.points,
          (battle.opponent?.score || 0) + result.opponentPoints
        );

        return result;
      } catch (error) {
        console.error('Error submitting answer:', error);
        setNotification({ type: 'error', message: 'Failed to submit answer' });
        return null;
      } finally {
        setBattleLoading(false);
      }
    },
    [battle.matchId, battle.player?.score, battle.opponent?.score, user, addRoundResult, updateScore, setBattleLoading, setNotification]
  );

  // End the battle
  const endBattle = useCallback(async () => {
    if (!battle.matchId || !user) return;

    try {
      setBattleLoading(true);
      const result = await endMatch(battle.matchId, user.id);

      setBattle({ status: 'completed' });
      setLastFeedback(result.feedback);

      // Update user stats
      updateUserStats({
        knowledgeRating: user.knowledgeRating + result.krChange,
        points: user.points + result.pointsEarned,
        currentStreak: result.winner === 'player' ? user.currentStreak + 1 : 0,
        longestStreak:
          result.winner === 'player' && user.currentStreak + 1 > user.longestStreak
            ? user.currentStreak + 1
            : user.longestStreak,
      });

      if (result.winner === 'player') {
        setShowConfetti(true);
        setNotification({ type: 'success', message: `Victory! +${result.krChange} KR` });
      } else if (result.winner === 'draw') {
        setNotification({ type: 'info', message: "It's a draw!" });
      } else {
        setNotification({ type: 'info', message: `Defeat. ${result.krChange} KR` });
      }

      return result;
    } catch (error) {
      console.error('Error ending battle:', error);
      setNotification({ type: 'error', message: 'Failed to end battle' });
      return null;
    } finally {
      setBattleLoading(false);
    }
  }, [
    battle.matchId,
    user,
    setBattle,
    setLastFeedback,
    updateUserStats,
    setShowConfetti,
    setNotification,
    setBattleLoading,
  ]);

  // Exit battle
  const exitBattle = useCallback(() => {
    resetBattle();
    setShowConfetti(false);
  }, [resetBattle, setShowConfetti]);

  // Auto-load next question when round changes
  useEffect(() => {
    if (
      battle.status === 'active' &&
      battle.currentRound > 0 &&
      battle.currentRound <= battle.totalRounds &&
      !battle.currentQuestion
    ) {
      loadNextQuestion();
    }
  }, [battle.status, battle.currentRound, battle.totalRounds, battle.currentQuestion, loadNextQuestion]);

  return {
    battle,
    isBattleLoading,
    startQuickBattle,
    startRankedBattle,
    loadNextQuestion,
    answerQuestion,
    endBattle,
    exitBattle,
    // Computed values
    isPlayerWinning:
      (battle.player?.score || 0) > (battle.opponent?.score || 0),
    roundsRemaining: battle.totalRounds - battle.currentRound,
    isMatchComplete: battle.status === 'completed',
  };
}
