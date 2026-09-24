'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import { Plus, HeadphonesIcon, Clock, CheckCircle, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import clsx from 'clsx'

const statusBadge: Record<string, string> = {
  'খোলা':          'badge-red',
  'চলমান':         'badge-yellow',
  'সমাধান হয়েছে': 'badge-green',
}
const priorityBadge: Record<string, string> = {
  'জরুরি':  'badge-red',
  'মাঝারি': 'badge-yellow',
  'কম':     'badge-blue',
}

export default function SupportPage() {
  const [tickets, setTickets]   = useState<any[]>([])
  const [loading, setLoading]   = useState(true)
  const [clients, setClients]   = useState<any[]>([])
  const [projects, setProjects] = useState<any[]>([])
  const [statusFilter, setStatusFilter] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({
    title: '', description: '', clientId: '', projectId: '',
    priority: 'মাঝারি', status: 'খোলা',
  })
  const [saving, setSaving] = useState(false)

  const load = () => {
    setLoading(true)
    axios.get('/api/support', { params: { status: statusFilter } })
      .then((r) => setTickets(r.data.tickets))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [statusFilter])
  useEffect(() => {
    axios.get('/api/clients').then((r) => setClients(r.data.clients))
  }, [])

  const loadProjects = (clientId: string) => {
    axios.get('/api/projects', { params: { clientId } })
      .then((r) => setProjects(r.data.projects))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      await axios.post('/api/support', form)
      toast.success('টিকেট তৈরি হয়েছে!')
      setShowModal(false)
      load()
    } catch {
      toast.error('টিকেট তৈরি করতে সমস্যা হয়েছে')
    } finally {
      setSaving(false)
    }
  }

  const openCount   = tickets.filter(t => t.status === 'খোলা').length
  const ongoingCount = tickets.filter(t => t.status === 'চলমান').length
  const resolvedCount = tickets.filter(t => t.status === 'সমাধান হয়েছে').length

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="section-header">
        <div>
          <h1 className="section-title"><HeadphonesIcon size={22} className="text-primary-400" /> সাপোর্ট টিকেট</h1>
          <p className="text-sm text-gray-500 mt-1">মোট {tickets.length}টি টিকেট</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary">
          <Plus size={18} /> নতুন টিকেট
        </button>
      </div>

      {/* Status Summary */}
      <div className="grid grid-cols-3 gap-4">
        <button onClick={() => setStatusFilter('খোলা')} className={clsx('glass-card p-4 text-left hover:-translate-y-1 transition-all', statusFilter === 'খোলা' && 'border-red-500/50')}>
          <div className="flex items-center gap-2 mb-1">
            <AlertCircle size={16} className="text-red-400" />
            <p className="text-xs text-gray-400">খোলা</p>
          </div>
          <p className="text-2xl font-bold text-red-400">{openCount}</p>
        </button>
        <button onClick={() => setStatusFilter('চলমান')} className={clsx('glass-card p-4 text-left hover:-translate-y-1 transition-all', statusFilter === 'চলমান' && 'border-yellow-500/50')}>
          <div className="flex items-center gap-2 mb-1">
            <Clock size={16} className="text-yellow-400" />
            <p className="text-xs text-gray-400">চলমান</p>
          </div>
          <p className="text-2xl font-bold text-yellow-400">{ongoingCount}</p>
        </button>
        <button onClick={() => setStatusFilter('সমাধান হয়েছে')} className={clsx('glass-card p-4 text-left hover:-translate-y-1 transition-all', statusFilter === 'সমাধান হয়েছে' && 'border-emerald-500/50')}>
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle size={16} className="text-emerald-400" />
            <p className="text-xs text-gray-400">সমাধান হয়েছে</p>
          </div>
          <p className="text-2xl font-bold text-emerald-400">{resolvedCount}</p>
        </button>
      </div>

      {/* Clear filter */}
      {statusFilter && (
        <button onClick={() => setStatusFilter('')} className="text-xs text-primary-400 hover:text-primary-300">
          ← সব টিকেট দেখুন
        </button>
      )}

      {/* Ticket List */}
      <div className="space-y-3">
        {loading ? (
          Array(5).fill(0).map((_, i) => <div key={i} className="skeleton h-20" />)
        ) : tickets.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <CheckCircle size={40} className="text-gray-700 mx-auto mb-3" />
            <p className="text-gray-500">কোনো টিকেট পাওয়া যায়নি</p>
          </div>
        ) : (
          tickets.map((ticket) => (
            <Link key={ticket._id} href={`/support/${ticket._id}`}
              className="glass-card p-4 flex items-start justify-between hover:border-primary-500/30 transition-all block"
            >
              <div className="flex-1 mr-4">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-white text-sm">{ticket.title}</h3>
                  <span className={clsx('badge', priorityBadge[ticket.priority])}>{ticket.priority}</span>
                </div>
                <p className="text-xs text-gray-500 mb-2 line-clamp-1">{ticket.description}</p>
                <div className="flex items-center gap-3 text-xs text-gray-600">
                  <span>ক্লায়েন্ট: {ticket.clientId?.name}</span>
                  <span>•</span>
                  <span>{new Date(ticket.createdAt).toLocaleDateString('bn-BD')}</span>
                </div>
              </div>
              <span className={clsx('badge flex-shrink-0', statusBadge[ticket.status])}>{ticket.status}</span>
            </Link>
          ))
        )}
      </div>

      {/* Create Ticket Modal */}
      {showModal && (
        <div className="fixed inset-0 modal-overlay flex items-center justify-center z-50 p-4">
          <div className="glass-card w-full max-w-lg animate-slide-up">
            <div className="p-6 border-b border-dark-border flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">নতুন সাপোর্ট টিকেট</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-white text-2xl">&times;</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="form-label">শিরোনাম *</label>
                <input required value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} className="input-dark" placeholder="সমস্যার সংক্ষিপ্ত বিবরণ" />
              </div>
              <div>
                <label className="form-label">ক্লায়েন্ট *</label>
                <select required value={form.clientId}
                  onChange={(e) => { setForm({...form, clientId: e.target.value}); loadProjects(e.target.value) }}
                  className="input-dark"
                >
                  <option value="">ক্লায়েন্ট নির্বাচন করুন</option>
                  {clients.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
              </div>
              {projects.length > 0 && (
                <div>
                  <label className="form-label">প্রজেক্ট</label>
                  <select value={form.projectId} onChange={(e) => setForm({...form, projectId: e.target.value})} className="input-dark">
                    <option value="">প্রজেক্ট নির্বাচন করুন</option>
                    {projects.map((p) => <option key={p._id} value={p._id}>{p.name}</option>)}
                  </select>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">অগ্রাধিকার</label>
                  <select value={form.priority} onChange={(e) => setForm({...form, priority: e.target.value})} className="input-dark">
                    <option value="কম">কম</option>
                    <option value="মাঝারি">মাঝারি</option>
                    <option value="জরুরি">জরুরি</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">স্ট্যাটাস</label>
                  <select value={form.status} onChange={(e) => setForm({...form, status: e.target.value})} className="input-dark">
                    <option value="খোলা">খোলা</option>
                    <option value="চলমান">চলমান</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="form-label">বিস্তারিত বিবরণ *</label>
                <textarea required value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} className="input-dark" rows={4} placeholder="সমস্যার বিস্তারিত বিবরণ লিখুন..." />
              </div>
              <div className="flex gap-3">
                <button type="submit" disabled={saving} className="btn-primary flex-1 justify-center">
                  {saving ? 'তৈরি হচ্ছে...' : 'টিকেট তৈরি করুন'}
                </button>
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">বাতিল</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
