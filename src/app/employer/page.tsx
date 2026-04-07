'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2, Plus, Users, Clock, DollarSign, Star, Edit2,
  Trash2, Eye, CheckCircle, AlertCircle, ArrowLeft, TrendingUp,
  Award, Briefcase, MapPin, Send, Loader2, Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';

// Mock employer data
const EMPLOYER_PROFILE = {
  id: 'emp1',
  companyName: 'TechCorp Global',
  industry: 'technology',
  logo: null,
  website: 'https://techcorp.example.com',
  location: 'San Francisco, CA',
  country: 'United States',
  tier: 'Premium',
  totalPositions: 5,
  totalPlacements: 12,
  avgRating: 4.8,
  joinedAt: '2025-01-15',
};

// Mock positions
const EMPLOYER_POSITIONS = [
  {
    id: '1',
    title: 'Junior Software Developer',
    status: 'published',
    spots: 3,
    filled: 1,
    applications: 8,
    compensation: 2500,
    createdAt: '2026-03-01',
    deadline: '2026-06-15',
  },
  {
    id: '2',
    title: 'UX Design Intern',
    status: 'published',
    spots: 2,
    filled: 0,
    applications: 5,
    compensation: 2000,
    createdAt: '2026-03-15',
    deadline: '2026-06-20',
  },
  {
    id: '3',
    title: 'Data Analyst Trainee',
    status: 'draft',
    spots: 4,
    filled: 0,
    applications: 0,
    compensation: 2200,
    createdAt: '2026-04-01',
    deadline: null,
  },
];

// Mock applications
const RECENT_APPLICATIONS = [
  {
    id: 'app1',
    studentName: 'Alex Chen',
    position: 'Junior Software Developer',
    kr: 1480,
    winRate: 72,
    status: 'pending',
    appliedAt: '2026-03-28',
  },
  {
    id: 'app2',
    studentName: 'Yuki Tanaka',
    position: 'Junior Software Developer',
    kr: 1420,
    winRate: 68,
    status: 'reviewed',
    appliedAt: '2026-03-27',
  },
  {
    id: 'app3',
    studentName: 'Emma Schmidt',
    position: 'UX Design Intern',
    kr: 1350,
    winRate: 71,
    status: 'pending',
    appliedAt: '2026-03-29',
  },
];

