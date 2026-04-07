'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Building2, Users, Shield, BarChart3, Globe, CheckCircle,
  ArrowRight, Mail, Phone, MapPin, Loader2, Star, Award,
  Clock, BookOpen, TrendingUp, Heart, Sparkles, Send
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

// Plan features
const PLANS = [
  {
    name: 'Trial',
    price: 'Free',
    period: '30 days',
    description: 'Try EduSparring with your students',
    features: [
      'Up to 50 students',
      'Basic safety features',
      'Standard support',
      'Limited analytics',
    ],
    cta: 'Start Free Trial',
    popular: false,
  },
  {
    name: 'Basic',
    price: '$2',
    period: 'per student/month',
    description: 'Perfect for small schools',
    features: [
      'Up to 200 students',
      'Full safety features',
      'Priority support',
      'Advanced analytics',
      'Custom subjects',
      'Parent portal',
    ],
    cta: 'Get Started',
    popular: false,
  },
  {
    name: 'Premium',
    price: '$4',
    period: 'per student/month',
    description: 'For growing institutions',
    features: [
      'Unlimited students',
      'All safety features',
      '24/7 dedicated support',
      'Full analytics dashboard',
      'Custom branding',
      'API access',
      'Single Sign-On (SSO)',
      'Dedicated account manager',
    ],
    cta: 'Contact Sales',
    popular: true,
  },
];

// Benefits for schools
const BENEFITS = [
  {
    icon: Shield,
    title: 'Student Safety First',
    description: 'AI-powered content moderation, verified student accounts, and comprehensive safety controls ensure a secure learning environment.',
  },
  {
    icon: BookOpen,
    title: 'Curriculum Aligned',
    description: 'Questions and subjects align with common curriculum standards. Custom subjects available for Premium plans.',
  },
  {
    icon: BarChart3,
    title: 'Detailed Analytics',
    description: 'Track student progress, identify struggling areas, and measure learning outcomes with comprehensive dashboards.',
  },
  {
    icon: Users,
    title: 'Collaborative Learning',
    description: 'Students compete and collaborate with peers worldwide, building both knowledge and social skills.',
  },
  {
    icon: Clock,
    title: 'Time Efficient',
    description: 'Quick setup, automated moderation, and easy student management save teachers valuable time.',
  },
  {
    icon: Heart,
    title: 'Wellness Integration',
    description: 'Built-in wellness check-ins, mood tracking, and mental health resources support student well-being.',
  },
];

// Testimonials
const TESTIMONIALS = [
  {
    quote: "EduSparring transformed how our students engage with learning. The competitive element keeps them motivated, and the safety features give us peace of mind.",
    author: "Dr. Sarah Chen",
    role: "Principal, Lincoln High School",
    location: "California, USA",
  },
  {
    quote: "Our students' math scores improved by 23% after implementing EduSparring. The real-time translation feature helps our diverse student body connect.",
    author: "Mr. James Okonkwo",
    role: "Math Department Head",
    location: "Lagos, Nigeria",
  },
  {
    quote: "The parent dashboard is fantastic. Parents love being able to see their children's progress and feel confident about the platform's safety.",
    author: "Ms. Priya Sharma",
    role: "Academic Director",
    location: "Mumbai, India",
  },
];

// Stats
const STATS = [
  { value: '500+', label: 'Schools Worldwide' },
  { value: '150K+', label: 'Student Users' },
  { value: '45', label: 'Countries' },
  { value: '98%', label: 'Safety Score' },
];

