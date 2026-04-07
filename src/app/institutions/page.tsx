'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2, Landmark, GraduationCap, FileCheck, Shield, Users,
  Globe, DollarSign, CheckCircle, ArrowRight, Star, Clock,
  Award, BarChart3, Lock, Settings, Phone, Mail, MapPin,
  ChevronRight, BadgeCheck, Zap, Target, AlertCircle, Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';

// Partnership tiers
const PARTNERSHIP_TIERS = [
  {
    id: 'trial',
    name: 'Trial',
    price: 'Free',
    duration: '30 days',
    description: 'Explore EduSparring for your institution',
    features: [
      'Up to 50 students',
      'Basic question bank',
      'Standard analytics',
      'Email support',
      'No exam administration',
    ],
    color: 'from-gray-500 to-gray-400',
  },
  {
    id: 'standard',
    name: 'Standard',
    price: '$299',
    period: '/month',
    description: 'For schools getting started with digital learning',
    features: [
      'Up to 500 students',
      'Full question bank access',
      'Advanced analytics dashboard',
      'Priority email support',
      'Internal exams only',
      'Custom subjects (up to 5)',
      'Basic branding',
    ],
    color: 'from-blue-500 to-cyan-400',
    popular: false,
  },
  {
    id: 'premium',
    name: 'Premium',
    price: '$799',
    period: '/month',
    description: 'For institutions ready to transform education',
    features: [
      'Up to 2,500 students',
      'Full question bank + custom',
      'Real-time analytics & AI insights',
      'Dedicated account manager',
      'Internal & regional exams',
      'Custom subjects (unlimited)',
      'Full custom branding',
      'API access',
      'SSO integration',
      'Teacher training included',
    ],
    color: 'from-yellow-500 to-orange-400',
    popular: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 'Custom',
    period: 'pricing',
    description: 'For governments and large-scale exam administration',
    features: [
      'Unlimited students',
      'Full platform capabilities',
      'White-label deployment',
      'Dedicated infrastructure',
      'National exam administration',
      'Multi-region support',
      '24/7 phone & video support',
      'On-site training',
      'Custom development',
      'SLA guarantee',
      'Data sovereignty options',
    ],
    color: 'from-purple-500 to-pink-400',
  },
];

// Exam types
const EXAM_TYPES = [
  {
    type: 'Internal Assessments',
    icon: FileCheck,
    description: 'Regular school tests, quizzes, and assessments',
    available: 'Standard+',
  },
  {
    type: 'Regional Examinations',
    icon: Globe,
    description: 'District or state-level standardized tests',
    available: 'Premium+',
  },
  {
    type: 'National Examinations',
    icon: Landmark,
    description: 'Country-wide public exams with high security',
    available: 'Enterprise',
  },
  {
    type: 'Professional Certifications',
    icon: Award,
    description: 'Industry-recognized professional qualifications',
    available: 'Enterprise',
  },
];

// Security features
const SECURITY_FEATURES = [
  {
    feature: 'AI-Powered Proctoring',
    description: 'Real-time monitoring with behavioral analysis',
    icon: Shield,
  },
  {
    feature: 'Browser Lockdown',
    description: 'Prevents tab switching and screen capture',
    icon: Lock,
  },
  {
    feature: 'Identity Verification',
    description: 'Multi-factor authentication and photo ID matching',
    icon: BadgeCheck,
  },
  {
    feature: 'Question Encryption',
    description: 'End-to-end encrypted question delivery',
    icon: Lock,
  },
  {
    feature: 'Audit Trail',
    description: 'Complete logging for compliance and disputes',
    icon: BarChart3,
  },
  {
    feature: 'Role-Based Access',
    description: 'Granular permissions for all stakeholders',
    icon: Users,
  },
];

