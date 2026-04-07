'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Briefcase, Clock, CheckCircle, XCircle, AlertCircle, Calendar,
  Building2, ArrowLeft, Eye, FileText, Loader2, Filter, TrendingUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import Link from 'next/link';

// Mock applications data
const MOCK_APPLICATIONS = [
  {
    id: 'app1',
    position: {
      id: '1',
      title: 'Junior Software Developer',
      company: 'TechCorp Global',
      industry: 'technology',
      location: 'San Francisco, CA',
      remote: true,
      compensation: 2500,
      duration: 14,
    },
    status: 'pending',
    appliedAt: '2026-03-28',
    krAtApplication: 1420,
    winsAtApplication: 28,
    coverLetter: 'I am excited to apply for this opportunity...',
  },
  {
    id: 'app2',
    position: {
      id: '2',
      title: 'UX Design Intern',
      company: 'Creative Brands Co.',
      industry: 'marketing',
      location: 'Los Angeles, CA',
      remote: true,
      compensation: 2000,
      duration: 10,
    },
    status: 'reviewed',
    appliedAt: '2026-03-25',
    krAtApplication: 1380,
    winsAtApplication: 22,
    coverLetter: 'Design has always been my passion...',
    reviewedAt: '2026-03-27',
    reviewNotes: 'Strong portfolio, good academic standing.',
  },
  {
    id: 'app3',
    position: {
      id: '3',
      title: 'Data Analyst Trainee',
      company: 'Global Finance Partners',
      industry: 'finance',
      location: 'New York, NY',
      remote: true,
      compensation: 2800,
      duration: 14,
    },
    status: 'accepted',
    appliedAt: '2026-03-20',
    krAtApplication: 1450,
    winsAtApplication: 32,
    coverLetter: 'I have a strong background in mathematics...',
    reviewedAt: '2026-03-22',
    placement: {
      id: 'pl1',
      startDate: '2026-07-01',
      endDate: '2026-07-15',
      status: 'scheduled',
    },
  },
  {
    id: 'app4',
    position: {
      id: '4',
      title: 'Medical Research Assistant',
      company: 'HealthFirst Institute',
      industry: 'healthcare',
      location: 'Boston, MA',
      remote: false,
      compensation: 3200,
      duration: 21,
    },
    status: 'rejected',
    appliedAt: '2026-03-15',
    krAtApplication: 1310,
    winsAtApplication: 18,
    coverLetter: 'I am interested in medical research...',
    reviewedAt: '2026-03-18',
    reviewNotes: 'Position requires higher KR rating (1350+).',
  },
];

const STATUS_CONFIG = {
  pending: {
    label: 'Pending Review',
    color: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    icon: Clock,
    description: 'Your application is being reviewed',
  },
  reviewed: {
    label: 'Under Consideration',
    color: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    icon: Eye,
    description: 'Employer has reviewed your application',
  },
  accepted: {
    label: 'Accepted!',
    color: 'bg-green-500/20 text-green-400 border-green-500/30',
    icon: CheckCircle,
    description: 'Congratulations! You have been accepted',
  },
  rejected: {
    label: 'Not Selected',
    color: 'bg-red-500/20 text-red-400 border-red-500/30',
    icon: XCircle,
    description: 'This position was not offered',
  },
  completed: {
    label: 'Completed',
    color: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    icon: CheckCircle,
    description: 'You have completed this placement',
  },
};

