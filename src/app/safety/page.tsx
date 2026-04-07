'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield, AlertTriangle, UserX, Lock, Heart, Phone, MessageCircle,
  Flag, Users, Bell, Eye, EyeOff, Settings, ChevronRight, CheckCircle2,
  XCircle, Send, Loader2, ArrowLeft, BookOpen
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import Link from 'next/link';
import { cn } from '@/lib/utils';

// Mock data
const BLOCKED_USERS = [
  { id: '1', name: 'Problematic User', reason: 'Inappropriate messages', date: new Date(Date.now() - 86400000 * 5) },
  { id: '2', name: 'Spam Account', reason: 'Spam', date: new Date(Date.now() - 86400000 * 2) },
];

const PRIVACY_SETTINGS = {
  profileVisibility: 'friends',
  showOnlineStatus: true,
  allowFriendRequests: true,
  showActivityFeed: true,
  dataSharing: false,
};

const MENTAL_HEALTH_RESOURCES = [
  { name: 'Crisis Text Line', description: 'Text HOME to 741741', icon: MessageCircle, color: 'text-blue-400' },
  { name: 'National Suicide Prevention', description: '1-800-273-8255', icon: Phone, color: 'text-green-400' },
  { name: 'Talk to a Counselor', description: 'Connect with your school counselor', icon: Heart, color: 'text-pink-400' },
  { name: 'Self-Care Tips', description: 'Mental wellness resources', icon: BookOpen, color: 'text-purple-400' },
];

