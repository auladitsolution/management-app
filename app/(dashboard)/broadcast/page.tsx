'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import { Send, Users, CheckCircle, XCircle, Clock, Image as ImageIcon } from 'lucide-react'
import toast from 'react-hot-toast'
import clsx from 'clsx'
import { BD_DISTRICTS } from '@/constants/bd-districts'
import { useAuth } from '@/contexts/AuthContext'

interface BroadcastResult {
  success: number
  failed: number
}

export default function BroadcastPage() {
  const { user } = useAuth()
  const [form, setForm] = useState({
    title:          '',
    message:        '',
    imageUrl:       '',
    targetDistrict: '',
  })
  const [sending, setSending]     = useState(false)
  const [history, setHistory]     = useState<any[]>([])
  const [loadingHistory, setLoadingHistory] = useState(true)
  const [repsCount, setRepsCount] = useState(0)
  const [filteredCount, setFilteredCount] = useState(0)

  useEffect(() => {
    axios.get('/api/broadcast').then((r) => setHistory(r.data.messages)).finally(() => setLoadingHistory(false))
    axios.get('/api/representatives').then((r) => setRepsCount(r.data.total))
  }, [])

  // Update filtered count when district changes
  useEffect(() => {
    if (!form.targetDistrict) {
      setFilteredCount(repsCount)
    } else {
      axios.get('/api/representatives', { params: { district: form.targetDistrict } })
        .then((r) => setFilteredCount(r.data.total))
    }
  }, [form.targetDistrict, repsCount])

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.message.trim()) { toast.error('বার্তা লিখুন'); return }
    setSending(true)
    try {
      const r = await axios.post('/api/broadcast', {
        ...form,
        sentBy: user?.email || 'Admin',
      })
      toast.success(r.data.message)
      setForm({ title: '', message: '', imageUrl: '', targetDistrict: '' })
      // Reload history
      const hist = await axios.get('/api/broadcast')
      setHistory(hist.data.messages)
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'বার্তা পাঠাতে সমস্যা হয়েছে')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="section-header">
        <div>
          <h1 className="section-title"><Send size={22} className="text-primary-400" /> Telegram বার্তা পাঠান</h1>
          <p className="text-sm text-gray-500 mt-1">মোট {repsCount} জন সক্রিয় প্রতিনিধি</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Send Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSend} className="glass-card p-6 space-y-5">
            <h2 className="font-bold text-white text-lg flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
                <Send size={15} className="text-blue-400" />
              </div>
              নতুন বার্তা
            </h2>

            <div>
              <label className="form-label">বার্তার শিরোনাম *</label>
              <input
                required
                value={form.title}
                onChange={(e) => setForm({...form, title: e.target.value})}
                className="input-dark"
                placeholder="বার্তার শিরোনাম লিখুন"
              />
            </div>

            <div>
              <label className="form-label">প্রাপক (জেলা)</label>
              <select
                value={form.targetDistrict}
                onChange={(e) => setForm({...form, targetDistrict: e.target.value})}
                className="input-dark"
              >
                <option value="">সকল প্রতিনিধি ({repsCount} জন)</option>
                {BD_DISTRICTS.map((d) => (
                  <option key={d.id} value={d.name}>{d.name} জেলা</option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">
                নির্বাচিত প্রাপক: <span className="text-primary-400 font-semibold">{filteredCount} জন</span>
              </p>
            </div>

            <div>
              <label className="form-label">বার্তা *</label>
              <textarea
                required
                value={form.message}
                onChange={(e) => setForm({...form, message: e.target.value})}
                className="input-dark"
                rows={8}
                placeholder="এখানে বার্তা লিখুন...

HTML ফরম্যাটিং ব্যবহার করতে পারবেন:
<b>গুরুত্বপূর্ণ</b>
<i>তির্যক</i>
<code>কোড</code>"
              />
              <p className="text-xs text-gray-500 mt-1">অক্ষর: {form.message.length}</p>
            </div>

            <div>
              <label className="form-label">ছবির URL (ঐচ্ছিক)</label>
              <div className="flex gap-2">
                <input
                  value={form.imageUrl}
                  onChange={(e) => setForm({...form, imageUrl: e.target.value})}
                  className="input-dark flex-1"
                  placeholder="https://... (Cloudinary বা অন্য URL)"
                />
                {form.imageUrl && (
                  <a href={form.imageUrl} target="_blank" rel="noreferrer"
                    className="w-10 h-10 rounded-xl bg-dark-hover border border-dark-border flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                  >
                    <ImageIcon size={16} />
                  </a>
                )}
              </div>
            </div>

            {/* Preview */}
            {form.message && (
              <div className="bg-blue-900/20 border border-blue-500/20 rounded-xl p-4">
                <p className="text-xs text-blue-400 font-semibold mb-2">📱 প্রিভিউ (Telegram)</p>
                <p className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: form.message
                    .replace(/<b>(.*?)<\/b>/g, '<strong>$1</strong>')
                    .replace(/<i>(.*?)<\/i>/g, '<em>$1</em>')
                  }}
                />
              </div>
            )}

            <button
              type="submit"
              disabled={sending || filteredCount === 0}
              className={clsx('btn-primary w-full justify-center py-3.5', sending && 'opacity-70 cursor-not-allowed')}
            >
              {sending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  বার্তা পাঠানো হচ্ছে...
                </>
              ) : (
                <>
                  <Send size={18} />
                  {filteredCount} জন প্রতিনিধিকে বার্তা পাঠান
                </>
              )}
            </button>
          </form>
        </div>

        {/* History */}
        <div className="glass-card p-5">
          <h3 className="font-bold text-white mb-4 flex items-center gap-2">
            <Clock size={16} className="text-gray-400" /> পাঠানো বার্তার ইতিহাস
          </h3>
          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
            {loadingHistory ? (
              Array(5).fill(0).map((_, i) => <div key={i} className="skeleton h-20" />)
            ) : history.length === 0 ? (
              <p className="text-gray-600 text-sm text-center py-8">এখনো কোনো বার্তা পাঠানো হয়নি</p>
            ) : (
              history.map((msg) => (
                <div key={msg._id} className="p-3 bg-dark-hover rounded-xl border border-dark-border/50">
                  <p className="text-sm font-medium text-white mb-1 line-clamp-1">{msg.title}</p>
                  <p className="text-xs text-gray-500 mb-2 line-clamp-2">{msg.message}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1 text-xs text-emerald-400">
                        <CheckCircle size={11} /> {msg.successCount}
                      </span>
                      {msg.failedCount > 0 && (
                        <span className="flex items-center gap-1 text-xs text-red-400">
                          <XCircle size={11} /> {msg.failedCount}
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-gray-600">
                      {new Date(msg.sentAt).toLocaleDateString('bn-BD')}
                    </p>
                  </div>
                  {msg.targetDistrict && (
                    <p className="text-[10px] text-blue-400 mt-1">📍 {msg.targetDistrict}</p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
