'use client'

import { useAuth, AuthProvider } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Building2, Shield, Zap, Globe, Lock, CheckCircle2, Sparkles } from 'lucide-react'

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
        <div className="relative flex items-center justify-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-600 to-purple-600 animate-pulse glow-primary" />
          <Building2 size={28} className="text-white absolute animate-bounce" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-bg relative flex items-center justify-center p-4 sm:p-6 lg:p-12 overflow-hidden selection:bg-primary-500/30 selection:text-white">
      {/* Dynamic Ambient Background Glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary-600/15 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[500px] h-[500px] bg-purple-600/15 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-cyan-500/10 rounded-full blur-[100px]" />
        <div className="absolute inset-0 bg-[radial-gradient(#2d2d4a_1px,transparent_1px)] [background-size:24px_24px] opacity-25" />
      </div>

      {/* Main Centered Container */}
      <div className="w-full max-w-6xl relative z-10 my-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column — Branding & Highlights */}
          <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
            {/* Top Brand Tag */}
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-dark-card/80 border border-dark-border backdrop-blur-md shadow-lg">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-purple-600 flex items-center justify-center glow-primary">
                <Building2 size={20} className="text-white" />
              </div>
              <div className="text-left">
                <h1 className="text-base font-bold text-white tracking-wide">Aulad IT Solution</h1>
                <p className="text-xs text-primary-400 font-medium">ব্যবসায়িক ম্যানেজমেন্ট সিস্টেম</p>
              </div>
            </div>

            {/* Headline */}
            <div className="space-y-4">
              <h2 className="text-3xl sm:text-4xl xl:text-5xl font-extrabold text-white leading-tight">
                সম্পূর্ণ ব্যবসায়িক{' '}
                <span className="gradient-text block sm:inline">ম্যানেজমেন্ট প্ল্যাটফর্ম</span>
              </h2>
              <p className="text-gray-300 text-base sm:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed">
                ক্লায়েন্ট, প্রজেক্ট, পেমেন্ট হিসাব এবং প্রতিনিধি কার্যক্রম — সবকিছু একটি কেন্দ্রীয় প্ল্যাটফর্মে আধুনিক ও নিরাপদে পরিচালনা করুন।
              </p>
            </div>

            {/* Feature Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              {[
                {
                  icon: Shield,
                  color: 'from-blue-500/20 to-indigo-500/20 text-blue-400 border-blue-500/30',
                  title: 'Credential Vault',
                  desc: 'AES-256 এনক্রিপ্টেড ক্লায়েন্ট ডেটা সংরক্ষণ',
                },
                {
                  icon: Zap,
                  color: 'from-purple-500/20 to-pink-500/20 text-purple-400 border-purple-500/30',
                  title: 'Telegram Broadcast',
                  desc: 'এক ক্লিকে সকল প্রতিনিধিকে বার্তা প্রদান',
                },
                {
                  icon: Globe,
                  color: 'from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30',
                  title: 'রিয়েলটাইম মনিটরিং',
                  desc: 'যেকোনো স্থান থেকে প্রজেক্ট ও পেমেন্ট ট্র্যাকিং',
                },
              ].map(({ icon: Icon, color, title, desc }) => (
                <div
                  key={title}
                  className="glass-card p-4 text-left border border-dark-border/80 hover:border-primary-500/40 transition-all duration-300 hover:scale-[1.02] hover:-translate-y-0.5 group"
                >
                  <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${color} border flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                    <Icon size={18} />
                  </div>
                  <h3 className="text-white font-semibold text-sm mb-1">{title}</h3>
                  <p className="text-gray-400 text-xs leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>

            {/* Trust badge */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 pt-2 text-xs text-gray-400">
              <span className="flex items-center gap-1.5 text-gray-300">
                <CheckCircle2 size={15} className="text-accent-green" /> আধুনিক Next.js আর্কিটেকচার
              </span>
              <span className="flex items-center gap-1.5 text-gray-300">
                <CheckCircle2 size={15} className="text-accent-green" /> সুরক্ষিত ক্লাউড ডাটাবেস
              </span>
              <span className="flex items-center gap-1.5 text-gray-300">
                <CheckCircle2 size={15} className="text-accent-green" /> ইনস্ট্যান্ট সিঙ্ক
              </span>
            </div>
          </div>

          {/* Right Column — Elegant Login Box */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-md bg-dark-card/90 backdrop-blur-xl border border-dark-border/90 rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden group">
              {/* Top ambient highlight */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-transparent via-primary-500 to-transparent" />
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary-600/10 rounded-full blur-2xl pointer-events-none" />

              <div className="relative z-10 space-y-6">
                {/* Header inside card */}
                <div className="text-center space-y-2">
                  <div className="inline-flex w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-600/30 to-purple-600/30 border border-primary-500/30 items-center justify-center mb-1 glow-primary">
                    <Lock size={24} className="text-primary-400" />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-white">স্বাগতম</h2>
                  <p className="text-gray-400 text-sm">
                    সিস্টেমে প্রবেশ করতে আপনার অনুমোদিত অ্যাকাউন্ট দিয়ে লগইন করুন
                  </p>
                </div>

                {/* Google Sign-In Button */}
                <button
                  onClick={signInWithGoogle}
                  className="w-full flex items-center justify-center gap-3.5 py-3.5 px-6 bg-white hover:bg-gray-100 active:scale-[0.99] text-gray-900 font-semibold rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl group"
                >
                  <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span className="text-sm font-medium">Google দিয়ে লগইন করুন</span>
                </button>

                {/* Divider */}
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-dark-border" />
                  <span className="text-xs uppercase tracking-wider text-gray-500 font-medium">নিরাপত্তা</span>
                  <div className="flex-1 h-px bg-dark-border" />
                </div>

                {/* Security info box */}
                <div className="bg-dark-bg/60 border border-dark-border/80 rounded-2xl p-4 space-y-2 text-center">
                  <div className="inline-flex items-center gap-1.5 text-xs text-primary-400 font-medium">
                    <Shield size={14} /> Firebase Authentication সুরক্ষিত
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    শুধুমাত্র অনুমোদিত অ্যাডমিন অ্যাকাউন্টের মাধ্যমে অ্যাক্সেস মঞ্জুর করা হবে।
                  </p>
                </div>

                {/* Footer note inside card */}
                <p className="text-center text-[11px] text-gray-500">
                  সমস্যা হলে সাপোর্ট টিমের সাথে যোগাযোগ করুন
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Global Footer */}
        <div className="text-center pt-12 pb-4 text-xs text-gray-500">
          © ২০২৪ Aulad IT Solution. সর্বস্বত্ব সংরক্ষিত।
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