export default function MyApplicationsPage() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setApplications(MOCK_APPLICATIONS);
      setLoading(false);
    }, 800);
  }, []);

  const filteredApplications = applications.filter(app => {
    if (filter === 'all') return true;
    return app.status === filter;
  });

  const stats = {
    total: applications.length,
    pending: applications.filter(a => a.status === 'pending').length,
    accepted: applications.filter(a => a.status === 'accepted').length,
    completed: applications.filter(a => a.status === 'completed').length,
  };

  const formatCompensation = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getDaysAgo = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (diff === 0) return 'Today';
    if (diff === 1) return 'Yesterday';
    return `${diff} days ago`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 text-white">
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/careers">
            <Button variant="ghost" className="text-gray-400 hover:text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">My Applications</h1>
            <p className="text-gray-400">Track your mock job applications</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <FileText className="w-5 h-5 text-purple-400" />
              </div>
              <p className="text-2xl font-bold mt-2">{stats.total}</p>
              <p className="text-sm text-gray-400">Total Applications</p>
            </CardContent>
          </Card>
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <Clock className="w-5 h-5 text-amber-400" />
              </div>
              <p className="text-2xl font-bold mt-2">{stats.pending}</p>
              <p className="text-sm text-gray-400">Pending Review</p>
            </CardContent>
          </Card>
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <CheckCircle className="w-5 h-5 text-green-400" />
              </div>
              <p className="text-2xl font-bold mt-2">{stats.accepted}</p>
              <p className="text-sm text-gray-400">Accepted</p>
            </CardContent>
          </Card>
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <TrendingUp className="w-5 h-5 text-cyan-400" />
              </div>
              <p className="text-2xl font-bold mt-2">
                {Math.round((stats.accepted / stats.total) * 100) || 0}%
              </p>
              <p className="text-sm text-gray-400">Success Rate</p>
            </CardContent>
          </Card>
        </div>

        {/* Filter Tabs */}
        <Tabs defaultValue="all" onValueChange={setFilter} className="mb-6">
          <TabsList className="bg-white/5 border-white/10">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="reviewed">Under Review</TabsTrigger>
            <TabsTrigger value="accepted">Accepted</TabsTrigger>
            <TabsTrigger value="rejected">Not Selected</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Applications List */}
        <div className="space-y-4">
          <AnimatePresence mode="wait">
            {filteredApplications.length === 0 ? (
              <Card className="bg-white/5 border-white/10">
                <CardContent className="p-8 text-center">
                  <Briefcase className="w-12 h-12 mx-auto mb-4 text-gray-500" />
                  <h3 className="text-lg font-semibold mb-2">No Applications Found</h3>
                  <p className="text-gray-400 mb-4">
                    {filter === 'all' 
                      ? "You haven't applied for any positions yet."
                      : `No ${filter} applications.`
                    }
                  </p>
                  <Link href="/careers">
                    <Button className="bg-gradient-to-r from-purple-600 to-cyan-600">
                      Browse Positions
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              filteredApplications.map((app, index) => {
                const statusConfig = STATUS_CONFIG[app.status as keyof typeof STATUS_CONFIG];
                const StatusIcon = statusConfig.icon;

                return (
                  <motion.div
                    key={app.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className={`bg-white/5 border-white/10 hover:bg-white/10 transition-all ${
                      app.status === 'accepted' ? 'border-l-4 border-l-green-500' : ''
                    }`}>
                      <CardContent className="p-5">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold text-lg">{app.position.title}</h3>
                              <Badge className={statusConfig.color}>
                                <StatusIcon className="w-3 h-3 mr-1" />
                                {statusConfig.label}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-3 text-gray-400 text-sm">
                              <span className="flex items-center gap-1">
                                <Building2 className="w-4 h-4" />
                                {app.position.company}
                              </span>
                              <span>•</span>
                              <span>{app.position.location}</span>
                              <span>•</span>
                              <span>{formatCompensation(app.position.compensation)}</span>
                            </div>
                            <p className="text-xs text-gray-500 mt-2">
                              Applied {getDaysAgo(app.appliedAt)} • KR: {app.krAtApplication} • Wins: {app.winsAtApplication}
                            </p>
                          </div>

                          <div className="flex items-center gap-3">
                            {app.status === 'accepted' && app.placement && (
                              <Link href={`/careers/placements/${app.placement.id}`}>
                                <Button className="bg-green-600 hover:bg-green-500">
                                  View Placement
                                </Button>
                              </Link>
                            )}
                            <Link href={`/careers/jobs/${app.position.id}`}>
                              <Button variant="outline" className="border-white/20 bg-white/5">
                                View Position
                              </Button>
                            </Link>
                          </div>
                        </div>

                        {/* Review Notes */}
                        {app.reviewNotes && (
                          <div className="mt-4 p-3 bg-white/5 rounded-lg">
                            <p className="text-sm text-gray-400">
                              <strong className="text-white">Employer Note:</strong> {app.reviewNotes}
                            </p>
                          </div>
                        )}

                        {/* Placement Info */}
                        {app.status === 'accepted' && app.placement && (
                          <div className="mt-4 p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                            <div className="flex items-center gap-2 text-green-400">
                              <Calendar className="w-4 h-4" />
                              <span className="text-sm">
                                Placement: {new Date(app.placement.startDate).toLocaleDateString()} - {new Date(app.placement.endDate).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
