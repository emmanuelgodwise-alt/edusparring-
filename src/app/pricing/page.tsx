'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Check, X, Sparkles, Zap, Crown, Diamond, Star, Shield,
  Users, Brain, Target, Trophy, Clock, MessageSquare, Globe,
  ChevronRight, ArrowRight, BadgeCheck, Heart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import Link from 'next/link';

// Pricing tiers
const PRICING_TIERS = [
  {
    id: 'free',
    name: 'Free',
    tagline: 'Get Started',
    price: { monthly: 0, yearly: 0 },
    description: 'Perfect for exploring EduSparring and casual learning',
    icon: Sparkles,
    color: 'from-gray-500 to-gray-400',
    popular: false,
    features: [
      { name: 'Knowledge Sparring matches', included: true, limit: '5 per day' },
      { name: 'Basic question bank access', included: true, limit: '1,000 questions' },
      { name: 'Knowledge Rating system', included: true },
      { name: 'Study circles (join only)', included: true },
      { name: 'Basic leaderboard', included: true },
      { name: 'Chat translation', included: true, limit: '10 messages/day' },
      { name: 'Career portal access', included: true },
      { name: 'Mock job applications', included: true, limit: '3 active' },
      { name: 'AI study coach', included: false },
      { name: 'Detailed analytics', included: false },
      { name: 'Priority matchmaking', included: false },
      { name: 'Tournament participation', included: false },
    ],
    cta: 'Get Started Free',
    ctaVariant: 'outline' as const,
  },
  {
    id: 'scholar',
    name: 'Scholar',
    tagline: 'Serious Learners',
    price: { monthly: 4.99, yearly: 49 },
    description: 'For students committed to academic excellence',
    icon: Zap,
    color: 'from-blue-500 to-cyan-400',
    popular: false,
    features: [
      { name: 'Knowledge Sparring matches', included: true, limit: 'Unlimited' },
      { name: 'Full question bank access', included: true, limit: '10,000+ questions' },
      { name: 'Knowledge Rating system', included: true },
      { name: 'Study circles (create & join)', included: true },
      { name: 'Full leaderboard access', included: true },
      { name: 'Unlimited chat translation', included: true },
      { name: 'Career portal access', included: true },
      { name: 'Mock job applications', included: true, limit: '10 active' },
      { name: 'Basic AI study coach', included: true },
      { name: 'Weekly progress reports', included: true },
      { name: 'Priority matchmaking', included: false },
      { name: 'Tournament participation', included: true },
    ],
    cta: 'Start 7-Day Free Trial',
    ctaVariant: 'default' as const,
  },
  {
    id: 'champion',
    name: 'Champion',
    tagline: 'Competitive Excellence',
    price: { monthly: 9.99, yearly: 99 },
    description: 'For ambitious students aiming for the top',
    icon: Crown,
    color: 'from-yellow-500 to-orange-400',
    popular: true,
    features: [
      { name: 'Knowledge Sparring matches', included: true, limit: 'Unlimited' },
      { name: 'Full question bank + premium', included: true, limit: '15,000+ questions' },
      { name: 'Knowledge Rating system', included: true },
      { name: 'Study circles (create & join)', included: true },
      { name: 'Full leaderboard + trends', included: true },
      { name: 'Unlimited chat translation', included: true },
      { name: 'Priority career portal access', included: true },
      { name: 'Mock job applications', included: true, limit: 'Unlimited' },
      { name: 'Advanced AI study coach', included: true },
      { name: 'Daily progress reports', included: true },
      { name: 'Priority matchmaking', included: true },
      { name: 'Tournament participation', included: true },
    ],
    cta: 'Start 7-Day Free Trial',
    ctaVariant: 'default' as const,
  },
  {
    id: 'elite',
    name: 'Elite',
    tagline: 'Maximum Advantage',
    price: { monthly: 19.99, yearly: 199 },
    description: 'The ultimate package for future leaders',
    icon: Diamond,
    color: 'from-purple-500 to-pink-400',
    popular: false,
    features: [
      { name: 'Everything in Champion', included: true },
      { name: 'Exclusive Elite questions', included: true, limit: '5,000+ questions' },
      { name: '1-on-1 AI tutoring sessions', included: true, limit: '4 per month' },
      { name: 'Personal learning path', included: true },
      { name: 'Career counseling', included: true, limit: '1 session/month' },
      { name: 'Elite tournaments', included: true, limit: 'Exclusive access' },
      { name: 'Early mock job access', included: true, limit: '48h before others' },
      { name: 'Certificate of completion', included: true },
      { name: 'Priority support', included: true },
      { name: 'Ad-free experience', included: true },
      { name: 'Beta features access', included: true },
      { name: 'Alumni network access', included: true },
    ],
    cta: 'Start 7-Day Free Trial',
    ctaVariant: 'default' as const,
  },
];

