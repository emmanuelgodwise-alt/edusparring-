'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users, Shield, Clock, TrendingUp, AlertTriangle, ChevronRight,
  ArrowLeft, Bell, BookOpen, Award, Heart, MessageCircle, Eye,
  CheckCircle2, XCircle, Calendar, BarChart3
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { cn } from '@/lib/utils';

// Mock data - child's activity
const CHILD_DATA = {
  name: 'Alex',
  grade: '10th Grade',
  school: 'Lincoln High School',
  avatar: null,
  stats: {
    totalSessions: 45,
    totalStudyTime: 1200, // minutes
    subjectsStudied: ['Math', 'Physics', 'Chemistry'],
    currentStreak: 7,
    avgMood: 4.2,
    badges: 5,
  }
};

const WEEKLY_ACTIVITY = [
  { day: 'Mon', study: 45, battles: 2 },
  { day: 'Tue', study: 30, battles: 1 },
  { day: 'Wed', study: 60, battles: 3 },
  { day: 'Thu', study: 25, battles: 0 },
  { day: 'Fri', study: 55, battles: 2 },
  { day: 'Sat', study: 40, battles: 1 },
  { day: 'Sun', study: 35, battles: 2 },
];

const RECENT_ACHIEVEMENTS = [
  { id: '1', type: 'badge', title: 'Earned "Helper" Badge', time: '2 hours ago' },
  { id: '2', type: 'battle', title: 'Won Math battle against Jordan', time: '4 hours ago' },
  { id: '3', type: 'study', title: 'Completed Physics study session', time: 'Yesterday' },
  { id: '4', type: 'tutoring', title: 'Peer tutoring session completed', time: '2 days ago' },
];

const SAFETY_ALERTS = [
  // Empty for demo - would show real alerts
];

const UPCOMING_SESSIONS = [
  { id: '1', subject: 'Math', tutor: 'Taylor S.', time: 'Today, 4:00 PM' },
  { id: '2', subject: 'Chemistry', tutor: 'Jordan K.', time: 'Tomorrow, 3:00 PM' },
];

