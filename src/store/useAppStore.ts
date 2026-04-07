import { create } from 'zustand';

// Types
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  knowledgeRating: number;
  level: string;
  bio?: string;
  country?: string;
  language?: string;
  points: number;
  totalWins: number;
  totalLosses: number;
  currentStreak: number;
  bestStreak: number;
  subjects: { subject: string; proficiency: number }[];
  achievements: { name: string; icon: string; earnedAt: string }[];
}

export interface Question {
  id: string;
  subject: string;
  topic: string;
  difficulty: string;
  type: string;
  text: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  pointsValue: number;
}

export interface Opponent {
  id: string;
  name: string;
  avatar?: string;
  knowledgeRating: number;
  score: number;
}

export interface MatchRound {
  roundNumber: number;
  question: Question;
  playerAnswer?: string;
  opponentAnswer?: string;
  playerCorrect: boolean;
  opponentCorrect: boolean;
  playerTime?: number;
  opponentTime?: number;
  pointsAwarded: number;
}

export interface Match {
  id: string;
  opponent: Opponent;
  mode: 'quick' | 'ranked' | 'challenge';
  subject?: string;
  status: 'waiting' | 'searching' | 'active' | 'completed';
  totalRounds: number;
  currentRound: number;
  playerScore: number;
  opponentScore: number;
  difficulty: string;
  currentQuestion?: Question;
  rounds: MatchRound[];
  timeLeft: number;
  winner?: 'player' | 'opponent' | 'draw';
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  avatar?: string;
  knowledgeRating: number;
  points: number;
  country?: string;
}

export interface CoachingFeedback {
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  studyPlan: string[];
  ratingChange: number;
  won?: boolean;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  rarity: string;
  earnedAt?: string;
}

export interface Friend {
  id: string;
  name: string;
  avatar?: string;
  knowledgeRating: number;
  status: 'online' | 'offline' | 'in_match';
  currentSubject?: string;
}

export interface Tournament {
  id: string;
  name: string;
  description?: string;
  subject?: string;
  startDate: string;
  endDate: string;
  maxParticipants: number;
  currentParticipants: number;
  prizePool: number;
  status: 'upcoming' | 'active' | 'completed';
}

export interface LiveMatch {
  id: string;
  player1Name: string;
  player2Name: string;
  player1Score: number;
  player2Score: number;
  currentRound: number;
  totalRounds: number;
  subject: string;
  spectatorCount: number;
}

export interface UserSettings {
  notifications: boolean;
  sounds: boolean;
  vibrations: boolean;
  theme: 'dark' | 'light' | 'system';
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  timerDuration: number;
  selectedSubjects: string[];
  privacyProfile: 'public' | 'friends' | 'private';
  privacyStats: 'public' | 'friends' | 'private';
  language: string;
}

type TabType = 'home' | 'battle' | 'dashboard' | 'leaderboard' | 'profile' | 'settings';

interface AppState {
  // User state
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  // UI state
  activeTab: TabType;
  showMatchResult: boolean;
  showCoachingFeedback: boolean;
  notifications: { id: string; message: string; type: 'success' | 'error' | 'info' }[];

  // Battle state
  match: Match | null;
  isSearchingMatch: boolean;
  coachingFeedback: CoachingFeedback | null;

  // Leaderboard state
  leaderboard: LeaderboardEntry[];
  leaderboardCategory: string;

  // Subject selection
  selectedSubject: string;

  // Settings state
  settings: UserSettings;

  // Friends state
  friends: Friend[];
  friendsLoading: boolean;
  showFriendsModal: boolean;

  // Achievements state
  achievements: Achievement[];
  achievementsLoading: boolean;
  showAchievementModal: boolean;
  newAchievement: Achievement | null;

  // Tournaments state
  tournaments: Tournament[];
  tournamentsLoading: boolean;

  // Spectator state
  liveMatches: LiveMatch[];

  // Profile state
  isEditingProfile: boolean;
  matchHistory: Match[];

  // Actions
  setUser: (user: User | null) => void;
  setIsLoading: (loading: boolean) => void;
  setActiveTab: (tab: TabType) => void;
  setMatch: (match: Match | null) => void;
  updateMatchScore: (playerScore: number, opponentScore: number) => void;
  setCurrentQuestion: (question: Question | undefined) => void;
  setTimeLeft: (time: number) => void;
  incrementRound: () => void;
  addRound: (round: MatchRound) => void;
  setSearchingMatch: (searching: boolean) => void;
  setShowMatchResult: (show: boolean) => void;
  setCoachingFeedback: (feedback: CoachingFeedback | null) => void;
  setShowCoachingFeedback: (show: boolean) => void;
  setLeaderboard: (entries: LeaderboardEntry[]) => void;
  setLeaderboardCategory: (category: string) => void;
  addNotification: (message: string, type: 'success' | 'error' | 'info') => void;
  removeNotification: (id: string) => void;
  updateUserStats: (stats: Partial<User>) => void;
  resetBattle: () => void;

  // Subject actions
  setSelectedSubject: (subject: string) => void;

  // Settings actions
  updateSettings: (settings: Partial<UserSettings>) => void;

  // Friends actions
  setFriends: (friends: Friend[]) => void;
  setFriendsLoading: (loading: boolean) => void;
  setShowFriendsModal: (show: boolean) => void;
  addFriend: (friend: Friend) => void;
  removeFriend: (friendId: string) => void;

