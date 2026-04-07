'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Briefcase, Building2, MapPin, Clock, DollarSign, Star, ArrowRight,
  CheckCircle, AlertCircle, Filter, Search, TrendingUp, Users,
  Award, Zap, Globe, ChevronRight, Loader2, Heart, Target, BadgeCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import Link from 'next/link';

// Industries for filtering
const INDUSTRIES = [
  { id: 'technology', name: 'Technology', icon: '💻' },
  { id: 'healthcare', name: 'Healthcare', icon: '🏥' },
  { id: 'finance', name: 'Finance', icon: '💰' },
  { id: 'education', name: 'Education', icon: '📚' },
  { id: 'engineering', name: 'Engineering', icon: '⚙️' },
  { id: 'marketing', name: 'Marketing', icon: '📢' },
  { id: 'research', name: 'Research', icon: '🔬' },
  { id: 'arts', name: 'Arts & Media', icon: '🎨' },
];

// Mock job positions
const MOCK_JOBS = [
  {
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
    description: 'Work alongside senior developers on real projects. Learn agile development, code reviews, and modern tech stacks.',
    requirements: ['Knowledge Rating 1400+', '20+ match wins', '70% win rate', 'Python or JavaScript proficiency'],
    featured: true,
    deadline: '2026-06-15',
  },
  {
    id: '2',
    title: 'Medical Research Assistant',
    company: 'HealthFirst Institute',
    industry: 'healthcare',
    location: 'Boston, MA',
    remote: false,
    duration: 21,
    compensation: 3200,
    currency: 'USD',
    spots: 2,
    filled: 0,
    minKR: 1350,
    minWins: 15,
    minWinRate: 0.65,
    description: 'Assist in clinical research projects. Gain exposure to medical data analysis and research methodology.',
    requirements: ['Knowledge Rating 1350+', '15+ match wins', 'Biology subject proficiency', 'Strong analytical skills'],
    featured: true,
    deadline: '2026-06-20',
  },
  {
    id: '3',
    title: 'Financial Analyst Intern',
    company: 'Global Finance Partners',
    industry: 'finance',
    location: 'New York, NY',
    remote: true,
    duration: 14,
    compensation: 2800,
    currency: 'USD',
    spots: 4,
    filled: 2,
    minKR: 1300,
    minWins: 15,
    minWinRate: 0.65,
    description: 'Learn financial modeling, market analysis, and investment strategies from industry experts.',
    requirements: ['Knowledge Rating 1300+', '15+ match wins', 'Math or Economics proficiency', 'Excel skills'],
    featured: false,
    deadline: '2026-06-25',
  },
  {
    id: '4',
    title: 'Marketing & Social Media Coordinator',
    company: 'Creative Brands Co.',
    industry: 'marketing',
    location: 'Los Angeles, CA',
    remote: true,
    duration: 10,
    compensation: 1800,
    currency: 'USD',
    spots: 5,
    filled: 1,
    minKR: 1200,
    minWins: 10,
    minWinRate: 0.6,
    description: 'Create content, manage social media campaigns, and learn digital marketing strategies.',
    requirements: ['Knowledge Rating 1200+', '10+ match wins', 'Creative mindset', 'Good communication skills'],
    featured: false,
    deadline: '2026-07-01',
  },
  {
    id: '5',
    title: 'Engineering Design Assistant',
    company: 'Innovate Engineering',
    industry: 'engineering',
    location: 'Detroit, MI',
    remote: false,
    duration: 21,
    compensation: 3000,
    currency: 'USD',
    spots: 2,
    filled: 0,
    minKR: 1380,
    minWins: 25,
    minWinRate: 0.7,
    description: 'Work on real engineering projects. Learn CAD software, design principles, and project management.',
    requirements: ['Knowledge Rating 1380+', '25+ match wins', 'Physics proficiency', 'Problem-solving skills'],
    featured: true,
    deadline: '2026-06-10',
  },
  {
    id: '6',
    title: 'Educational Content Developer',
    company: 'EduTech Solutions',
    industry: 'education',
    location: 'Remote',
    remote: true,
    duration: 14,
    compensation: 2200,
    currency: 'USD',
    spots: 6,
    filled: 3,
    minKR: 1250,
    minWins: 12,
    minWinRate: 0.6,
    description: 'Create engaging educational content and learn curriculum development from education experts.',
    requirements: ['Knowledge Rating 1250+', '12+ match wins', 'Strong writing skills', 'Subject expertise'],
    featured: false,
    deadline: '2026-07-05',
  },
];

