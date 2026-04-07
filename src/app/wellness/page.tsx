'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Moon, Sun, Clock, Heart, Brain, Phone, ChevronRight, ArrowLeft,
  Timer, Zap, Bell, TrendingUp, AlertTriangle, CheckCircle2, Loader2,
  MessageCircle, Coffee, BookOpen, Music
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Link from 'next/link';
import { cn } from '@/lib/utils';

// Mock data
const MOCK_MOOD_HISTORY = [
  { date: new Date(Date.now() - 86400000 * 6), mood: 4 },
  { date: new Date(Date.now() - 86400000 * 5), mood: 3 },
  { date: new Date(Date.now() - 86400000 * 4), mood: 5 },
  { date: new Date(Date.now() - 86400000 * 3), mood: 4 },
  { date: new Date(Date.now() - 86400000 * 2), mood: 3 },
  { date: new Date(Date.now() - 86400000), mood: 4 },
];

const SCREEN_TIME_DATA = {
  today: 85,
  dailyLimit: 120,
  weekly: [
    { day: 'Mon', minutes: 95 },
    { day: 'Tue', minutes: 72 },
    { day: 'Wed', minutes: 110 },
    { day: 'Thu', minutes: 88 },
    { day: 'Fri', minutes: 65 },
    { day: 'Sat', minutes: 120 },
    { day: 'Sun', minutes: 85 },
  ]
};

const STRESS_ACTIVITIES = [
  { name: 'Deep Breathing', duration: '2 min', icon: Brain, color: 'text-purple-400' },
  { name: 'Quick Stretch', duration: '3 min', icon: Zap, color: 'text-cyan-400' },
  { name: 'Mindful Moment', duration: '5 min', icon: Heart, color: 'text-pink-400' },
  { name: 'Take a Walk', duration: '10 min', icon: Coffee, color: 'text-green-400' },
];

