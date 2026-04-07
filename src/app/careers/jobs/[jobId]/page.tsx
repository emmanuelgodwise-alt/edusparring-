'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Briefcase, Building2, MapPin, Clock, DollarSign, Star, ArrowLeft,
  CheckCircle, AlertCircle, Send, Loader2, Users, Target
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

// Mock job data (would come from API in real implementation)
const MOCK_JOBS: Record<string, any> = {
  '1': {
    id: '1',
    title: 'Junior Software Developer',
    company: 'TechCorp Global',
    industry: 'technology',
    location: 'San Francisco, CA',
    remote: true,
    duration: 14,
    compensation: 2500,
    currency: 'USD',
    spots: 3,
    filled: 1,
    minKR: 1400,
    minWins: 20,
    minWinRate: 0.7,
    description: 'Work alongside senior developers on real projects. Learn agile development, code reviews, and modern tech stacks. This is a unique opportunity to gain hands-on experience in a professional software development environment.',
    requirements: ['Knowledge Rating 1400+', '20+ match wins', '70% win rate', 'Python or JavaScript proficiency'],
    responsibilities: [
      'Assist in developing and testing new features',
      'Participate in code reviews and team meetings',
      'Write clean, maintainable code',
      'Document your work and learn best practices',
    ],
    benefits: [
      'Full compensation of $2,500 for 2 weeks',
      'Real-world development experience',
      'Mentorship from senior engineers',
      'Potential future internship opportunities',
    ],
    featured: true,
    deadline: '2026-06-15',
  },
};

export default function JobDetailPage() {
  const router = useRouter();
  const params = useParams();
  const jobId = params.jobId as string;

  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');

  // Mock user qualification
  const userQualification = {
    kr: 1350,
    wins: 18,
    winRate: 0.68,
    badges: ['safe_chatter', 'kind_friend'],
  };

  useEffect(() => {
    // In real implementation, fetch from API
    setTimeout(() => {
      setJob(MOCK_JOBS[jobId] || null);
      setLoading(false);
    }, 500);
  }, [jobId]);

  const checkQualification = () => {
    if (!job) return { qualified: false, reasons: [] };
    
    const reasons = [];
    let qualified = true;

    if (userQualification.kr < job.minKR) {
      reasons.push(`Knowledge Rating must be ${job.minKR}+ (you have ${userQualification.kr})`);
      qualified = false;
    }
    if (userQualification.wins < job.minWins) {
      reasons.push(`Must have ${job.minWins}+ wins (you have ${userQualification.wins})`);
      qualified = false;
    }
    if (userQualification.winRate < job.minWinRate) {
      reasons.push(`Win rate must be ${Math.round(job.minWinRate * 100)}%+ (you have ${Math.round(userQualification.winRate * 100)}%)`);
      qualified = false;
    }

    return { qualified, reasons };
  };

  const handleApply = async () => {
    setApplying(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setApplied(true);
    setApplying(false);
  };

  const formatCompensation = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-400" />
          <h2 className="text-xl font-semibold">Position Not Found</h2>
          <p className="text-gray-400 mb-4">This position may have been filled or removed.</p>
          <Link href="/careers">
            <Button>Browse All Positions</Button>
          </Link>
        </div>
      </div>
    );
  }

  const { qualified, reasons } = checkQualification();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 text-white">
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link href="/careers">
          <Button variant="ghost" className="mb-6 text-gray-400 hover:text-white">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Careers
          </Button>
        </Link>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="bg-white/5 border-white/10">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        {job.featured && (
                          <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                            <Star className="w-3 h-3 mr-1" />
                            Featured
                          </Badge>
                        )}
                        <Badge variant="outline" className="border-white/20 bg-white/5">
                          {job.industry}
                        </Badge>
                      </div>
                      <h1 className="text-2xl font-bold">{job.title}</h1>
                      <p className="text-gray-400">{job.company}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                        {formatCompensation(job.compensation, job.currency)}
                      </p>
                      <p className="text-sm text-gray-400">Full compensation</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm text-gray-400 mb-6">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {job.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {job.duration} days
                    </div>
                    {job.remote && (
                      <div className="flex items-center gap-1 text-green-400">
                        <CheckCircle className="w-4 h-4" />
                        Remote Friendly
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {job.filled}/{job.spots} spots filled
                    </div>
                  </div>

                  <Separator className="bg-white/10 my-6" />

                  <div className="space-y-4">
                    <h3 className="font-semibold">Description</h3>
                    <p className="text-gray-300">{job.description}</p>
                  </div>

                  <div className="space-y-4 mt-6">
                    <h3 className="font-semibold">What You'll Do</h3>
                    <ul className="space-y-2">
                      {job.responsibilities?.map((item: string, i: number) => (
                        <li key={i} className="flex items-start gap-2 text-gray-300">
                          <CheckCircle className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-4 mt-6">
                    <h3 className="font-semibold">Benefits</h3>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {job.benefits?.map((benefit: string, i: number) => (
                        <div key={i} className="flex items-center gap-2 text-gray-300">
                          <div className="w-2 h-2 rounded-full bg-purple-400" />
                          {benefit}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Qualification Status */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className={`bg-white/5 border-white/10 ${qualified ? 'border-l-4 border-l-green-500' : 'border-l-4 border-l-amber-500'}`}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {qualified ? (
                      <>
                        <CheckCircle className="w-5 h-5 text-green-400" />
                        <span className="text-green-400">Qualified!</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-5 h-5 text-amber-400" />
                        <span className="text-amber-400">Qualification Required</span>
                      </>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {qualified ? (
                    <p className="text-sm text-gray-400">
                      You meet all the requirements for this position. Apply now!
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {reasons.map((reason, i) => (
                        <p key={i} className="text-sm text-gray-400">
                          • {reason}
                        </p>
                      ))}
                    </div>
                  )}

                  {/* Progress */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>KR Requirement</span>
                      <span>{userQualification.kr}/{job.minKR}</span>
                    </div>
                    <Progress 
                      value={Math.min(100, (userQualification.kr / job.minKR) * 100)} 
                      className="h-2"
                    />
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>Wins Requirement</span>
                      <span>{userQualification.wins}/{job.minWins}</span>
                    </div>
                    <Progress 
                      value={Math.min(100, (userQualification.wins / job.minWins) * 100)} 
                      className="h-2"
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Apply Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="bg-white/5 border-white/10">
                <CardContent className="p-4">
                  {applied ? (
                    <div className="text-center py-4">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center"
                      >
                        <CheckCircle className="w-8 h-8 text-green-400" />
                      </motion.div>
                      <h3 className="font-semibold text-green-400 mb-2">Application Submitted!</h3>
                      <p className="text-sm text-gray-400">
                        The employer will review your application and get back to you soon.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Cover Letter (Optional)</label>
                        <Textarea
                          value={coverLetter}
                          onChange={(e) => setCoverLetter(e.target.value)}
                          placeholder="Tell us why you're interested in this position..."
                          className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 min-h-[100px]"
                        />
                      </div>

                      <Button
                        onClick={handleApply}
                        disabled={!qualified || applying}
                        className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500"
                      >
                        {applying ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                            Applying...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4 mr-2" />
                            Apply for Position
                          </>
                        )}
                      </Button>

                      {!qualified && (
                        <p className="text-xs text-amber-400 text-center">
                          Complete qualification requirements to apply
                        </p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Deadline */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="bg-white/5 border-white/10">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 text-amber-400">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">
                      Application deadline: {new Date(job.deadline).toLocaleDateString()}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