  // Achievements actions
  setAchievements: (achievements: Achievement[]) => void;
  setAchievementsLoading: (loading: boolean) => void;
  setShowAchievementModal: (show: boolean) => void;
  setNewAchievement: (achievement: Achievement | null) => void;

  // Tournaments actions
  setTournaments: (tournaments: Tournament[]) => void;
  setTournamentsLoading: (loading: boolean) => void;

  // Spectator actions
  setLiveMatches: (matches: LiveMatch[]) => void;

  // Profile actions
  setIsEditingProfile: (editing: boolean) => void;
  setMatchHistory: (matches: Match[]) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  // Initial state
  user: null,
  isLoading: true,
  isAuthenticated: false,
  activeTab: 'home',
  showMatchResult: false,
  showCoachingFeedback: false,
  notifications: [],
  match: null,
  isSearchingMatch: false,
  coachingFeedback: null,
  leaderboard: [],
  leaderboardCategory: 'global',

  // Subject selection
  selectedSubject: 'Math',

  // Settings initial state
  settings: {
    notifications: true,
    sounds: true,
    vibrations: true,
    theme: 'dark',
    difficulty: 'medium',
    timerDuration: 15,
    selectedSubjects: ['Math', 'Physics', 'Chemistry', 'Biology'],
    privacyProfile: 'public',
    privacyStats: 'public',
    language: 'en'
  },

  // Friends initial state
  friends: [],
  friendsLoading: false,
  showFriendsModal: false,

  // Achievements initial state
  achievements: [],
  achievementsLoading: false,
  showAchievementModal: false,
  newAchievement: null,

  // Tournaments initial state
  tournaments: [],
  tournamentsLoading: false,

  // Spectator initial state
  liveMatches: [],

  // Profile initial state
  isEditingProfile: false,
  matchHistory: [],

  // Actions
  setUser: (user) => set({ user, isAuthenticated: !!user, isLoading: false }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  setActiveTab: (tab) => set({ activeTab: tab }),

  setMatch: (match) => set({ match }),

  updateMatchScore: (playerScore, opponentScore) => set((state) => ({
    match: state.match ? { ...state.match, playerScore, opponentScore } : null
  })),

  setCurrentQuestion: (question) => set((state) => ({
    match: state.match ? { ...state.match, currentQuestion: question } : null
  })),

  setTimeLeft: (time) => set((state) => ({
    match: state.match ? { ...state.match, timeLeft: time } : null
  })),

  incrementRound: () => set((state) => ({
    match: state.match ? { ...state.match, currentRound: state.match.currentRound + 1 } : null
  })),

  addRound: (round) => set((state) => ({
    match: state.match ? {
      ...state.match,
      rounds: [...state.match.rounds, round]
    } : null
  })),

  setSearchingMatch: (searching) => set({ isSearchingMatch: searching }),

  setShowMatchResult: (show) => set({ showMatchResult: show }),

  setCoachingFeedback: (feedback) => set({ coachingFeedback: feedback }),

  setShowCoachingFeedback: (show) => set({ showCoachingFeedback: show }),

  setLeaderboard: (entries) => set({ leaderboard: entries }),

  setLeaderboardCategory: (category) => set({ leaderboardCategory: category }),

  addNotification: (message, type) => {
    const id = Date.now().toString();
    set((state) => ({
      notifications: [...state.notifications, { id, message, type }]
    }));
    setTimeout(() => get().removeNotification(id), 5000);
  },

  removeNotification: (id) => set((state) => ({
    notifications: state.notifications.filter(n => n.id !== id)
  })),

  updateUserStats: (stats) => set((state) => ({
    user: state.user ? { ...state.user, ...stats } : null
  })),

  resetBattle: () => set({
    match: null,
    isSearchingMatch: false,
    showMatchResult: false,
    coachingFeedback: null,
    showCoachingFeedback: false
  }),

  // Subject actions
  setSelectedSubject: (subject) => set({ selectedSubject: subject }),

  // Settings actions
  updateSettings: (newSettings) => set((state) => ({
    settings: { ...state.settings, ...newSettings }
  })),

  // Friends actions
  setFriends: (friends) => set({ friends }),
  setFriendsLoading: (loading) => set({ friendsLoading: loading }),
  setShowFriendsModal: (show) => set({ showFriendsModal: show }),
  addFriend: (friend) => set((state) => ({
    friends: [...state.friends, friend]
  })),
  removeFriend: (friendId) => set((state) => ({
    friends: state.friends.filter(f => f.id !== friendId)
  })),

  // Achievements actions
  setAchievements: (achievements) => set({ achievements }),
  setAchievementsLoading: (loading) => set({ achievementsLoading: loading }),
  setShowAchievementModal: (show) => set({ showAchievementModal: show }),
  setNewAchievement: (achievement) => set({ newAchievement: achievement }),

  // Tournaments actions
  setTournaments: (tournaments) => set({ tournaments }),
  setTournamentsLoading: (loading) => set({ tournamentsLoading: loading }),

  // Spectator actions
  setLiveMatches: (matches) => set({ liveMatches: matches }),

  // Profile actions
  setIsEditingProfile: (editing) => set({ isEditingProfile: editing }),
  setMatchHistory: (matches) => set({ matchHistory: matches }),
}));
