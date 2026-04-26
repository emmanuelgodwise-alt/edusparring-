'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  GraduationCap, Briefcase, ArrowRight, Star, Users, Clock,
  Target, Award, CheckCircle, TrendingUp, BookOpen, Heart,
  Zap, Shield, ChevronRight, Calendar, Flame
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MobileHeader } from '@/components/navigation/MobileHeader';

// Available programs
const PROGRAMS = [
  {
    id: 'incubation',
    name: 'Straight As Incubation Program',
    slug: 'incubation',
    description: 'Transform from an average student to a Straight As student in 90 days',
    longDescription: 'A life-changing 3-month program that pairs struggling students with verified volunteers for daily accountability. Read 2 school notes daily, write summaries, and watch your grades transform.',
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
      '90-day transformation cycle'
    ],
    stats: [
      { label: 'Success Rate', value: '87%' },
      { label: 'Avg Grade Improvement', value: '+2.3' },
      { label: 'Active Students', value: '2,500+' },
      { label: 'Verified Volunteers', value: '450+' }
    ],
    duration: '90 days',
    featured: true,
    status: 'active',
    spots: null,
  },
  {
    id: 'career-placement',
    name: 'Career & Job Placement',
    slug: 'career-placement',
    description: 'Gain real work experience with top organizations through mock employment',
    longDescription: 'High-achieving students get matched with partner organizations for real work experience. Build your portfolio, earn compensation, and discover your dream career.',
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
    status: 'active',
    spots: null,
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
  const [selectedProgram, setSelectedProgram] = useState<string | null>(null);

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
        <section className="container mx-auto px-4 py-8">
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

        {/* Featured: Straight As Incubation Program */}
        <section className="container mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card className="bg-gradient-to-r from-purple-500/10 via-fuchsia-500/10 to-purple-500/10 border-purple-500/20 max-w-4xl mx-auto overflow-hidden">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
                      <GraduationCap className="w-10 h-10 text-white" />
                    </div>
                  </div>

                  <div className="flex-1 text-center md:text-left">
                    <Badge className="mb-2 bg-purple-500/20 text-purple-300 border-purple-500/30">
                      <Flame className="w-3 h-3 mr-1" />
                      New Program
                    </Badge>
                    <h2 className="text-2xl font-bold mb-2">Straight As Incubation Program</h2>
                    <p className="text-gray-400 mb-4">
                      The Ben Carson simulation effect. Transform from a D-average student to Straight As 
                      through daily study habits and verified volunteer mentorship. 90 days to transformation.
                    </p>
                    
                    <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                      <Link href="/programs/incubation">
                        <Button className="bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500">
                          <BookOpen className="w-4 h-4 mr-2" />
                          Enroll Now
                        </Button>
                      </Link>
                      <Link href="/programs/incubation#how-it-works">
                        <Button variant="outline" className="border-white/20 bg-white/5 hover:bg-white/10">
                          How It Works
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </section>

        {/* How Programs Work */}
        <section className="container mx-auto px-4 py-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">How Programs Work</h2>
            <p className="text-gray-400">A simple path to transformation</p>
          </div>

          <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              { step: 1, title: 'Choose a Program', description: 'Select the program that fits your goals', icon: Target },
              { step: 2, title: 'Enroll & Get Matched', description: 'Complete enrollment and get paired with a mentor', icon: Users },
              { step: 3, title: 'Daily Commitment', description: 'Follow the structured daily routine', icon: Zap },
              { step: 4, title: 'Transform', description: 'Achieve your goals and celebrate success', icon: Award },
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

        {/* Testimonials */}
        <section className="container mx-auto px-4 py-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">Success Stories</h2>
            <p className="text-gray-400">Real transformations from real students</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                name: 'Chidi O.',
                program: 'Incubation Program',
                quote: 'I went from D in Mathematics to an A in just 3 months. The daily routine of reading notes and writing summaries changed everything.',
                grade: 'D → A',
                subject: 'Mathematics'
              },
              {
                name: 'Amara K.',
                program: 'Career Placement',
                quote: 'The mock job experience confirmed my passion for software development. I now know exactly what I want to pursue.',
                grade: 'Career Clarity',
                subject: 'Technology'
              },
              {
                name: 'Oluwaseun D.',
                program: 'Incubation Program',
                quote: 'My volunteer mentor kept me accountable. The habit of daily study is now part of me. My grades improved across all subjects.',
                grade: 'C → A',
                subject: 'All Subjects'
              },
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="bg-white/5 border-white/10 h-full">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                        {testimonial.grade}
                      </Badge>
                      <span className="text-xs text-gray-400">{testimonial.subject}</span>
                    </div>
                    <p className="text-gray-300 mb-4 text-sm italic">"{testimonial.quote}"</p>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-sm">{testimonial.name}</p>
                        <p className="text-xs text-gray-400">{testimonial.program}</p>
                      </div>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-12">
          <Card className="bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border-purple-500/20 max-w-4xl mx-auto">
            <CardContent className="p-8 text-center">
              <Heart className="w-12 h-12 mx-auto mb-4 text-purple-400" />
              <h2 className="text-2xl font-bold mb-2">Ready to Transform?</h2>
              <p className="text-gray-400 mb-6 max-w-xl mx-auto">
                Join thousands of students who have transformed their academic performance and career prospects 
                through our structured programs.
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Link href="/programs/incubation">
                  <Button size="lg" className="bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500">
                    <GraduationCap className="w-4 h-4 mr-2" />
                    Join Incubation Program
                  </Button>
                </Link>
                <Link href="/careers">
                  <Button size="lg" variant="outline" className="border-white/20 bg-white/5 hover:bg-white/10">
                    <Briefcase className="w-4 h-4 mr-2" />
                    Explore Careers
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
