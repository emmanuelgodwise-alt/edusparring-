'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, Plus, Search, BookOpen, Clock, ChevronRight, ArrowLeft,
  UserPlus, UserMinus, Lock, Globe, MessageCircle, X, Check,
  Loader2, Star, Crown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Link from 'next/link';
import { cn } from '@/lib/utils';

// Subject icons
const SUBJECT_ICONS: Record<string, string> = {
  Math: '📐', Physics: '⚛️', Chemistry: '🧪', Biology: '🧬',
  History: '📜', Geography: '🌍', Literature: '📚', Computer: '💻',
  Art: '🎨', Music: '🎵', Language: '🗣️', Other: '📖'
};

// Mock data
const MOCK_CIRCLES = [
  {
    id: '1',
    name: 'Math Olympiad Prep',
    description: 'Preparing for upcoming math competitions',
    subject: 'Math',
    creatorId: 'user1',
    members: ['user1', 'user2', 'user3', 'user4'],
    memberCount: 4,
    maxMembers: 20,
    isPublic: true,
    isMember: false,
    createdAt: new Date(Date.now() - 86400000 * 3),
    recentActivity: [
      { user: 'Alex', action: 'shared a practice problem', time: '2h ago' },
      { user: 'Jordan', action: 'asked a question', time: '4h ago' }
    ]
  },
  {
    id: '2',
    name: 'Physics Study Group',
    description: 'Weekly physics problem solving sessions',
    subject: 'Physics',
    creatorId: 'user5',
    members: ['user5', 'user6'],
    memberCount: 2,
    maxMembers: 15,
    isPublic: true,
    isMember: true,
    createdAt: new Date(Date.now() - 86400000 * 7),
    recentActivity: [
      { user: 'Taylor', action: 'started a discussion', time: '1h ago' }
    ]
  },
  {
    id: '3',
    name: 'AP Chemistry Help',
    description: 'Help each other with AP Chemistry concepts',
    subject: 'Chemistry',
    creatorId: 'user7',
    members: ['user7', 'user8', 'user9'],
    memberCount: 3,
    maxMembers: 10,
    isPublic: true,
    isMember: false,
    createdAt: new Date(Date.now() - 86400000 * 5),
    recentActivity: []
  },
];

const SUBJECTS = ['Math', 'Physics', 'Chemistry', 'Biology', 'History', 'Geography', 'Literature', 'Computer', 'Art', 'Music', 'Language', 'Other'];

