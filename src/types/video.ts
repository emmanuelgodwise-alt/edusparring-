// Video Types for EduSparring

export interface Video {
  id: string;
  title: string;
  description: string;
  subject: string;
  topic: string;
  thumbnailUrl: string;
  videoUrl: string;
  duration: number; // in seconds
  views: number;
  likes: number;
  creatorId: string;
  creatorName: string;
  creatorAvatar?: string;
  type: 'solution' | 'lesson' | 'live' | 'short';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  createdAt: string;
  updatedAt: string;
  isLive: boolean;
  liveViewers?: number;
  scheduledFor?: string;
}

export interface LiveClass {
  id: string;
  title: string;
  description: string;
  subject: string;
  hostId: string;
  hostName: string;
  hostAvatar?: string;
  streamUrl: string;
  thumbnailUrl?: string;
  status: 'scheduled' | 'live' | 'ended';
  scheduledFor?: string;
  startedAt?: string;
  endedAt?: string;
  viewerCount: number;
  maxViewers: number;
  chatEnabled: boolean;
  recordEnabled: boolean;
  tags: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface LiveChatMessage {
  id: string;
  liveClassId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  message: string;
  timestamp: string;
  isHighlighted: boolean;
  isModerator: boolean;
}

export interface VideoProgress {
  videoId: string;
  userId: string;
  progress: number; // percentage
  currentTime: number; // seconds
  completed: boolean;
  lastWatchedAt: string;
}

export interface VideoComment {
  id: string;
  videoId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  timestamp: string;
  likes: number;
  replies: VideoComment[];
}

export interface VideoPlaylist {
  id: string;
  title: string;
  description: string;
  thumbnailUrl?: string;
  videos: Video[];
  videoCount: number;
  creatorId: string;
  creatorName: string;
  createdAt: string;
  updatedAt: string;
}

export type VideoCategory = 
  | 'Math'
  | 'Physics'
  | 'Chemistry'
  | 'Biology'
  | 'History'
  | 'Geography'
  | 'Literature'
  | 'Computer Science'
  | 'Exam Prep'
  | 'Study Tips';

export interface VideoFilter {
  subject?: string;
  type?: Video['type'];
  difficulty?: Video['difficulty'];
  search?: string;
  sortBy?: 'newest' | 'popular' | 'recommended';
}