export default function WellnessPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [focusMode, setFocusMode] = useState(false);
  const [screenTimeLimit, setScreenTimeLimit] = useState(120);
  const [sleepReminder, setSleepReminder] = useState('22:00');
  const [breakReminders, setBreakReminders] = useState(true);
  const [mindfulnessPrompts, setMindfulnessPrompts] = useState(true);
  const [todayMood, setTodayMood] = useState<number | null>(null);
  const [showMoodCheckin, setShowMoodCheckin] = useState(false);
  const [moodNotes, setMoodNotes] = useState('');
  const [focusTimer, setFocusTimer] = useState(25);
  const [focusTimeRemaining, setFocusTimeRemaining] = useState(0);
  const [isFocusActive, setIsFocusActive] = useState(false);

  const screenTimePercent = (SCREEN_TIME_DATA.today / screenTimeLimit) * 100;
  const avgWeeklyTime = Math.round(SCREEN_TIME_DATA.weekly.reduce((a, b) => a + b.minutes, 0) / 7);

  const handleMoodCheckin = () => {
    // Save mood check-in
    console.log('Mood check-in:', { mood: todayMood, notes: moodNotes });
    setShowMoodCheckin(false);
  };

  const startFocusSession = () => {
    setFocusTimeRemaining(focusTimer * 60);
    setIsFocusActive(true);
    setFocusMode(true);
  };

  const endFocusSession = () => {
    setIsFocusActive(false);
    setFocusTimeRemaining(0);
    setFocusMode(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 text-white pb-20">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>

      {/* Focus Mode Overlay */}
      {isFocusActive && (
        <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col items-center justify-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center"
          >
            <div className="w-48 h-48 mx-auto mb-6 rounded-full border-4 border-purple-500 flex items-center justify-center">
              <span className="text-5xl font-bold">{focusTimer}:00</span>
            </div>
            <h2 className="text-2xl font-bold mb-2">Focus Mode Active</h2>
            <p className="text-gray-400 mb-8">Stay focused, you&apos;re doing great!</p>
            <Button onClick={endFocusSession} variant="outline" size="lg" className="border-white/20">
              End Session
            </Button>
          </motion.div>
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-black/30 border-b border-white/10">
        <div className="container mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/social">
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-xl font-bold">Wellness Dashboard</h1>
            <p className="text-xs text-gray-400">Take care of yourself</p>
          </div>
          {focusMode && !isFocusActive && (
            <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 animate-pulse">
              Focus Mode On
            </Badge>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-4 max-w-2xl">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 bg-slate-800/50 border border-slate-700 mb-4">
            <TabsTrigger value="overview" className="data-[state=active]:bg-purple-600">
              <Heart className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="screen" className="data-[state=active]:bg-purple-600">
              <Clock className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">Screen</span>
            </TabsTrigger>
            <TabsTrigger value="mood" className="data-[state=active]:bg-purple-600">
              <Brain className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">Mood</span>
            </TabsTrigger>
            <TabsTrigger value="focus" className="data-[state=active]:bg-purple-600">
              <Zap className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">Focus</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            {/* Today's Mood */}
            <Card className="bg-gradient-to-br from-pink-900/30 to-purple-900/30 border-pink-500/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-pink-500/20 flex items-center justify-center">
                      <span className="text-2xl">{todayMood ? ['😔', '😕', '😐', '🙂', '😊'][todayMood - 1] : '🤔'}</span>
                    </div>
                    <div>
                      <p className="font-medium">Today&apos;s Check-in</p>
                      <p className="text-sm text-gray-400">
                        {todayMood ? 'Mood recorded' : 'How are you feeling?'}
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={() => setShowMoodCheckin(true)}
                    variant="outline"
                    className="border-pink-500/30 text-pink-400"
                  >
                    {todayMood ? 'Update' : 'Check In'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-3">
              <Card className="bg-white/5 border-white/10">
                <CardContent className="p-3 text-center">
                  <Clock className="w-6 h-6 mx-auto mb-1 text-cyan-400" />
                  <p className="text-lg font-bold">{SCREEN_TIME_DATA.today}m</p>
                  <p className="text-xs text-gray-400">Screen Today</p>
                </CardContent>
              </Card>
              <Card className="bg-white/5 border-white/10">
                <CardContent className="p-3 text-center">
                  <TrendingUp className="w-6 h-6 mx-auto mb-1 text-green-400" />
                  <p className="text-lg font-bold">{avgWeeklyTime}m</p>
                  <p className="text-xs text-gray-400">Daily Avg</p>
                </CardContent>
              </Card>
              <Card className="bg-white/5 border-white/10">
                <CardContent className="p-3 text-center">
                  <Heart className="w-6 h-6 mx-auto mb-1 text-pink-400" />
                  <p className="text-lg font-bold">4.1</p>
                  <p className="text-xs text-gray-400">Avg Mood</p>
                </CardContent>
              </Card>
            </div>

            {/* Focus Mode Toggle */}
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                      <Zap className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <p className="font-medium">Focus Mode</p>
                      <p className="text-xs text-gray-400">Block distractions while studying</p>
                    </div>
                  </div>
                  <Switch
                    checked={focusMode}
                    onCheckedChange={setFocusMode}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Stress Relief Activities */}
            <div>
              <h2 className="text-sm font-medium text-gray-400 mb-2">Quick Stress Relief</h2>
              <div className="grid grid-cols-2 gap-3">
                {STRESS_ACTIVITIES.map((activity) => (
                  <Card key={activity.name} className="bg-white/5 border-white/10 cursor-pointer hover:bg-white/10 transition-colors">
                    <CardContent className="p-3 flex items-center gap-3">
                      <activity.icon className={cn('w-5 h-5', activity.color)} />
                      <div>
                        <p className="text-sm font-medium">{activity.name}</p>
                        <p className="text-xs text-gray-400">{activity.duration}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Counselor Connect */}
            <Card className="bg-gradient-to-r from-cyan-900/30 to-blue-900/30 border-cyan-500/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                      <MessageCircle className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div>
                      <p className="font-medium">Talk to a Counselor</p>
                      <p className="text-xs text-gray-400">Available 24/7 for support</p>
                    </div>
                  </div>
                  <Button className="bg-cyan-600 hover:bg-cyan-500">
                    Connect
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Screen Time Tab */}
          <TabsContent value="screen" className="space-y-4">
            {/* Today's Usage */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Today&apos;s Screen Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-4">
                  <p className="text-4xl font-bold">{SCREEN_TIME_DATA.today}</p>
                  <p className="text-gray-400">of {screenTimeLimit} minutes</p>
                </div>
                <Progress 
                  value={screenTimePercent} 
                  className={cn(
                    "h-3",
                    screenTimePercent > 100 && "[&>div]:bg-red-500",
                    screenTimePercent > 80 && "[&>div]:bg-yellow-500"
                  )}
                />
                {screenTimePercent > 80 && (
                  <p className="text-xs text-yellow-400 mt-2 text-center">
                    {screenTimePercent >= 100 
                      ? '⚠️ Daily limit reached! Consider taking a break.'
                      : '⚠️ Approaching daily limit'}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Weekly Chart */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">This Week</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-end justify-between h-32 gap-2">
                  {SCREEN_TIME_DATA.weekly.map((day) => (
                    <div key={day.day} className="flex-1 flex flex-col items-center gap-1">
                      <div
                        className={cn(
                          "w-full rounded-t-sm transition-all",
                          day.minutes > 100 ? "bg-red-500" : day.minutes > 80 ? "bg-yellow-500" : "bg-cyan-500"
                        )}
                        style={{ height: `${(day.minutes / 120) * 100}%` }}
                      />
                      <span className="text-xs text-gray-400">{day.day}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Settings */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Screen Time Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">Daily Limit</p>
                    <p className="text-xs text-gray-400">Max minutes per day</p>
                  </div>
                  <Select value={screenTimeLimit.toString()} onValueChange={(v) => setScreenTimeLimit(parseInt(v))}>
                    <SelectTrigger className="w-[100px] bg-white/5 border-white/10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="90">1.5 hours</SelectItem>
                      <SelectItem value="120">2 hours</SelectItem>
                      <SelectItem value="180">3 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator className="bg-white/10" />

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">Break Reminders</p>
                    <p className="text-xs text-gray-400">Remind to take breaks</p>
                  </div>
                  <Switch checked={breakReminders} onCheckedChange={setBreakReminders} />
                </div>

                <Separator className="bg-white/10" />

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">Sleep Reminder</p>
                    <p className="text-xs text-gray-400">Time to wind down</p>
                  </div>
                  <Input
                    type="time"
                    value={sleepReminder}
                    onChange={(e) => setSleepReminder(e.target.value)}
                    className="w-[100px] bg-white/5 border-white/10"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Mood Tab */}
          <TabsContent value="mood" className="space-y-4">
            {/* Mood History */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Last 7 Days</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-end justify-between h-24 gap-2">
                  {MOCK_MOOD_HISTORY.map((entry, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <span className="text-lg">
                        {['😔', '😕', '😐', '🙂', '😊'][entry.mood - 1]}
                      </span>
                      <div
                        className="w-full rounded-t-sm bg-gradient-to-t from-pink-500 to-purple-500"
                        style={{ height: `${entry.mood * 20}%` }}
                      />
                      <span className="text-xs text-gray-400">
                        {['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Mood Journal */}
            <Card className="bg-gradient-to-r from-pink-900/30 to-purple-900/30 border-pink-500/20">
              <CardContent className="p-6 text-center">
                <p className="text-4xl font-bold mb-2">😊</p>
                <p className="text-gray-400 mb-4">How are you feeling today?</p>
                <div className="flex justify-center gap-2 mb-4">
                  {[1, 2, 3, 4, 5].map(mood => (
                    <button
                      key={mood}
                      onClick={() => {
                        setTodayMood(mood);
                        setShowMoodCheckin(true);
                      }}
                      className={cn(
                        "w-12 h-12 rounded-full flex items-center justify-center text-xl transition-all hover:scale-110",
                        todayMood === mood && "ring-2 ring-purple-400 scale-110"
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
                <p className="text-xs text-gray-500">
                  Regular check-ins help track your well-being
                </p>
              </CardContent>
            </Card>

            {/* Insights */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Insights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <TrendingUp className="w-4 h-4 text-green-400" />
                  <span className="text-gray-300">Your mood has been improving this week!</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Heart className="w-4 h-4 text-pink-400" />
                  <span className="text-gray-300">Consider more study breaks for better focus</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Focus Tab */}
          <TabsContent value="focus" className="space-y-4">
            {/* Focus Timer */}
            <Card className="bg-gradient-to-br from-purple-900/30 to-cyan-900/30 border-purple-500/20">
              <CardContent className="p-6 text-center">
                <p className="text-gray-400 mb-4">Focus Session Duration</p>
                <div className="flex justify-center gap-2 mb-6">
                  {[15, 25, 45, 60].map(mins => (
                    <button
                      key={mins}
                      onClick={() => setFocusTimer(mins)}
                      className={cn(
                        "w-16 h-16 rounded-lg flex flex-col items-center justify-center transition-all",
                        focusTimer === mins
                          ? "bg-purple-600 text-white"
                          : "bg-white/5 text-gray-400 hover:bg-white/10"
                      )}
                    >
                      <span className="text-xl font-bold">{mins}</span>
                      <span className="text-xs">min</span>
                    </button>
                  ))}
                </div>
                <Button
                  onClick={startFocusSession}
                  size="lg"
                  className="w-full bg-gradient-to-r from-purple-600 to-cyan-600"
                >
                  <Zap className="w-5 h-5 mr-2" />
                  Start Focus Session
                </Button>
              </CardContent>
            </Card>

            {/* Focus Stats */}
            <div className="grid grid-cols-2 gap-3">
              <Card className="bg-white/5 border-white/10">
                <CardContent className="p-4 text-center">
                  <p className="text-3xl font-bold text-purple-400">12</p>
                  <p className="text-xs text-gray-400">Sessions This Week</p>
                </CardContent>
              </Card>
              <Card className="bg-white/5 border-white/10">
                <CardContent className="p-4 text-center">
                  <p className="text-3xl font-bold text-cyan-400">4.5h</p>
                  <p className="text-xs text-gray-400">Total Focus Time</p>
                </CardContent>
              </Card>
            </div>

            {/* Focus Settings */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Focus Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">Block Notifications</p>
                    <p className="text-xs text-gray-400">Silence during focus</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator className="bg-white/10" />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">Mindfulness Prompts</p>
                    <p className="text-xs text-gray-400">Gentle reminders to stay present</p>
                  </div>
                  <Switch checked={mindfulnessPrompts} onCheckedChange={setMindfulnessPrompts} />
                </div>
                <Separator className="bg-white/10" />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">Ambient Sounds</p>
                    <p className="text-xs text-gray-400">Background sounds for focus</p>
                  </div>
                  <Button variant="outline" size="sm" className="border-white/20">
                    <Music className="w-4 h-4 mr-1" />
                    Choose
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Mood Check-in Dialog */}
      {showMoodCheckin && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-slate-900 rounded-xl p-6 max-w-md w-full"
          >
            <h2 className="text-xl font-bold mb-4 text-center">How are you feeling?</h2>
            <div className="flex justify-center gap-2 mb-4">
              {[1, 2, 3, 4, 5].map(mood => (
                <button
                  key={mood}
                  onClick={() => setTodayMood(mood)}
                  className={cn(
                    "w-14 h-14 rounded-full flex items-center justify-center text-2xl transition-all hover:scale-110",
                    todayMood === mood && "ring-2 ring-purple-400 scale-110 bg-purple-500/20"
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
            <textarea
              value={moodNotes}
              onChange={(e) => setMoodNotes(e.target.value)}
              placeholder="Any notes about how you're feeling? (optional)"
              className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-sm mb-4 min-h-[80px]"
            />
            <div className="flex gap-2">
              <Button
                onClick={() => setShowMoodCheckin(false)}
                variant="outline"
                className="flex-1 border-white/20"
              >
                Cancel
              </Button>
              <Button
                onClick={handleMoodCheckin}
                className="flex-1 bg-gradient-to-r from-purple-600 to-cyan-600"
                disabled={todayMood === null}
              >
                Save Check-in
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
