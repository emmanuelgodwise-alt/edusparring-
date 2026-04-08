'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Video, Search, Filter, Grid, List, Radio, Clock, TrendingUp,
  BookOpen, Award, Play, Calendar, Users, ChevronRight, X,
  SlidersHorizontal, Sparkles, Flame, Star, Bookmark
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { VideoPlayer, VideoCard } from '@/components/video/VideoPlayer';
import { LiveClassViewer, LiveClassCard, LiveClassHost } from '@/components/video/LiveClass';
import type { Video as VideoType, LiveClass as LiveClassType, VideoFilter } from '@/types/video';
import Link from 'next/link';
import { GlobalSearch, SearchTrigger, useGlobalSearch } from '@/components/navigation';

// Mock data
const mockVideos: VideoType[] = [
  {
    id: '1',
    title: 'Solving Quadratic Equations - Complete Guide',
    description: 'Learn all methods to solve quadratic equations step by step.',
    subject: 'Math',
    topic: 'Algebra',
    thumbnailUrl: 'https://picsum.photos/seed/math1/640/360',
    videoUrl: '/videos/sample.mp4',
    duration: 845,
    views: 15420,
    likes: 892,
    creatorId: 't1',
    creatorName: 'Prof. Mathews',
    type: 'lesson',
    difficulty: 'intermediate',
    tags: ['quadratic', 'equations', 'algebra'],
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    isLive: false,
  },
  {
    id: '2',
    title: 'Newton\'s Laws of Motion Explained',
    description: 'Understanding the three laws of motion with real-world examples.',
    subject: 'Physics',
    topic: 'Mechanics',
    thumbnailUrl: 'https://picsum.photos/seed/physics1/640/360',
    videoUrl: '/videos/sample.mp4',
    duration: 1200,
    views: 23100,
    likes: 1456,
    creatorId: 't2',
    creatorName: 'Dr. Physics',
    type: 'lesson',
    difficulty: 'beginner',
    tags: ['newton', 'motion', 'forces'],
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    isLive: false,
  },
  {
    id: '3',
    title: 'JAMB 2024 Chemistry Solutions',
    description: 'Step-by-step solutions to JAMB chemistry questions.',
    subject: 'Chemistry',
    topic: 'Exam Prep',
    thumbnailUrl: 'https://picsum.photos/seed/chem1/640/360',
    videoUrl: '/videos/sample.mp4',
    duration: 2400,
    views: 45000,
    likes: 3200,
    creatorId: 't3',
    creatorName: 'Chem Master',
    type: 'solution',
    difficulty: 'advanced',
    tags: ['JAMB', 'chemistry', 'solutions'],
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    isLive: false,
  },
  {
    id: '4',
    title: 'Quick Biology: Photosynthesis in 60 Seconds',
    description: 'Fast overview of photosynthesis process.',
    subject: 'Biology',
    topic: 'Botany',
    thumbnailUrl: 'https://picsum.photos/seed/bio1/640/360',
    videoUrl: '/videos/sample.mp4',
    duration: 65,
    views: 89000,
    likes: 5600,
    creatorId: 't4',
    creatorName: 'Bio Quick',
    type: 'short',
    difficulty: 'beginner',
    tags: ['photosynthesis', 'biology', 'quick'],
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    isLive: false,
  },
  {
    id: '5',
    title: 'WAEC Past Questions - Trigonometry',
    description: 'Complete walkthrough of WAEC trigonometry questions.',
    subject: 'Math',
    topic: 'Trigonometry',
    thumbnailUrl: 'https://picsum.photos/seed/math2/640/360',
    videoUrl: '/videos/sample.mp4',
    duration: 1800,
    views: 32100,
    likes: 2100,
    creatorId: 't5',
    creatorName: 'WAEC Expert',
    type: 'solution',
    difficulty: 'intermediate',
    tags: ['WAEC', 'trigonometry', 'past questions'],
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    isLive: false,
  },
  {
    id: '6',
    title: 'Live: Physics Problem Solving Session',
    description: 'Join live problem solving for physics.',
    subject: 'Physics',
    topic: 'Problem Solving',
    thumbnailUrl: 'https://picsum.photos/seed/physics2/640/360',
    videoUrl: '/videos/sample.mp4',
    duration: 0,
    views: 2340,
    likes: 156,
    creatorId: 't2',
    creatorName: 'Dr. Physics',
    type: 'live',
    difficulty: 'intermediate',
    tags: ['live', 'physics', 'problems'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isLive: true,
    liveViewers: 234,
  },
];

const mockLiveClasses: LiveClassType[] = [
  {
    id: 'l1',
    title: 'Mathematics Olympiad Prep',
    description: 'Prepare for the upcoming Math Olympiad competition.',
    subject: 'Math',
    hostId: 'h1',
    hostName: 'Prof. Mathews',
    streamUrl: '/stream/live1',
    status: 'live',
    viewerCount: 245,
    maxViewers: 500,
    chatEnabled: true,
    recordEnabled: true,
    tags: ['olympiad', 'competition', 'math'],
    difficulty: 'advanced',
  },
  {
    id: 'l2',
    title: 'JAMB Chemistry Revision',
    description: 'Last-minute revision for JAMB chemistry exam.',
    subject: 'Chemistry',
    hostId: 'h2',
    hostName: 'Chem Master',
    streamUrl: '/stream/live2',
    status: 'scheduled',
    scheduledFor: new Date(Date.now() + 3600000 * 2).toISOString(),
    viewerCount: 0,
    maxViewers: 300,
    chatEnabled: true,
    recordEnabled: true,
    tags: ['JAMB', 'revision', 'chemistry'],
    difficulty: 'intermediate',
  },
];

const subjects = ['All', 'Math', 'Physics', 'Chemistry', 'Biology', 'History', 'Geography'];
const videoTypes = ['All', 'lesson', 'solution', 'short', 'live'];
const difficulties = ['All', 'beginner', 'intermediate', 'advanced'];

export default function VideosPage() {
  const [videos, setVideos] = useState<VideoType[]>(mockVideos);
  const [liveClasses, setLiveClasses] = useState<LiveClassType[]>(mockLiveClasses);
  const [selectedVideo, setSelectedVideo] = useState<VideoType | null>(null);
  const [selectedLiveClass, setSelectedLiveClass] = useState<LiveClassType | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<VideoFilter>({});
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeTab, setActiveTab] = useState('all');
  const { isOpen: searchOpen, openSearch, closeSearch } = useGlobalSearch();

  const filteredVideos = videos.filter(video => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (!video.title.toLowerCase().includes(query) && 
          !video.description.toLowerCase().includes(query) &&
          !video.tags.some(t => t.toLowerCase().includes(query))) {
        return false;
      }
    }
    if (filters.subject && filters.subject !== 'All' && video.subject !== filters.subject) {
      return false;
    }
    if (filters.type && filters.type !== 'All' && video.type !== filters.type) {
      return false;
    }
    if (filters.difficulty && filters.difficulty !== 'All' && video.difficulty !== filters.difficulty) {
      return false;
    }
    return true;
  });

  const liveNow = liveClasses.filter(lc => lc.status === 'live');
  const upcoming = liveClasses.filter(lc => lc.status === 'scheduled');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-black/30 border-b border-white/10">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Video className="w-8 h-8 text-purple-400" />
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              EduSparring Videos
            </h1>
          </Link>

          <div className="flex items-center gap-3">
            <SearchTrigger onClick={openSearch} />
            <Link href="/">
              <Button variant="ghost" className="text-gray-300 hover:text-white">
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Video Player Modal */}
        <AnimatePresence>
          {selectedVideo && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/90 p-4 overflow-y-auto"
            >
              <div className="max-w-5xl mx-auto">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">{selectedVideo.title}</h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedVideo(null)}
                    className="text-white"
                  >
                    <X className="w-6 h-6" />
                  </Button>
                </div>
                <VideoPlayer
                  video={selectedVideo}
                  onProgress={(p) => console.log('Progress:', p)}
                  onComplete={() => console.log('Completed!')}
                />
                <div className="mt-4">
                  <p className="text-gray-300">{selectedVideo.description}</p>
                  <div className="flex items-center gap-2 mt-3">
                    {selectedVideo.tags.map(tag => (
                      <Badge key={tag} variant="outline" className="border-white/20">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Live Class Viewer Modal */}
        <AnimatePresence>
          {selectedLiveClass && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black p-4"
            >
              <div className="h-full flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">{selectedLiveClass.title}</h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedLiveClass(null)}
                    className="text-white"
                  >
                    <X className="w-6 h-6" />
                  </Button>
                </div>
                <div className="flex-1">
                  <LiveClassViewer
                    liveClass={selectedLiveClass}
                    currentUserId="user1"
                    onLeave={() => setSelectedLiveClass(null)}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Live Now Section */}
        {liveNow.length > 0 && (
          <section className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
              <h2 className="text-xl font-bold text-white">Live Now</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {liveNow.map(lc => (
                <LiveClassCard
                  key={lc.id}
                  liveClass={lc}
                  onClick={() => setSelectedLiveClass(lc)}
                />
              ))}
            </div>
          </section>
        )}

        {/* Search and Filters */}
        <section className="mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search videos, topics, or creators..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500"
              />
            </div>
            
            <div className="flex gap-2">
              <select
                value={filters.subject || 'All'}
                onChange={(e) => setFilters({ ...filters, subject: e.target.value })}
                className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white"
              >
                {subjects.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              
              <select
                value={filters.type || 'All'}
                onChange={(e) => setFilters({ ...filters, type: e.target.value as any })}
                className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white"
              >
                {videoTypes.map(t => (
                  <option key={t} value={t}>{t === 'All' ? 'All Types' : t.charAt(0).toUpperCase() + t.slice(1)}</option>
                ))}
              </select>
              
              <Button
                variant="outline"
                size="icon"
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                className="border-white/20"
              >
                {viewMode === 'grid' ? <List className="w-4 h-4" /> : <Grid className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </section>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-white/5 border border-white/10">
            <TabsTrigger value="all" className="data-[state=active]:bg-purple-500/20">
              All Videos
            </TabsTrigger>
            <TabsTrigger value="lessons" className="data-[state=active]:bg-purple-500/20">
              <BookOpen className="w-4 h-4 mr-2" />
              Lessons
            </TabsTrigger>
            <TabsTrigger value="solutions" className="data-[state=active]:bg-purple-500/20">
              <Award className="w-4 h-4 mr-2" />
              Solutions
            </TabsTrigger>
            <TabsTrigger value="shorts" className="data-[state=active]:bg-purple-500/20">
              <Sparkles className="w-4 h-4 mr-2" />
              Quick Learn
            </TabsTrigger>
            <TabsTrigger value="live" className="data-[state=active]:bg-purple-500/20">
              <Radio className="w-4 h-4 mr-2" />
              Live Classes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <div className={viewMode === 'grid' 
              ? 'grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
              : 'space-y-4'
            }>
              {filteredVideos.map(video => (
                <VideoCard
                  key={video.id}
                  video={video}
                  onClick={() => setSelectedVideo(video)}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="lessons">
            <div className={viewMode === 'grid' 
              ? 'grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
              : 'space-y-4'
            }>
              {filteredVideos
                .filter(v => v.type === 'lesson')
                .map(video => (
                  <VideoCard
                    key={video.id}
                    video={video}
                    onClick={() => setSelectedVideo(video)}
                  />
                ))}
            </div>
          </TabsContent>

          <TabsContent value="solutions">
            <div className={viewMode === 'grid' 
              ? 'grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
              : 'space-y-4'
            }>
              {filteredVideos
                .filter(v => v.type === 'solution')
                .map(video => (
                  <VideoCard
                    key={video.id}
                    video={video}
                    onClick={() => setSelectedVideo(video)}
                  />
                ))}
            </div>
          </TabsContent>

          <TabsContent value="shorts">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {filteredVideos
                .filter(v => v.type === 'short')
                .map(video => (
                  <motion.div
                    key={video.id}
                    whileHover={{ scale: 1.05 }}
                    onClick={() => setSelectedVideo(video)}
                    className="cursor-pointer aspect-[9/16] rounded-xl overflow-hidden bg-slate-800 relative group"
                  >
                    <img
                      src={video.thumbnailUrl}
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <p className="text-sm font-medium line-clamp-2">{video.title}</p>
                      <p className="text-xs text-gray-400 mt-1">{video.views.toLocaleString()} views</p>
                    </div>
                  </motion.div>
                ))}
            </div>
          </TabsContent>

          <TabsContent value="live">
            <div className="space-y-8">
              {/* Upcoming */}
              {upcoming.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-purple-400" />
                    Upcoming Classes
                  </h3>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {upcoming.map(lc => (
                      <LiveClassCard
                        key={lc.id}
                        liveClass={lc}
                        onClick={() => setSelectedLiveClass(lc)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Past Recordings */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-cyan-400" />
                  Past Recordings
                </h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredVideos
                    .filter(v => v.type === 'lesson')
                    .slice(0, 3)
                    .map(video => (
                      <VideoCard
                        key={video.id}
                        video={video}
                        onClick={() => setSelectedVideo(video)}
                      />
                    ))}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Recommended Section */}
        <section className="mt-12">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-400" />
            Recommended for You
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredVideos.slice(0, 4).map(video => (
              <VideoCard
                key={video.id}
                video={video}
                onClick={() => setSelectedVideo(video)}
              />
            ))}
          </div>
        </section>

        {/* Continue Watching */}
        <section className="mt-8">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-cyan-400" />
            Continue Watching
          </h2>
          <ScrollArea className="w-full">
            <div className="flex gap-4 pb-4">
              {filteredVideos.slice(0, 5).map((video, i) => (
                <motion.div
                  key={video.id}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setSelectedVideo(video)}
                  className="cursor-pointer flex-shrink-0 w-80"
                >
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-800">
                    <img
                      src={video.thumbnailUrl}
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
                      <div 
                        className="h-full bg-purple-500"
                        style={{ width: `${Math.random() * 80 + 10}%` }}
                      />
                    </div>
                  </div>
                  <h4 className="font-medium mt-2 line-clamp-1">{video.title}</h4>
                  <p className="text-sm text-gray-400">{video.creatorName}</p>
                </motion.div>
              ))}
            </div>
          </ScrollArea>
        </section>
      </main>

      {/* Global Search */}
      <GlobalSearch isOpen={searchOpen} onClose={closeSearch} />
    </div>
  );
}
