'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Video, Play, ChevronRight, X, BookOpen, Award, Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Video } from '@/types/video';

interface VideoSuggestionsProps {
  subject: string;
  topic?: string;
  showAfterBattle?: boolean;
  onClose?: () => void;
}

// Mock video suggestions
const getMockVideos = (subject: string, topic?: string): Video[] => [
  {
    id: '1',
    title: `Understanding ${topic || subject} Concepts`,
    description: `Learn the fundamentals of ${topic || subject} step by step.`,
    subject,
    topic: topic || subject,
    thumbnailUrl: `https://picsum.photos/seed/${subject}${topic}/320/180`,
    videoUrl: '/videos/sample.mp4',
    duration: 845,
    views: 15420,
    likes: 892,
    creatorId: 't1',
    creatorName: 'EduSparring Academy',
    type: 'lesson',
    difficulty: 'intermediate',
    tags: [subject.toLowerCase(), topic?.toLowerCase() || 'basics'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isLive: false,
  },
  {
    id: '2',
    title: `${topic || subject} Practice Problems`,
    description: `Work through practice problems with detailed explanations.`,
    subject,
    topic: topic || subject,
    thumbnailUrl: `https://picsum.photos/seed/${subject}${topic}2/320/180`,
    videoUrl: '/videos/sample.mp4',
    duration: 1200,
    views: 8930,
    likes: 456,
    creatorId: 't2',
    creatorName: 'Study Master',
    type: 'solution',
    difficulty: 'intermediate',
    tags: [subject.toLowerCase(), 'practice', 'problems'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isLive: false,
  },
  {
    id: '3',
    title: `Quick ${topic || subject} Tips`,
    description: `Fast tips and tricks for ${topic || subject}.`,
    subject,
    topic: topic || subject,
    thumbnailUrl: `https://picsum.photos/seed/${subject}${topic}3/320/180`,
    videoUrl: '/videos/sample.mp4',
    duration: 120,
    views: 45000,
    likes: 2100,
    creatorId: 't3',
    creatorName: 'Quick Learn',
    type: 'short',
    difficulty: 'beginner',
    tags: [subject.toLowerCase(), 'tips', 'quick'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isLive: false,
  },
];

export function VideoSuggestions({ subject, topic, showAfterBattle, onClose }: VideoSuggestionsProps) {
  const [expanded, setExpanded] = useState(!showAfterBattle);
  const videos = getMockVideos(subject, topic);

  return (
    <Card className="bg-white/5 border-white/10 overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Video className="w-5 h-5 text-purple-400" />
            Related Videos
          </span>
          {showAfterBattle && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-400"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3">
          {videos.map((video, index) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer group"
            >
              {/* Thumbnail */}
              <div className="relative w-32 aspect-video rounded-lg overflow-hidden flex-shrink-0">
                <img
                  src={video.thumbnailUrl}
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                  <Play className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-black/80 rounded text-xs text-white">
                  {Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, '0')}
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm line-clamp-2 group-hover:text-purple-400 transition-colors">
                  {video.title}
                </h4>
                <p className="text-xs text-gray-400 mt-1">{video.creatorName}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="text-xs border-white/10">
                    {video.type === 'lesson' && <BookOpen className="w-3 h-3 mr-1" />}
                    {video.type === 'solution' && <Award className="w-3 h-3 mr-1" />}
                    {video.type === 'short' && <Sparkles className="w-3 h-3 mr-1" />}
                    {video.type}
                  </Badge>
                  <span className="text-xs text-gray-500">
                    {video.views.toLocaleString()} views
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <Button
          variant="outline"
          className="w-full mt-4 border-purple-500/30 text-purple-400 hover:bg-purple-500/10"
          asChild
        >
          <a href="/videos">
            View All Videos
            <ChevronRight className="w-4 h-4 ml-1" />
          </a>
        </Button>
      </CardContent>
    </Card>
  );
}

// Compact video widget for homepage
export function VideoWidget() {
  const videos = getMockVideos('Math', 'Algebra');

  return (
    <Card className="bg-gradient-to-br from-purple-900/30 to-cyan-900/30 border-purple-500/20">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Video className="w-5 h-5 text-purple-400" />
          Featured Videos
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {videos.slice(0, 2).map((video) => (
            <a
              key={video.id}
              href="/videos"
              className="flex gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors group"
            >
              <div className="relative w-20 aspect-video rounded-lg overflow-hidden flex-shrink-0">
                <img
                  src={video.thumbnailUrl}
                  alt={video.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <Play className="w-4 h-4 text-white" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium line-clamp-2 group-hover:text-purple-400 transition-colors">
                  {video.title}
                </h4>
                <p className="text-xs text-gray-400 mt-1">
                  {Math.floor(video.duration / 60)} min • {video.views.toLocaleString()} views
                </p>
              </div>
            </a>
          ))}
        </div>

        <Button
          variant="ghost"
          className="w-full mt-3 text-purple-400 hover:text-purple-300 hover:bg-purple-500/10"
          asChild
        >
          <a href="/videos">
            Browse All Videos
            <ChevronRight className="w-4 h-4 ml-1" />
          </a>
        </Button>
      </CardContent>
    </Card>
  );
}
