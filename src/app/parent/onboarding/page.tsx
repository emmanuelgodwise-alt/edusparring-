'use client';

import { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield, User, Bell, Link as LinkIcon, CheckCircle, ChevronRight,
  ArrowRight, ArrowLeft, Mail, Lock, Eye, EyeOff, Clock, AlertTriangle,
  Heart, Users, BarChart3, Smartphone, Send, Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useRouter, useSearchParams } from 'next/navigation';

// Onboarding steps
const STEPS = [
  { id: 1, title: 'Welcome', description: 'Learn about EduSparring safety' },
  { id: 2, title: 'Your Details', description: 'Set up your parent account' },
  { id: 3, title: 'Link Student', description: 'Connect to your child\'s account' },
  { id: 4, title: 'Alerts', description: 'Choose your notification preferences' },
  { id: 5, title: 'Complete', description: 'Start monitoring' },
];

// Safety features overview
const SAFETY_FEATURES = [
  {
    icon: Shield,
    title: 'AI-Powered Moderation',
    description: 'All chats are automatically monitored for inappropriate content, bullying, and potential dangers.',
  },
  {
    icon: Users,
    title: 'Verified Students Only',
    description: 'Students verify with school emails, ensuring a safe community of real students.',
  },
  {
    icon: Eye,
    title: 'Activity Dashboard',
    description: 'View your child\'s activity, friends, and interactions in real-time.',
  },
  {
    icon: AlertTriangle,
    title: 'Instant Alerts',
    description: 'Get notified immediately if any concerning activity is detected.',
  },
  {
    icon: Clock,
    title: 'Screen Time Controls',
    description: 'Set limits on when and how long your child can use the platform.',
  },
  {
    icon: Heart,
    title: 'Wellness Tracking',
    description: 'Monitor your child\'s mood and well-being through daily check-ins.',
  },
];

// Alert types
const ALERT_TYPES = [
  { id: 'content_violation', label: 'Content Concerns', description: 'Inappropriate content detected' },
  { id: 'new_friend', label: 'New Connections', description: 'When your child adds a new friend' },
  { id: 'weekly_summary', label: 'Weekly Summary', description: 'Weekly activity digest' },
  { id: 'match_complete', label: 'Match Results', description: 'When your child completes a sparring match' },
  { id: 'achievement', label: 'Achievements', description: 'When your child earns a badge' },
  { id: 'screen_time', label: 'Screen Time Alerts', description: 'When daily limit is approached' },
];

function ParentOnboardingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const inviteEmail = searchParams.get('email');
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    guardianName: '',
    guardianEmail: inviteEmail || '',
    password: '',
    confirmPassword: '',
    relationship: 'parent',
    studentCode: '',
    alerts: {
      content_violation: true,
      new_friend: true,
      weekly_summary: true,
      match_complete: false,
      achievement: true,
      screen_time: true,
    },
    weeklyReports: true,
    screenTimeLimit: 120, // minutes
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [linkedStudent, setLinkedStudent] = useState<{
    name: string;
    grade: string;
    school: string;
  } | null>(null);

  const progress = (currentStep / STEPS.length) * 100;

  // Handle form changes
  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Handle alert toggle
  const toggleAlert = (alertId: string) => {
    setFormData(prev => ({
      ...prev,
      alerts: {
        ...prev.alerts,
        [alertId]: !prev.alerts[alertId],
      },
    }));
  };

  // Validate step
  const validateStep = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (currentStep === 2) {
      if (!formData.guardianName.trim()) {
        newErrors.guardianName = 'Name is required';
      }
      if (!formData.guardianEmail.trim()) {
        newErrors.guardianEmail = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.guardianEmail)) {
        newErrors.guardianEmail = 'Invalid email format';
      }
      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (formData.password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters';
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    if (currentStep === 3) {
      if (!formData.studentCode.trim()) {
        newErrors.studentCode = 'Student code is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle next step
  const handleNext = async () => {
    if (!validateStep()) return;

    if (currentStep === 3) {
      // Simulate linking student
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1500));
      setLinkedStudent({
        name: 'Alex Chen',
        grade: '10th Grade',
        school: 'Lincoln High School',
      });
      setIsLoading(false);
    }

    if (currentStep < STEPS.length) {
      setCurrentStep(prev => prev + 1);
    }
  };

  // Handle previous step
  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  // Handle complete
  const handleComplete = async () => {
    setIsLoading(true);
    
    try {
      // Submit onboarding data
      const response = await fetch('/api/guardian/link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guardianName: formData.guardianName,
          guardianEmail: formData.guardianEmail,
          password: formData.password,
          relationship: formData.relationship,
          studentCode: formData.studentCode,
          alertPreferences: formData.alerts,
          weeklyReportsEnabled: formData.weeklyReports,
          screenTimeLimit: formData.screenTimeLimit,
        }),
      });

      if (response.ok) {
        router.push('/guardian?onboarded=true');
      } else {
        const data = await response.json();
        setErrors({ submit: data.error || 'Failed to complete setup' });
      }
    } catch (error) {
      setErrors({ submit: 'Failed to complete setup. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 text-white">
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex items-center gap-2 mb-4"
          >
            <Shield className="w-8 h-8 text-purple-400" />
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              EduSparring Parents
            </span>
          </motion.div>
          <h1 className="text-3xl font-bold mb-2">Set Up Your Parent Dashboard</h1>
          <p className="text-gray-400">Keep your child safe while they learn and compete</p>
        </div>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            {STEPS.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                    currentStep > step.id
                      ? 'bg-green-500 text-white'
                      : currentStep === step.id
                      ? 'bg-purple-500 text-white'
                      : 'bg-white/10 text-gray-400'
                  }`}
                >
                  {currentStep > step.id ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    step.id
                  )}
                </div>
                {index < STEPS.length - 1 && (
                  <div
                    className={`w-12 h-1 mx-2 rounded transition-all ${
                      currentStep > step.id ? 'bg-green-500' : 'bg-white/10'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {currentStep === 1 && (
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-2xl">Welcome to EduSparring Safety</CardTitle>
                  <CardDescription className="text-gray-400">
                    Your child's safety is our top priority. Here's how we protect students.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {SAFETY_FEATURES.map((feature, index) => (
                      <motion.div
                        key={feature.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-4 rounded-xl bg-white/5 border border-white/10"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                            <feature.icon className="w-5 h-5 text-purple-400" />
                          </div>
                          <div>
                            <h3 className="font-semibold mb-1">{feature.title}</h3>
                            <p className="text-sm text-gray-400">{feature.description}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border border-purple-500/20">
                    <p className="text-sm text-gray-300">
                      <strong className="text-white">As a parent/guardian</strong>, you'll have full visibility into your child's activity 
                      and can set appropriate boundaries. We believe in transparency and partnership between 
                      parents, students, and our platform.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {currentStep === 2 && (
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-2xl">Create Your Parent Account</CardTitle>
                  <CardDescription className="text-gray-400">
                    Set up your credentials to access the parent dashboard
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Your Name</label>
                    <Input
                      value={formData.guardianName}
                      onChange={(e) => handleChange('guardianName', e.target.value)}
                      placeholder="Enter your full name"
                      className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                    />
                    {errors.guardianName && (
                      <p className="text-sm text-red-400">{errors.guardianName}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Email Address</label>
                    <Input
                      type="email"
                      value={formData.guardianEmail}
                      onChange={(e) => handleChange('guardianEmail', e.target.value)}
                      placeholder="Enter your email"
                      className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                    />
                    {errors.guardianEmail && (
                      <p className="text-sm text-red-400">{errors.guardianEmail}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Relationship</label>
                    <select
                      value={formData.relationship}
                      onChange={(e) => handleChange('relationship', e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white"
                    >
                      <option value="parent">Parent</option>
                      <option value="guardian">Guardian</option>
                      <option value="teacher">Teacher</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Create Password</label>
                    <Input
                      type="password"
                      value={formData.password}
                      onChange={(e) => handleChange('password', e.target.value)}
                      placeholder="Create a strong password"
                      className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                    />
                    {errors.password && (
                      <p className="text-sm text-red-400">{errors.password}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Confirm Password</label>
                    <Input
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleChange('confirmPassword', e.target.value)}
                      placeholder="Confirm your password"
                      className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                    />
                    {errors.confirmPassword && (
                      <p className="text-sm text-red-400">{errors.confirmPassword}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {currentStep === 3 && (
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-2xl">Link Your Child's Account</CardTitle>
                  <CardDescription className="text-gray-400">
                    Enter the unique code from your child's EduSparring account
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                    <p className="text-sm text-gray-300">
                      <strong className="text-white">How to find the code:</strong> Ask your child to open EduSparring, 
                      go to Settings → Parent Link, and share the 8-character code with you.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Student Link Code</label>
                    <Input
                      value={formData.studentCode}
                      onChange={(e) => handleChange('studentCode', e.target.value.toUpperCase())}
                      placeholder="Enter 8-character code (e.g., ABC123XY)"
                      className="bg-white/5 border-white/10 text-white text-center text-xl tracking-widest placeholder:text-gray-500 placeholder:text-sm placeholder:tracking-normal"
                      maxLength={8}
                    />
                    {errors.studentCode && (
                      <p className="text-sm text-red-400">{errors.studentCode}</p>
                    )}
                  </div>

                  {linkedStudent && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 rounded-xl bg-green-500/10 border border-green-500/20"
                    >
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-6 h-6 text-green-400" />
                        <div>
                          <p className="font-semibold text-green-400">Account Linked Successfully!</p>
                          <p className="text-sm text-gray-400">
                            {linkedStudent.name} • {linkedStudent.grade} • {linkedStudent.school}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            )}

            {currentStep === 4 && (
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-2xl">Set Up Alerts</CardTitle>
                  <CardDescription className="text-gray-400">
                    Choose what notifications you'd like to receive about your child's activity
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    {ALERT_TYPES.map(alert => (
                      <div
                        key={alert.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10"
                      >
                        <div>
                          <p className="font-medium">{alert.label}</p>
                          <p className="text-sm text-gray-400">{alert.description}</p>
                        </div>
                        <Switch
                          checked={formData.alerts[alert.id as keyof typeof formData.alerts]}
                          onCheckedChange={() => toggleAlert(alert.id)}
                        />
                      </div>
                    ))}
                  </div>

                  <Separator className="bg-white/10" />

                  <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                    <div>
                      <p className="font-medium">Weekly Email Reports</p>
                      <p className="text-sm text-gray-400">Get a comprehensive summary every week</p>
                    </div>
                    <Switch
                      checked={formData.weeklyReports}
                      onCheckedChange={(checked) => handleChange('weeklyReports', checked)}
                    />
                  </div>

                  <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20">
                    <div className="flex items-start gap-3">
                      <Smartphone className="w-5 h-5 text-purple-400 mt-0.5" />
                      <div>
                        <p className="font-medium text-purple-300">Screen Time Limit</p>
                        <p className="text-sm text-gray-400 mb-3">
                          Set a daily maximum usage time for your child
                        </p>
                        <div className="flex items-center gap-3">
                          <Input
                            type="number"
                            value={formData.screenTimeLimit}
                            onChange={(e) => handleChange('screenTimeLimit', parseInt(e.target.value) || 0)}
                            className="w-24 bg-white/5 border-white/10 text-white"
                            min={30}
                            max={480}
                          />
                          <span className="text-gray-400">minutes per day</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {currentStep === 5 && (
              <Card className="bg-white/5 border-white/10">
                <CardHeader className="text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', duration: 0.5 }}
                    className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center"
                  >
                    <CheckCircle className="w-10 h-10 text-white" />
                  </motion.div>
                  <CardTitle className="text-2xl">You're All Set!</CardTitle>
                  <CardDescription className="text-gray-400">
                    Your parent dashboard is ready. You can now monitor your child's EduSparring activity.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg bg-white/5 border border-white/10 text-center">
                      <p className="text-2xl font-bold text-green-400">✓</p>
                      <p className="text-sm text-gray-400">Account Created</p>
                    </div>
                    <div className="p-3 rounded-lg bg-white/5 border border-white/10 text-center">
                      <p className="text-2xl font-bold text-green-400">✓</p>
                      <p className="text-sm text-gray-400">Student Linked</p>
                    </div>
                    <div className="p-3 rounded-lg bg-white/5 border border-white/10 text-center">
                      <p className="text-2xl font-bold text-green-400">✓</p>
                      <p className="text-sm text-gray-400">Alerts Configured</p>
                    </div>
                    <div className="p-3 rounded-lg bg-white/5 border border-white/10 text-center">
                      <p className="text-2xl font-bold text-green-400">✓</p>
                      <p className="text-sm text-gray-400">Weekly Reports</p>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border border-purple-500/20">
                    <p className="text-sm text-gray-300 text-center">
                      You can change these settings anytime from your Parent Dashboard.
                      We'll send you a confirmation email shortly.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="border-white/20 bg-white/5 text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          {currentStep < STEPS.length ? (
            <Button
              onClick={handleNext}
              disabled={isLoading}
              className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <ArrowRight className="w-4 h-4 mr-2" />
              )}
              Continue
            </Button>
          ) : (
            <Button
              onClick={handleComplete}
              disabled={isLoading}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <CheckCircle className="w-4 h-4 mr-2" />
              )}
              Go to Dashboard
            </Button>
          )}
        </div>

        {errors.submit && (
          <p className="text-center text-red-400 mt-4">{errors.submit}</p>
        )}
      </div>
    </div>
  );
}

export default function ParentOnboardingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full" />
      </div>
    }>
      <ParentOnboardingContent />
    </Suspense>
  );
}
