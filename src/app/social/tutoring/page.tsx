'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  GraduationCap, BookOpen, Clock, Star, ChevronRight, ArrowLeft,
  Calendar, User, Filter, Search, Plus, Loader2, MessageCircle,
  CheckCircle2, XCircle, Timer, Award, Users
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
import {
  Avatar,
  AvatarFallback,
} from '@/components/ui/avatar';
import Link from 'next/link';
import { cn } from '@/lib/utils';

// Subject icons
const SUBJECT_ICONS: Record<string, string> = {
  Math: '📐', Physics: '⚛️', Chemistry: '🧪', Biology: '🧬',
  History: '📜', Geography: '🌍', Literature: '📚', Computer: '💻'
};

// Mock tutors
const MOCK_TUTORS = [
  { id: '1', name: 'Alex M.', knowledgeRating: 1450, subjects: ['Math', 'Physics'], sessions: 28, rating: 4.9, avatar: null },
  { id: '2', name: 'Jordan K.', knowledgeRating: 1320, subjects: ['Chemistry', 'Biology'], sessions: 15, rating: 4.7, avatar: null },
  { id: '3', name: 'Taylor S.', knowledgeRating: 1580, subjects: ['Math', 'Computer'], sessions: 42, rating: 4.95, avatar: null },
  { id: '4', name: 'Casey L.', knowledgeRating: 1280, subjects: ['History', 'Literature'], sessions: 12, rating: 4.8, avatar: null },
];

// Mock sessions
const MOCK_SESSIONS = [
  {
    id: '1',
    tutorId: '1',
    studentId: 'current',
    tutor: MOCK_TUTORS[0],
    subject: 'Math',
    scheduledAt: new Date(Date.now() + 3600000 * 2),
    duration: 30,
    status: 'scheduled',
    notes: 'Help with calculus derivatives'
  },
  {
    id: '2',
    tutorId: '3',
    studentId: 'current',
    tutor: MOCK_TUTORS[2],
    subject: 'Physics',
    scheduledAt: new Date(Date.now() - 86400000),
    duration: 45,
    status: 'completed',
    rating: 5,
    feedback: 'Great explanation of quantum mechanics!'
  },
];

const SUBJECTS = ['Math', 'Physics', 'Chemistry', 'Biology', 'History', 'Geography', 'Literature', 'Computer'];
const TIME_SLOTS = ['Today 3:00 PM', 'Today 4:00 PM', 'Today 5:00 PM', 'Tomorrow 10:00 AM', 'Tomorrow 2:00 PM'];

