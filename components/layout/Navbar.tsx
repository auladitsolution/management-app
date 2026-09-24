'use client'

import { usePathname } from 'next/navigation'
import { Bell, Search } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useState } from 'react'
import Image from 'next/image'

const pageTitles: Record<string, string> = {
  '/dashboard':       'ড্যাশবোর্ড',
  '/clients':         'ক্লায়েন্ট ব্যবস্থাপনা',
  '/projects':        'প্রজেক্ট ব্যবস্থাপনা',
  '/payments':        'পেমেন্ট ব্যবস্থাপনা',
  '/support':         'সাপোর্ট টিকেট',
  '/representatives': 'প্রতিনিধি ব্যবস্থাপনা',
  '/broadcast':       'বার্তা প্রেরণ',
}

export default function Navbar() {
  const pathname = usePathname()
  const { user } = useAuth()

  const title = Object.entries(pageTitles).find(([path]) =>
    pathname.startsWith(path)
  )?.[1] || 'Aulad IT Solution'

  return (
    <header className="h-16 border-b border-dark-border bg-dark-card/50 backdrop-blur-sm flex items-center justify-between px-6 sticky top-0 z-30">
      <div>
        <h2 className="text-lg font-bold text-white">{title}</h2>
        <p className="text-xs text-gray-500">Aulad IT Solution — ম্যানেজমেন্ট সিস্টেম</p>
      </div>

      <div className="flex items-center gap-3">
        {/* Notification bell */}
        <button className="w-9 h-9 rounded-xl bg-dark-hover border border-dark-border flex items-center justify-center text-gray-400 hover:text-white hover:border-primary-500 transition-all relative">
          <Bell size={16} />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] flex items-center justify-center text-white font-bold">৩</span>
        </button>

        {/* User avatar */}
        {user?.photoURL && (
          <Image
            src={user.photoURL}
            alt={user.displayName || ''}
            width={36}
            height={36}
            className="rounded-xl ring-2 ring-primary-500/40"
          />
        )}
      </div>
    </header>
  )
}