// Qualification levels
const QUALIFICATION_LEVELS = [
  { tier: 'Bronze', minKR: 1000, color: 'from-amber-600 to-amber-400', benefits: ['Basic job access', 'Standard positions'] },
  { tier: 'Silver', minKR: 1200, color: 'from-gray-400 to-gray-300', benefits: ['Priority applications', 'Featured positions', 'Mentorship'] },
  { tier: 'Gold', minKR: 1400, color: 'from-yellow-500 to-yellow-300', benefits: ['Premium positions', 'Higher compensation', 'Direct employer contact'] },
  { tier: 'Platinum', minKR: 1600, color: 'from-cyan-400 to-purple-400', benefits: ['Exclusive positions', 'Top compensation', 'Fast-track acceptance', 'Career coaching'] },
];

export default function CareersPortalPage() {
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [userQualification, setUserQualification] = useState({
    kr: 1350,
    wins: 22,
    winRate: 0.72,
    badges: ['safe_chatter', 'helper', 'good_sportsmanship'],
    isQualified: true,
  });
  const [isLoading, setIsLoading] = useState(false);

  // Filter jobs
  const filteredJobs = MOCK_JOBS.filter(job => {
    if (selectedIndustry && job.industry !== selectedIndustry) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        job.title.toLowerCase().includes(query) ||
        job.company.toLowerCase().includes(query) ||
        job.description.toLowerCase().includes(query)
      );
    }
    return true;
  });

  // Get qualification tier
  const getQualificationTier = (kr: number) => {
    if (kr >= 1600) return QUALIFICATION_LEVELS[3];
    if (kr >= 1400) return QUALIFICATION_LEVELS[2];
    if (kr >= 1200) return QUALIFICATION_LEVELS[1];
    return QUALIFICATION_LEVELS[0];
  };

  const currentTier = getQualificationTier(userQualification.kr);

  // Check if user qualifies for a job
  const checkQualification = (job: typeof MOCK_JOBS[0]) => {
    return (
      userQualification.kr >= job.minKR &&
      userQualification.wins >= job.minWins &&
      userQualification.winRate >= job.minWinRate
    );
  };

  // Format compensation
  const formatCompensation = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Calculate days until deadline
  const getDaysUntil = (dateStr: string) => {
    const deadline = new Date(dateStr);
    const now = new Date();
    return Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 text-white">
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <Badge className="mb-4 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 text-cyan-300 border-purple-500/30">
              <Briefcase className="w-3 h-3 mr-1" />
              Mock Employment Program
            </Badge>

            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-purple-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
                Discover Your Dream Career
              </span>
            </h1>

            <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-6">
              High-achieving students get real work experience with top organizations.
              Full compensation, real projects, and career discovery.
            </p>

            <div className="flex flex-wrap gap-3 justify-center">
              <Link href="/careers/qualify">
                <Button size="lg" className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500">
                  <Target className="w-4 h-4 mr-2" />
                  Check Qualification
                </Button>
              </Link>
              <Link href="/careers/jobs">
                <Button size="lg" variant="outline" className="border-white/20 bg-white/5 hover:bg-white/10">
                  Browse All Positions
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>

            {/* Quick Links */}
            <div className="flex flex-wrap gap-4 justify-center mt-4">
              <Link href="/careers/my-applications" className="text-sm text-purple-400 hover:text-purple-300 flex items-center gap-1">
                <Briefcase className="w-4 h-4" />
                My Applications
              </Link>
              <span className="text-gray-600">•</span>
              <Link href="/careers/placements" className="text-sm text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
                <Award className="w-4 h-4" />
                My Placements
              </Link>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto"
          >
            {[
              { value: '150+', label: 'Partner Companies', icon: Building2 },
              { value: '500+', label: 'Positions Available', icon: Briefcase },
              { value: '$2,500', label: 'Avg. Compensation', icon: DollarSign },
              { value: '92%', label: 'Career Clarity Rate', icon: Heart },
            ].map((stat, index) => (
              <Card key={index} className="bg-white/5 border-white/10">
                <CardContent className="p-4 text-center">
                  <stat.icon className="w-5 h-5 mx-auto mb-2 text-purple-400" />
                  <p className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                    {stat.value}
                  </p>
                  <p className="text-sm text-gray-400">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        </section>

        {/* Qualification Status */}
        <section className="container mx-auto px-4 py-8">
          <Card className="bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border-purple-500/20 max-w-4xl mx-auto">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="flex-shrink-0">
                  <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${currentTier.color} flex items-center justify-center`}>
                    <div className="text-center">
                      <p className="text-2xl font-bold">{userQualification.kr}</p>
                      <p className="text-xs">KR</p>
                    </div>
                  </div>
                </div>

                <div className="flex-1 text-center md:text-left">
                  <div className="flex items-center gap-2 justify-center md:justify-start mb-2">
                    <h3 className="text-xl font-semibold">{currentTier.tier} Tier Qualified</h3>
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Eligible
                    </Badge>
                  </div>
                  <p className="text-gray-400 mb-4">
                    You qualify for {filteredJobs.filter(j => checkQualification(j)).length} positions across {INDUSTRIES.length} industries.
                    Current benefits: {currentTier.benefits.join(', ')}
                  </p>

                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-lg font-semibold">{userQualification.wins}</p>
                      <p className="text-xs text-gray-400">Wins</p>
                    </div>
                    <div>
                      <p className="text-lg font-semibold">{(userQualification.winRate * 100).toFixed(0)}%</p>
                      <p className="text-xs text-gray-400">Win Rate</p>
                    </div>
                    <div>
                      <p className="text-lg font-semibold">{userQualification.badges.length}</p>
                      <p className="text-xs text-gray-400">Badges</p>
                    </div>
                  </div>
                </div>

                <Link href="/careers/qualify">
                  <Button variant="outline" className="border-white/20 bg-white/5">
                    View Details
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Featured Positions */}
        <section className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">Featured Positions</h2>
              <p className="text-gray-400">Top opportunities from our partner organizations</p>
            </div>
            <Link href="/careers/jobs">
              <Button variant="ghost" className="text-purple-400 hover:text-purple-300 hover:bg-purple-500/10">
                View All
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {MOCK_JOBS.filter(job => job.featured).slice(0, 3).map((job, index) => {
              const qualified = checkQualification(job);
              const daysLeft = getDaysUntil(job.deadline);

              return (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className={`bg-white/5 border-white/10 hover:bg-white/10 transition-all h-full flex flex-col ${qualified ? 'border-l-4 border-l-green-500' : 'border-l-4 border-l-amber-500'}`}>
                    <CardContent className="p-5 flex-1 flex flex-col">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <Badge variant="outline" className="border-white/20 bg-white/5 text-gray-300 mb-2">
                            {INDUSTRIES.find(i => i.id === job.industry)?.icon} {INDUSTRIES.find(i => i.id === job.industry)?.name}
                          </Badge>
                          <h3 className="font-semibold text-lg">{job.title}</h3>
                          <p className="text-sm text-gray-400">{job.company}</p>
                        </div>
                        <Badge className={job.featured ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' : 'bg-white/5 text-gray-400 border-white/10'}>
                          <Star className="w-3 h-3 mr-1" />
                          Featured
                        </Badge>
                      </div>

                      <p className="text-sm text-gray-400 mb-4 flex-1">{job.description}</p>

                      <div className="space-y-3 mt-auto">
                        <div className="flex flex-wrap gap-2 text-xs text-gray-400">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {job.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {job.duration} days
                          </span>
                          <span className="flex items-center gap-1">
                            <DollarSign className="w-3 h-3" />
                            {formatCompensation(job.compensation, job.currency)}
                          </span>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-white/10">
                          <span className="text-xs text-gray-500">
                            {job.spots - job.filled} of {job.spots} spots left • {daysLeft} days
                          </span>
                          {qualified ? (
                            <Link href={`/careers/jobs/${job.id}`}>
                              <Button size="sm" className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500">
                                Apply Now
                                <ArrowRight className="w-3 h-3 ml-1" />
                              </Button>
                            </Link>
                          ) : (
                            <Button size="sm" variant="outline" disabled className="border-amber-500/30 text-amber-400">
                              <AlertCircle className="w-3 h-3 mr-1" />
                              Not Qualified
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* How It Works */}
        <section className="container mx-auto px-4 py-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">How It Works</h2>
            <p className="text-gray-400">Your path to career discovery</p>
          </div>

          <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              { step: 1, title: 'Achieve Excellence', description: 'Build your KR rating, win matches, earn badges through EduSparring', icon: Zap },
              { step: 2, title: 'Get Qualified', description: 'Meet the requirements for mock job eligibility in your chosen field', icon: BadgeCheck },
              { step: 3, title: 'Apply & Interview', description: 'Browse positions, apply, and connect with partner organizations', icon: Briefcase },
              { step: 4, title: 'Discover Your Path', description: 'Work real projects, earn full compensation, find your calling', icon: Heart },
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="text-center">
                  <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-gradient-to-br from-purple-500/20 to-cyan-500/20 flex items-center justify-center border border-white/10">
                    <item.icon className="w-6 h-6 text-purple-400" />
                  </div>
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center text-xs font-bold">
                    {item.step}
                  </div>
                  <h3 className="font-semibold mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-400">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Qualification Tiers */}
        <section className="container mx-auto px-4 py-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">Qualification Tiers</h2>
            <p className="text-gray-400">Higher tiers unlock more opportunities</p>
          </div>

          <div className="grid md:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {QUALIFICATION_LEVELS.map((tier, index) => (
              <motion.div
                key={tier.tier}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className={`bg-white/5 border-white/10 h-full ${userQualification.kr >= tier.minKR ? 'ring-2 ring-purple-500/50' : ''}`}>
                  <CardContent className="p-4">
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${tier.color} flex items-center justify-center mb-3`}>
                      <Award className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-lg">{tier.tier}</h3>
                    <p className="text-sm text-gray-400 mb-3">KR {tier.minKR}+</p>
                    <ul className="space-y-1">
                      {tier.benefits.map((benefit, i) => (
                        <li key={i} className="flex items-center gap-2 text-xs text-gray-400">
                          <CheckCircle className="w-3 h-3 text-green-400" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Industry Filter */}
        <section className="container mx-auto px-4 py-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-2">Explore by Industry</h2>
            <p className="text-gray-400">Find positions that match your interests</p>
          </div>

          <div className="flex flex-wrap gap-3 justify-center">
            {INDUSTRIES.map((industry) => (
              <Button
                key={industry.id}
                variant={selectedIndustry === industry.id ? 'default' : 'outline'}
                onClick={() => setSelectedIndustry(selectedIndustry === industry.id ? null : industry.id)}
                className={selectedIndustry === industry.id 
                  ? 'bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500'
                  : 'border-white/20 bg-white/5 hover:bg-white/10'
                }
              >
                <span className="mr-2">{industry.icon}</span>
                {industry.name}
              </Button>
            ))}
          </div>

          {/* Jobs Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            <AnimatePresence mode="wait">
              {filteredJobs.map((job, index) => {
                const qualified = checkQualification(job);

                return (
                  <motion.div
                    key={job.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="bg-white/5 border-white/10 hover:bg-white/10 transition-all h-full flex flex-col">
                      <CardContent className="p-4 flex-1 flex flex-col">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold">{job.title}</h3>
                            <p className="text-sm text-gray-400">{job.company}</p>
                          </div>
                          {job.featured && (
                            <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                              <Star className="w-3 h-3" />
                            </Badge>
                          )}
                        </div>

                        <p className="text-xs text-gray-400 mb-3 flex-1">{job.description.substring(0, 100)}...</p>

                        <div className="flex flex-wrap gap-2 text-xs text-gray-400 mb-3">
                          <Badge variant="outline" className="border-white/10 bg-white/5">
                            {formatCompensation(job.compensation, job.currency)}
                          </Badge>
                          <Badge variant="outline" className="border-white/10 bg-white/5">
                            {job.duration} days
                          </Badge>
                          {job.remote && (
                            <Badge variant="outline" className="border-green-500/30 bg-green-500/10 text-green-400">
                              Remote
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-white/10">
                          <span className="text-xs text-gray-500">
                            KR {job.minKR}+ required
                          </span>
                          {qualified ? (
                            <Link href={`/careers/jobs/${job.id}`}>
                              <Button size="sm" className="bg-purple-600 hover:bg-purple-500">
                                View
                              </Button>
                            </Link>
                          ) : (
                            <Badge variant="outline" className="border-amber-500/30 text-amber-400">
                              Not Qualified
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </section>

        {/* For Employers CTA */}
        <section className="container mx-auto px-4 py-12">
          <Card className="bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border-purple-500/20 max-w-4xl mx-auto">
            <CardContent className="p-8 text-center">
              <Building2 className="w-12 h-12 mx-auto mb-4 text-purple-400" />
              <h2 className="text-2xl font-bold mb-2">For Employers</h2>
              <p className="text-gray-400 mb-6 max-w-xl mx-auto">
                Partner with EduSparring to discover exceptional young talent. Build your brand with the next generation 
                while providing meaningful work experiences.
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Link href="/employer">
                  <Button className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500">
                    Become a Partner
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
