// AI Types for EduSparring

// AI Tutor Types
export interface TutorMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  subject?: string;
  topic?: string;
  attachments?: TutorAttachment[];
  feedback?: TutorFeedback;
}

export interface TutorAttachment {
  type: 'image' | 'document' | 'code';
  url: string;
  name: string;
}

export interface TutorFeedback {
  helpful: boolean | null;
  rating: number | null; // 1-5
  comment?: string;
}

export interface TutorSession {
  id: string;
  userId: string;
  subject: string;
  topic?: string;
  messages: TutorMessage[];
  startedAt: string;
  endedAt?: string;
  summary?: string;
  conceptsCovered: string[];
  questionsAsked: number;
  helpfulResponses: number;
}

// Adaptive Learning Types
export interface LearningProfile {
  userId: string;
  subjects: SubjectProfile[];
  overallLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  learningStyle: 'visual' | 'auditory' | 'reading' | 'kinesthetic' | 'mixed';
  preferredPace: 'slow' | 'moderate' | 'fast';
  strengthAreas: string[];
  weaknessAreas: string[];
  goals: LearningGoal[];
  lastUpdated: string;
}

export interface SubjectProfile {
  subject: string;
  level: number; // 1-100
  masteryTopics: string[];
  strugglingTopics: string[];
  totalQuestionsAnswered: number;
  correctRate: number;
  averageTime: number; // seconds per question
  streakDays: number;
  lastPracticed: string;
}

export interface LearningGoal {
  id: string;
  subject: string;
  targetTopic?: string;
  targetLevel: number;
  currentLevel: number;
  deadline?: string;
  createdAt: string;
  status: 'in_progress' | 'completed' | 'abandoned';
}

// Adaptive Difficulty Types
export interface DifficultyAdjustment {
  userId: string;
  subject: string;
  currentDifficulty: number; // 1-10 scale
  recommendedDifficulty: number;
  adjustmentReason: string;
  performanceMetrics: PerformanceMetrics;
  lastAdjusted: string;
}

export interface PerformanceMetrics {
  recentAccuracy: number; // 0-1
  averageResponseTime: number; // seconds
  streakCorrect: number;
  streakIncorrect: number;
  totalSessions: number;
  improvementRate: number; // -1 to 1
}

export interface QuestionDifficulty {
  questionId: string;
  subject: string;
  topic: string;
  difficulty: number; // 1-10
  discriminationIndex: number; // how well it differentiates skill levels
  averageTime: number;
  correctRate: number;
}

// Recommendation Types
export interface Recommendation {
  id: string;
  type: 'question' | 'video' | 'lesson' | 'practice' | 'challenge' | 'review';
  subject: string;
  topic?: string;
  title: string;
  description: string;
  reason: string; // AI-generated reason for recommendation
  priority: 'high' | 'medium' | 'low';
  relevanceScore: number; // 0-1
  estimatedDuration: number; // minutes
  contentId?: string;
  actionUrl?: string;
  createdAt: string;
  expiresAt?: string;
}

export interface LearningPath {
  id: string;
  userId: string;
  title: string;
  description: string;
  subject: string;
  targetGoal: string;
  currentProgress: number; // 0-100
  estimatedDaysToComplete: number;
  milestones: LearningMilestone[];
  recommendedDaily: RecommendedActivity[];
  createdAt: string;
}

export interface LearningMilestone {
  id: string;
  title: string;
  description: string;
  targetLevel: number;
  requiredTopics: string[];
  completed: boolean;
  completedAt?: string;
}

export interface RecommendedActivity {
  type: 'practice' | 'video' | 'quiz' | 'challenge' | 'review';
  subject: string;
  topic?: string;
  duration: number; // minutes
  difficulty: number;
  reason: string;
}

// AI Analysis Types
export interface PerformanceAnalysis {
  userId: string;
  subject: string;
  timeRange: 'week' | 'month' | 'all_time';
  summary: string;
  strengths: string[];
  weaknesses: string[];
  recommendations: Recommendation[];
  trends: PerformanceTrend[];
  comparisonToAverage: number; // -1 to 1
  predictedScore?: number;
  studyTips: string[];
  generatedAt: string;
}

export interface PerformanceTrend {
  date: string;
  accuracy: number;
  questionsAnswered: number;
  averageTime: number;
  difficulty: number;
}

// Quiz Generation Types
export interface QuizGeneration {
  subject: string;
  topic?: string;
  difficulty: number;
  questionCount: number;
  questionTypes: ('multiple_choice' | 'true_false' | 'short_answer' | 'fill_blank')[];
  focusAreas?: string[];
}

export interface GeneratedQuestion {
  id: string;
  question: string;
  type: 'multiple_choice' | 'true_false' | 'short_answer' | 'fill_blank';
  options?: string[];
  correctAnswer: string;
  explanation: string;
  difficulty: number;
  subject: string;
  topic: string;
  tags: string[];
}

// Spaced Repetition Types
export interface SpacedRepetitionItem {
  id: string;
  userId: string;
  conceptId: string;
  conceptName: string;
  subject: string;
  topic: string;
  difficulty: number;
  interval: number; // days until next review
  easeFactor: number; // SM-2 algorithm factor
  repetitions: number; // number of successful reviews
  nextReviewDate: string;
  lastReviewDate?: string;
  reviewHistory: ReviewRecord[];
}

export interface ReviewRecord {
  date: string;
  quality: number; // 0-5 SM-2 rating
  responseTime: number;
  correct: boolean;
}

// AI Chat Context
export interface AIContext {
  userId: string;
  currentSubject?: string;
  currentTopic?: string;
  recentQuestions: GeneratedQuestion[];
  recentPerformance: PerformanceMetrics;
  learningProfile: LearningProfile;
  activeGoals: LearningGoal[];
}
