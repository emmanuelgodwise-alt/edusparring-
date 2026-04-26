'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  GraduationCap, Briefcase, Clock, Target, Award, CheckCircle, ChevronRight, Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MobileHeader } from '@/components/navigation/MobileHeader';

// Available programs
const PROGRAMS = [
  {
    id: 'incubation',
    name: 'Straight As Incubation Program',
    slug: 'incubation',
    description: 'Transform from an average student to a Straight As student this semester',
    icon: GraduationCap,
    color: 'from-purple-500 to-fuchsia-500',
    bgColor: 'from-purple-900/30 to-fuchsia-900/30',
    borderColor: 'border-purple-500/30',
    features: [
      'Daily study accountability',
      'Verified volunteer mentorship',
      '2 notes/day reading habit',
      'Summary writing practice',
      'Exam grade goal tracking',
      'Semester-long transformation'
    ],
    stats: [
      { label: 'Success Rate', value: '87%' },
      { label: 'Avg Grade Improvement', value: '+2.3' },
      { label: 'Active Students', value: '2,500+' },
      { label: 'Verified Volunteers', value: '450+' }
    ],
    duration: 'Per Semester',
    featured: true,
  },
  {
    id: 'career-placement',
    name: 'Career & Job Placement',
    slug: 'career-placement',
    description: 'Gain real work experience with top organizations through mock employment',
    icon: Briefcase,
    color: 'from-cyan-500 to-blue-500',
    bgColor: 'from-cyan-900/30 to-blue-900/30',
    borderColor: 'border-cyan-500/30',
    features: [
      'Real work experience',
      'Full compensation provided',
      'Partner organizations',
      'Career discovery',
      'Portfolio building',
      'Professional mentorship'
    ],
    stats: [
      { label: 'Partner Companies', value: '150+' },
      { label: 'Positions Available', value: '500+' },
      { label: 'Avg Compensation', value: '$2,500' },
      { label: 'Career Clarity Rate', value: '92%' }
    ],
    duration: '10-21 days',
    featured: true,
  }
];

// Program stats
const OVERALL_STATS = [
  { label: 'Students Transformed', value: '15,000+', icon: GraduationCap },
  { label: 'Active Programs', value: '2', icon: Target },
  { label: 'Success Stories', value: '12,000+', icon: Star },
  { label: 'Countries Reached', value: '50+', icon: Award },
];

export default function ProgramsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 text-white">
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <MobileHeader title="Programs" />

        {/* Hero Section */}
        <section className="container mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <Badge className="mb-4 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 text-cyan-300 border-purple-500/30">
              <Target className="w-3 h-3 mr-1" />
              Transform Your Future
            </Badge>

            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-purple-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
                EduSparring Programs
              </span>
            </h1>

            <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-6">
              Structured programs designed to transform students. From academic excellence to career readiness,
              we provide the guidance and accountability you need to succeed.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {OVERALL_STATS.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="bg-white/5 border-white/10">
                    <CardContent className="p-4 text-center">
                      <stat.icon className="w-5 h-5 mx-auto mb-2 text-purple-400" />
                      <p className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                        {stat.value}
                      </p>
                      <p className="text-sm text-gray-400">{stat.label}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Programs Grid */}
        <section className="container mx-auto px-4 py-8 pb-20">
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {PROGRAMS.map((program, index) => (
              <motion.div
                key={program.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
              >
                <Card className={`bg-gradient-to-br ${program.bgColor} border ${program.borderColor} hover:scale-[1.02] transition-transform h-full flex flex-col relative overflow-hidden`}>
                  {/* Featured badge */}
                  {program.featured && (
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                        <Star className="w-3 h-3 mr-1" />
                        Featured
                      </Badge>
                    </div>
                  )}

                  <CardContent className="p-6 flex-1 flex flex-col">
                    {/* Header */}
                    <div className="flex items-start gap-4 mb-4">
                      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${program.color} flex items-center justify-center flex-shrink-0`}>
                        <program.icon className="w-7 h-7 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-1">{program.name}</h3>
                        <p className="text-sm text-gray-400">{program.description}</p>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      {program.stats.map((stat) => (
                        <div key={stat.label} className="bg-white/5 rounded-lg p-2 text-center">
                          <p className="text-lg font-bold text-white">{stat.value}</p>
                          <p className="text-xs text-gray-400">{stat.label}</p>
                        </div>
                      ))}
                    </div>

                    {/* Features */}
                    <div className="mb-4 flex-1">
                      <p className="text-sm font-medium text-gray-300 mb-2">What's Included:</p>
                      <ul className="space-y-1">
                        {program.features.slice(0, 4).map((feature, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm text-gray-400">
                            <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Duration and CTA */}
                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Clock className="w-4 h-4" />
                        {program.duration}
                      </div>
                      <Link href={program.slug === 'incubation' ? '/programs/incubation' : '/careers'}>
                        <Button className={`bg-gradient-to-r ${program.color} hover:opacity-90`}>
                          Learn More
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