export default function SchoolPartnershipPage() {
  const [formData, setFormData] = useState({
    schoolName: '',
    schoolType: 'secondary',
    country: '',
    adminName: '',
    adminEmail: '',
    adminPhone: '',
    studentCount: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setSubmitted(true);
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 text-white">
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 w-[800px] h-[800px] -translate-x-1/2 -translate-y-1/2 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="mb-4 bg-purple-500/20 text-purple-300 border-purple-500/30">
              <Building2 className="w-3 h-3 mr-1" />
              For Schools & Institutions
            </Badge>

            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-purple-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
                Bring EduSparring
              </span>
              <br />
              <span className="text-white">to Your School</span>
            </h1>

            <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
              Join hundreds of schools worldwide using EduSparring to make learning engaging, 
              competitive, and safe. Give your students a platform they'll love.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="py-6 px-8 text-lg bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500">
                Start Free Trial
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button size="lg" variant="outline" className="py-6 px-8 text-lg border-white/20 bg-white/5 hover:bg-white/10">
                Contact Sales
              </Button>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 max-w-4xl mx-auto"
          >
            {STATS.map((stat, index) => (
              <div key={index} className="text-center">
                <p className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  {stat.value}
                </p>
                <p className="text-gray-400 mt-1">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </section>

        {/* Benefits Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Schools Choose EduSparring</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Built specifically for educational institutions with safety, engagement, and learning outcomes in mind.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {BENEFITS.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors h-full">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 flex items-center justify-center mb-4">
                      <benefit.icon className="w-6 h-6 text-purple-400" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
                    <p className="text-gray-400 text-sm">{benefit.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Plans Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Plans for Every School</h2>
            <p className="text-gray-400">Flexible pricing based on your school's size and needs</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {PLANS.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative"
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                    <Badge className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white">
                      <Star className="w-3 h-3 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}
                <Card className={`bg-white/5 border-white/10 h-full ${plan.popular ? 'border-purple-500/50 bg-purple-500/5' : ''}`}>
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className="mb-4">
                      <h3 className="text-xl font-semibold">{plan.name}</h3>
                      <p className="text-gray-400 text-sm">{plan.description}</p>
                    </div>
                    <div className="mb-6">
                      <span className="text-4xl font-bold">{plan.price}</span>
                      <span className="text-gray-400 ml-2">{plan.period}</span>
                    </div>
                    <ul className="space-y-3 flex-1 mb-6">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-300">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      className={`w-full ${
                        plan.popular
                          ? 'bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500'
                          : 'bg-white/10 hover:bg-white/20 border border-white/20'
                      }`}
                    >
                      {plan.cta}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Testimonials */}
        <section className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Trusted by Educators Worldwide</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {TESTIMONIALS.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="bg-white/5 border-white/10 h-full">
                  <CardContent className="p-6">
                    <div className="flex gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      ))}
                    </div>
                    <p className="text-gray-300 mb-4 italic">"{testimonial.quote}"</p>
                    <div className="mt-auto">
                      <p className="font-semibold">{testimonial.author}</p>
                      <p className="text-sm text-gray-400">{testimonial.role}</p>
                      <p className="text-sm text-gray-500">{testimonial.location}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Contact Form */}
        <section className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto">
            <Card className="bg-white/5 border-white/10">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Get Started Today</CardTitle>
                <CardDescription className="text-gray-400">
                  Fill out the form and our team will reach out within 24 hours
                </CardDescription>
              </CardHeader>
              <CardContent>
                {submitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-8"
                  >
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
                      <CheckCircle className="w-8 h-8 text-green-400" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Thank You!</h3>
                    <p className="text-gray-400">
                      We've received your inquiry and will contact you shortly.
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">School Name</label>
                        <Input
                          value={formData.schoolName}
                          onChange={(e) => handleChange('schoolName', e.target.value)}
                          placeholder="Your school name"
                          className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">School Type</label>
                        <select
                          value={formData.schoolType}
                          onChange={(e) => handleChange('schoolType', e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white"
                        >
                          <option value="primary">Primary/Elementary</option>
                          <option value="secondary">Secondary/High School</option>
                          <option value="university">University/College</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">Country</label>
                      <Input
                        value={formData.country}
                        onChange={(e) => handleChange('country', e.target.value)}
                        placeholder="Country"
                        className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                        required
                      />
                    </div>

                    <Separator className="bg-white/10 my-4" />

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Contact Name</label>
                        <Input
                          value={formData.adminName}
                          onChange={(e) => handleChange('adminName', e.target.value)}
                          placeholder="Your name"
                          className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Email</label>
                        <Input
                          type="email"
                          value={formData.adminEmail}
                          onChange={(e) => handleChange('adminEmail', e.target.value)}
                          placeholder="your@email.com"
                          className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Phone (Optional)</label>
                        <Input
                          value={formData.adminPhone}
                          onChange={(e) => handleChange('adminPhone', e.target.value)}
                          placeholder="+1 234 567 8900"
                          className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Number of Students</label>
                        <Input
                          type="number"
                          value={formData.studentCount}
                          onChange={(e) => handleChange('studentCount', e.target.value)}
                          placeholder="Estimated students"
                          className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">Message (Optional)</label>
                      <textarea
                        value={formData.message}
                        onChange={(e) => handleChange('message', e.target.value)}
                        placeholder="Tell us about your school's needs..."
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder:text-gray-500 min-h-[100px]"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500"
                    >
                      {isSubmitting ? (
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      ) : (
                        <Send className="w-4 h-4 mr-2" />
                      )}
                      Submit Inquiry
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/10 py-8">
          <div className="container mx-auto px-4 text-center text-gray-400">
            <p>&copy; 2024 EduSparring for Schools. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
