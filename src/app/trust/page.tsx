'use client';

import { motion } from 'framer-motion';
import {
  Shield, BadgeCheck, Lock, Eye, Server, Globe, FileCheck,
  AlertTriangle, CheckCircle, Star, Users, Building2, Landmark,
  Award, Zap, Heart, Fingerprint, Clock, Database
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

// Certifications
const CERTIFICATIONS = [
  {
    name: 'FERPA',
    full: 'Family Educational Rights and Privacy Act',
    description: 'Compliant with US student privacy regulations',
    type: 'Privacy',
    icon: Shield,
    verified: true,
  },
  {
    name: 'GDPR',
    full: 'General Data Protection Regulation',
    description: 'Full compliance with EU data protection laws',
    type: 'Privacy',
    icon: Globe,
    verified: true,
  },
  {
    name: 'COPPA',
    full: 'Children\'s Online Privacy Protection Act',
    description: 'Certified safe for users under 13',
    type: 'Child Safety',
    icon: Heart,
    verified: true,
  },
  {
    name: 'SOC 2 Type II',
    full: 'Service Organization Control',
    description: 'Audited security, availability, and confidentiality',
    type: 'Security',
    icon: BadgeCheck,
    verified: true,
  },
  {
    name: 'ISO 27001',
    full: 'Information Security Management',
    description: 'International security management standard',
    type: 'Security',
    icon: Lock,
    verified: true,
  },
  {
    name: 'ISO 9001',
    full: 'Quality Management System',
    description: 'Certified quality management processes',
    type: 'Quality',
    icon: Award,
    verified: true,
  },
  {
    name: 'WCAG 2.1 AA',
    full: 'Web Content Accessibility Guidelines',
    description: 'Fully accessible for users with disabilities',
    type: 'Accessibility',
    icon: Eye,
    verified: true,
  },
  {
    name: 'PCI DSS',
    full: 'Payment Card Industry Data Security Standard',
    description: 'Secure payment processing',
    type: 'Payment',
    icon: Database,
    verified: true,
  },
];

// Security features
const SECURITY_FEATURES = [
  {
    title: 'End-to-End Encryption',
    description: 'All data is encrypted in transit (TLS 1.3) and at rest (AES-256). Your questions, answers, and personal data are always protected.',
    icon: Lock,
  },
  {
    title: 'Zero-Knowledge Architecture',
    description: 'We cannot read your private messages or see your exam answers until you submit them. Your privacy is mathematically guaranteed.',
    icon: Fingerprint,
  },
  {
    title: 'Real-Time Threat Detection',
    description: 'AI-powered systems monitor for suspicious activity 24/7. Potential threats are identified and neutralized before they become problems.',
    icon: AlertTriangle,
  },
  {
    title: 'Secure Exam Delivery',
    description: 'Questions are encrypted until the moment of delivery. Browser lockdown prevents cheating. AI proctoring ensures integrity.',
    icon: FileCheck,
  },
  {
    title: 'Multi-Region Redundancy',
    description: 'Data is replicated across multiple geographic regions with automatic failover. 99.99% uptime guaranteed for enterprise partners.',
    icon: Server,
  },
  {
    title: 'Role-Based Access Control',
    description: 'Granular permissions ensure users only access what they need. Teachers, parents, and admins have appropriately scoped access.',
    icon: Users,
  },
];

// Statistics
const TRUST_STATS = [
  { value: '0', label: 'Security breaches', suffix: '' },
  { value: '99.99', label: 'Uptime', suffix: '%' },
  { value: '500K+', label: 'Students protected', suffix: '' },
  { value: '25+', label: 'Countries served', suffix: '' },
];

// Trusted by
const TRUSTED_BY = [
  { type: 'Ministries of Education', icon: Landmark, count: '12+' },
  { type: 'Universities', icon: Building2, count: '50+' },
  { type: 'Schools', icon: Users, count: '500+' },
  { type: 'Exam Boards', icon: FileCheck, count: '8+' },
];

export default function TrustPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 text-white">
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-green-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <Badge className="mb-4 bg-green-500/20 text-green-300 border-green-500/30">
              <Shield className="w-3 h-3 mr-1" />
              Security & Trust
            </Badge>

            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-green-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Built for Trust
              </span>
            </h1>

            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              EduSparring is designed from the ground up to be the most secure, 
              private, and trustworthy educational platform in the world.
            </p>
          </motion.div>

          {/* Trust Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-16"
          >
            {TRUST_STATS.map((stat, index) => (
              <Card key={index} className="bg-white/5 border-white/10 text-center">
                <CardContent className="p-6">
                  <p className="text-3xl font-bold text-green-400">
                    {stat.value}{stat.suffix}
                  </p>
                  <p className="text-sm text-gray-400 mt-1">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </motion.div>

          {/* Zero Breaches Banner */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-gradient-to-r from-green-500/10 to-cyan-500/10 border-green-500/20 max-w-4xl mx-auto mb-16">
              <CardContent className="p-8 text-center">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
                  <Shield className="w-10 h-10 text-green-400" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Zero Security Breaches</h2>
                <p className="text-gray-400 max-w-xl mx-auto">
                  Since our launch, EduSparring has maintained a perfect security record. 
                  No data breaches, no unauthorized access, no compromises. This is our commitment to you.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </section>

        {/* Certifications Section */}
        <section className="container mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Certified & Compliant</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              EduSparring meets and exceeds international standards for security, 
              privacy, and accessibility. Our certifications are independently verified.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {CERTIFICATIONS.map((cert, index) => (
              <motion.div
                key={cert.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="bg-white/5 border-white/10 h-full hover:bg-white/10 transition-all">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                        <cert.icon className="w-5 h-5 text-green-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{cert.name}</h3>
                        <Badge variant="outline" className="border-green-500/30 text-green-400 text-xs">
                          <CheckCircle className="w-2 h-2 mr-1" />
                          Verified
                        </Badge>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mb-2">{cert.full}</p>
                    <p className="text-sm text-gray-400">{cert.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Security Features */}
        <section className="container mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Enterprise-Grade Security</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Every feature is built with security as the foundation, not an afterthought.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {SECURITY_FEATURES.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="bg-white/5 border-white/10 h-full">
                  <CardContent className="p-6">
                    <feature.icon className="w-8 h-8 mb-4 text-purple-400" />
                    <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                    <p className="text-sm text-gray-400">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Trusted By */}
        <section className="container mx-auto px-4 py-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">Trusted by Institutions Worldwide</h2>
            <p className="text-gray-400">From local schools to national governments</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-12">
            {TRUSTED_BY.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-white/5 border-white/10 text-center">
                  <CardContent className="p-4">
                    <item.icon className="w-8 h-8 mx-auto mb-2 text-purple-400" />
                    <p className="text-2xl font-bold">{item.count}</p>
                    <p className="text-sm text-gray-400">{item.type}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Student Safety Features */}
        <section className="container mx-auto px-4 py-12">
          <Card className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/20 max-w-4xl mx-auto">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                  <Heart className="w-10 h-10 text-white" />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-xl font-bold mb-2">Student Safety is Our Priority</h3>
                  <p className="text-gray-400 mb-4">
                    EduSparring goes beyond compliance to actively protect students. 
                    Our AI-powered content moderation, guardian dashboards, and proactive 
                    safety features create a secure environment for young learners.
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      AI Content Moderation
                    </Badge>
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Guardian Dashboard
                    </Badge>
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Anonymous Reporting
                    </Badge>
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Screen Time Controls
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Data Sovereignty */}
        <section className="container mx-auto px-4 py-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">Data Sovereignty Options</h2>
            <p className="text-gray-400">Your data stays where you need it</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              {
                title: 'Americas',
                regions: ['US East', 'US West', 'Brazil'],
                flag: '🌎',
              },
              {
                title: 'Europe & Africa',
                regions: ['Ireland', 'Germany', 'South Africa'],
                flag: '🌍',
              },
              {
                title: 'Asia Pacific',
                regions: ['Singapore', 'Japan', 'Australia'],
                flag: '🌏',
              },
            ].map((region, index) => (
              <Card key={index} className="bg-white/5 border-white/10">
                <CardContent className="p-5 text-center">
                  <span className="text-4xl mb-3 block">{region.flag}</span>
                  <h4 className="font-semibold mb-2">{region.title}</h4>
                  <div className="flex flex-wrap gap-1 justify-center">
                    {region.regions.map((r, i) => (
                      <Badge key={i} variant="outline" className="border-white/10 text-gray-400 text-xs">
                        {r}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Contact Security Team */}
        <section className="container mx-auto px-4 py-12">
          <div className="text-center">
            <Card className="bg-white/5 border-white/10 max-w-2xl mx-auto">
              <CardContent className="p-8">
                <Shield className="w-12 h-12 mx-auto mb-4 text-green-400" />
                <h3 className="text-xl font-bold mb-2">Report a Security Concern</h3>
                <p className="text-gray-400 mb-4">
                  Found a potential security vulnerability? We appreciate responsible disclosure 
                  and will respond within 24 hours.
                </p>
                <Button className="bg-green-600 hover:bg-green-500">
                  Contact Security Team
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA */}
        <section className="container mx-auto px-4 py-12">
          <Card className="bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border-purple-500/20 max-w-4xl mx-auto">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-2">Ready to Partner With Trust?</h2>
              <p className="text-gray-400 mb-6 max-w-xl mx-auto">
                Join the institutions that trust EduSparring for secure, 
                compliant, and reliable educational technology.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link href="/institutions">
                  <Button className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500">
                    Partner With Us
                  </Button>
                </Link>
                <Link href="/pricing">
                  <Button variant="outline" className="border-white/20 bg-white/5">
                    View Pricing
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
