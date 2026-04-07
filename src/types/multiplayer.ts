// Multiplayer Types for EduSparring

// Live Battle Types
export interface LiveBattle {
  id: string;
  status: 'waiting' | 'countdown' | 'active' | 'paused' | 'completed';
  players: BattlePlayer[];
  currentRound: number;
  totalRounds: number;
  subject: string;
  difficulty: number;
  startedAt?: string;
  endedAt?: string;
  winner?: string;
  spectators: number;
  isRanked: boolean;
  prizes?: BattlePrize;
}

export interface BattlePlayer {
  id: string;
  name: string;
  avatar?: string;
  knowledgeRating: number;
  score: number;
  correctAnswers: number;
  wrongAnswers: number;
  averageResponseTime: number;
  streak: number;
  isReady: boolean;
  disconnected: boolean;
}

export interface BattleRound {
  roundNumber: number;
  question: BattleQuestion;
  playerAnswers: Record<string, PlayerAnswer>;
  correctAnswer: string;
  startedAt: string;
  endedAt?: string;
  pointsAwarded: Record<string, number>;
}

export interface BattleQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  difficulty: number;
  subject: string;
  topic: string;
  timeLimit: number; // seconds
  points: number;
}

export interface PlayerAnswer {
  playerId: string;
  answer: string;
  isCorrect: boolean;
  responseTime: number; // milliseconds
  pointsEarned: number;
  answeredAt: string;
}

export interface BattlePrize {
  points: number;
  knowledgeRatingChange: number;
  badges?: string[];
  items?: PrizeItem[];
}

export interface PrizeItem {
  id: string;
  name: string;
  type: 'avatar' | 'title' | 'badge' | 'boost';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

// Tournament Types
export interface Tournament {
  id: string;
  name: string;
  description: string;
  subject: string;
  type: 'elimination' | 'round_robin' | 'swiss' | 'battle_royale';
  status: 'upcoming' | 'registration' | 'in_progress' | 'completed';
  startDate: string;
  endDate: string;
  registrationDeadline: string;
  maxParticipants: number;
  currentParticipants: number;
  prizePool: number;
  entryFee: number;
  minRating: number;
  maxRating?: number;
  rounds: TournamentRound[];
  participants: TournamentParticipant[];
  bracket?: TournamentBracket;
  rules: string[];
  isOfficial: boolean;
  sponsors?: string[];
}

export interface TournamentRound {
  roundNumber: number;
  name: string;
  matches: TournamentMatch[];
  status: 'pending' | 'in_progress' | 'completed';
  startedAt?: string;
  endedAt?: string;
}

export interface TournamentMatch {
  id: string;
  roundNumber: number;
  position: number;
  player1: TournamentParticipant | null;
  player2: TournamentParticipant | null;
  winner: string | null;
  score: { player1: number; player2: number };
  status: 'pending' | 'ready' | 'in_progress' | 'completed';
  scheduledFor?: string;
  startedAt?: string;
  endedAt?: string;
  battleId?: string;
}

export interface TournamentParticipant {
  id: string;
  userId: string;
  name: string;
  avatar?: string;
  knowledgeRating: number;
  seed: number;
  wins: number;
  losses: number;
  draws: number;
  points: number;
  eliminated: boolean;
  eliminatedInRound?: number;
  placement?: number;
}

export interface TournamentBracket {
  rounds: BracketRound[];
  champion: string | null;
}

export interface BracketRound {
  roundNumber: number;
  name: string;
  matches: BracketMatch[];
}

export interface BracketMatch {
  id: string;
  position: number;
  player1Seed: number | null;
  player2Seed: number | null;
  winnerSeed: number | null;
  score: { player1: number; player2: number } | null;
}

// Spectator Types
export interface SpectatorSession {
  id: string;
  battleId: string;
  userId: string;
  joinedAt: string;
  watchDuration: number;
  reactions: SpectatorReaction[];
}

export interface SpectatorReaction {
  id: string;
  type: 'cheer' | 'gasp' | 'clap' | 'fire' | 'heart' | 'wow';
  timestamp: string;
  userId: string;
  userName: string;
}

export interface LiveBattleState {
  battle: LiveBattle;
  currentQuestion?: BattleQuestion;
  timeRemaining: number;
  roundResults?: BattleRound;
  spectatorCount: number;
  recentReactions: SpectatorReaction[];
}

// Matchmaking Types
export interface MatchmakingQueue {
  id: string;
  subject: string;
  players: QueuedPlayer[];
  createdAt: string;
  status: 'open' | 'matching' | 'closed';
}

export interface QueuedPlayer {
  id: string;
  name: string;
  knowledgeRating: number;
  joinedAt: string;
  preferredSubjects: string[];
  region?: string;
}

export interface MatchmakingConfig {
  ratingRange: number;
  maxWaitTime: number; // seconds
  minPlayersForMatch: number;
  subjectBalancing: boolean;
  regionPriority: boolean;
}

// Real-time Events
export type MultiplayerEventType =
  | 'player_joined'
  | 'player_left'
  | 'player_ready'
  | 'battle_starting'
  | 'round_start'
  | 'answer_submitted'
  | 'round_end'
  | 'battle_end'
  | 'spectator_joined'
  | 'spectator_left'
  | 'reaction_added'
  | 'tournament_update'
  | 'match_update';

export interface MultiplayerEvent {
  type: MultiplayerEventType;
  payload: any;
  timestamp: string;
  battleId?: string;
  tournamentId?: string;
}

// Leaderboard Types (Extended for Multiplayer)
export interface SeasonLeaderboard {
  season: string;
  rankings: LeaderboardEntry[];
  updatedAt: string;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  avatar?: string;
  knowledgeRating: number;
  wins: number;
  losses: number;
  winStreak: number;
  tournamentsWon: number;
  points: number;
  trend: 'up' | 'down' | 'same';
  change: number;
}

// Notification Types for Multiplayer
export interface MultiplayerNotification {
  id: string;
  type: 'match_found' | 'tournament_starting' | 'friend_battle' | 'tournament_result' | 'ranking_change';
  title: string;
  message: string;
  actionUrl?: string;
  timestamp: string;
  read: boolean;
}