// Trusted by section
const TRUSTED_TYPES = [
  { label: 'Ministries of Education', icon: Landmark, count: '12+' },
  { label: 'Universities', icon: GraduationCap, count: '50+' },
  { label: 'Schools', icon: Building2, count: '500+' },
  { label: 'Countries', icon: Globe, count: '25+' },
];

export default function InstitutionsPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [showContactForm, setShowContactForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    organizationName: '',
    organizationType: '',
    country: '',
    email: '',
    phone: '',
    studentCount: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setSubmitted(true);
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
        <section className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <Badge className="mb-4 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 text-cyan-300 border-purple-500/30">
              <Landmark className="w-3 h-3 mr-1" />
              Institutional Partnerships
            </Badge>

            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-purple-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
                Transform Education at Scale
              </span>
            </h1>

            <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-6">
              Partner with EduSparring to modernize learning, administer secure exams, 
              and unlock data-driven insights for your institution.
            </p>

            <div className="flex flex-wrap gap-4 justify-center">
              <Button
                onClick={() => setShowContactForm(true)}
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500"
              >
                Request Partnership
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button size="lg" variant="outline" className="border-white/20 bg-white/5 hover:bg-white/10">
                Download Brochure
              </Button>
            </div>
          </motion.div>

          {/* Trusted By */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-16"
          >
            {TRUSTED_TYPES.map((item, index) => (
              <Card key={index} className="bg-white/5 border-white/10 text-center">
                <CardContent className="p-4">
                  <item.icon className="w-8 h-8 mx-auto mb-2 text-purple-400" />
                  <p className="text-2xl font-bold">{item.count}</p>
                  <p className="text-sm text-gray-400">{item.label}</p>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        </section>

        {/* Main Content Tabs */}
        <section className="container mx-auto px-4 py-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-6xl mx-auto">
            <TabsList className="bg-white/5 border-white/10 mb-8 flex flex-wrap">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="exam-admin">Exam Administration</TabsTrigger>
              <TabsTrigger value="security">Security & Trust</TabsTrigger>
              <TabsTrigger value="pricing">Pricing</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview">
              <div className="space-y-12">
                {/* Why Partner */}
                <div>
                  <h2 className="text-2xl font-bold mb-6 text-center">Why Partner With EduSparring?</h2>
                  <div className="grid md:grid-cols-3 gap-6">
                    {[
                      {
                        icon: Target,
                        title: 'Proven Learning Outcomes',
                        description: 'Students using EduSparring show 35% improvement in subject mastery within 3 months.',
                        stat: '35%',
                        statLabel: 'Average improvement',
                      },
                      {
                        icon: Shield,
                        title: 'Exam Security Guarantee',
                        description: 'Military-grade security with zero breaches. Trusted by governments for national exams.',
                        stat: '0',
                        statLabel: 'Security breaches',
                      },
                      {
                        icon: Globe,
                        title: 'Multi-Language Support',
                        description: 'Platform available in 28+ languages with real-time translation for diverse populations.',
                        stat: '28+',
                        statLabel: 'Languages',
                      },
                    ].map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card className="bg-white/5 border-white/10 h-full">
                          <CardContent className="p-6 text-center">
                            <item.icon className="w-12 h-12 mx-auto mb-4 text-purple-400" />
                            <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                            <p className="text-gray-400 text-sm mb-4">{item.description}</p>
                            <div className="pt-4 border-t border-white/10">
                              <p className="text-3xl font-bold text-cyan-400">{item.stat}</p>
                              <p className="text-xs text-gray-500">{item.statLabel}</p>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Platform Features */}
                <div>
                  <h2 className="text-2xl font-bold mb-6 text-center">Platform Capabilities</h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    {[
                      {
                        title: 'Competitive Learning System',
                        features: ['Real-time knowledge battles', 'Adaptive difficulty matching', 'KR Rating system', 'Subject mastery tracking'],
                      },
                      {
                        title: 'Comprehensive Analytics',
                        features: ['Individual student insights', 'Class performance comparisons', 'Predictive learning paths', 'Exportable reports'],
                      },
                      {
                        title: 'Teacher Tools',
                        features: ['Assignment creation', 'Progress monitoring', 'Intervention alerts', 'Parent communication'],
                      },
                      {
                        title: 'Student Safety',
                        features: ['AI content moderation', 'Guardian dashboards', 'Screen time controls', 'Anonymous reporting'],
                      },
                    ].map((category, index) => (
                      <Card key={index} className="bg-white/5 border-white/10">
                        <CardHeader>
                          <CardTitle className="text-lg">{category.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {category.features.map((feature, i) => (
                              <li key={i} className="flex items-center gap-2 text-sm text-gray-400">
                                <CheckCircle className="w-4 h-4 text-green-400" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Exam Administration Tab */}
            <TabsContent value="exam-admin">
              <div className="space-y-12">
                {/* Exam Types */}
                <div>
                  <h2 className="text-2xl font-bold mb-2 text-center">Exam Administration Services</h2>
                  <p className="text-gray-400 text-center mb-8 max-w-2xl mx-auto">
                    EduSparring is certified to administer examinations at every level, from classroom quizzes to national public exams.
                  </p>

                  <div className="grid md:grid-cols-2 gap-6 mb-8">
                    {EXAM_TYPES.map((exam, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card className="bg-white/5 border-white/10 hover:bg-white/10 transition-all">
                          <CardContent className="p-6">
                            <div className="flex items-start gap-4">
                              <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                                <exam.icon className="w-6 h-6 text-purple-400" />
                              </div>
                              <div>
                                <h3 className="font-semibold mb-1">{exam.type}</h3>
                                <p className="text-sm text-gray-400 mb-2">{exam.description}</p>
                                <Badge variant="outline" className="border-cyan-500/30 text-cyan-400">
                                  Available: {exam.available}
                                </Badge>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Exam Process */}
                <div>
                  <h3 className="text-xl font-bold mb-6 text-center">How Exam Administration Works</h3>
                  <div className="grid md:grid-cols-5 gap-4">
                    {[
                      { step: 1, title: 'Question Design', desc: 'Upload or use our question bank' },
                      { step: 2, title: 'Student Registration', desc: 'Bulk import or individual signup' },
                      { step: 3, title: 'Secure Delivery', desc: 'Encrypted, proctored exam sessions' },
                      { step: 4, title: 'Auto-Grading', desc: 'AI-powered instant assessment' },
                      { step: 5, title: 'Results & Analytics', desc: 'Comprehensive reports and certificates' },
                    ].map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="text-center"
                      >
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center mx-auto mb-3">
                          <span className="font-bold">{item.step}</span>
                        </div>
                        <h4 className="font-medium mb-1">{item.title}</h4>
                        <p className="text-xs text-gray-400">{item.desc}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Government Special Section */}
                <Card className="bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border-purple-500/20">
                  <CardContent className="p-8">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                        <Landmark className="w-10 h-10 text-white" />
                      </div>
                      <div className="flex-1 text-center md:text-left">
                        <h3 className="text-xl font-bold mb-2">Government & Ministry Partnerships</h3>
                        <p className="text-gray-400 mb-4">
                          EduSparring is fully equipped to serve as a national examination platform. 
                          We offer data sovereignty, multi-region deployment, custom integrations with 
                          existing systems, and comprehensive SLAs for mission-critical examinations.
                        </p>
                        <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Data Sovereignty
                          </Badge>
                          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            On-Premise Option
                          </Badge>
                          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            99.99% Uptime SLA
                          </Badge>
                        </div>
                      </div>
                      <Button
                        onClick={() => setShowContactForm(true)}
                        className="bg-gradient-to-r from-purple-600 to-cyan-600"
                      >
                        Contact Sales
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security">
              <div className="space-y-12">
                {/* Trust & Compliance */}
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold mb-2">Enterprise-Grade Security & Compliance</h2>
                  <p className="text-gray-400">Built for trust. Designed for compliance. Secured for scale.</p>
                </div>

                {/* Certifications */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                  {[
                    { name: 'FERPA', desc: 'Educational Privacy' },
                    { name: 'GDPR', desc: 'Data Protection' },
                    { name: 'COPPA', desc: 'Child Safety' },
                    { name: 'SOC 2', desc: 'Security Controls' },
                    { name: 'ISO 27001', desc: 'Info Security' },
                    { name: 'ISO 9001', desc: 'Quality Mgmt' },
                    { name: 'WCAG 2.1', desc: 'Accessibility' },
                    { name: 'PCI DSS', desc: 'Payment Security' },
                  ].map((cert, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card className="bg-white/5 border-white/10 text-center">
                        <CardContent className="p-4">
                          <BadgeCheck className="w-8 h-8 mx-auto mb-2 text-green-400" />
                          <p className="font-semibold">{cert.name}</p>
                          <p className="text-xs text-gray-500">{cert.desc}</p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>

                {/* Security Features */}
                <div>
                  <h3 className="text-xl font-bold mb-6 text-center">Exam Security Features</h3>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {SECURITY_FEATURES.map((feature, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card className="bg-white/5 border-white/10 h-full">
                          <CardContent className="p-5">
                            <feature.icon className="w-8 h-8 mb-3 text-purple-400" />
                            <h4 className="font-semibold mb-2">{feature.feature}</h4>
                            <p className="text-sm text-gray-400">{feature.description}</p>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Data Centers */}
                <Card className="bg-white/5 border-white/10">
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-4">Global Infrastructure</h3>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="flex items-center gap-3">
                        <Globe className="w-5 h-5 text-cyan-400" />
                        <div>
                          <p className="font-medium">Multi-Region Deployments</p>
                          <p className="text-xs text-gray-400">Americas, EMEA, APAC</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Shield className="w-5 h-5 text-green-400" />
                        <div>
                          <p className="font-medium">99.99% Uptime</p>
                          <p className="text-xs text-gray-400">Enterprise SLA</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Lock className="w-5 h-5 text-purple-400" />
                        <div>
                          <p className="font-medium">End-to-End Encryption</p>
                          <p className="text-xs text-gray-400">At rest & in transit</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Pricing Tab */}
            <TabsContent value="pricing">
              <div className="space-y-8">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold mb-2">Institutional Pricing</h2>
                  <p className="text-gray-400">Flexible plans for institutions of all sizes</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {PARTNERSHIP_TIERS.map((tier, index) => (
                    <motion.div
                      key={tier.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="relative"
                    >
                      {tier.popular && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                          <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black">
                            Most Popular
                          </Badge>
                        </div>
                      )}
                      <Card className={`bg-white/5 border-white/10 h-full flex flex-col ${
                        tier.popular ? 'ring-2 ring-yellow-500/50' : ''
                      }`}>
                        <CardHeader className="text-center">
                          <div className={`w-12 h-12 mx-auto rounded-full bg-gradient-to-br ${tier.color} flex items-center justify-center mb-3`}>
                            <Building2 className="w-6 h-6 text-white" />
                          </div>
                          <CardTitle>{tier.name}</CardTitle>
                          <div className="flex items-end justify-center gap-1 mt-2">
                            <span className="text-3xl font-bold">{tier.price}</span>
                            {tier.period && <span className="text-gray-400 mb-1">{tier.period}</span>}
                          </div>
                          <CardDescription>{tier.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1 flex flex-col">
                          <ul className="space-y-2 flex-1 mb-4">
                            {tier.features.map((feature, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm text-gray-400">
                                <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                          <Button
                            onClick={() => setShowContactForm(true)}
                            className={`w-full ${
                              tier.popular
                                ? 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black'
                                : 'bg-white/10 hover:bg-white/20 border border-white/20'
                            }`}
                            variant={tier.popular ? 'default' : 'outline'}
                          >
                            {tier.id === 'trial' ? 'Start Trial' : 'Contact Sales'}
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>

                {/* Additional Services */}
                <Card className="bg-white/5 border-white/10">
                  <CardHeader>
                    <CardTitle>Additional Services</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      {[
                        { name: 'Custom Question Development', price: '$50-200 per question set' },
                        { name: 'Teacher Training Program', price: '$150 per hour' },
                        { name: 'Custom Integration Development', price: 'Starting at $5,000' },
                        { name: 'On-site Deployment Support', price: 'Contact for quote' },
                        { name: 'Data Migration Services', price: 'Starting at $2,000' },
                        { name: 'White-Label Deployment', price: 'Starting at $10,000/year' },
                      ].map((service, index) => (
                        <div key={index} className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                          <span>{service.name}</span>
                          <span className="text-purple-400 font-medium">{service.price}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </section>

        {/* Contact Form Modal */}
        <AnimatePresence>
          {showContactForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
              onClick={() => setShowContactForm(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-lg"
              >
                <Card className="bg-slate-900 border-white/10">
                  <CardHeader>
                    <CardTitle>Request Partnership</CardTitle>
                    <CardDescription>Tell us about your institution and we'll get back to you within 24 hours.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {submitted ? (
                      <div className="text-center py-8">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center"
                        >
                          <CheckCircle className="w-8 h-8 text-green-400" />
                        </motion.div>
                        <h3 className="font-semibold mb-2">Request Submitted!</h3>
                        <p className="text-gray-400 text-sm">Our partnerships team will contact you shortly.</p>
                      </div>
                    ) : (
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Organization Name</label>
                            <Input
                              value={formData.organizationName}
                              onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
                              required
                              className="bg-white/5 border-white/10"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Type</label>
                            <select
                              value={formData.organizationType}
                              onChange={(e) => setFormData({ ...formData, organizationType: e.target.value })}
                              className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 text-sm"
                              required
                            >
                              <option value="">Select type</option>
                              <option value="school">School</option>
                              <option value="university">University</option>
                              <option value="government">Government</option>
                              <option value="ministry">Ministry of Education</option>
                              <option value="exam_board">Exam Board</option>
                              <option value="other">Other</option>
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Country</label>
                            <Input
                              value={formData.country}
                              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                              required
                              className="bg-white/5 border-white/10"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Student Count</label>
                            <Input
                              value={formData.studentCount}
                              onChange={(e) => setFormData({ ...formData, studentCount: e.target.value })}
                              placeholder="Approximate"
                              className="bg-white/5 border-white/10"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Email</label>
                            <Input
                              type="email"
                              value={formData.email}
                              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                              required
                              className="bg-white/5 border-white/10"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Phone</label>
                            <Input
                              value={formData.phone}
                              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                              className="bg-white/5 border-white/10"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium">Message (Optional)</label>
                          <Textarea
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            placeholder="Tell us about your needs..."
                            className="bg-white/5 border-white/10"
                          />
                        </div>

                        <div className="flex gap-3 pt-4">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setShowContactForm(false)}
                            className="flex-1 border-white/20 bg-white/5"
                          >
                            Cancel
                          </Button>
                          <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 bg-gradient-to-r from-purple-600 to-cyan-600"
                          >
                            {isSubmitting ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              'Submit Request'
                            )}
                          </Button>
                        </div>
                      </form>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-12">
          <Card className="bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border-purple-500/20 max-w-4xl mx-auto">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-2">Ready to Transform Education?</h2>
              <p className="text-gray-400 mb-6 max-w-xl mx-auto">
                Join hundreds of institutions worldwide who trust EduSparring to power their learning and examinations.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button
                  onClick={() => setShowContactForm(true)}
                  className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500"
                >
                  Request Partnership
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Link href="/pricing">
                  <Button variant="outline" className="border-white/20 bg-white/5">
                    View Student Pricing
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