export default function GuardianPage() {
  const [activeTab, setActiveTab] = useState('overview');

  const totalWeeklyStudy = WEEKLY_ACTIVITY.reduce((sum, d) => sum + d.study, 0);
  const totalWeeklyBattles = WEEKLY_ACTIVITY.reduce((sum, d) => sum + d.battles, 0);

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
          <Link href="/safety">
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-xl font-bold">Guardian Dashboard</h1>
            <p className="text-xs text-gray-400">Monitor your child&apos;s progress</p>
          </div>
          <Button variant="ghost" size="icon" className="text-gray-400">
            <Bell className="w-5 h-5" />
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-4 max-w-2xl">
        {/* Child Profile */}
        <Card className="bg-gradient-to-r from-purple-900/30 to-cyan-900/30 border-purple-500/20 mb-6">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-2xl font-bold">
                {CHILD_DATA.name.charAt(0)}
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold">{CHILD_DATA.name}</h2>
                <p className="text-sm text-gray-400">{CHILD_DATA.grade} • {CHILD_DATA.school}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Verified Student
                  </Badge>
                  <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                    🔥 {CHILD_DATA.stats.currentStreak} day streak
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 bg-slate-800/50 border border-slate-700 mb-4">
            <TabsTrigger value="overview" className="data-[state=active]:bg-purple-600">
              <Eye className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="activity" className="data-[state=active]:bg-purple-600">
              <BarChart3 className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">Activity</span>
            </TabsTrigger>
            <TabsTrigger value="academic" className="data-[state=active]:bg-purple-600">
              <BookOpen className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">Academic</span>
            </TabsTrigger>
            <TabsTrigger value="safety" className="data-[state=active]:bg-purple-600">
              <Shield className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">Safety</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Card className="bg-white/5 border-white/10">
                <CardContent className="p-3 text-center">
                  <Clock className="w-5 h-5 mx-auto mb-1 text-cyan-400" />
                  <p className="text-lg font-bold">{Math.round(CHILD_DATA.stats.totalStudyTime / 60)}h</p>
                  <p className="text-xs text-gray-400">Study Time</p>
                </CardContent>
              </Card>
              <Card className="bg-white/5 border-white/10">
                <CardContent className="p-3 text-center">
                  <TrendingUp className="w-5 h-5 mx-auto mb-1 text-green-400" />
                  <p className="text-lg font-bold">{CHILD_DATA.stats.totalSessions}</p>
                  <p className="text-xs text-gray-400">Sessions</p>
                </CardContent>
              </Card>
              <Card className="bg-white/5 border-white/10">
                <CardContent className="p-3 text-center">
                  <Award className="w-5 h-5 mx-auto mb-1 text-yellow-400" />
                  <p className="text-lg font-bold">{CHILD_DATA.stats.badges}</p>
                  <p className="text-xs text-gray-400">Badges</p>
                </CardContent>
              </Card>
              <Card className="bg-white/5 border-white/10">
                <CardContent className="p-3 text-center">
                  <Heart className="w-5 h-5 mx-auto mb-1 text-pink-400" />
                  <p className="text-lg font-bold">{CHILD_DATA.stats.avgMood}</p>
                  <p className="text-xs text-gray-400">Avg Mood</p>
                </CardContent>
              </Card>
            </div>

            {/* Weekly Summary */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">This Week</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-end justify-between h-24 gap-1">
                  {WEEKLY_ACTIVITY.map((day) => (
                    <div key={day.day} className="flex-1 flex flex-col items-center gap-1">
                      <div className="w-full flex flex-col gap-0.5" style={{ height: '80px' }}>
                        <div
                          className="w-full bg-cyan-500 rounded-t"
                          style={{ height: `${(day.study / 60) * 100}%` }}
                        />
                        <div
                          className="w-full bg-purple-500 rounded-b"
                          style={{ height: `${day.battles * 10}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-400">{day.day}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-center gap-6 mt-3">
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-3 h-3 rounded bg-cyan-500" />
                    <span className="text-gray-400">Study ({totalWeeklyStudy}m)</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-3 h-3 rounded bg-purple-500" />
                    <span className="text-gray-400">Battles ({totalWeeklyBattles})</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Achievements */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {RECENT_ACHIEVEMENTS.map((achievement) => (
                    <div key={achievement.id} className="flex items-center gap-3">
                      <div className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center",
                        achievement.type === 'badge' && "bg-yellow-500/20",
                        achievement.type === 'battle' && "bg-purple-500/20",
                        achievement.type === 'study' && "bg-cyan-500/20",
                        achievement.type === 'tutoring' && "bg-green-500/20"
                      )}>
                        {achievement.type === 'badge' && <Award className="w-4 h-4 text-yellow-400" />}
                        {achievement.type === 'battle' && <TrendingUp className="w-4 h-4 text-purple-400" />}
                        {achievement.type === 'study' && <BookOpen className="w-4 h-4 text-cyan-400" />}
                        {achievement.type === 'tutoring' && <Users className="w-4 h-4 text-green-400" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm">{achievement.title}</p>
                        <p className="text-xs text-gray-500">{achievement.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity" className="space-y-4">
            {/* Screen Time */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Screen Time</CardTitle>
                <CardDescription>Daily usage on EduSparring</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-cyan-400">{Math.round(totalWeeklyStudy / 60)}h</p>
                    <p className="text-xs text-gray-400">This Week</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-400">{Math.round(totalWeeklyStudy / 7)}m</p>
                    <p className="text-xs text-gray-400">Daily Average</p>
                  </div>
                </div>
                <Progress value={70} className="h-2" />
                <p className="text-xs text-gray-400 mt-2 text-center">70% of daily limit (2h)</p>
              </CardContent>
            </Card>

            {/* Study Subjects */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Subjects Studied</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {CHILD_DATA.stats.subjectsStudied.map((subject) => (
                    <Badge key={subject} variant="outline" className="bg-white/5 border-white/10">
                      {subject === 'Math' && '📐'}
                      {subject === 'Physics' && '⚛️'}
                      {subject === 'Chemistry' && '🧪'}
                      {' '}{subject}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Sessions */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Upcoming Tutoring</CardTitle>
              </CardHeader>
              <CardContent>
                {UPCOMING_SESSIONS.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-4">No upcoming sessions</p>
                ) : (
                  <div className="space-y-3">
                    {UPCOMING_SESSIONS.map((session) => (
                      <div key={session.id} className="flex items-center gap-3 p-2 bg-white/5 rounded-lg">
                        <Calendar className="w-5 h-5 text-purple-400" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">{session.subject} with {session.tutor}</p>
                          <p className="text-xs text-gray-400">{session.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Academic Tab */}
          <TabsContent value="academic" className="space-y-4">
            {/* Knowledge Rating */}
            <Card className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 border-yellow-500/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Knowledge Rating</p>
                    <p className="text-3xl font-bold text-yellow-400">1,250</p>
                    <p className="text-xs text-gray-400">Intermediate Tier</p>
                  </div>
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center">
                    <TrendingUp className="w-8 h-8 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Performance by Subject */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Performance by Subject</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { subject: 'Math', score: 85, trend: 'up' },
                  { subject: 'Physics', score: 78, trend: 'up' },
                  { subject: 'Chemistry', score: 72, trend: 'stable' },
                ].map((item) => (
                  <div key={item.subject}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{item.subject}</span>
                      <span className="text-gray-400">{item.score}%</span>
                    </div>
                    <Progress value={item.score} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Character Badges */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Character Badges</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {['✅ Verified', '🤝 Helper', '📚 Scholar', '🎓 Mentor', '👑 Leader'].map((badge) => (
                    <Badge key={badge} variant="outline" className="bg-purple-500/10 border-purple-500/30">
                      {badge}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Goals Progress */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Current Goals</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { title: 'Complete 10 Math sessions', progress: 70 },
                  { title: 'Help 5 students in tutoring', progress: 40 },
                ].map((goal) => (
                  <div key={goal.title}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{goal.title}</span>
                      <span className="text-gray-400">{goal.progress}%</span>
                    </div>
                    <Progress value={goal.progress} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Safety Tab */}
          <TabsContent value="safety" className="space-y-4">
            {/* Safety Status */}
            <Card className="bg-gradient-to-r from-green-900/30 to-teal-900/30 border-green-500/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                    <Shield className="w-6 h-6 text-green-400" />
                  </div>
                  <div>
                    <p className="font-semibold">All Clear</p>
                    <p className="text-sm text-gray-400">No safety concerns detected</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Safety Alerts */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-400" />
                  Safety Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                {SAFETY_ALERTS.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-4">
                    No alerts to display. Your child&apos;s activity has been positive.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {SAFETY_ALERTS.map((alert: { id: string; message: string; time: string }) => (
                      <div key={alert.id} className="p-2 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                        <p className="text-sm">{alert.message}</p>
                        <p className="text-xs text-gray-500">{alert.time}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Safety Settings */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Monitoring Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">Weekly Reports</p>
                    <p className="text-xs text-gray-400">Receive weekly activity summary</p>
                  </div>
                  <Badge className="bg-green-500/20 text-green-400">Enabled</Badge>
                </div>
                <Separator className="bg-white/10" />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">Safety Alerts</p>
                    <p className="text-xs text-gray-400">Instant notifications for concerns</p>
                  </div>
                  <Badge className="bg-green-500/20 text-green-400">Enabled</Badge>
                </div>
                <Separator className="bg-white/10" />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">Screen Time Alerts</p>
                    <p className="text-xs text-gray-400">Notified when limits exceeded</p>
                  </div>
                  <Badge className="bg-green-500/20 text-green-400">Enabled</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Communication */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">School Communication</CardTitle>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full border-purple-500/30 text-purple-400">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Contact School Counselor
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
