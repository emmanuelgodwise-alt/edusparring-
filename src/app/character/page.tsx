'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Award, Target, BookOpen, Heart, Users, Star, ChevronRight, ArrowLeft,
  Plus, Loader2, CheckCircle2, Trophy, Clock, Flame, Lightbulb
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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

// Badge definitions
const BADGE_TYPES = {
  helper: { name: 'Helper', description: 'Helps others in study circles', icon: '🤝', color: 'from-green-500 to-emerald-500' },
  leader: { name: 'Leader', description: 'Creates and leads study groups', icon: '👑', color: 'from-yellow-500 to-orange-500' },
  honest: { name: 'Honest', description: 'Demonstrates academic integrity', icon: '✓', color: 'from-blue-500 to-cyan-500' },
  resilient: { name: 'Resilient', description: 'Shows persistence in learning', icon: '💪', color: 'from-orange-500 to-red-500' },
  kind: { name: 'Kind', description: 'Shows kindness to others', icon: '❤️', color: 'from-pink-500 to-rose-500' },
  scholar: { name: 'Scholar', description: 'Achieves academic excellence', icon: '📚', color: 'from-purple-500 to-indigo-500' },
  mentor: { name: 'Mentor', description: 'Helps peers through tutoring', icon: '🎓', color: 'from-cyan-500 to-teal-500' },
  verified: { name: 'Verified Student', description: 'Verified school email', icon: '✅', color: 'from-blue-500 to-purple-500' }
};

// Mock data
const MOCK_BADGES = [
  { type: 'verified', level: 1, earnedAt: new Date(Date.now() - 86400000 * 30), progress: 100 },
  { type: 'helper', level: 2, earnedAt: new Date(Date.now() - 86400000 * 10), progress: 75 },
  { type: 'scholar', level: 1, earnedAt: new Date(Date.now() - 86400000 * 5), progress: 60 },
];

const MOCK_GOALS = [
  { id: '1', title: 'Complete 10 Math sessions', category: 'academic', progress: 70, targetDate: new Date(Date.now() + 86400000 * 7) },
  { id: '2', title: 'Help 5 students in tutoring', category: 'character', progress: 40, targetDate: new Date(Date.now() + 86400000 * 14) },
  { id: '3', title: 'Maintain daily mood check-ins', category: 'wellness', progress: 85, targetDate: null },
];

const MOCK_SERVICE_LOG = [
  { id: '1', activity: 'Peer tutoring', hours: 3, date: new Date(Date.now() - 86400000 * 2), verified: true },
  { id: '2', activity: 'Study group facilitation', hours: 2, date: new Date(Date.now() - 86400000 * 5), verified: true },
];

const MOCK_JOURNAL_ENTRIES = [
  { id: '1', title: 'Great study session', content: 'Today I finally understood derivatives...', mood: 4, date: new Date(Date.now() - 86400000) },
  { id: '2', title: 'Feeling accomplished', content: 'Helped a friend with physics...', mood: 5, date: new Date(Date.now() - 86400000 * 3) },
];

