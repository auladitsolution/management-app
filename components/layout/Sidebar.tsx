'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  CreditCard,
  HeadphonesIcon,
  UserCheck,
  Send,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Building2,
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import Image from 'next/image'
import { useState } from 'react'
import clsx from 'clsx'

const navItems = [
  { href: '/dashboard',       label: 'ড্যাশবোর্ড',       icon: LayoutDashboard },
  { href: '/clients',         label: 'ক্লায়েন্ট',         icon: Users },
  { href: '/projects',        label: 'প্রজেক্ট',           icon: FolderKanban },
  { href: '/payments',        label: 'পেমেন্ট',            icon: CreditCard },
  { href: '/support',         label: 'সাপোর্ট টিকেট',     icon: HeadphonesIcon },
  { href: '/representatives', label: 'প্রতিনিধি',          icon: UserCheck },
  { href: '/broadcast',       label: 'বার্তা পাঠান',       icon: Send },
]

export default function Sidebar() {
  const pathname       = usePathname()
  const { user, logout } = useAuth()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={clsx(
        'h-screen sticky top-0 flex flex-col transition-all duration-300 border-r border-dark-border bg-dark-card z-40',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className={clsx('p-4 border-b border-dark-border flex items-center gap-3', collapsed && 'justify-center')}>
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-600 to-purple-600 flex items-center justify-center flex-shrink-0 glow-primary">
          <Building2 size={18} className="text-white" />
        </div>
        {!collapsed && (
          <div>
            <h1 className="text-sm font-bold text-white leading-tight">Aulad IT</h1>
            <p className="text-xs text-gray-500">Solution</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon    = item.icon
          const isActive = pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              title={item.label}
              className={clsx(
                'sidebar-item',
                isActive && 'active',
                collapsed && 'justify-center px-2'
              )}
            >
              <Icon size={18} className="flex-shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          )
        })}
      </nav>

      {/* User info & logout */}
      <div className="p-3 border-t border-dark-border space-y-2">
        {!collapsed && user && (
          <div className="flex items-center gap-3 px-3 py-2">
            {user.photoURL && (
              <Image
                src={user.photoURL}
                alt={user.displayName || ''}
                width={32}
                height={32}
                className="rounded-full ring-2 ring-primary-500/50"
              />
            )}
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-white truncate">{user.displayName}</p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>
          </div>
        )}
        <button
          onClick={logout}
          title="লগআউট"
          className={clsx(
            'sidebar-item w-full text-red-400 hover:text-red-300 hover:bg-red-500/10',
            collapsed && 'justify-center px-2'
          )}
        >
          <LogOut size={18} />
          {!collapsed && <span>লগআউট</span>}
        </button>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-dark-card border border-dark-border flex items-center justify-center text-gray-400 hover:text-white hover:border-primary-500 transition-all z-50"
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>
    </aside>
  )
}
