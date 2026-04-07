'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  CreditCard, CheckCircle, XCircle, Clock, Download, Zap, Crown, Diamond,
  Sparkles, ArrowLeft, Calendar, DollarSign, AlertCircle, Loader2,
  Settings, Receipt, ChevronRight, Shield, Star, Gift
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';

// Mock subscription data
const MOCK_SUBSCRIPTION = {
  plan: 'champion',
  status: 'active',
  price: 9.99,
  currency: 'USD',
  billingCycle: 'monthly',
  currentPeriodStart: '2026-03-01',
  currentPeriodEnd: '2026-04-01',
  trialEnd: null,
  canceledAt: null,
  stripeCustomerId: 'cus_xxx',
  stripeSubscriptionId: 'sub_xxx',
  totalPaid: 29.97,
  paymentsCount: 3,
};

const MOCK_PAYMENTS = [
  {
    id: 'pay1',
    amount: 9.99,
    currency: 'USD',
    status: 'completed',
    description: 'Champion Plan - Monthly',
    createdAt: '2026-03-01',
    receiptUrl: '#',
  },
  {
    id: 'pay2',
    amount: 9.99,
    currency: 'USD',
    status: 'completed',
    description: 'Champion Plan - Monthly',
    createdAt: '2026-02-01',
    receiptUrl: '#',
  },
  {
    id: 'pay3',
    amount: 9.99,
    currency: 'USD',
    status: 'completed',
    description: 'Champion Plan - Monthly',
    createdAt: '2026-01-01',
    receiptUrl: '#',
  },
];

const PLAN_DETAILS = {
  free: {
    name: 'Free',
    icon: Sparkles,
    color: 'from-gray-500 to-gray-400',
    price: 0,
    features: ['5 matches/day', 'Basic questions', 'Join study circles'],
  },
  scholar: {
    name: 'Scholar',
    icon: Zap,
    color: 'from-blue-500 to-cyan-400',
    price: 4.99,
    features: ['Unlimited matches', '10,000+ questions', 'AI study coach', 'Weekly reports'],
  },
  champion: {
    name: 'Champion',
    icon: Crown,
    color: 'from-yellow-500 to-orange-400',
    price: 9.99,
    features: ['Everything in Scholar', 'Priority matchmaking', 'Daily reports', 'Advanced analytics'],
  },
  elite: {
    name: 'Elite',
    icon: Diamond,
    color: 'from-purple-500 to-pink-400',
    price: 19.99,
    features: ['Everything in Champion', '1-on-1 AI tutoring', 'Career counseling', 'Exclusive tournaments'],
  },
};