export default function SafetyCenterPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [privacySettings, setPrivacySettings] = useState(PRIVACY_SETTINGS);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [reportData, setReportData] = useState({
    contentType: '',
    reason: '',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [blockedUsers, setBlockedUsers] = useState(BLOCKED_USERS);

  const handleReport = async () => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setReportDialogOpen(false);
    setIsSubmitting(false);
    setReportData({ contentType: '', reason: '', description: '' });
  };

  const handleUnblock = (userId: string) => {
    setBlockedUsers(prev => prev.filter(u => u.id !== userId));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 text-white pb-20">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-black/30 border-b border-white/10">
        <div className="container mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/social">
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-purple-400" />
            <h1 className="text-xl font-bold">Safety Center</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 max-w-2xl">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 bg-slate-800/50 border border-slate-700 mb-6">
            <TabsTrigger value="overview" className="data-[state=active]:bg-purple-600">
              <Shield className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="report" className="data-[state=active]:bg-purple-600">
              <Flag className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">Report</span>
            </TabsTrigger>
            <TabsTrigger value="privacy" className="data-[state=active]:bg-purple-600">
              <Lock className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">Privacy</span>
            </TabsTrigger>
            <TabsTrigger value="support" className="data-[state=active]:bg-purple-600">
              <Heart className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">Support</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <Card className="bg-gradient-to-br from-purple-900/30 to-cyan-900/30 border-purple-500/20">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                    <Shield className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold mb-1">Your Safety Matters</h2>
                    <p className="text-sm text-gray-400">
                      EduSparring is committed to creating a safe learning environment. 
                      All features require student verification, and we monitor for inappropriate content.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Safety Features Grid */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: CheckCircle2, title: 'Verified Students', description: 'Only real students can join', color: 'text-green-400' },
                { icon: Eye, title: 'Content Moderation', description: 'AI-powered safety filters', color: 'text-cyan-400' },
                { icon: UserX, title: 'Block Users', description: 'Block anyone instantly', color: 'text-red-400' },
                { icon: Flag, title: 'Report Content', description: 'Quick reporting system', color: 'text-yellow-400' },
                { icon: Users, title: 'Guardian Access', description: 'Parents can monitor', color: 'text-purple-400' },
                { icon: Bell, title: 'Safety Alerts', description: 'Instant notifications', color: 'text-orange-400' },
              ].map((feature) => (
                <Card key={feature.title} className="bg-white/5 border-white/10">
                  <CardContent className="p-4">
                    <feature.icon className={cn('w-6 h-6 mb-2', feature.color)} />
                    <h3 className="font-medium text-sm">{feature.title}</h3>
                    <p className="text-xs text-gray-400">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Blocked Users */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <UserX className="w-4 h-4 text-red-400" />
                  Blocked Users
                </CardTitle>
              </CardHeader>
              <CardContent>
                {blockedUsers.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-4">No blocked users</p>
                ) : (
                  <div className="space-y-2">
                    {blockedUsers.map((user) => (
                      <div key={user.id} className="flex items-center justify-between p-2 bg-white/5 rounded-lg">
                        <div>
                          <p className="text-sm font-medium">{user.name}</p>
                          <p className="text-xs text-gray-400">{user.reason}</p>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUnblock(user.id)}
                          className="border-white/20 text-xs"
                        >
                          Unblock
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Guardian Connection */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Users className="w-4 h-4 text-purple-400" />
                  Guardian Connection
                </CardTitle>
                <CardDescription>
                  Allow a parent or guardian to view your activity
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/guardian">
                  <Button variant="outline" className="w-full border-purple-500/30 text-purple-400">
                    <Users className="w-4 h-4 mr-2" />
                    Manage Guardian Access
                    <ChevronRight className="w-4 h-4 ml-auto" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Report Tab */}
          <TabsContent value="report" className="space-y-4">
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Flag className="w-5 h-5 text-red-400" />
                  Report Content or User
                </CardTitle>
                <CardDescription>
                  Help us keep EduSparring safe by reporting inappropriate content
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>What are you reporting?</Label>
                  <Select
                    value={reportData.contentType}
                    onValueChange={(value) => setReportData(prev => ({ ...prev, contentType: value }))}
                  >
                    <SelectTrigger className="bg-white/5 border-white/10">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="post">Post or Activity</SelectItem>
                      <SelectItem value="comment">Comment</SelectItem>
                      <SelectItem value="message">Direct Message</SelectItem>
                      <SelectItem value="profile">User Profile</SelectItem>
                      <SelectItem value="circle">Study Circle</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Reason</Label>
                  <Select
                    value={reportData.reason}
                    onValueChange={(value) => setReportData(prev => ({ ...prev, reason: value }))}
                  >
                    <SelectTrigger className="bg-white/5 border-white/10">
                      <SelectValue placeholder="Select reason" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="harassment">Harassment or Bullying</SelectItem>
                      <SelectItem value="inappropriate">Inappropriate Content</SelectItem>
                      <SelectItem value="spam">Spam or Scam</SelectItem>
                      <SelectItem value="cheating">Academic Dishonesty</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={reportData.description}
                    onChange={(e) => setReportData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Please provide details about the issue..."
                    className="bg-white/5 border-white/10 min-h-[100px]"
                  />
                </div>

                <Button
                  onClick={handleReport}
                  disabled={!reportData.contentType || !reportData.reason || isSubmitting}
                  className="w-full bg-gradient-to-r from-red-600 to-orange-600"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <Send className="w-4 h-4 mr-2" />
                  )}
                  Submit Report
                </Button>
              </CardContent>
            </Card>

            {/* What happens next */}
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-4">
                <h3 className="font-medium mb-2">What happens next?</h3>
                <ul className="text-sm text-gray-400 space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5" />
                    Our team reviews your report within 24 hours
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5" />
                    If appropriate action is needed, we&apos;ll take it
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5" />
                    Your report is anonymous
                  </li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Privacy Tab */}
          <TabsContent value="privacy" className="space-y-4">
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="w-5 h-5 text-cyan-400" />
                  Privacy Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Who can see your profile?</Label>
                  <Select
                    value={privacySettings.profileVisibility}
                    onValueChange={(value) => setPrivacySettings(prev => ({ ...prev, profileVisibility: value }))}
                  >
                    <SelectTrigger className="bg-white/5 border-white/10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="everyone">Everyone</SelectItem>
                      <SelectItem value="friends">Friends Only</SelectItem>
                      <SelectItem value="verified">Verified Students Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator className="bg-white/10" />

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">Show Online Status</p>
                    <p className="text-xs text-gray-400">Let others see when you&apos;re online</p>
                  </div>
                  <Switch
                    checked={privacySettings.showOnlineStatus}
                    onCheckedChange={(checked) => setPrivacySettings(prev => ({ ...prev, showOnlineStatus: checked }))}
                  />
                </div>

                <Separator className="bg-white/10" />

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">Allow Friend Requests</p>
                    <p className="text-xs text-gray-400">Let others send you friend requests</p>
                  </div>
                  <Switch
                    checked={privacySettings.allowFriendRequests}
                    onCheckedChange={(checked) => setPrivacySettings(prev => ({ ...prev, allowFriendRequests: checked }))}
                  />
                </div>

                <Separator className="bg-white/10" />

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">Activity Feed Visibility</p>
                    <p className="text-xs text-gray-400">Show your achievements in feeds</p>
                  </div>
                  <Switch
                    checked={privacySettings.showActivityFeed}
                    onCheckedChange={(checked) => setPrivacySettings(prev => ({ ...prev, showActivityFeed: checked }))}
                  />
                </div>

                <Separator className="bg-white/10" />

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">Data Sharing</p>
                    <p className="text-xs text-gray-400">Share anonymous usage data to improve the app</p>
                  </div>
                  <Switch
                    checked={privacySettings.dataSharing}
                    onCheckedChange={(checked) => setPrivacySettings(prev => ({ ...prev, dataSharing: checked }))}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Support Tab */}
          <TabsContent value="support" className="space-y-4">
            <Card className="bg-gradient-to-br from-pink-900/30 to-purple-900/30 border-pink-500/20">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-pink-500/20 flex items-center justify-center">
                    <Heart className="w-6 h-6 text-pink-400" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold mb-1">Mental Health Support</h2>
                    <p className="text-sm text-gray-400">
                      It&apos;s okay to ask for help. These resources are available 24/7.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-3">
              {MENTAL_HEALTH_RESOURCES.map((resource) => (
                <Card key={resource.name} className="bg-white/5 border-white/10 cursor-pointer hover:bg-white/10 transition-colors">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                      <resource.icon className={cn('w-5 h-5', resource.color)} />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{resource.name}</p>
                      <p className="text-sm text-gray-400">{resource.description}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-4 text-center">
                <p className="text-sm text-gray-400 mb-2">
                  Need immediate help? Contact a trusted adult or call emergency services.
                </p>
                <p className="text-xs text-gray-500">
                  Your well-being is the most important thing.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