export default function PeerTutoringPage() {
  const [activeTab, setActiveTab] = useState('find');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [bookDialogOpen, setBookDialogOpen] = useState(false);
  const [selectedTutor, setSelectedTutor] = useState<typeof MOCK_TUTORS[0] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [bookingData, setBookingData] = useState({
    subject: '',
    time: '',
    notes: ''
  });
  const [sessions, setSessions] = useState(MOCK_SESSIONS);

  const filteredTutors = MOCK_TUTORS.filter(tutor => {
    if (selectedSubject !== 'all' && !tutor.subjects.includes(selectedSubject)) return false;
    if (searchQuery && !tutor.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const upcomingSessions = sessions.filter(s => s.status === 'scheduled');
  const pastSessions = sessions.filter(s => s.status === 'completed');

  const handleBookSession = async () => {
    if (!selectedTutor || !bookingData.subject || !bookingData.time) return;
    
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const newSession = {
      id: Date.now().toString(),
      tutorId: selectedTutor.id,
      studentId: 'current',
      tutor: selectedTutor,
      subject: bookingData.subject,
      scheduledAt: new Date(Date.now() + 3600000),
      duration: 30,
      status: 'scheduled' as const,
      notes: bookingData.notes
    };
    
    setSessions(prev => [newSession, ...prev]);
    setBookDialogOpen(false);
    setBookingData({ subject: '', time: '', notes: '' });
    setIsLoading(false);
  };

  const handleCompleteSession = (sessionId: string, rating: number, feedback: string) => {
    setSessions(prev => prev.map(s => {
      if (s.id === sessionId) {
        return { ...s, status: 'completed', rating, feedback };
      }
      return s;
    }));
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    if (date.toDateString() === today.toDateString()) return 'Today';
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
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
            <h1 className="text-xl font-bold">Peer Tutoring</h1>
            <p className="text-xs text-gray-400">Learn from fellow students</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-4 max-w-2xl">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 bg-slate-800/50 border border-slate-700 mb-4">
            <TabsTrigger value="find" className="data-[state=active]:bg-purple-600">
              <Search className="w-4 h-4 mr-1" />
              Find Tutor
            </TabsTrigger>
            <TabsTrigger value="sessions" className="data-[state=active]:bg-purple-600">
              <Calendar className="w-4 h-4 mr-1" />
              Sessions
            </TabsTrigger>
            <TabsTrigger value="offer" className="data-[state=active]:bg-purple-600">
              <GraduationCap className="w-4 h-4 mr-1" />
              Offer Help
            </TabsTrigger>
          </TabsList>

          {/* Find Tutor Tab */}
          <TabsContent value="find" className="space-y-4">
            {/* Search and Filter */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search tutors..."
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

            {/* Tutors List */}
            <div className="grid gap-3">
              {filteredTutors.map((tutor) => (
                <motion.div
                  key={tutor.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Avatar className="w-12 h-12">
                          <AvatarFallback className="bg-gradient-to-br from-purple-500 to-cyan-500 text-white font-bold">
                            {tutor.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{tutor.name}</h3>
                            <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 text-xs">
                              ⭐ {tutor.rating}
                            </Badge>
                          </div>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {tutor.subjects.map(s => (
                              <Badge key={s} variant="outline" className="text-xs bg-white/5 border-white/10">
                                {SUBJECT_ICONS[s]} {s}
                              </Badge>
                            ))}
                          </div>
                          <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                            <span className="flex items-center gap-1">
                              <Award className="w-3 h-3 text-purple-400" />
                              {tutor.knowledgeRating} KR
                            </span>
                            <span className="flex items-center gap-1">
                              <GraduationCap className="w-3 h-3 text-cyan-400" />
                              {tutor.sessions} sessions
                            </span>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => {
                            setSelectedTutor(tutor);
                            setBookingData(prev => ({ ...prev, subject: tutor.subjects[0] }));
                            setBookDialogOpen(true);
                          }}
                          className="bg-gradient-to-r from-purple-600 to-cyan-600"
                        >
                          Book
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Sessions Tab */}
          <TabsContent value="sessions" className="space-y-4">
            {/* Upcoming Sessions */}
            {upcomingSessions.length > 0 && (
              <div>
                <h2 className="text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-cyan-400" />
                  Upcoming Sessions
                </h2>
                <div className="grid gap-3">
                  {upcomingSessions.map((session) => (
                    <Card key={session.id} className="bg-gradient-to-r from-purple-900/30 to-cyan-900/30 border-purple-500/20">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <Avatar className="w-10 h-10">
                            <AvatarFallback className="bg-gradient-to-br from-purple-500 to-cyan-500 text-white font-bold">
                              {session.tutor.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <p className="font-medium">{session.tutor.name}</p>
                            <div className="flex items-center gap-2 text-sm text-gray-400">
                              <span>{SUBJECT_ICONS[session.subject]} {session.subject}</span>
                              <span>•</span>
                              <span>{formatDate(session.scheduledAt)} at {formatTime(session.scheduledAt)}</span>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">{session.notes}</p>
                          </div>
                          <div className="flex flex-col gap-2">
                            <Button size="sm" className="bg-green-600 hover:bg-green-500">
                              <CheckCircle2 className="w-4 h-4 mr-1" />
                              Join
                            </Button>
                            <Button size="sm" variant="outline" className="border-red-500/30 text-red-400">
                              Cancel
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Past Sessions */}
            {pastSessions.length > 0 && (
              <div>
                <h2 className="text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                  Past Sessions
                </h2>
                <div className="grid gap-3">
                  {pastSessions.map((session) => (
                    <Card key={session.id} className="bg-white/5 border-white/10">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <Avatar className="w-10 h-10">
                            <AvatarFallback className="bg-gradient-to-br from-purple-500 to-cyan-500 text-white font-bold">
                              {session.tutor.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <p className="font-medium">{session.tutor.name}</p>
                            <div className="flex items-center gap-2 text-sm text-gray-400">
                              <span>{SUBJECT_ICONS[session.subject]} {session.subject}</span>
                              <span>•</span>
                              <span>{formatDate(session.scheduledAt)}</span>
                            </div>
                            <div className="flex items-center gap-1 mt-1">
                              {[1, 2, 3, 4, 5].map(star => (
                                <Star
                                  key={star}
                                  className={cn(
                                    "w-4 h-4",
                                    star <= (session.rating || 0) ? "text-yellow-400 fill-yellow-400" : "text-gray-500"
                                  )}
                                />
                              ))}
                            </div>
                            {session.feedback && (
                              <p className="text-xs text-gray-500 mt-1 italic">"{session.feedback}"</p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {sessions.length === 0 && (
              <Card className="bg-white/5 border-white/10">
                <CardContent className="p-8 text-center">
                  <Calendar className="w-12 h-12 mx-auto text-gray-500 mb-3" />
                  <p className="text-gray-400">No tutoring sessions yet</p>
                  <Button
                    onClick={() => setActiveTab('find')}
                    variant="outline"
                    className="mt-3 border-purple-500/30 text-purple-400"
                  >
                    Find a Tutor
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Offer Help Tab */}
          <TabsContent value="offer" className="space-y-4">
            <Card className="bg-gradient-to-br from-purple-900/30 to-cyan-900/30 border-purple-500/20">
              <CardContent className="p-6 text-center">
                <GraduationCap className="w-16 h-16 mx-auto mb-4 text-purple-400" />
                <h2 className="text-xl font-bold mb-2">Become a Peer Tutor</h2>
                <p className="text-gray-400 mb-4">
                  Share your knowledge and help fellow students succeed!
                </p>
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-400">1,250</p>
                    <p className="text-xs text-gray-400">Your KR</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-cyan-400">0</p>
                    <p className="text-xs text-gray-400">Sessions</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-400">-</p>
                    <p className="text-xs text-gray-400">Rating</p>
                  </div>
                </div>
                <Button className="w-full bg-gradient-to-r from-purple-600 to-cyan-600">
                  <Plus className="w-4 h-4 mr-2" />
                  Start Tutoring
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                    <span>KR rating of 1000+ (You have 1250 ✓)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                    <span>Verified student status ✓</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                    <span>Good conduct record ✓</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Benefits</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-yellow-400" />
                    Earn the "Mentor" character badge
                  </li>
                  <li className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-cyan-400" />
                    Gain recognition in the community
                  </li>
                  <li className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-purple-400" />
                    Build teaching experience
                  </li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Book Session Dialog */}
      <Dialog open={bookDialogOpen} onOpenChange={setBookDialogOpen}>
        <DialogContent className="bg-slate-900 border-white/10 text-white max-w-md">
          {selectedTutor && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback className="bg-gradient-to-br from-purple-500 to-cyan-500 text-white font-bold">
                      {selectedTutor.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <DialogTitle>Book with {selectedTutor.name}</DialogTitle>
                    <DialogDescription className="text-gray-400">
                      ⭐ {selectedTutor.rating} • {selectedTutor.sessions} sessions
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Subject</Label>
                  <Select
                    value={bookingData.subject}
                    onValueChange={(value) => setBookingData(prev => ({ ...prev, subject: value }))}
                  >
                    <SelectTrigger className="bg-white/5 border-white/10">
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedTutor.subjects.map(s => (
                        <SelectItem key={s} value={s}>{SUBJECT_ICONS[s]} {s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Time</Label>
                  <Select
                    value={bookingData.time}
                    onValueChange={(value) => setBookingData(prev => ({ ...prev, time: value }))}
                  >
                    <SelectTrigger className="bg-white/5 border-white/10">
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      {TIME_SLOTS.map(t => (
                        <SelectItem key={t} value={t}>{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Notes (optional)</Label>
                  <Textarea
                    value={bookingData.notes}
                    onChange={(e) => setBookingData(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="What would you like help with?"
                    className="bg-white/5 border-white/10 min-h-[80px]"
                  />
                </div>

                <Button
                  onClick={handleBookSession}
                  disabled={!bookingData.subject || !bookingData.time || isLoading}
                  className="w-full bg-gradient-to-r from-purple-600 to-cyan-600"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <Calendar className="w-4 h-4 mr-2" />
                  )}
                  Book Session
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
