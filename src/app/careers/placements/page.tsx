'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Briefcase, Calendar, Clock, CheckCircle, MapPin, DollarSign,
  Building2, ArrowLeft, Star, FileText, Award, Loader2, Plus,
  Edit3, MessageSquare, Heart, Target
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import Link from 'next/link';

// Mock placements data
const MOCK_PLACEMENTS = [
  {
    id: 'pl1',
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
    status: 'in_progress',
    actualStartDate: '2026-03-20',
    actualEndDate: '2026-04-03',
    daysCompleted: 8,
    daysTotal: 14,
    paymentStatus: 'pending',
    paymentAmount: 2500,
    workLog: [
      { date: '2026-03-20', activity: 'Orientation and team introductions', hours: 8 },
      { date: '2026-03-21', activity: 'Learned codebase and setup development environment', hours: 8 },
      { date: '2026-03-22', activity: 'First coding task - bug fix in user module', hours: 8 },
      { date: '2026-03-23', activity: 'Code review and team standup meetings', hours: 8 },
    ],
    mentorName: 'Sarah Johnson',
    employerRating: null,
    employerFeedback: null,
  },
  {
    id: 'pl2',
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
    status: 'completed',
    actualStartDate: '2026-02-01',
    actualEndDate: '2026-02-15',
    daysCompleted: 14,
    daysTotal: 14,
    paymentStatus: 'paid',
    paymentAmount: 2800,
    paymentDate: '2026-02-20',
    workLog: [],
    mentorName: 'Michael Chen',
    employerRating: 5,
    employerFeedback: 'Excellent analytical skills and very proactive learner. Would welcome back anytime.',
    reviewSubmitted: true,
    certificateUrl: '/certificates/pl2.pdf',
  },
  {
    id: 'pl3',
    position: {
      id: '5',
      title: 'Engineering Design Assistant',
      company: 'Innovate Engineering',
      industry: 'engineering',
      location: 'Detroit, MI',
      remote: false,
      compensation: 3000,
      duration: 21,
    },
    status: 'scheduled',
    actualStartDate: '2026-07-01',
    actualEndDate: '2026-07-22',
    daysCompleted: 0,
    daysTotal: 21,
    paymentStatus: 'pending',
    paymentAmount: 3000,
    workLog: [],
    mentorName: 'David Wilson',
  },
];

const STATUS_CONFIG = {
  scheduled: {
    label: 'Scheduled',
    color: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    description: 'Your placement is scheduled to begin soon',
  },
  in_progress: {
    label: 'In Progress',
    color: 'bg-green-500/20 text-green-400 border-green-500/30',
    description: 'Currently in progress',
  },
  completed: {
    label: 'Completed',
    color: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    description: 'Successfully completed',
  },
  cancelled: {
    label: 'Cancelled',
    color: 'bg-red-500/20 text-red-400 border-red-500/30',
    description: 'Placement was cancelled',
  },
};

