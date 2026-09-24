'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import {
  Users, FolderKanban, CreditCard, HeadphonesIcon,
  UserCheck, TrendingUp, AlertTriangle, CheckCircle,
  Clock, ArrowUpRight,
} from 'lucide-react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Area, AreaChart,
} from 'recharts'
import Link from 'next/link'
import clsx from 'clsx'

interface DashboardData {
  stats: {
    totalClients: number
    activeClients: number
    totalProjects: number
    activeProjects: number
    totalRevenue: number
    totalDue: number
    dueClients: number
    openTickets: number
    totalReps: number
    activeReps: number
  }
  monthlyRevenue: { month: string; revenue: number }[]
  recentClients: any[]
  recentTickets: any[]
  duePayments: any[]
}

function formatTaka(amount: number) {
  return `৳${amount.toLocaleString('bn-BD')}`
}

function StatsCard({
  title, value, subtitle, icon: Icon, color, href,
}: {
  title: string; value: string | number; subtitle?: string
  icon: any; color: string; href?: string
}) {
  const content = (
    <div className={clsx('stats-card', `border-l-4 ${color}`)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-gray-500 mb-1">{title}</p>
          <p className="text-2xl font-bold text-white mb-1">{value}</p>
          {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
        </div>
        <div className={clsx('w-12 h-12 rounded-2xl flex items-center justify-center', `bg-${color.split('-')[1]}-500/10`)}>
          <Icon size={22} className={`text-${color.split('-')[1]}-400`} />
        </div>
      </div>
      {href && (
        <div className="mt-3 flex items-center gap-1 text-xs text-gray-500 hover:text-primary-400 transition-colors">
          <span>বিস্তারিত দেখুন</span>
          <ArrowUpRight size={12} />
        </div>
      )}
    </div>
  )

  return href ? <Link href={href}>{content}</Link> : content
}

const statusMap: Record<string, { label: string; className: string }> = {
  'খোলা':            { label: 'খোলা',         className: 'badge-red' },
  'চলমান':           { label: 'চলমান',         className: 'badge-yellow' },
  'সমাধান হয়েছে':   { label: 'সমাধান হয়েছে', className: 'badge-green' },
  'জরুরি':           { label: 'জরুরি',         className: 'badge-red' },
  'মাঝারি':          { label: 'মাঝারি',        className: 'badge-yellow' },
  'কম':              { label: 'কম',            className: 'badge-blue' },
  'সক্রিয়':          { label: 'সক্রিয়',        className: 'badge-green' },
  'নিষ্ক্রিয়':       { label: 'নিষ্ক্রিয়',     className: 'badge-gray' },
  'অপেক্ষমান':       { label: 'অপেক্ষমান',    className: 'badge-yellow' },
}

export default function DashboardPage() {
  const [data, setData]       = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get('/api/dashboard')
      .then((res) => setData(res.data))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array(8).fill(0).map((_, i) => (
            <div key={i} className="skeleton h-32" />
          ))}
        </div>
      </div>
    )
  }

  if (!data) return <p className="text-gray-500">ডেটা লোড করতে সমস্যা হয়েছে</p>

  const { stats, monthlyRevenue, recentClients, recentTickets, duePayments } = data

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="মোট ক্লায়েন্ট"
          value={stats.totalClients}
          subtitle={`${stats.activeClients} জন সক্রিয়`}
          icon={Users}
          color="border-blue-500"
          href="/clients"
        />
        <StatsCard
          title="মোট প্রজেক্ট"
          value={stats.totalProjects}
          subtitle={`${stats.activeProjects}টি চলমান`}
          icon={FolderKanban}
          color="border-purple-500"
          href="/projects"
        />
        <StatsCard
          title="মোট আয়"
          value={formatTaka(stats.totalRevenue)}
          subtitle="সর্বমোট পরিশোধিত"
          icon={TrendingUp}
          color="border-emerald-500"
          href="/payments"
        />
        <StatsCard
          title="বকেয়া"
          value={formatTaka(stats.totalDue)}
          subtitle={`${stats.dueClients} জনের বকেয়া`}
          icon={CreditCard}
          color="border-red-500"
          href="/payments"
        />
        <StatsCard
          title="খোলা টিকেট"
          value={stats.openTickets}
          subtitle="সমাধান বাকি"
          icon={HeadphonesIcon}
          color="border-yellow-500"
          href="/support"
        />
        <StatsCard
          title="মোট প্রতিনিধি"
          value={stats.totalReps}
          subtitle={`${stats.activeReps} জন সক্রিয়`}
          icon={UserCheck}
          color="border-cyan-500"
          href="/representatives"
        />
      </div>

      {/* Revenue Chart + Due Payments */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-white">মাসিক আয় (শেষ ৬ মাস)</h3>
            <span className="badge badge-green">৳ বাংলাদেশি টাকা</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={monthlyRevenue}>
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#2d2d4a" />
              <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `৳${v}`} />
              <Tooltip
                contentStyle={{ background: '#1a1a2e', border: '1px solid #2d2d4a', borderRadius: 12, color: '#fff' }}
                formatter={(v: number) => [`৳${v.toLocaleString()}`, 'আয়']}
              />
              <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2.5} fill="url(#revenueGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Due Payments */}
        <div className="glass-card p-6">
          <h3 className="font-bold text-white mb-4 flex items-center gap-2">
            <AlertTriangle size={16} className="text-red-400" />
            বকেয়া তালিকা
          </h3>
          <div className="space-y-3">
            {duePayments.length === 0 ? (
              <div className="flex items-center gap-2 text-emerald-400 text-sm">
                <CheckCircle size={16} />
                <span>কোনো বকেয়া নেই!</span>
              </div>
            ) : (
              duePayments.map((p: any) => (
                <div key={p._id} className="flex items-center justify-between py-2 border-b border-dark-border/50 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-white">{p.clientId?.name}</p>
                    <p className="text-xs text-gray-500">{p.projectId?.name}</p>
                  </div>
                  <span className="text-red-400 font-bold text-sm">{formatTaka(p.dueAmount)}</span>
                </div>
              ))
            )}
          </div>
          <Link href="/payments?dueOnly=true" className="mt-4 flex items-center gap-1 text-xs text-primary-400 hover:text-primary-300 transition-colors">
            সব বকেয়া দেখুন <ArrowUpRight size={12} />
          </Link>
        </div>
      </div>

      {/* Recent Clients + Recent Tickets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Clients */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-white">সাম্প্রতিক ক্লায়েন্ট</h3>
            <Link href="/clients" className="text-xs text-primary-400 hover:text-primary-300 flex items-center gap-1">
              সব দেখুন <ArrowUpRight size={12} />
            </Link>
          </div>
          <div className="space-y-3">
            {recentClients.map((client: any) => {
              const s = statusMap[client.status]
              return (
                <div key={client._id} className="flex items-center justify-between py-2 border-b border-dark-border/50 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-white">{client.name}</p>
                    <p className="text-xs text-gray-500">{client.district}</p>
                  </div>
                  <span className={clsx('badge', s?.className)}>{s?.label}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Recent Tickets */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-white">সক্রিয় টিকেট</h3>
            <Link href="/support" className="text-xs text-primary-400 hover:text-primary-300 flex items-center gap-1">
              সব দেখুন <ArrowUpRight size={12} />
            </Link>
          </div>
          <div className="space-y-3">
            {recentTickets.length === 0 ? (
              <div className="flex items-center gap-2 text-emerald-400 text-sm">
                <CheckCircle size={16} />
                <span>সব টিকেট সমাধান হয়েছে!</span>
              </div>
            ) : (
              recentTickets.map((ticket: any) => {
                const s = statusMap[ticket.status]
                const p = statusMap[ticket.priority]
                return (
                  <Link key={ticket._id} href={`/support/${ticket._id}`}
                    className="flex items-start justify-between py-2 border-b border-dark-border/50 last:border-0 hover:bg-dark-hover/30 rounded-lg px-2 transition-colors"
                  >
                    <div className="flex-1 mr-2">
                      <p className="text-sm font-medium text-white line-clamp-1">{ticket.title}</p>
                      <p className="text-xs text-gray-500">{ticket.clientId?.name}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className={clsx('badge', s?.className)}>{s?.label}</span>
                      <span className={clsx('badge', p?.className)}>{p?.label}</span>
                    </div>
                  </Link>
                )
              })
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