const INSPIRATIONAL_QUOTES = [
  { quote: "The beautiful thing about learning is that no one can take it away from you.", author: "B.B. King" },
  { quote: "Education is the most powerful weapon which you can use to change the world.", author: "Nelson Mandela" },
  { quote: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { quote: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
];

export default function CharacterPage() {
  const [activeTab, setActiveTab] = useState('badges');
  const [badges, setBadges] = useState(MOCK_BADGES);
  const [goals, setGoals] = useState(MOCK_GOALS);
  const [serviceLog, setServiceLog] = useState(MOCK_SERVICE_LOG);
  const [journalEntries, setJournalEntries] = useState(MOCK_JOURNAL_ENTRIES);
  const [addGoalOpen, setAddGoalOpen] = useState(false);
  const [addJournalOpen, setAddJournalOpen] = useState(false);
  const [addServiceOpen, setAddServiceOpen] = useState(false);
  const [currentQuote] = useState(INSPIRATIONAL_QUOTES[Math.floor(Math.random() * INSPIRATIONAL_QUOTES.length)]);

  const [newGoal, setNewGoal] = useState({ title: '', category: 'academic', targetDate: '' });
  const [newJournal, setNewJournal] = useState({ title: '', content: '', mood: 3 });
  const [newService, setNewService] = useState({ activity: '', hours: '', description: '' });

  const earnedBadges = badges.filter(b => b.progress >= 100);
  const inProgressBadges = badges.filter(b => b.progress < 100);

  const totalServiceHours = serviceLog.reduce((sum, s) => sum + s.hours, 0);

  const handleAddGoal = () => {
    if (!newGoal.title) return;
    setGoals(prev => [...prev, {
      id: Date.now().toString(),
      title: newGoal.title,
      category: newGoal.category,
      progress: 0,
      targetDate: newGoal.targetDate ? new Date(newGoal.targetDate) : null
    }]);
    setNewGoal({ title: '', category: 'academic', targetDate: '' });
    setAddGoalOpen(false);
  };

  const handleAddJournal = () => {
    if (!newJournal.content) return;
    setJournalEntries(prev => [{
      id: Date.now().toString(),
      title: newJournal.title || 'Reflection',
      content: newJournal.content,
      mood: newJournal.mood,
      date: new Date()
    }, ...prev]);
    setNewJournal({ title: '', content: '', mood: 3 });
    setAddJournalOpen(false);
  };

  const handleAddService = () => {
    if (!newService.activity || !newService.hours) return;
    setServiceLog(prev => [{
      id: Date.now().toString(),
      activity: newService.activity,
      hours: parseFloat(newService.hours),
      date: new Date(),
      verified: false
    }, ...prev]);
    setNewService({ activity: '', hours: '', description: '' });
    setAddServiceOpen(false);
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
            <h1 className="text-xl font-bold">Character Development</h1>
            <p className="text-xs text-gray-400">Build skills & values</p>
          </div>
        </div>
      </header>

      {/* Inspirational Quote */}
      <div className="container mx-auto px-4 py-4 max-w-2xl">
        <Card className="bg-gradient-to-r from-purple-900/30 to-cyan-900/30 border-purple-500/20">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Lightbulb className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm italic text-gray-300">"{currentQuote.quote}"</p>
                <p className="text-xs text-gray-500 mt-1">— {currentQuote.author}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 max-w-2xl">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 bg-slate-800/50 border border-slate-700 mb-4">
            <TabsTrigger value="badges" className="data-[state=active]:bg-purple-600">
              <Award className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">Badges</span>
            </TabsTrigger>
            <TabsTrigger value="goals" className="data-[state=active]:bg-purple-600">
              <Target className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">Goals</span>
            </TabsTrigger>
            <TabsTrigger value="service" className="data-[state=active]:bg-purple-600">
              <Heart className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">Service</span>
            </TabsTrigger>
            <TabsTrigger value="journal" className="data-[state=active]:bg-purple-600">
              <BookOpen className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">Journal</span>
            </TabsTrigger>
          </TabsList>

          {/* Badges Tab */}
          <TabsContent value="badges" className="space-y-4">
            {/* Earned Badges */}
            <div>
              <h2 className="text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
                <Trophy className="w-4 h-4 text-yellow-400" />
                Earned Badges ({earnedBadges.length})
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {earnedBadges.map((badge) => {
                  const badgeInfo = BADGE_TYPES[badge.type as keyof typeof BADGE_TYPES];
                  return (
                    <motion.div
                      key={badge.type}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      <Card className="bg-gradient-to-br from-purple-900/30 to-cyan-900/30 border-purple-500/30 overflow-hidden">
                        <CardContent className="p-4 text-center">
                          <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-br ${badgeInfo.color} flex items-center justify-center text-2xl mb-2`}>
                            {badgeInfo.icon}
                          </div>
                          <h3 className="font-semibold text-sm">{badgeInfo.name}</h3>
                          <p className="text-xs text-gray-400 mb-2">{badgeInfo.description}</p>
                          <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                            Level {badge.level}
                          </Badge>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* In Progress */}
            {inProgressBadges.length > 0 && (
              <div>
                <h2 className="text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
                  <Star className="w-4 h-4 text-cyan-400" />
                  In Progress
                </h2>
                <div className="grid gap-3">
                  {inProgressBadges.map((badge) => {
                    const badgeInfo = BADGE_TYPES[badge.type as keyof typeof BADGE_TYPES];
                    return (
                      <Card key={badge.type} className="bg-white/5 border-white/10">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${badgeInfo.color} opacity-50 flex items-center justify-center text-xl`}>
                              {badgeInfo.icon}
                            </div>
                            <div className="flex-1">
                              <h3 className="font-medium text-sm">{badgeInfo.name}</h3>
                              <Progress value={badge.progress} className="h-2 mt-2" />
                              <p className="text-xs text-gray-400 mt-1">{badge.progress}% complete</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}

            {/* All Available Badges */}
            <div>
              <h2 className="text-sm font-medium text-gray-400 mb-2">All Character Badges</h2>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                {Object.entries(BADGE_TYPES).map(([type, info]) => {
                  const earned = earnedBadges.some(b => b.type === type);
                  return (
                    <div
                      key={type}
                      className={cn(
                        "aspect-square rounded-lg flex flex-col items-center justify-center text-center p-1",
                        earned
                          ? `bg-gradient-to-br ${info.color}`
                          : "bg-white/5 opacity-40"
                      )}
                      title={info.name}
                    >
                      <span className="text-lg">{info.icon}</span>
                      <span className="text-[8px] mt-0.5 truncate w-full">{info.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </TabsContent>

          {/* Goals Tab */}
          <TabsContent value="goals" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-sm font-medium text-gray-400">Your Goals</h2>
              <Button
                size="sm"
                onClick={() => setAddGoalOpen(true)}
                className="bg-purple-600"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Goal
              </Button>
            </div>

            <div className="grid gap-3">
              {goals.map((goal) => (
                <Card key={goal.id} className="bg-white/5 border-white/10">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center",
                        goal.category === 'academic' && "bg-purple-500/20 text-purple-400",
                        goal.category === 'character' && "bg-green-500/20 text-green-400",
                        goal.category === 'wellness' && "bg-pink-500/20 text-pink-400",
                        goal.category === 'social' && "bg-cyan-500/20 text-cyan-400"
                      )}>
                        {goal.category === 'academic' && <BookOpen className="w-5 h-5" />}
                        {goal.category === 'character' && <Heart className="w-5 h-5" />}
                        {goal.category === 'wellness' && <Flame className="w-5 h-5" />}
                        {goal.category === 'social' && <Users className="w-5 h-5" />}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{goal.title}</h3>
                        <Progress value={goal.progress} className="h-2 mt-2" />
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-gray-400">{goal.progress}% complete</span>
                          {goal.targetDate && (
                            <span className="text-xs text-gray-500">
                              Due {goal.targetDate.toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Service Tab */}
          <TabsContent value="service" className="space-y-4">
            <Card className="bg-gradient-to-r from-green-900/30 to-teal-900/30 border-green-500/20">
              <CardContent className="p-6 text-center">
                <p className="text-4xl font-bold text-green-400">{totalServiceHours}</p>
                <p className="text-gray-400">Community Service Hours</p>
              </CardContent>
            </Card>

            <div className="flex justify-between items-center">
              <h2 className="text-sm font-medium text-gray-400">Service Log</h2>
              <Button
                size="sm"
                onClick={() => setAddServiceOpen(true)}
                className="bg-green-600"
              >
                <Plus className="w-4 h-4 mr-1" />
                Log Hours
              </Button>
            </div>

            <div className="grid gap-3">
              {serviceLog.map((service) => (
                <Card key={service.id} className="bg-white/5 border-white/10">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                        <Heart className="w-5 h-5 text-green-400" />
                      </div>
                      <div>
                        <h3 className="font-medium">{service.activity}</h3>
                        <p className="text-xs text-gray-400">
                          {service.date.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-400">{service.hours}h</p>
                      {service.verified ? (
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Verified
                        </Badge>
                      ) : (
                        <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 text-xs">
                          Pending
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Journal Tab */}
          <TabsContent value="journal" className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-sm font-medium text-gray-400">Reflection Journal</h2>
                <p className="text-xs text-gray-500">Private notes for your growth journey</p>
              </div>
              <Button
                size="sm"
                onClick={() => setAddJournalOpen(true)}
                className="bg-cyan-600"
              >
                <Plus className="w-4 h-4 mr-1" />
                New Entry
              </Button>
            </div>

            <div className="grid gap-3">
              {journalEntries.map((entry) => (
                <Card key={entry.id} className="bg-white/5 border-white/10">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-medium">{entry.title}</h3>
                        <p className="text-xs text-gray-500">{entry.date.toLocaleDateString()}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map(star => (
                          <Star
                            key={star}
                            className={cn(
                              "w-4 h-4",
                              star <= entry.mood ? "text-yellow-400 fill-yellow-400" : "text-gray-600"
                            )}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-gray-300">{entry.content}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Add Goal Dialog */}
      <Dialog open={addGoalOpen} onOpenChange={setAddGoalOpen}>
        <DialogContent className="bg-slate-900 border-white/10 text-white max-w-md">
          <DialogHeader>
            <DialogTitle>Add a New Goal</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Goal Title</Label>
              <Input
                value={newGoal.title}
                onChange={(e) => setNewGoal(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., Master calculus derivatives"
                className="bg-white/5 border-white/10"
              />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={newGoal.category} onValueChange={(v) => setNewGoal(prev => ({ ...prev, category: v }))}>
                <SelectTrigger className="bg-white/5 border-white/10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="academic">📚 Academic</SelectItem>
                  <SelectItem value="character">❤️ Character</SelectItem>
                  <SelectItem value="wellness">🧘 Wellness</SelectItem>
                  <SelectItem value="social">👥 Social</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Target Date (optional)</Label>
              <Input
                type="date"
                value={newGoal.targetDate}
                onChange={(e) => setNewGoal(prev => ({ ...prev, targetDate: e.target.value }))}
                className="bg-white/5 border-white/10"
              />
            </div>
            <Button onClick={handleAddGoal} className="w-full bg-purple-600">Add Goal</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Journal Dialog */}
      <Dialog open={addJournalOpen} onOpenChange={setAddJournalOpen}>
        <DialogContent className="bg-slate-900 border-white/10 text-white max-w-md">
          <DialogHeader>
            <DialogTitle>Reflection Entry</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Title (optional)</Label>
              <Input
                value={newJournal.title}
                onChange={(e) => setNewJournal(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., Today's progress"
                className="bg-white/5 border-white/10"
              />
            </div>
            <div className="space-y-2">
              <Label>How are you feeling?</Label>
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map(mood => (
                  <button
                    key={mood}
                    onClick={() => setNewJournal(prev => ({ ...prev, mood }))}
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all",
                      newJournal.mood === mood
                        ? "bg-purple-600 scale-110"
                        : "bg-white/5 hover:bg-white/10"
                    )}
                  >
                    {mood === 1 && '😔'}
                    {mood === 2 && '😕'}
                    {mood === 3 && '😐'}
                    {mood === 4 && '🙂'}
                    {mood === 5 && '😊'}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Your thoughts</Label>
              <Textarea
                value={newJournal.content}
                onChange={(e) => setNewJournal(prev => ({ ...prev, content: e.target.value }))}
                placeholder="What's on your mind?"
                className="bg-white/5 border-white/10 min-h-[120px]"
              />
            </div>
            <Button onClick={handleAddJournal} className="w-full bg-cyan-600">Save Entry</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Service Dialog */}
      <Dialog open={addServiceOpen} onOpenChange={setAddServiceOpen}>
        <DialogContent className="bg-slate-900 border-white/10 text-white max-w-md">
          <DialogHeader>
            <DialogTitle>Log Community Service</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Activity</Label>
              <Input
                value={newService.activity}
                onChange={(e) => setNewService(prev => ({ ...prev, activity: e.target.value }))}
                placeholder="e.g., Peer tutoring"
                className="bg-white/5 border-white/10"
              />
            </div>
            <div className="space-y-2">
              <Label>Hours</Label>
              <Input
                type="number"
                step="0.5"
                value={newService.hours}
                onChange={(e) => setNewService(prev => ({ ...prev, hours: e.target.value }))}
                placeholder="2"
                className="bg-white/5 border-white/10"
              />
            </div>
            <div className="space-y-2">
              <Label>Description (optional)</Label>
              <Textarea
                value={newService.description}
                onChange={(e) => setNewService(prev => ({ ...prev, description: e.target.value }))}
                placeholder="What did you do?"
                className="bg-white/5 border-white/10 min-h-[80px]"
              />
            </div>
            <Button onClick={handleAddService} className="w-full bg-green-600">Log Hours</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
