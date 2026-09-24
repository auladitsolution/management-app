'use client'

import { useEffect, useState } from 'react'
import { use } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { ArrowLeft, Clock, CheckCircle, AlertCircle, Plus, Save } from 'lucide-react'
import Link from 'next/link'
import clsx from 'clsx'

export default function TicketDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id }          = use(params)
  const [ticket, setTicket] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [updateMsg, setUpdateMsg] = useState('')
  const [resolution, setResolution] = useState('')
  const [timeTaken, setTimeTaken]   = useState(0)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    axios.get(`/api/support/${id}`)
      .then((r) => setTicket(r.data.ticket))
      .finally(() => setLoading(false))
  }, [id])

  const handleStatusChange = async (newStatus: string) => {
    setSaving(true)
    try {
      const body: any = { status: newStatus }
      if (newStatus === 'সমাধান হয়েছে') {
        body.resolution    = resolution
        body.timeTakenHours = timeTaken
      }
      if (updateMsg) {
        body.newUpdate = { message: updateMsg, updatedBy: 'Admin' }
      }
      const r = await axios.put(`/api/support/${id}`, body)
      toast.success('টিকেট আপডেট হয়েছে!')
      setTicket(r.data.ticket)
      setUpdateMsg('')
    } catch {
      toast.error('আপডেট করতে সমস্যা হয়েছে')
    } finally {
      setSaving(false)
    }
  }

  const handleAddUpdate = async () => {
    if (!updateMsg.trim()) return
    setSaving(true)
    try {
      const r = await axios.put(`/api/support/${id}`, {
        newUpdate: { message: updateMsg, updatedBy: 'Admin' }
      })
      toast.success('আপডেট যোগ হয়েছে!')
      setTicket(r.data.ticket)
      setUpdateMsg('')
    } catch {
      toast.error('আপডেট যোগ করতে সমস্যা হয়েছে')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="skeleton h-96" />
  if (!ticket) return <p className="text-gray-500">টিকেট পাওয়া যায়নি</p>

  const statusIcons: Record<string, React.ReactNode> = {
    'খোলা':          <AlertCircle size={18} className="text-red-400" />,
    'চলমান':         <Clock size={18} className="text-yellow-400" />,
    'সমাধান হয়েছে': <CheckCircle size={18} className="text-emerald-400" />,
  }
  const statusIcon = statusIcons[ticket.status]

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/support" className="w-9 h-9 rounded-xl bg-dark-hover border border-dark-border flex items-center justify-center text-gray-400 hover:text-white transition-colors">
          <ArrowLeft size={16} />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            {statusIcon}
            <h1 className="text-xl font-bold text-white">{ticket.title}</h1>
          </div>
          <p className="text-sm text-gray-500 mt-0.5">
            {ticket.clientId?.name} • {new Date(ticket.createdAt).toLocaleDateString('bn-BD')}
          </p>
        </div>
        <div className="flex gap-2">
          <span className={clsx('badge', {
            'badge-red':    ticket.priority === 'জরুরি',
            'badge-yellow': ticket.priority === 'মাঝারি',
            'badge-blue':   ticket.priority === 'কম',
          })}>{ticket.priority}</span>
          <span className={clsx('badge', {
            'badge-red':    ticket.status === 'খোলা',
            'badge-yellow': ticket.status === 'চলমান',
            'badge-green':  ticket.status === 'সমাধান হয়েছে',
          })}>{ticket.status}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-4">
          {/* Description */}
          <div className="glass-card p-5">
            <h3 className="font-bold text-white mb-3">সমস্যার বিবরণ</h3>
            <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">{ticket.description}</p>
          </div>

          {/* Updates timeline */}
          {ticket.updates?.length > 0 && (
            <div className="glass-card p-5">
              <h3 className="font-bold text-white mb-4">আপডেট ইতিহাস</h3>
              <div className="space-y-3">
                {ticket.updates.map((u: any, i: number) => (
                  <div key={i} className="flex gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary-500 mt-1.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-300">{u.message}</p>
                      <p className="text-xs text-gray-600 mt-0.5">
                        {u.updatedBy} • {new Date(u.date).toLocaleDateString('bn-BD')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Resolution */}
          {ticket.resolution && (
            <div className="glass-card p-5 border-emerald-500/30">
              <h3 className="font-bold text-emerald-400 mb-2 flex items-center gap-2">
                <CheckCircle size={16} /> সমাধান
              </h3>
              <p className="text-gray-300 text-sm">{ticket.resolution}</p>
              {ticket.timeTakenHours && (
                <p className="text-xs text-gray-500 mt-2">সময় লেগেছে: {ticket.timeTakenHours} ঘণ্টা</p>
              )}
            </div>
          )}

          {/* Add Update */}
          {ticket.status !== 'সমাধান হয়েছে' && (
            <div className="glass-card p-5">
              <h3 className="font-bold text-white mb-3">আপডেট যোগ করুন</h3>
              <textarea
                value={updateMsg}
                onChange={(e) => setUpdateMsg(e.target.value)}
                className="input-dark w-full mb-3"
                rows={3}
                placeholder="আপডেট বার্তা লিখুন..."
              />
              <button onClick={handleAddUpdate} disabled={saving} className="btn-primary">
                <Plus size={16} /> আপডেট যোগ করুন
              </button>
            </div>
          )}
        </div>

        {/* Sidebar actions */}
        <div className="space-y-4">
          {/* Client info */}
          <div className="glass-card p-4">
            <h3 className="font-bold text-white mb-3 text-sm">ক্লায়েন্ট তথ্য</h3>
            <p className="text-sm text-gray-300">{ticket.clientId?.name}</p>
            <p className="text-xs text-gray-500">{ticket.clientId?.phone}</p>
            {ticket.clientId?.email && <p className="text-xs text-gray-500">{ticket.clientId?.email}</p>}
            {ticket.projectId && (
              <div className="mt-3 pt-3 border-t border-dark-border">
                <p className="text-xs text-gray-500">প্রজেক্ট</p>
                <p className="text-sm text-primary-400">{ticket.projectId?.name}</p>
              </div>
            )}
          </div>

          {/* Status Change */}
          {ticket.status !== 'সমাধান হয়েছে' && (
            <div className="glass-card p-4 space-y-3">
              <h3 className="font-bold text-white text-sm">স্ট্যাটাস পরিবর্তন</h3>
              {ticket.status === 'খোলা' && (
                <button onClick={() => handleStatusChange('চলমান')} disabled={saving} className="btn-secondary w-full justify-center text-yellow-400">
                  <Clock size={14} /> চলমান হিসেবে চিহ্নিত করুন
                </button>
              )}
              <div className="space-y-2">
                <textarea
                  value={resolution}
                  onChange={(e) => setResolution(e.target.value)}
                  className="input-dark text-sm"
                  rows={3}
                  placeholder="সমাধানের বিবরণ..."
                />
                <input
                  type="number"
                  value={timeTaken}
                  onChange={(e) => setTimeTaken(+e.target.value)}
                  className="input-dark text-sm"
                  placeholder="লাগা সময় (ঘণ্টা)"
                />
                <button
                  onClick={() => handleStatusChange('সমাধান হয়েছে')}
                  disabled={saving}
                  className="btn-success w-full justify-center"
                >
                  <CheckCircle size={14} /> সমাধান হিসেবে বন্ধ করুন
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