export default function StudyCirclesPage() {
  const [circles, setCircles] = useState(MOCK_CIRCLES);
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedCircle, setSelectedCircle] = useState<typeof MOCK_CIRCLES[0] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [newCircle, setNewCircle] = useState({
    name: '',
    description: '',
    subject: '',
    isPublic: true,
    maxMembers: 20
  });

  const filteredCircles = circles.filter(circle => {
    if (selectedSubject !== 'all' && circle.subject !== selectedSubject) return false;
    if (searchQuery && !circle.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !circle.description.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const myCircles = circles.filter(c => c.isMember);
  const otherCircles = filteredCircles.filter(c => !c.isMember);

  const handleJoinCircle = async (circleId: string) => {
    setCircles(prev => prev.map(c => {
      if (c.id === circleId) {
        return { ...c, isMember: true, memberCount: c.memberCount + 1 };
      }
      return c;
    }));
  };

  const handleLeaveCircle = async (circleId: string) => {
    setCircles(prev => prev.map(c => {
      if (c.id === circleId) {
        return { ...c, isMember: false, memberCount: c.memberCount - 1 };
      }
      return c;
    }));
    if (selectedCircle?.id === circleId) {
      setSelectedCircle(null);
    }
  };

  const handleCreateCircle = async () => {
    if (!newCircle.name || !newCircle.subject) return;
    
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const circle = {
      id: Date.now().toString(),
      ...newCircle,
      creatorId: 'current-user',
      members: ['current-user'],
      memberCount: 1,
      isMember: true,
      createdAt: new Date(),
      recentActivity: []
    };
    
    setCircles(prev => [circle, ...prev]);
    setCreateDialogOpen(false);
    setNewCircle({ name: '', description: '', subject: '', isPublic: true, maxMembers: 20 });
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 text-white pb-20">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-black/30 border-b border-white/10">
        <div className="container mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/social">
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-xl font-bold">Study Circles</h1>
            <p className="text-xs text-gray-400">Learn together, grow together</p>
          </div>
          <Button
            onClick={() => setCreateDialogOpen(true)}
            className="bg-gradient-to-r from-purple-600 to-cyan-600"
          >
            <Plus className="w-4 h-4 mr-1" />
            Create
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-4 max-w-2xl">
        {/* Search and Filter */}
        <div className="flex gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search circles..."
              className="pl-9 bg-white/5 border-white/10"
            />
          </div>
          <Select value={selectedSubject} onValueChange={setSelectedSubject}>
            <SelectTrigger className="w-[140px] bg-white/5 border-white/10">
              <SelectValue placeholder="Subject" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Subjects</SelectItem>
              {SUBJECTS.map(s => (
                <SelectItem key={s} value={s}>{SUBJECT_ICONS[s]} {s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* My Circles */}
        {myCircles.length > 0 && (
          <div className="mb-6">
            <h2 className="text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-400" />
              Your Circles
            </h2>
            <div className="grid gap-3">
              {myCircles.map((circle) => (
                <motion.div
                  key={circle.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={() => setSelectedCircle(circle)}
                  className="cursor-pointer"
                >
                  <Card className="bg-gradient-to-r from-purple-900/30 to-cyan-900/30 border-purple-500/20 hover:border-purple-500/40 transition-colors">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center text-xl">
                          {SUBJECT_ICONS[circle.subject] || '📖'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold truncate">{circle.name}</h3>
                            {!circle.isPublic && <Lock className="w-3 h-3 text-gray-400" />}
                          </div>
                          <p className="text-xs text-gray-400 truncate">{circle.description}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline" className="text-xs bg-white/5 border-white/10">
                              <Users className="w-3 h-3 mr-1" />
                              {circle.memberCount}/{circle.maxMembers}
                            </Badge>
                            {circle.recentActivity.length > 0 && (
                              <span className="text-xs text-cyan-400">
                                {circle.recentActivity[0].action}
                              </span>
                            )}
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Browse Circles */}
        <div>
          <h2 className="text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
            <Globe className="w-4 h-4 text-cyan-400" />
            Browse Circles
          </h2>
          {otherCircles.length === 0 ? (
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-8 text-center">
                <Users className="w-12 h-12 mx-auto text-gray-500 mb-3" />
                <p className="text-gray-400">No circles found</p>
                <Button
                  onClick={() => setCreateDialogOpen(true)}
                  variant="outline"
                  className="mt-3 border-purple-500/30 text-purple-400"
                >
                  Create one?
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-3">
              {otherCircles.map((circle) => (
                <motion.div
                  key={circle.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-xl">
                          {SUBJECT_ICONS[circle.subject] || '📖'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold truncate">{circle.name}</h3>
                            {!circle.isPublic && <Lock className="w-3 h-3 text-gray-400" />}
                          </div>
                          <p className="text-xs text-gray-400 truncate">{circle.description}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline" className="text-xs bg-white/5 border-white/10">
                              <Users className="w-3 h-3 mr-1" />
                              {circle.memberCount}/{circle.maxMembers}
                            </Badge>
                            <Badge variant="outline" className="text-xs bg-white/5 border-white/10">
                              {SUBJECT_ICONS[circle.subject]} {circle.subject}
                            </Badge>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => handleJoinCircle(circle.id)}
                          className="bg-gradient-to-r from-purple-600 to-cyan-600"
                        >
                          <UserPlus className="w-4 h-4 mr-1" />
                          Join
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Circle Detail Dialog */}
      <Dialog open={!!selectedCircle} onOpenChange={() => setSelectedCircle(null)}>
        <DialogContent className="bg-slate-900 border-white/10 text-white max-w-md">
          {selectedCircle && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center text-2xl">
                    {SUBJECT_ICONS[selectedCircle.subject] || '📖'}
                  </div>
                  <div>
                    <DialogTitle>{selectedCircle.name}</DialogTitle>
                    <DialogDescription className="text-gray-400">
                      {selectedCircle.memberCount} members • {selectedCircle.subject}
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-4">
                <p className="text-sm text-gray-300">{selectedCircle.description}</p>

                {/* Activity Feed */}
                <div>
                  <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-cyan-400" />
                    Recent Activity
                  </h4>
                  {selectedCircle.recentActivity.length === 0 ? (
                    <p className="text-xs text-gray-500 text-center py-4">No recent activity</p>
                  ) : (
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {selectedCircle.recentActivity.map((activity, i) => (
                        <div key={i} className="text-xs p-2 bg-white/5 rounded-lg">
                          <span className="font-medium text-purple-400">{activity.user}</span>
                          <span className="text-gray-400"> {activity.action}</span>
                          <span className="text-gray-500 ml-2">{activity.time}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => handleLeaveCircle(selectedCircle.id)}
                    className="flex-1 border-red-500/30 text-red-400"
                  >
                    <UserMinus className="w-4 h-4 mr-2" />
                    Leave Circle
                  </Button>
                  <Button
                    className="flex-1 bg-gradient-to-r from-purple-600 to-cyan-600"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Chat
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Create Circle Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="bg-slate-900 border-white/10 text-white max-w-md">
          <DialogHeader>
            <DialogTitle>Create a Study Circle</DialogTitle>
            <DialogDescription>
              Start a group for collaborative learning
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Circle Name</Label>
              <Input
                value={newCircle.name}
                onChange={(e) => setNewCircle(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., AP Calculus Study Group"
                className="bg-white/5 border-white/10"
              />
            </div>

            <div className="space-y-2">
              <Label>Subject</Label>
              <Select
                value={newCircle.subject}
                onValueChange={(value) => setNewCircle(prev => ({ ...prev, subject: value }))}
              >
                <SelectTrigger className="bg-white/5 border-white/10">
                  <SelectValue placeholder="Select a subject" />
                </SelectTrigger>
                <SelectContent>
                  {SUBJECTS.map(s => (
                    <SelectItem key={s} value={s}>{SUBJECT_ICONS[s]} {s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={newCircle.description}
                onChange={(e) => setNewCircle(prev => ({ ...prev, description: e.target.value }))}
                placeholder="What will you study together?"
                className="bg-white/5 border-white/10 min-h-[80px]"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">Public Circle</p>
                <p className="text-xs text-gray-400">Anyone can find and join</p>
              </div>
              <Button
                size="sm"
                variant={newCircle.isPublic ? "default" : "outline"}
                onClick={() => setNewCircle(prev => ({ ...prev, isPublic: true }))}
                className={newCircle.isPublic ? "bg-purple-600" : "border-white/20"}
              >
                Public
              </Button>
            </div>

            <Button
              onClick={handleCreateCircle}
              disabled={!newCircle.name || !newCircle.subject || isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-cyan-600"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Plus className="w-4 h-4 mr-2" />
              )}
              Create Circle
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