export default function PlacementsPage() {
  const [placements, setPlacements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState<string | null>(null);
  const [reviewForm, setReviewForm] = useState({
    overallRating: 5,
    learningRating: 5,
    cultureRating: 5,
    recommendRating: 5,
    title: '',
    review: '',
    pros: '',
    cons: '',
    careerConfirmed: false,
    careerChanged: false,
  });

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setPlacements(MOCK_PLACEMENTS);
      setLoading(false);
    }, 800);
  }, []);

  const stats = {
    total: placements.length,
    active: placements.filter(p => p.status === 'in_progress').length,
    completed: placements.filter(p => p.status === 'completed').length,
    totalEarnings: placements
      .filter(p => p.paymentStatus === 'paid')
      .reduce((acc, p) => acc + p.paymentAmount, 0),
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getDaysUntilStart = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const handleSubmitReview = async (placementId: string) => {
    // Simulate API call
    console.log('Submitting review for placement:', placementId, reviewForm);
    setShowReviewForm(null);
    // Refresh placements
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
            <h1 className="text-2xl font-bold">My Placements</h1>
            <p className="text-gray-400">Track your mock employment experiences</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-4">
              <Briefcase className="w-5 h-5 text-purple-400 mb-2" />
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-sm text-gray-400">Total Placements</p>
            </CardContent>
          </Card>
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-4">
              <Clock className="w-5 h-5 text-green-400 mb-2" />
              <p className="text-2xl font-bold">{stats.active}</p>
              <p className="text-sm text-gray-400">Active</p>
            </CardContent>
          </Card>
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-4">
              <CheckCircle className="w-5 h-5 text-cyan-400 mb-2" />
              <p className="text-2xl font-bold">{stats.completed}</p>
              <p className="text-sm text-gray-400">Completed</p>
            </CardContent>
          </Card>
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-4">
              <DollarSign className="w-5 h-5 text-yellow-400 mb-2" />
              <p className="text-2xl font-bold">{formatCurrency(stats.totalEarnings)}</p>
              <p className="text-sm text-gray-400">Total Earned</p>
            </CardContent>
          </Card>
        </div>

        {/* Placements List */}
        <div className="space-y-6">
          {placements.length === 0 ? (
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-8 text-center">
                <Briefcase className="w-12 h-12 mx-auto mb-4 text-gray-500" />
                <h3 className="text-lg font-semibold mb-2">No Placements Yet</h3>
                <p className="text-gray-400 mb-4">
                  Your accepted applications will appear here as placements.
                </p>
                <Link href="/careers">
                  <Button className="bg-gradient-to-r from-purple-600 to-cyan-600">
                    Browse Positions
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            placements.map((placement, index) => {
              const statusConfig = STATUS_CONFIG[placement.status as keyof typeof STATUS_CONFIG];

              return (
                <motion.div
                  key={placement.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="bg-white/5 border-white/10">
                    <CardContent className="p-6">
                      {/* Header */}
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-xl font-semibold">{placement.position.title}</h3>
                            <Badge className={statusConfig.color}>
                              {statusConfig.label}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-3 text-gray-400">
                            <span className="flex items-center gap-1">
                              <Building2 className="w-4 h-4" />
                              {placement.position.company}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {placement.position.location}
                            </span>
                            {placement.position.remote && (
                              <Badge variant="outline" className="border-green-500/30 text-green-400">
                                Remote
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                            {formatCurrency(placement.paymentAmount)}
                          </p>
                          <p className="text-sm text-gray-400">
                            {placement.paymentStatus === 'paid' ? 'Paid' : 'Pending Payment'}
                          </p>
                        </div>
                      </div>

                      {/* Progress Bar (for in-progress) */}
                      {placement.status === 'in_progress' && (
                        <div className="mb-6">
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-gray-400">Progress</span>
                            <span className="text-white">
                              Day {placement.daysCompleted} of {placement.daysTotal}
                            </span>
                          </div>
                          <Progress 
                            value={(placement.daysCompleted / placement.daysTotal) * 100} 
                            className="h-2"
                          />
                        </div>
                      )}

                      {/* Schedule Info */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div className="p-3 bg-white/5 rounded-lg">
                          <p className="text-xs text-gray-500">Start Date</p>
                          <p className="font-medium">{formatDate(placement.actualStartDate)}</p>
                        </div>
                        <div className="p-3 bg-white/5 rounded-lg">
                          <p className="text-xs text-gray-500">End Date</p>
                          <p className="font-medium">{formatDate(placement.actualEndDate)}</p>
                        </div>
                        <div className="p-3 bg-white/5 rounded-lg">
                          <p className="text-xs text-gray-500">Duration</p>
                          <p className="font-medium">{placement.daysTotal} days</p>
                        </div>
                        <div className="p-3 bg-white/5 rounded-lg">
                          <p className="text-xs text-gray-500">Mentor</p>
                          <p className="font-medium">{placement.mentorName}</p>
                        </div>
                      </div>

                      {/* Work Log (for in-progress) */}
                      {placement.status === 'in_progress' && placement.workLog.length > 0 && (
                        <div className="mb-6">
                          <h4 className="font-medium mb-3 flex items-center gap-2">
                            <Edit3 className="w-4 h-4 text-purple-400" />
                            Recent Work Log
                          </h4>
                          <div className="space-y-2">
                            {placement.workLog.slice(-3).map((log: any, i: number) => (
                              <div key={i} className="flex justify-between items-center p-2 bg-white/5 rounded text-sm">
                                <span className="text-gray-400">{formatDate(log.date)}</span>
                                <span>{log.activity}</span>
                                <span className="text-purple-400">{log.hours}h</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Employer Feedback (for completed) */}
                      {placement.status === 'completed' && placement.employerFeedback && (
                        <div className="mb-6 p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                          <div className="flex items-center gap-2 mb-2">
                            <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                            <span className="font-medium">Employer Feedback</span>
                            <span className="text-yellow-400">({placement.employerRating}/5)</span>
                          </div>
                          <p className="text-gray-300 text-sm">{placement.employerFeedback}</p>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex flex-wrap gap-3">
                        {placement.status === 'scheduled' && (
                          <>
                            <div className="flex items-center gap-2 text-blue-400">
                              <Calendar className="w-4 h-4" />
                              <span>Starts in {getDaysUntilStart(placement.actualStartDate)} days</span>
                            </div>
                          </>
                        )}
                        
                        {placement.status === 'in_progress' && (
                          <Button variant="outline" className="border-white/20 bg-white/5">
                            <Edit3 className="w-4 h-4 mr-2" />
                            Update Work Log
                          </Button>
                        )}

                        {placement.status === 'completed' && !placement.reviewSubmitted && (
                          <Button 
                            onClick={() => setShowReviewForm(placement.id)}
                            className="bg-gradient-to-r from-purple-600 to-cyan-600"
                          >
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Write Review
                          </Button>
                        )}

                        {placement.status === 'completed' && placement.certificateUrl && (
                          <Button variant="outline" className="border-green-500/30 text-green-400 bg-green-500/10">
                            <Award className="w-4 h-4 mr-2" />
                            Download Certificate
                          </Button>
                        )}

                        {placement.status === 'completed' && placement.paymentStatus === 'paid' && (
                          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Payment Received
                          </Badge>
                        )}
                      </div>

                      {/* Review Form */}
                      {showReviewForm === placement.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="mt-6 pt-6 border-t border-white/10"
                        >
                          <h4 className="font-semibold mb-4">Share Your Experience</h4>
                          
                          <div className="grid md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <label className="text-sm text-gray-400 mb-1 block">Overall Rating</label>
                              <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <button
                                    key={star}
                                    onClick={() => setReviewForm({ ...reviewForm, overallRating: star })}
                                    className={`w-8 h-8 ${
                                      star <= reviewForm.overallRating ? 'text-yellow-400' : 'text-gray-500'
                                    }`}
                                  >
                                    <Star className="w-6 h-6 fill-current" />
                                  </button>
                                ))}
                              </div>
                            </div>
                            <div>
                              <label className="text-sm text-gray-400 mb-1 block">Learning Experience</label>
                              <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <button
                                    key={star}
                                    onClick={() => setReviewForm({ ...reviewForm, learningRating: star })}
                                    className={`w-8 h-8 ${
                                      star <= reviewForm.learningRating ? 'text-yellow-400' : 'text-gray-500'
                                    }`}
                                  >
                                    <Star className="w-6 h-6 fill-current" />
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <div>
                              <label className="text-sm text-gray-400 mb-1 block">Review Title</label>
                              <input
                                type="text"
                                value={reviewForm.title}
                                onChange={(e) => setReviewForm({ ...reviewForm, title: e.target.value })}
                                placeholder="Summarize your experience"
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder:text-gray-500"
                              />
                            </div>
                            
                            <div>
                              <label className="text-sm text-gray-400 mb-1 block">Your Review</label>
                              <Textarea
                                value={reviewForm.review}
                                onChange={(e) => setReviewForm({ ...reviewForm, review: e.target.value })}
                                placeholder="Share your experience working with this company..."
                                className="bg-white/5 border-white/10 min-h-[100px]"
                              />
                            </div>

                            <div className="flex items-center gap-4">
                              <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={reviewForm.careerConfirmed}
                                  onChange={(e) => setReviewForm({ ...reviewForm, careerConfirmed: e.target.checked })}
                                  className="rounded border-white/20 bg-white/5"
                                />
                                <span className="text-sm text-gray-400">
                                  <Heart className="w-4 h-4 inline mr-1 text-pink-400" />
                                  This confirmed my career choice
                                </span>
                              </label>
                            </div>
                          </div>

                          <div className="flex gap-3 mt-4">
                            <Button
                              variant="outline"
                              onClick={() => setShowReviewForm(null)}
                              className="border-white/20 bg-white/5"
                            >
                              Cancel
                            </Button>
                            <Button
                              onClick={() => handleSubmitReview(placement.id)}
                              className="bg-gradient-to-r from-purple-600 to-cyan-600"
                            >
                              Submit Review
                            </Button>
                          </div>
                        </motion.div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })
          )}
        </div>

        {/* Career Discovery Section */}
        {stats.completed > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8"
          >
            <Card className="bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border-purple-500/20">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Career Discovery</h3>
                    <p className="text-gray-400">
                      You've completed {stats.completed} placement{stats.completed > 1 ? 's' : ''}! 
                      {stats.completed >= 2 
                        ? ' Check out your career insights to see which path fits you best.'
                        : ' Complete more placements to discover your ideal career path.'
                      }
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