// Feature comparison for detailed view
const FEATURE_CATEGORIES = [
  {
    name: 'Learning & Sparring',
    features: [
      { name: 'Daily matches', free: '5', scholar: 'Unlimited', champion: 'Unlimited', elite: 'Unlimited' },
      { name: 'Question bank', free: '1,000', scholar: '10,000+', champion: '15,000+', elite: '20,000+' },
      { name: 'Subject variety', free: '5', scholar: '15', champion: 'All', elite: 'All + Exclusive' },
      { name: 'Difficulty levels', free: 'Basic', scholar: 'All', champion: 'All', elite: 'All + Custom' },
    ],
  },
  {
    name: 'Analytics & Insights',
    features: [
      { name: 'Performance tracking', free: 'Basic', scholar: 'Weekly', champion: 'Daily', elite: 'Real-time' },
      { name: 'Weakness analysis', free: false, scholar: true, champion: true, elite: true },
      { name: 'Learning path recommendations', free: false, scholar: false, champion: true, elite: 'Personalized' },
      { name: 'Progress predictions', free: false, scholar: false, champion: false, elite: true },
    ],
  },
  {
    name: 'Career & Jobs',
    features: [
      { name: 'Job board access', free: true, scholar: true, champion: 'Priority', elite: 'Early access' },
      { name: 'Active applications', free: '3', scholar: '10', champion: 'Unlimited', elite: 'Unlimited' },
      { name: 'Resume builder', free: false, scholar: true, champion: true, elite: true },
      { name: 'Career counseling', free: false, scholar: false, champion: false, elite: '1/month' },
    ],
  },
  {
    name: 'Social & Community',
    features: [
      { name: 'Study circles', free: 'Join', scholar: 'Create & Join', champion: 'Create & Join', elite: 'VIP status' },
      { name: 'Chat translation', free: '10/day', scholar: 'Unlimited', champion: 'Unlimited', elite: 'Unlimited' },
      { name: 'Tournaments', free: false, scholar: true, champion: true, elite: 'VIP events' },
      { name: 'Peer tutoring', free: false, scholar: true, champion: true, elite: 'Free sessions' },
    ],
  },
];

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [showComparison, setShowComparison] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: price % 1 === 0 ? 0 : 2,
    }).format(price);
  };

  const getSavings = (monthly: number, yearly: number) => {
    const yearlyEquivalent = monthly * 12;
    const savings = yearlyEquivalent - yearly;
    return Math.round((savings / yearlyEquivalent) * 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 text-white">
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-500/5 rounded-full blur-3xl" />
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
              <Sparkles className="w-3 h-3 mr-1" />
              Simple, Transparent Pricing
            </Badge>

            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-purple-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
                Choose Your Path to Excellence
              </span>
            </h1>

            <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
              Start free and upgrade as you grow. Every plan includes our core competitive learning experience.
            </p>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <span className={billingCycle === 'monthly' ? 'text-white' : 'text-gray-400'}>
                Monthly
              </span>
              <Switch
                checked={billingCycle === 'yearly'}
                onCheckedChange={(checked) => setBillingCycle(checked ? 'yearly' : 'monthly')}
              />
              <span className={billingCycle === 'yearly' ? 'text-white' : 'text-gray-400'}>
                Yearly
              </span>
              {billingCycle === 'yearly' && (
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                  Save up to 17%
                </Badge>
              )}
            </div>
          </motion.div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {PRICING_TIERS.map((tier, index) => (
              <motion.div
                key={tier.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                    <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-semibold">
                      <Star className="w-3 h-3 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}
                <Card className={`bg-white/5 border-white/10 h-full flex flex-col ${
                  tier.popular ? 'ring-2 ring-yellow-500/50' : ''
                }`}>
                  <CardHeader className="text-center">
                    <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-br ${tier.color} flex items-center justify-center mb-4`}>
                      <tier.icon className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-2xl">{tier.name}</CardTitle>
                    <CardDescription>{tier.tagline}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    {/* Price */}
                    <div className="text-center mb-6">
                      <div className="flex items-end justify-center gap-1">
                        <span className="text-4xl font-bold">
                          {formatPrice(tier.price[billingCycle])}
                        </span>
                        {tier.price[billingCycle] > 0 && (
                          <span className="text-gray-400 mb-1">
                            /{billingCycle === 'monthly' ? 'mo' : 'yr'}
                          </span>
                        )}
                      </div>
                      {billingCycle === 'yearly' && tier.price.monthly > 0 && (
                        <p className="text-sm text-green-400 mt-1">
                          Save {getSavings(tier.price.monthly, tier.price.yearly)}%
                        </p>
                      )}
                      <p className="text-sm text-gray-500 mt-2">{tier.description}</p>
                    </div>

                    {/* Features */}
                    <div className="space-y-3 flex-1 mb-6">
                      {tier.features.slice(0, 8).map((feature, i) => (
                        <div key={i} className="flex items-start gap-2">
                          {feature.included ? (
                            <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                          ) : (
                            <X className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                          )}
                          <span className={`text-sm ${feature.included ? 'text-gray-300' : 'text-gray-500'}`}>
                            {feature.name}
                            {feature.limit && feature.included && (
                              <span className="text-gray-500"> ({feature.limit})</span>
                            )}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* CTA */}
                    <Link href={tier.id === 'free' ? '/auth/signup' : '/subscription?plan=' + tier.id}>
                      <Button
                        className={`w-full ${
                          tier.popular
                            ? 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black'
                            : tier.id === 'free'
                            ? 'border-white/20 bg-white/5 hover:bg-white/10'
                            : 'bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500'
                        }`}
                        variant={tier.ctaVariant}
                      >
                        {tier.cta}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* All plans include */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-12 text-center"
          >
            <Card className="bg-white/5 border-white/10 max-w-3xl mx-auto">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">All Plans Include</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  {[
                    { icon: Shield, text: 'Safe environment' },
                    { icon: Users, text: 'Student verification' },
                    { icon: Trophy, text: 'KR Rating system' },
                    { icon: Globe, text: '28 languages' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 justify-center">
                      <item.icon className="w-4 h-4 text-purple-400" />
                      <span className="text-gray-400">{item.text}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </section>

        {/* Detailed Comparison */}
        <section className="container mx-auto px-4 py-12">
          <div className="text-center mb-8">
            <Button
              variant="outline"
              onClick={() => setShowComparison(!showComparison)}
              className="border-white/20 bg-white/5"
            >
              {showComparison ? 'Hide' : 'Show'} Detailed Comparison
              <ChevronRight className={`w-4 h-4 ml-2 transition-transform ${showComparison ? 'rotate-90' : ''}`} />
            </Button>
          </div>

          {showComparison && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="max-w-5xl mx-auto"
            >
              <Card className="bg-white/5 border-white/10 overflow-x-auto">
                <CardContent className="p-6">
                  {FEATURE_CATEGORIES.map((category, catIndex) => (
                    <div key={catIndex} className={catIndex > 0 ? 'mt-8' : ''}>
                      <h4 className="font-semibold text-purple-400 mb-4">{category.name}</h4>
                      <table className="w-full">
                        <thead>
                          <tr className="text-left text-sm text-gray-400">
                            <th className="pb-3">Feature</th>
                            <th className="pb-3 text-center">Free</th>
                            <th className="pb-3 text-center">Scholar</th>
                            <th className="pb-3 text-center">Champion</th>
                            <th className="pb-3 text-center">Elite</th>
                          </tr>
                        </thead>
                        <tbody>
                          {category.features.map((feature, i) => (
                            <tr key={i} className="border-t border-white/5">
                              <td className="py-3 text-sm">{feature.name}</td>
                              <td className="py-3 text-center text-sm">
                                {typeof feature.free === 'boolean' ? (
                                  feature.free ? <Check className="w-4 h-4 text-green-400 mx-auto" /> : <X className="w-4 h-4 text-gray-500 mx-auto" />
                                ) : (
                                  <span className="text-gray-400">{feature.free}</span>
                                )}
                              </td>
                              <td className="py-3 text-center text-sm">
                                {typeof feature.scholar === 'boolean' ? (
                                  feature.scholar ? <Check className="w-4 h-4 text-green-400 mx-auto" /> : <X className="w-4 h-4 text-gray-500 mx-auto" />
                                ) : (
                                  <span className="text-gray-400">{feature.scholar}</span>
                                )}
                              </td>
                              <td className="py-3 text-center text-sm">
                                {typeof feature.champion === 'boolean' ? (
                                  feature.champion ? <Check className="w-4 h-4 text-green-400 mx-auto" /> : <X className="w-4 h-4 text-gray-500 mx-auto" />
                                ) : (
                                  <span className="text-cyan-400">{feature.champion}</span>
                                )}
                              </td>
                              <td className="py-3 text-center text-sm">
                                {typeof feature.elite === 'boolean' ? (
                                  feature.elite ? <Check className="w-4 h-4 text-green-400 mx-auto" /> : <X className="w-4 h-4 text-gray-500 mx-auto" />
                                ) : (
                                  <span className="text-purple-400">{feature.elite}</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </section>

        {/* FAQ */}
        <section className="container mx-auto px-4 py-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">Frequently Asked Questions</h2>
            <p className="text-gray-400">Everything you need to know about our pricing</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              {
                q: 'Can I switch plans anytime?',
                a: 'Yes! You can upgrade or downgrade your plan at any time. When upgrading, you\'ll be prorated for the remainder of your billing cycle.',
              },
              {
                q: 'Is there a free trial for premium plans?',
                a: 'Yes, all premium plans (Scholar, Champion, Elite) come with a 7-day free trial. No credit card required to start.',
              },
              {
                q: 'What payment methods do you accept?',
                a: 'We accept all major credit cards, PayPal, and in some regions, mobile money and local payment methods.',
              },
              {
                q: 'Can I cancel my subscription?',
                a: 'Yes, you can cancel anytime. Your premium features will remain active until the end of your billing period.',
              },
              {
                q: 'Do you offer discounts for students in developing countries?',
                a: 'Yes! We offer up to 50% discount for students in eligible countries. Contact support for more information.',
              },
              {
                q: 'What happens to my data if I downgrade?',
                a: 'Your data is preserved. Some features may become read-only, but you can always upgrade again to regain full access.',
              },
            ].map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="bg-white/5 border-white/10 h-full">
                  <CardContent className="p-5">
                    <h4 className="font-semibold mb-2">{faq.q}</h4>
                    <p className="text-sm text-gray-400">{faq.a}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Institutional CTA */}
        <section className="container mx-auto px-4 py-12">
          <Card className="bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border-purple-500/20 max-w-4xl mx-auto">
            <CardContent className="p-8 text-center">
              <Building2 className="w-12 h-12 mx-auto mb-4 text-purple-400" />
              <h2 className="text-2xl font-bold mb-2">For Schools & Institutions</h2>
              <p className="text-gray-400 mb-6 max-w-xl mx-auto">
                Looking to deploy EduSparring for your school or administer public exams? 
                We offer special institutional pricing and exam administration partnerships.
              </p>
              <Link href="/institutions">
                <Button className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500">
                  Explore Institutional Plans
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </section>

        {/* Trust Badges */}
        <section className="container mx-auto px-4 py-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">Trusted by Students Worldwide</h2>
            <p className="text-gray-400">Built with security, privacy, and trust at the core</p>
          </div>

          <div className="flex flex-wrap justify-center gap-8">
            {[
              { icon: Shield, label: 'FERPA Compliant' },
              { icon: BadgeCheck, label: 'GDPR Ready' },
              { icon: Heart, label: 'COPPA Safe' },
              { icon: Shield, label: 'SOC 2 Certified' },
            ].map((badge, i) => (
              <div key={i} className="flex items-center gap-2 text-gray-400">
                <badge.icon className="w-5 h-5 text-purple-400" />
                <span>{badge.label}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

// Import Building2 for institutional section
function Building2({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
      <path d="M9 22v-4h6v4" />
      <path d="M8 6h.01" />
      <path d="M16 6h.01" />
      <path d="M12 6h.01" />
      <path d="M12 10h.01" />
      <path d="M12 14h.01" />
      <path d="M16 10h.01" />
      <path d="M16 14h.01" />
      <path d="M8 10h.01" />
      <path d="M8 14h.01" />
    </svg>
  );
}
