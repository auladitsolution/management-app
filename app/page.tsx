'use client'

import { useAuth } from '@/contexts/AuthContext'
import { AuthProvider } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Building2, Shield, Zap, Globe } from 'lucide-react'
import Image from 'next/image'

function LoginContent() {
  const { user, loading, signInWithGoogle } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-600 to-purple-600 animate-pulse" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-bg flex overflow-hidden">
      {/* Left Panel — Branding */}
      <div className="hidden lg:flex flex-1 flex-col justify-between p-12 bg-gradient-to-br from-dark-card via-dark-bg to-dark-card relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl" />
        </div>

        {/* Logo */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-600 to-purple-600 flex items-center justify-center glow-primary">
              <Building2 size={22} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Aulad IT Solution</h1>
              <p className="text-xs text-gray-500">ম্যানেজমেন্ট সিস্টেম</p>
            </div>
          </div>
        </div>

        {/* Center content */}
        <div className="relative z-10 space-y-8">
          <div>
            <h2 className="text-4xl font-bold text-white leading-tight mb-4">
              সম্পূর্ণ ব্যবসায়িক<br />
              <span className="gradient-text">ম্যানেজমেন্ট প্ল্যাটফর্ম</span>
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed">
              ক্লায়েন্ট, প্রজেক্ট, পেমেন্ট এবং প্রতিনিধি — সব কিছু একটি জায়গায় পরিচালনা করুন।
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {[
              { icon: Shield, title: 'নিরাপদ Credential Vault', desc: 'AES-256 এনক্রিপ্টেড তথ্য সংরক্ষণ' },
              { icon: Zap,    title: 'Telegram Broadcast',      desc: 'সকল প্রতিনিধিকে এক বার্তায়' },
              { icon: Globe,  title: 'সর্বত্র অ্যাক্সেস',       desc: 'যেকোনো ডিভাইস থেকে পরিচালনা' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-center gap-4 glass-card p-4">
                <div className="w-10 h-10 rounded-xl bg-primary-600/20 border border-primary-600/30 flex items-center justify-center flex-shrink-0">
                  <Icon size={18} className="text-primary-400" />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{title}</p>
                  <p className="text-gray-500 text-xs">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10">
          <p className="text-gray-600 text-sm">© ২০২৪ Aulad IT Solution. সকল অধিকার সংরক্ষিত।</p>
        </div>
      </div>

      {/* Right Panel — Login Form */}
      <div className="flex-1 lg:max-w-md flex flex-col items-center justify-center p-8 bg-dark-card relative">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-600/5 rounded-full blur-3xl" />
        </div>

        <div className="w-full max-w-sm space-y-8 relative z-10">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 justify-center">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-600 to-purple-600 flex items-center justify-center">
              <Building2 size={22} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">Aulad IT Solution</h1>
              <p className="text-xs text-gray-500">ম্যানেজমেন্ট সিস্টেম</p>
            </div>
          </div>

          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold text-white mb-2">স্বাগতম</h2>
            <p className="text-gray-400">অ্যাপে প্রবেশ করতে Google অ্যাকাউন্ট দিয়ে লগইন করুন</p>
          </div>

          {/* Google Login Button */}
          <button
            onClick={signInWithGoogle}
            className="w-full flex items-center justify-center gap-4 py-4 px-6 bg-white hover:bg-gray-50 text-gray-800 font-semibold rounded-2xl transition-all duration-200 hover:scale-[1.02] shadow-lg hover:shadow-xl group"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span>Google দিয়ে লগইন করুন</span>
          </button>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-dark-border" />
            <p className="text-xs text-gray-600">নিরাপদ লগইন</p>
            <div className="flex-1 h-px bg-dark-border" />
          </div>

          <p className="text-center text-xs text-gray-600 leading-relaxed">
            শুধুমাত্র অনুমোদিত অ্যাডমিন অ্যাকাউন্ট দিয়ে লগইন করা যাবে।<br />
            Firebase Authentication দ্বারা সুরক্ষিত।
          </p>
        </div>
      </div>
    </div>
  )
}

export default function HomePage() {
  return (
    <AuthProvider>
      <LoginContent />
    </AuthProvider>
  )
}
