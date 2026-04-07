'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { 
  ArrowLeft, Languages, Globe, Save, Loader2, 
  Check, RefreshCw, MessageCircle, Users
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { LanguageSelector } from '@/components/social/LanguageSelector'
import { 
  SUPPORTED_LANGUAGES, 
  getAllLanguages, 
  getCommonPhrases,
  type LanguageCode 
} from '@/lib/translation'

export default function LanguageSettingsPage() {
  const router = useRouter()
  const [userId, setUserId] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  
  // Language preferences
  const [nativeLanguage, setNativeLanguage] = useState<LanguageCode>('en')
  const [preferredChatLanguage, setPreferredChatLanguage] = useState<LanguageCode>('en')
  const [autoTranslate, setAutoTranslate] = useState(true)
  const [showOriginalText, setShowOriginalText] = useState(true)

  const allLanguages = getAllLanguages()
  const commonPhrases = getCommonPhrases(nativeLanguage)

  useEffect(() => {
    fetchUserAndPreferences()
  }, [])

  const fetchUserAndPreferences = async () => {
    try {
      // Get current user
      const userResponse = await fetch('/api/user')
      const userData = await userResponse.json()
      
      if (userData.user) {
        setUserId(userData.user.id)
        
        // Fetch language preferences
        const prefResponse = await fetch(`/api/language-preferences?userId=${userData.user.id}`)
        const prefData = await prefResponse.json()
        
        if (prefData.success && prefData.preferences) {
          setNativeLanguage(prefData.preferences.nativeLanguage as LanguageCode)
          setPreferredChatLanguage(prefData.preferences.preferredChatLanguage as LanguageCode)
          setAutoTranslate(prefData.preferences.autoTranslate)
          setShowOriginalText(prefData.preferences.showOriginalText)
        }
      }
    } catch (error) {
      console.error('Error fetching preferences:', error)
    } finally {
      setLoading(false)
    }
  }

  const savePreferences = async () => {
    if (!userId) return
    
    setSaving(true)
    try {
      const response = await fetch('/api/language-preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          nativeLanguage,
          preferredChatLanguage,
          autoTranslate,
          showOriginalText
        })
      })
      
      const data = await response.json()
      
      if (data.success) {
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      }
    } catch (error) {
      console.error('Error saving preferences:', error)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
      </div>
    )
  }

  const nativeLang = SUPPORTED_LANGUAGES[nativeLanguage]
  const chatLang = SUPPORTED_LANGUAGES[preferredChatLanguage]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 text-white pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-black/30 border-b border-white/10">
        <div className="container mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/social">
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-lg font-bold">Language Settings</h1>
            <p className="text-xs text-gray-400">Translation & communication preferences</p>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-2xl space-y-6">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-purple-500/25 mb-4">
            <Globe className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Communicate Globally</h2>
          <p className="text-gray-400">
            Connect with students worldwide in your native language
          </p>
        </motion.div>

        {/* Native Language */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Languages className="w-5 h-5 text-purple-400" />
              Native Language
            </CardTitle>
            <CardDescription>
              Your primary language for communication
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <LanguageSelector
              value={nativeLanguage}
              onChange={setNativeLanguage}
              label="Select your native language"
            />
            
            {/* Common Phrases Preview */}
            <div className="mt-4 p-3 bg-slate-800/50 rounded-lg">
              <p className="text-xs text-gray-400 mb-2">Common phrases in {nativeLang?.nativeName}:</p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {Object.entries(commonPhrases).slice(0, 6).map(([key, phrase]) => (
                  <div key={key} className="text-gray-300">
                    <span className="text-gray-500 text-xs capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                    <br />
                    <span className="text-white">{phrase}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Chat Language */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-cyan-400" />
              Chat Language
            </CardTitle>
            <CardDescription>
              Language you prefer when chatting with others
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <LanguageSelector
              value={preferredChatLanguage}
              onChange={setPreferredChatLanguage}
              label="Select your preferred chat language"
            />
            
            {nativeLanguage !== preferredChatLanguage && (
              <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <p className="text-sm text-yellow-300">
                  Your native language ({nativeLang?.nativeName}) differs from your chat language ({chatLang?.nativeName}). 
                  Messages will be translated accordingly.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Translation Settings */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-green-400" />
              Translation Settings
            </CardTitle>
            <CardDescription>
              Configure how translations work in your chats
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Auto-translate toggle */}
            <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
              <div>
                <Label className="text-white font-medium">Auto-translate messages</Label>
                <p className="text-xs text-gray-400">
                  Automatically translate messages to your preferred language
                </p>
              </div>
              <Switch
                checked={autoTranslate}
                onCheckedChange={setAutoTranslate}
              />
            </div>

            {/* Show original text toggle */}
            <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
              <div>
                <Label className="text-white font-medium">Show original text</Label>
                <p className="text-xs text-gray-400">
                  Display original message alongside translation
                </p>
              </div>
              <Switch
                checked={showOriginalText}
                onCheckedChange={setShowOriginalText}
              />
            </div>
          </CardContent>
        </Card>

        {/* Available Languages */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Globe className="w-5 h-5 text-blue-400" />
              Supported Languages
            </CardTitle>
            <CardDescription>
              {allLanguages.length} languages available for real-time translation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {allLanguages.map((lang) => (
                <div
                  key={lang.code}
                  className={`p-2 rounded-lg text-center transition-all ${
                    lang.code === nativeLanguage || lang.code === preferredChatLanguage
                      ? 'bg-purple-500/20 border border-purple-500/30'
                      : 'bg-slate-800/50 border border-transparent'
                  }`}
                >
                  <span className="text-xl block">{lang.flag}</span>
                  <span className="text-xs text-gray-300 block truncate">{lang.nativeName}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* How It Works */}
        <Card className="bg-gradient-to-br from-purple-900/30 to-cyan-900/30 border-purple-500/20">
          <CardHeader>
            <CardTitle className="text-lg">How Real-Time Translation Works</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-500/30 flex items-center justify-center text-sm font-bold shrink-0">1</div>
              <div>
                <p className="font-medium text-white">You Type in Your Language</p>
                <p className="text-gray-400">Type naturally in your native language</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-cyan-500/30 flex items-center justify-center text-sm font-bold shrink-0">2</div>
              <div>
                <p className="font-medium text-white">AI Translates Instantly</p>
                <p className="text-gray-400">Advanced AI provides contextual, accurate translations</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-green-500/30 flex items-center justify-center text-sm font-bold shrink-0">3</div>
              <div>
                <p className="font-medium text-white">Recipient Sees Their Language</p>
                <p className="text-gray-400">They receive the message in their chosen language</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-yellow-500/30 flex items-center justify-center text-sm font-bold shrink-0">4</div>
              <div>
                <p className="font-medium text-white">Bidirectional Communication</p>
                <p className="text-gray-400">Both sides can communicate naturally in their own languages</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="sticky bottom-20 bg-gradient-to-t from-slate-950 via-slate-950 to-transparent pt-4">
          <Button
            onClick={savePreferences}
            disabled={saving}
            className="w-full py-6 text-lg font-semibold bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500"
          >
            {saving ? (
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
            ) : saved ? (
              <Check className="w-5 h-5 mr-2" />
            ) : (
              <Save className="w-5 h-5 mr-2" />
            )}
            {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Preferences'}
          </Button>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 gap-3">
          <Link href="/social">
            <Card className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors cursor-pointer h-full">
              <CardContent className="p-4 text-center">
                <MessageCircle className="w-6 h-6 mx-auto text-purple-400 mb-2" />
                <p className="font-medium text-sm">Start Chatting</p>
                <p className="text-xs text-gray-400">Try translation</p>
              </CardContent>
            </Card>
          </Link>
          <Link href="/sparring/lobby">
            <Card className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors cursor-pointer h-full">
              <CardContent className="p-4 text-center">
                <Users className="w-6 h-6 mx-auto text-cyan-400 mb-2" />
                <p className="font-medium text-sm">Find Partners</p>
                <p className="text-xs text-gray-400">Connect globally</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </main>
    </div>
  )
}
