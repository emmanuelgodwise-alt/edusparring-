'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  GraduationCap, ArrowRight, Star, Users, Clock, Target, Award,
  CheckCircle, BookOpen, Heart, Zap, ChevronRight, ChevronLeft,
  Calendar, Flame, User, Mail, Phone, MapPin, Edit3, FileText,
  Send, AlertCircle, Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { MobileHeader } from '@/components/navigation/MobileHeader';
import { useAuth } from '@/components/AuthProvider';

// Enrollment steps
const ENROLLMENT_STEPS = [
  { id: 1, title: 'Personal Info', description: 'Your basic information' },
  { id: 2, title: 'Academic Status', description: 'Current grade level and school' },
  { id: 3, title: 'Exam Goals', description: 'Set your target grades' },
  { id: 4, title: 'Commitment', description: 'Your pledge to the program' },
  { id: 5, title: 'Review', description: 'Confirm your enrollment' },
];

// Available subjects for goals
const SUBJECTS = ['English', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Economics', 'Literature', 'Geography', 'History', 'Government'];

// Current grade options
const CURRENT_GRADES = ['A', 'B', 'C', 'D', 'E', 'F'];
const TARGET_GRADES = ['A', 'B', 'C'];

export default function IncubationProgramPage() {
  const router = useRouter();
  const { user: authUser, isAuthenticated } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [enrollmentComplete, setEnrollmentComplete] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    // Personal info
    fullName: '',
    email: '',
    phone: '',
    country: '',
    city: '',
    
    // Academic status
    schoolName: '',
    gradeLevel: '',
    currentTerm: '',
    
    // Exam goals
    examGoals: [] as Array<{ subject: string; currentGrade: string; targetGrade: string }>,
    whyJoin: '',
    
    // Commitment
    studyTime: '',
    commitmentPledge: false,
    parentConsent: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const progress = ((currentStep - 1) / ENROLLMENT_STEPS.length) * 100;

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user types
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const addExamGoal = () => {
    if (formData.examGoals.length < 6) {
      setFormData(prev => ({
        ...prev,
        examGoals: [...prev.examGoals, { subject: '', currentGrade: '', targetGrade: 'A' }]
      }));
    }
  };

  const updateExamGoal = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      examGoals: prev.examGoals.map((goal, i) => 
        i === index ? { ...goal, [field]: value } : goal
      )
    }));
  };

  const removeExamGoal = (index: number) => {
    setFormData(prev => ({
      ...prev,
      examGoals: prev.examGoals.filter((_, i) => i !== index)
    }));
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
      if (!formData.email.trim()) newErrors.email = 'Email is required';
      if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
      if (!formData.country.trim()) newErrors.country = 'Country is required';
    }

    if (step === 2) {
      if (!formData.schoolName.trim()) newErrors.schoolName = 'School name is required';
      if (!formData.gradeLevel) newErrors.gradeLevel = 'Grade level is required';
    }

    if (step === 3) {
      if (formData.examGoals.length === 0) newErrors.examGoals = 'Add at least one exam goal';
      const hasInvalidGoal = formData.examGoals.some(g => !g.subject || !g.currentGrade || !g.targetGrade);
      if (hasInvalidGoal) newErrors.examGoals = 'Complete all exam goal fields';
      if (!formData.whyJoin.trim()) newErrors.whyJoin = 'Tell us why you want to join';
    }

    if (step === 4) {
      if (!formData.studyTime) newErrors.studyTime = 'Select your preferred study time';
      if (!formData.commitmentPledge) newErrors.commitmentPledge = 'You must accept the commitment pledge';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, ENROLLMENT_STEPS.length));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(5)) return;
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In production, this would call the API
      // const response = await fetch('/api/programs/incubation/enroll', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData)
      // });
      
      setEnrollmentComplete(true);
    } catch (error) {
      console.error('Enrollment failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success screen
  if (enrollmentComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 text-white">
        <MobileHeader title="Enrollment Complete" />
        
        <div className="container mx-auto px-4 py-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-lg mx-auto text-center"
          >
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-green-500/30">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
            
            <h1 className="text-3xl font-bold mb-4">Welcome to the Program!</h1>
            <p className="text-gray-400 mb-8">
              Your enrollment in the Straight As Incubation Program has been received. 
              You will be paired with a verified volunteer mentor within 24-48 hours.
            </p>
            
            <Card className="bg-white/5 border-white/10 mb-6">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">What Happens Next?</h3>
                <div className="space-y-3 text-left">
                  {[
                    { step: 1, text: 'Check your email for confirmation' },
                    { step: 2, text: 'Get matched with a volunteer mentor' },
                    { step: 3, text: 'Start your 90-day transformation journey' },
                  ].map((item) => (
                    <div key={item.step} className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center text-xs font-bold">
                        {item.step}
                      </div>
                      <span className="text-sm text-gray-300">{item.text}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <div className="flex gap-3 justify-center">
              <Link href="/">
                <Button className="bg-gradient-to-r from-purple-600 to-fuchsia-600">
                  Go to Dashboard
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 text-white pb-20">
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-fuchsia-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <MobileHeader title="Incubation Program" />

        {/* Hero Section */}
        <section className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              <span className="bg-gradient-to-r from-purple-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
                Straight As Incubation
              </span>
            </h1>
            
            <p className="text-gray-400 max-w-xl mx-auto">
              Transform from an average student to Straight As in 90 days through daily study habits 
              and verified volunteer mentorship.
            </p>
          </motion.div>

          {/* Progress Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="flex items-center justify-between mb-2">
              {ENROLLMENT_STEPS.map((step) => (
                <div 
                  key={step.id} 
                  className={`flex-1 text-center ${currentStep >= step.id ? 'text-purple-400' : 'text-gray-500'}`}
                >
                  <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center text-sm font-bold mb-1 ${
                    currentStep >= step.id 
                      ? 'bg-purple-500 text-white' 
                      : 'bg-white/10 text-gray-400'
                  }`}>
                    {currentStep > step.id ? <CheckCircle className="w-4 h-4" /> : step.id}
                  </div>
                  <p className="text-xs hidden sm:block">{step.title}</p>
                </div>
              ))}
            </div>
            <Progress value={progress} className="h-2 bg-white/10" />
          </div>
        </section>

        {/* Enrollment Form */}
        <section className="container mx-auto px-4">
          <Card className="bg-white/5 border-white/10 max-w-2xl mx-auto">
            <CardContent className="p-6">
              <AnimatePresence mode="wait">
                {/* Step 1: Personal Info */}
                {currentStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <h2 className="text-xl font-bold mb-4">Personal Information</h2>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="fullName">Full Name *</Label>
                        <Input
                          id="fullName"
                          value={formData.fullName}
                          onChange={(e) => updateFormData('fullName', e.target.value)}
                          placeholder="Enter your full name"
                          className="bg-white/5 border-white/10 mt-1"
                        />
                        {errors.fullName && <p className="text-red-400 text-sm mt-1">{errors.fullName}</p>}
                      </div>
                      
                      <div>
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => updateFormData('email', e.target.value)}
                          placeholder="your.email@example.com"
                          className="bg-white/5 border-white/10 mt-1"
                        />
                        {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
                      </div>
                      
                      <div>
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => updateFormData('phone', e.target.value)}
                          placeholder="+234 8XX XXX XXXX"
                          className="bg-white/5 border-white/10 mt-1"
                        />
                        {errors.phone && <p className="text-red-400 text-sm mt-1">{errors.phone}</p>}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="country">Country *</Label>
                          <Input
                            id="country"
                            value={formData.country}
                            onChange={(e) => updateFormData('country', e.target.value)}
                            placeholder="Nigeria"
                            className="bg-white/5 border-white/10 mt-1"
                          />
                          {errors.country && <p className="text-red-400 text-sm mt-1">{errors.country}</p>}
                        </div>
                        <div>
                          <Label htmlFor="city">City</Label>
                          <Input
                            id="city"
                            value={formData.city}
                            onChange={(e) => updateFormData('city', e.target.value)}
                            placeholder="Lagos"
                            className="bg-white/5 border-white/10 mt-1"
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Academic Status */}
                {currentStep === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <h2 className="text-xl font-bold mb-4">Academic Status</h2>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="schoolName">School Name *</Label>
                        <Input
                          id="schoolName"
                          value={formData.schoolName}
                          onChange={(e) => updateFormData('schoolName', e.target.value)}
                          placeholder="Enter your school name"
                          className="bg-white/5 border-white/10 mt-1"
                        />
                        {errors.schoolName && <p className="text-red-400 text-sm mt-1">{errors.schoolName}</p>}
                      </div>
                      
                      <div>
                        <Label htmlFor="gradeLevel">Current Grade Level *</Label>
                        <select
                          id="gradeLevel"
                          value={formData.gradeLevel}
                          onChange={(e) => updateFormData('gradeLevel', e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 mt-1 text-white"
                        >
                          <option value="">Select your grade level</option>
                          <option value="JSS1">JSS 1 (Grade 7)</option>
                          <option value="JSS2">JSS 2 (Grade 8)</option>
                          <option value="JSS3">JSS 3 (Grade 9)</option>
                          <option value="SS1">SS 1 (Grade 10)</option>
                          <option value="SS2">SS 2 (Grade 11)</option>
                          <option value="SS3">SS 3 (Grade 12)</option>
                          <option value="University">University Student</option>
                        </select>
                        {errors.gradeLevel && <p className="text-red-400 text-sm mt-1">{errors.gradeLevel}</p>}
                      </div>
                      
                      <div>
                        <Label htmlFor="currentTerm">Current Term/Semester</Label>
                        <Input
                          id="currentTerm"
                          value={formData.currentTerm}
                          onChange={(e) => updateFormData('currentTerm', e.target.value)}
                          placeholder="e.g., Second Term 2024"
                          className="bg-white/5 border-white/10 mt-1"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Exam Goals */}
                {currentStep === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <h2 className="text-xl font-bold mb-4">Set Your Exam Goals</h2>
                    <p className="text-gray-400 text-sm mb-4">
                      Set target grades for subjects you want to improve. Be realistic but ambitious.
                    </p>
                    
                    {errors.examGoals && (
                      <p className="text-red-400 text-sm mb-4 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        {errors.examGoals}
                      </p>
                    )}
                    
                    <div className="space-y-3 mb-4">
                      {formData.examGoals.map((goal, index) => (
                        <div key={index} className="flex items-center gap-2 p-3 bg-white/5 rounded-lg">
                          <select
                            value={goal.subject}
                            onChange={(e) => updateExamGoal(index, 'subject', e.target.value)}
                            className="flex-1 bg-white/10 border-0 rounded px-2 py-1.5 text-sm"
                          >
                            <option value="">Select Subject</option>
                            {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                          
                          <div className="flex items-center gap-1">
                            <select
                              value={goal.currentGrade}
                              onChange={(e) => updateExamGoal(index, 'currentGrade', e.target.value)}
                              className="bg-red-500/20 text-red-300 border-0 rounded px-2 py-1.5 text-sm"
                            >
                              <option value="">Current</option>
                              {CURRENT_GRADES.map(g => <option key={g} value={g}>{g}</option>)}
                            </select>
                            
                            <ArrowRight className="w-4 h-4 text-gray-400" />
                            
                            <select
                              value={goal.targetGrade}
                              onChange={(e) => updateExamGoal(index, 'targetGrade', e.target.value)}
                              className="bg-green-500/20 text-green-300 border-0 rounded px-2 py-1.5 text-sm"
                            >
                              {TARGET_GRADES.map(g => <option key={g} value={g}>{g}</option>)}
                            </select>
                          </div>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeExamGoal(index)}
                            className="text-red-400 hover:text-red-300"
                          >
                            ×
                          </Button>
                        </div>
                      ))}
                    </div>
                    
                    {formData.examGoals.length < 6 && (
                      <Button
                        variant="outline"
                        onClick={addExamGoal}
                        className="w-full border-dashed border-white/20"
                      >
                        + Add Another Subject
                      </Button>
                    )}
                    
                    <div className="mt-6">
                      <Label htmlFor="whyJoin">Why do you want to join this program? *</Label>
                      <Textarea
                        id="whyJoin"
                        value={formData.whyJoin}
                        onChange={(e) => updateFormData('whyJoin', e.target.value)}
                        placeholder="Tell us about your academic goals and why you're committed to transforming your grades..."
                        className="bg-white/5 border-white/10 mt-1 min-h-[100px]"
                      />
                      {errors.whyJoin && <p className="text-red-400 text-sm mt-1">{errors.whyJoin}</p>}
                    </div>
                  </motion.div>
                )}

                {/* Step 4: Commitment */}
                {currentStep === 4 && (
                  <motion.div
                    key="step4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <h2 className="text-xl font-bold mb-4">Your Commitment</h2>
                    
                    <div className="mb-6">
                      <Label>Preferred Daily Study Time *</Label>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {['Early Morning (6-8am)', 'Morning (8-12pm)', 'Afternoon (12-4pm)', 'Evening (4-8pm)', 'Night (8-10pm)'].map(time => (
                          <Button
                            key={time}
                            variant={formData.studyTime === time ? 'default' : 'outline'}
                            onClick={() => updateFormData('studyTime', time)}
                            className={formData.studyTime === time 
                              ? 'bg-purple-600 hover:bg-purple-500' 
                              : 'border-white/20 bg-white/5 hover:bg-white/10 justify-start'
                            }
                          >
                            <Clock className="w-4 h-4 mr-2" />
                            {time.split(' ')[0]}
                          </Button>
                        ))}
                      </div>
                      {errors.studyTime && <p className="text-red-400 text-sm mt-1">{errors.studyTime}</p>}
                    </div>
                    
                    <Card className="bg-purple-500/10 border-purple-500/20 mb-6">
                      <CardContent className="p-4">
                        <h3 className="font-semibold mb-3">Program Commitment Pledge</h3>
                        <ul className="space-y-2 text-sm text-gray-300 mb-4">
                          <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                            I will read 2 school notes every day
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                            I will write summaries for each note I read
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                            I will communicate with my assigned volunteer mentor
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                            I am committed to the 90-day transformation journey
                          </li>
                        </ul>
                        
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.commitmentPledge}
                            onChange={(e) => updateFormData('commitmentPledge', e.target.checked)}
                            className="w-5 h-5 rounded border-white/20 bg-white/5 text-purple-500 focus:ring-purple-500"
                          />
                          <span className="text-sm">I accept the commitment pledge *</span>
                        </label>
                        {errors.commitmentPledge && <p className="text-red-400 text-sm mt-1">{errors.commitmentPledge}</p>}
                      </CardContent>
                    </Card>
                    
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.parentConsent}
                        onChange={(e) => updateFormData('parentConsent', e.target.checked)}
                        className="w-5 h-5 rounded border-white/20 bg-white/5 text-purple-500 focus:ring-purple-500"
                      />
                      <span className="text-sm text-gray-400">My parent/guardian is aware of my enrollment (optional)</span>
                    </label>
                  </motion.div>
                )}

                {/* Step 5: Review */}
                {currentStep === 5 && (
                  <motion.div
                    key="step5"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <h2 className="text-xl font-bold mb-4">Review Your Enrollment</h2>
                    
                    <div className="space-y-4">
                      <Card className="bg-white/5 border-white/10">
                        <CardContent className="p-4">
                          <h4 className="font-semibold text-sm text-gray-400 mb-2">Personal Information</h4>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <p><span className="text-gray-400">Name:</span> {formData.fullName}</p>
                            <p><span className="text-gray-400">Email:</span> {formData.email}</p>
                            <p><span className="text-gray-400">Phone:</span> {formData.phone}</p>
                            <p><span className="text-gray-400">Country:</span> {formData.country}</p>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-white/5 border-white/10">
                        <CardContent className="p-4">
                          <h4 className="font-semibold text-sm text-gray-400 mb-2">Academic Status</h4>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <p><span className="text-gray-400">School:</span> {formData.schoolName}</p>
                            <p><span className="text-gray-400">Grade:</span> {formData.gradeLevel}</p>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-white/5 border-white/10">
                        <CardContent className="p-4">
                          <h4 className="font-semibold text-sm text-gray-400 mb-2">Exam Goals</h4>
                          <div className="space-y-2">
                            {formData.examGoals.map((goal, i) => (
                              <div key={i} className="flex items-center gap-2 text-sm">
                                <span>{goal.subject}</span>
                                <Badge className="bg-red-500/20 text-red-300">{goal.currentGrade}</Badge>
                                <ArrowRight className="w-3 h-3 text-gray-400" />
                                <Badge className="bg-green-500/20 text-green-300">{goal.targetGrade}</Badge>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-white/5 border-white/10">
                        <CardContent className="p-4">
                          <h4 className="font-semibold text-sm text-gray-400 mb-2">Commitment</h4>
                          <p className="text-sm"><span className="text-gray-400">Study Time:</span> {formData.studyTime}</p>
                          <p className="text-sm mt-1">
                            <CheckCircle className="w-4 h-4 inline text-green-400 mr-1" />
                            Commitment pledge accepted
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between mt-8 pt-4 border-t border-white/10">
                <Button
                  variant="ghost"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className="text-gray-400"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Back
                </Button>
                
                {currentStep < ENROLLMENT_STEPS.length ? (
                  <Button
                    onClick={nextStep}
                    className="bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500"
                  >
                    Continue
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Submit Enrollment
                      </>
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="container mx-auto px-4 py-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">How The Program Works</h2>
            <p className="text-gray-400">The Ben Carson simulation effect</p>
          </div>

          <div className="grid md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {[
              { step: 1, title: 'Enroll', description: 'Complete enrollment form', icon: FileText },
              { step: 2, title: 'Get Paired', description: 'Matched with volunteer mentor', icon: Users },
              { step: 3, title: 'Daily Study', description: 'Read 2 notes, write summaries', icon: BookOpen },
              { step: 4, title: 'Transform', description: 'Achieve Straight As in 90 days', icon: Award },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-purple-500/20 flex items-center justify-center">
                  <item.icon className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="font-semibold text-sm">{item.title}</h3>
                <p className="text-xs text-gray-400">{item.description}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