export default function EmployerDashboardPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [showCreateJob, setShowCreateJob] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // New job form
  const [newJob, setNewJob] = useState({
    title: '',
    description: '',
    location: '',
    remote: true,
    duration: 14,
    spots: 1,
    compensation: 0,
    minKR: 1200,
    minWins: 10,
    minWinRate: 60,
  });

  const handleCreateJob = async () => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setShowCreateJob(false);
    setIsSubmitting(false);
  };

  const stats = [
    { label: 'Active Positions', value: EMPLOYER_POSITIONS.filter(p => p.status === 'published').length, icon: Briefcase },
    { label: 'Total Applications', value: EMPLOYER_POSITIONS.reduce((acc, p) => acc + p.applications, 0), icon: Users },
    { label: 'Placements Made', value: EMPLOYER_PROFILE.totalPlacements, icon: CheckCircle },
    { label: 'Average Rating', value: EMPLOYER_PROFILE.avgRating, icon: Star },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 text-white">
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/careers">
              <Button variant="ghost" className="text-gray-400 hover:text-white">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">{EMPLOYER_PROFILE.companyName}</h1>
                <p className="text-sm text-gray-400">Employer Dashboard</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
              {EMPLOYER_PROFILE.tier} Partner
            </Badge>
            <Button variant="outline" size="icon" className="border-white/20 bg-white/5">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-white/5 border-white/10">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="positions">Positions</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {stats.map((stat) => (
                  <Card key={stat.label} className="bg-white/5 border-white/10">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <stat.icon className="w-5 h-5 text-purple-400" />
                        <TrendingUp className="w-4 h-4 text-green-400" />
                      </div>
                      <p className="text-2xl font-bold mt-2">{stat.value}</p>
                      <p className="text-sm text-gray-400">{stat.label}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Quick Actions */}
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Button
                      onClick={() => setShowCreateJob(true)}
                      className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Create New Position
                    </Button>
                    <Button variant="outline" className="border-white/20 bg-white/5 hover:bg-white/10">
                      <Users className="w-4 h-4 mr-2" />
                      View Applications
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Applications */}
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle>Recent Applications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {RECENT_APPLICATIONS.slice(0, 3).map((app) => (
                      <div key={app.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                        <div>
                          <p className="font-medium">{app.studentName}</p>
                          <p className="text-sm text-gray-400">{app.position}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="border-white/10 bg-white/5">
                            KR {app.kr}
                          </Badge>
                          <Badge className={`
                            ${app.status === 'pending' ? 'bg-amber-500/20 text-amber-400' : ''}
                            ${app.status === 'reviewed' ? 'bg-blue-500/20 text-blue-400' : ''}
                            ${app.status === 'accepted' ? 'bg-green-500/20 text-green-400' : ''}
                          `}>
                            {app.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Positions Tab */}
          <TabsContent value="positions" className="mt-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Your Positions</h2>
                <Button
                  onClick={() => setShowCreateJob(true)}
                  className="bg-gradient-to-r from-purple-600 to-cyan-600"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New Position
                </Button>
              </div>

              <div className="space-y-3">
                {EMPLOYER_POSITIONS.map((position) => (
                  <Card key={position.id} className="bg-white/5 border-white/10">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold">{position.title}</h3>
                            <Badge className={`
                              ${position.status === 'published' ? 'bg-green-500/20 text-green-400' : ''}
                              ${position.status === 'draft' ? 'bg-gray-500/20 text-gray-400' : ''}
                              ${position.status === 'closed' ? 'bg-red-500/20 text-red-400' : ''}
                            `}>
                              {position.status}
                            </Badge>
                          </div>
                          <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                            <span className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              {position.filled}/{position.spots} filled
                            </span>
                            <span className="flex items-center gap-1">
                              <DollarSign className="w-4 h-4" />
                              ${position.compensation}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {position.applications} applications
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon" className="hover:bg-white/10">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="hover:bg-white/10">
                            <Edit2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>
          </TabsContent>

          {/* Applications Tab */}
          <TabsContent value="applications" className="mt-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle>All Applications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {RECENT_APPLICATIONS.map((app) => (
                      <div key={app.id} className="p-4 bg-white/5 rounded-lg space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-semibold">{app.studentName}</p>
                            <p className="text-sm text-gray-400">Applied for: {app.position}</p>
                          </div>
                          <Badge className={`
                            ${app.status === 'pending' ? 'bg-amber-500/20 text-amber-400' : ''}
                            ${app.status === 'reviewed' ? 'bg-blue-500/20 text-blue-400' : ''}
                          `}>
                            {app.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                          <Badge variant="outline" className="border-white/10">KR: {app.kr}</Badge>
                          <Badge variant="outline" className="border-white/10">Win Rate: {app.winRate}%</Badge>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" className="bg-green-600 hover:bg-green-500">
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Accept
                          </Button>
                          <Button size="sm" variant="outline" className="border-white/20 bg-white/5">
                            View Profile
                          </Button>
                          <Button size="sm" variant="outline" className="border-red-500/30 text-red-400 hover:bg-red-500/10">
                            Decline
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="mt-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid md:grid-cols-2 gap-6"
            >
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle>Placement Success Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <p className="text-4xl font-bold text-green-400">92%</p>
                    <p className="text-gray-400 mt-2">Students complete their placements successfully</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle>Average Student Rating</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <p className="text-4xl font-bold text-yellow-400">{EMPLOYER_PROFILE.avgRating}/5</p>
                    <p className="text-gray-400 mt-2">Rating from placed students</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>

        {/* Create Job Modal */}
        <AnimatePresence>
          {showCreateJob && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
              onClick={() => setShowCreateJob(false)}
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                onClick={(e) => e.stopPropagation()}
              >
                <Card className="bg-slate-900 border-white/10 w-full max-w-lg max-h-[90vh] overflow-y-auto">
                  <CardHeader>
                    <CardTitle>Create New Position</CardTitle>
                    <CardDescription>List a new mock job opportunity for students</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Job Title</label>
                      <Input
                        value={newJob.title}
                        onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                        placeholder="e.g., Junior Software Developer"
                        className="bg-white/5 border-white/10"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Description</label>
                      <Textarea
                        value={newJob.description}
                        onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                        placeholder="Describe the role and what students will learn..."
                        className="bg-white/5 border-white/10 min-h-[100px]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Location</label>
                        <Input
                          value={newJob.location}
                          onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                          placeholder="City, Country"
                          className="bg-white/5 border-white/10"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Duration (days)</label>
                        <Input
                          type="number"
                          value={newJob.duration}
                          onChange={(e) => setNewJob({ ...newJob, duration: parseInt(e.target.value) || 14 })}
                          className="bg-white/5 border-white/10"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Positions Available</label>
                        <Input
                          type="number"
                          value={newJob.spots}
                          onChange={(e) => setNewJob({ ...newJob, spots: parseInt(e.target.value) || 1 })}
                          className="bg-white/5 border-white/10"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Compensation ($)</label>
                        <Input
                          type="number"
                          value={newJob.compensation}
                          onChange={(e) => setNewJob({ ...newJob, compensation: parseFloat(e.target.value) || 0 })}
                          className="bg-white/5 border-white/10"
                        />
                      </div>
                    </div>

                    <Separator className="bg-white/10" />

                    <p className="text-sm font-medium">Qualification Requirements</p>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs text-gray-400">Min KR</label>
                        <Input
                          type="number"
                          value={newJob.minKR}
                          onChange={(e) => setNewJob({ ...newJob, minKR: parseInt(e.target.value) || 1000 })}
                          className="bg-white/5 border-white/10"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs text-gray-400">Min Wins</label>
                        <Input
                          type="number"
                          value={newJob.minWins}
                          onChange={(e) => setNewJob({ ...newJob, minWins: parseInt(e.target.value) || 10 })}
                          className="bg-white/5 border-white/10"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs text-gray-400">Min Win Rate %</label>
                        <Input
                          type="number"
                          value={newJob.minWinRate}
                          onChange={(e) => setNewJob({ ...newJob, minWinRate: parseInt(e.target.value) || 60 })}
                          className="bg-white/5 border-white/10"
                        />
                      </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button
                        variant="outline"
                        onClick={() => setShowCreateJob(false)}
                        className="flex-1 border-white/20 bg-white/5"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleCreateJob}
                        disabled={isSubmitting || !newJob.title}
                        className="flex-1 bg-gradient-to-r from-purple-600 to-cyan-600"
                      >
                        {isSubmitting ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            <Send className="w-4 h-4 mr-2" />
                            Publish Position
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
