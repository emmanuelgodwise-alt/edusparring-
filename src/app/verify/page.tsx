'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GraduationCap, Mail, Check, ArrowRight, Shield, Loader2,
  School, CheckCircle2, AlertCircle, ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

const STEPS = [
  { id: 1, title: 'School Email', description: 'Enter your school email address' },
  { id: 2, title: 'Verification', description: 'Enter the code sent to your email' },
  { id: 3, title: 'Complete', description: 'Your account is verified!' }
];

const SCHOOL_SUGGESTIONS = [
  'Harvard University', 'MIT', 'Stanford University', 'Oxford University',
  'Cambridge University', 'UCLA', 'Berkeley', 'Columbia University'
];

export default function VerificationPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [schoolEmail, setSchoolEmail] = useState('');
  const [schoolName, setSchoolName] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [devCode, setDevCode] = useState(''); // For development

  // Mock user ID - in production, get from auth
  const userId = 'demo-user-id';

  const handleSendCode = async () => {
    if (!schoolEmail || !schoolName) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/verification/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, schoolEmail, schoolName })
      });

      const data = await res.json();

      if (data.success) {
        setCurrentStep(2);
        if (data.devCode) {
          setDevCode(data.devCode);
        }
      } else {
        setError(data.error || 'Failed to send verification code');
      }
    } catch (err) {
      setError('Failed to send verification code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      setError('Please enter a 6-digit code');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/verification/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, verificationCode })
      });

      const data = await res.json();

      if (data.success) {
        setSuccess(true);
        setCurrentStep(3);
      } else {
        setError(data.error || 'Invalid verification code');
      }
    } catch (err) {
      setError('Failed to verify code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const progress = (currentStep / 3) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 text-white">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-black/30 border-b border-white/10">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <GraduationCap className="w-8 h-8 text-purple-400" />
            </motion.div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              EduSparring
            </h1>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 max-w-lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Student Verification</h1>
          <p className="text-gray-400">Verify your school email to unlock all features</p>
        </motion.div>

        {/* Progress Steps */}
        <div className="mb-8">
          <Progress value={progress} className="h-2 mb-4" />
          <div className="flex justify-between">
            {STEPS.map((step) => (
              <div
                key={step.id}
                className={`flex flex-col items-center ${
                  currentStep >= step.id ? 'text-purple-400' : 'text-gray-500'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${
                  currentStep > step.id
                    ? 'bg-green-500 text-white'
                    : currentStep === step.id
                    ? 'bg-purple-500 text-white'
                    : 'bg-gray-700 text-gray-400'
                }`}>
                  {currentStep > step.id ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    step.id
                  )}
                </div>
                <span className="text-xs font-medium hidden sm:block">{step.title}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <Card className="bg-white/5 border-white/10 backdrop-blur-lg">
          <CardContent className="p-6">
            <AnimatePresence mode="wait">
              {/* Step 1: Email Input */}
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="schoolName">School Name</Label>
                    <Input
                      id="schoolName"
                      value={schoolName}
                      onChange={(e) => setSchoolName(e.target.value)}
                      placeholder="e.g., Harvard University"
                      className="bg-white/5 border-white/10"
                    />
                    <div className="flex flex-wrap gap-1 mt-2">
                      {SCHOOL_SUGGESTIONS.slice(0, 4).map((school) => (
                        <button
                          key={school}
                          onClick={() => setSchoolName(school)}
                          className="text-xs px-2 py-1 bg-white/5 rounded-full hover:bg-white/10 transition-colors"
                        >
                          {school}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="schoolEmail">School Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="schoolEmail"
                        type="email"
                        value={schoolEmail}
                        onChange={(e) => setSchoolEmail(e.target.value)}
                        placeholder="your.name@school.edu"
                        className="pl-10 bg-white/5 border-white/10"
                      />
                    </div>
                    <p className="text-xs text-gray-400">
                      Must be a valid .edu, .k12, or school domain
                    </p>
                  </div>

                  {error && (
                    <div className="flex items-center gap-2 text-red-400 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      {error}
                    </div>
                  )}

                  <Button
                    onClick={handleSendCode}
                    disabled={isLoading || !schoolEmail || !schoolName}
                    className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                      <>
                        Send Verification Code
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </motion.div>
              )}

              {/* Step 2: Verification Code */}
              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="text-center mb-4">
                    <School className="w-12 h-12 mx-auto mb-2 text-purple-400" />
                    <p className="text-sm text-gray-400">
                      We sent a verification code to
                    </p>
                    <p className="font-medium">{schoolEmail}</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="code">Enter 6-Digit Code</Label>
                    <Input
                      id="code"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      placeholder="000000"
                      className="text-center text-2xl tracking-widest bg-white/5 border-white/10"
                      maxLength={6}
                    />
                  </div>

                  {devCode && (
                    <div className="text-center text-sm text-cyan-400">
                      Development mode: Code is <span className="font-mono font-bold">{devCode}</span>
                    </div>
                  )}

                  {error && (
                    <div className="flex items-center gap-2 text-red-400 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      {error}
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentStep(1)}
                      className="flex-1 border-white/20"
                    >
                      Back
                    </Button>
                    <Button
                      onClick={handleVerify}
                      disabled={isLoading || verificationCode.length !== 6}
                      className="flex-1 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500"
                    >
                      {isLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        'Verify'
                      )}
                    </Button>
                  </div>

                  <p className="text-xs text-center text-gray-400">
                    Didn&apos;t receive the code?{' '}
                    <button
                      onClick={handleSendCode}
                      className="text-purple-400 hover:underline"
                    >
                      Resend
                    </button>
                  </p>
                </motion.div>
              )}

              {/* Step 3: Success */}
              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center space-y-4"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', bounce: 0.5 }}
                    className="w-20 h-20 mx-auto rounded-full bg-green-500/20 flex items-center justify-center"
                  >
                    <CheckCircle2 className="w-10 h-10 text-green-400" />
                  </motion.div>

                  <h2 className="text-2xl font-bold">You&apos;re Verified!</h2>
                  <p className="text-gray-400">
                    Your student account has been successfully verified.
                  </p>

                  <div className="flex flex-wrap justify-center gap-2">
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Verified Student
                    </Badge>
                    <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                      <School className="w-3 h-3 mr-1" />
                      {schoolName}
                    </Badge>
                  </div>

                  <div className="bg-white/5 rounded-lg p-4 text-left space-y-2 mt-4">
                    <p className="text-sm font-medium text-purple-400">You&apos;ve unlocked:</p>
                    <ul className="text-sm text-gray-300 space-y-1">
                      <li className="flex items-center gap-2">
                        <ChevronRight className="w-4 h-4 text-cyan-400" />
                        Full access to all social features
                      </li>
                      <li className="flex items-center gap-2">
                        <ChevronRight className="w-4 h-4 text-cyan-400" />
                        Join and create study circles
                      </li>
                      <li className="flex items-center gap-2">
                        <ChevronRight className="w-4 h-4 text-cyan-400" />
                        Peer tutoring sessions
                      </li>
                      <li className="flex items-center gap-2">
                        <ChevronRight className="w-4 h-4 text-cyan-400" />
                        Character badges & achievements
                      </li>
                    </ul>
                  </div>

                  <Link href="/social">
                    <Button className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500">
                      Go to Social Hub
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>

        {/* Safety Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 text-center"
        >
          <p className="text-xs text-gray-500">
            Your information is secure and will only be used for verification.
          </p>
        </motion.div>
      </main>
    </div>
  );
}