export default function SubscriptionPage() {
  const [subscription, setSubscription] = useState<any>(null);
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setSubscription(MOCK_SUBSCRIPTION);
      setPayments(MOCK_PAYMENTS);
      setLoading(false);
    }, 800);
  }, []);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const getDaysRemaining = () => {
    if (!subscription) return 0;
    const end = new Date(subscription.currentPeriodEnd);
    const now = new Date();
    return Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
      </div>
    );
  }

  const currentPlan = PLAN_DETAILS[subscription?.plan || 'free'];
  const PlanIcon = currentPlan.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 text-white">
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/settings">
            <Button variant="ghost" className="text-gray-400 hover:text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Subscription</h1>
            <p className="text-gray-400">Manage your plan and billing</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Current Plan */}
          <div className="lg:col-span-2 space-y-6">
            {/* Plan Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="bg-white/5 border-white/10">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center gap-6">
                    {/* Plan Icon */}
                    <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${currentPlan.color} flex items-center justify-center flex-shrink-0`}>
                      <PlanIcon className="w-10 h-10 text-white" />
                    </div>

                    {/* Plan Details */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h2 className="text-2xl font-bold">{currentPlan.name} Plan</h2>
                        <Badge className={
                          subscription?.status === 'active' 
                            ? 'bg-green-500/20 text-green-400 border-green-500/30'
                            : subscription?.status === 'canceled'
                            ? 'bg-red-500/20 text-red-400 border-red-500/30'
                            : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                        }>
                          {subscription?.status === 'active' && <CheckCircle className="w-3 h-3 mr-1" />}
                          {subscription?.status?.charAt(0).toUpperCase() + subscription?.status?.slice(1)}
                        </Badge>
                      </div>
                      <p className="text-gray-400 mb-4">
                        {formatCurrency(currentPlan.price)}/{subscription?.billingCycle === 'yearly' ? 'year' : 'month'}
                      </p>

                      {/* Usage */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Days remaining in billing period</span>
                          <span>{getDaysRemaining()} days</span>
                        </div>
                        <Progress 
                          value={((30 - getDaysRemaining()) / 30) * 100} 
                          className="h-2"
                        />
                        <p className="text-xs text-gray-500">
                          Renews on {formatDate(subscription?.currentPeriodEnd || '')}
                        </p>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      <p className="text-3xl font-bold">{formatCurrency(currentPlan.price)}</p>
                      <p className="text-sm text-gray-400">per month</p>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="mt-6 pt-6 border-t border-white/10">
                    <h4 className="font-medium mb-3">Plan Features</h4>
                    <div className="grid md:grid-cols-2 gap-2">
                      {currentPlan.features.map((feature, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-gray-400">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Payment History */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Receipt className="w-5 h-5 text-purple-400" />
                    Payment History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {payments.map((payment) => (
                      <div 
                        key={payment.id} 
                        className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            payment.status === 'completed' 
                              ? 'bg-green-500/20' 
                              : 'bg-amber-500/20'
                          }`}>
                            {payment.status === 'completed' ? (
                              <CheckCircle className="w-4 h-4 text-green-400" />
                            ) : (
                              <Clock className="w-4 h-4 text-amber-400" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{payment.description}</p>
                            <p className="text-xs text-gray-500">{formatDate(payment.createdAt)}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-medium">{formatCurrency(payment.amount)}</span>
                          <Button variant="ghost" size="sm" className="text-purple-400 hover:text-purple-300">
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 pt-4 border-t border-white/10">
                    <p className="text-sm text-gray-400">
                      Total paid: <span className="text-white font-medium">{formatCurrency(subscription?.totalPaid || 0)}</span>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    onClick={() => setShowUpgradeModal(true)}
                    className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500"
                  >
                    <Star className="w-4 h-4 mr-2" />
                    Upgrade Plan
                  </Button>
                  <Button variant="outline" className="w-full border-white/20 bg-white/5">
                    <CreditCard className="w-4 h-4 mr-2" />
                    Update Payment Method
                  </Button>
                  <Button variant="outline" className="w-full border-white/20 bg-white/5">
                    <Gift className="w-4 h-4 mr-2" />
                    Redeem Code
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Available Plans */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-lg">Available Plans</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {Object.entries(PLAN_DETAILS).map(([key, plan]) => {
                    const isActive = key === subscription?.plan;
                    const PlanIconLocal = plan.icon;
                    return (
                      <div 
                        key={key}
                        className={`flex items-center justify-between p-3 rounded-lg ${
                          isActive ? 'bg-purple-500/20 border border-purple-500/30' : 'bg-white/5'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${plan.color} flex items-center justify-center`}>
                            <PlanIconLocal className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <p className="font-medium">{plan.name}</p>
                            <p className="text-xs text-gray-400">{formatCurrency(plan.price)}/mo</p>
                          </div>
                        </div>
                        {isActive && (
                          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                            Current
                          </Badge>
                        )}
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            </motion.div>

            {/* Danger Zone */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="bg-red-500/5 border-red-500/20">
                <CardContent className="p-4">
                  <h4 className="font-medium text-red-400 mb-2">Cancel Subscription</h4>
                  <p className="text-sm text-gray-400 mb-3">
                    You'll retain access until the end of your billing period.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => setShowCancelModal(true)}
                    className="w-full border-red-500/30 text-red-400 hover:bg-red-500/10"
                  >
                    Cancel Subscription
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <Card className="bg-slate-900 border-white/10 w-full max-w-md">
            <CardHeader>
              <CardTitle>Upgrade Your Plan</CardTitle>
              <CardDescription>Choose a plan that fits your goals</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {['scholar', 'champion', 'elite'].map((planKey) => {
                const plan = PLAN_DETAILS[planKey as keyof typeof PLAN_DETAILS];
                const Icon = plan.icon;
                return (
                  <button
                    key={planKey}
                    onClick={() => {
                      // Handle upgrade
                      setShowUpgradeModal(false);
                    }}
                    className={`w-full flex items-center gap-4 p-4 rounded-lg transition-all ${
                      planKey === subscription?.plan
                        ? 'bg-purple-500/20 border border-purple-500/30'
                        : 'bg-white/5 hover:bg-white/10 border border-transparent'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${plan.color} flex items-center justify-center`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-medium">{plan.name}</p>
                      <p className="text-sm text-gray-400">{formatCurrency(plan.price)}/month</p>
                    </div>
                    {planKey === subscription?.plan && (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    )}
                  </button>
                );
              })}
              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowUpgradeModal(false)}
                  className="flex-1 border-white/20 bg-white/5"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <Card className="bg-slate-900 border-white/10 w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-red-400">Cancel Subscription?</CardTitle>
              <CardDescription>
                You'll lose access to premium features at the end of your billing period.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 mb-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-amber-400">Before you go...</p>
                    <p className="text-sm text-gray-400 mt-1">
                      Consider downgrading to Scholar plan at {formatCurrency(4.99)}/mo instead of cancelling completely.
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowCancelModal(false)}
                  className="flex-1 border-white/20 bg-white/5"
                >
                  Keep Plan
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={() => {
                    // Handle cancellation
                    setShowCancelModal(false);
                  }}
                >
                  Cancel Anyway
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
