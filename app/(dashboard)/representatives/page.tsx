'use client'

import { useEffect, useState, useCallback } from 'react'
import axios from 'axios'
import { Plus, Search, UserCheck, MapPin, Phone, Send, Edit2, Trash2, Eye } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import clsx from 'clsx'
import { BD_DISTRICTS, DIVISIONS, getDistrictsByDivision, getUpazilasByDistrict } from '@/constants/bd-districts'

export default function RepresentativesPage() {
  const [reps, setReps] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [district, setDistrict] = useState('')
  const [status, setStatus] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [saving, setSaving] = useState(false)

  const [form, setForm] = useState({
    name: '', phone: '', email: '', address: '', district: '', upazila: '',
    telegramChatId: '', telegramUsername: '', commissionRate: 10,
    status: 'সক্রিয়', nidNumber: '', notes: '',
  })
  const [selectedDivision, setSelectedDivision] = useState('')

  const load = useCallback(() => {
    setLoading(true)
    axios.get('/api/representatives', { params: { search, district, status } })
      .then((r) => setReps(r.data.representatives))
      .finally(() => setLoading(false))
  }, [search, district, status])

  useEffect(() => { load() }, [load])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      await axios.post('/api/representatives', form)
      toast.success('প্রতিনিধি সফলভাবে যোগ করা হয়েছে!')
      setShowModal(false)
      load()
    } catch {
      toast.error('যোগ করতে সমস্যা হয়েছে')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`"${name}" কে মুছে ফেলবেন?`)) return
    await axios.delete(`/api/representatives/${id}`)
    toast.success('প্রতিনিধি মুছে ফেলা হয়েছে')
    load()
  }

  const divisionalDistricts = selectedDivision ? getDistrictsByDivision(selectedDivision) : BD_DISTRICTS
  const upazilas = form.district ? getUpazilasByDistrict(form.district) : []

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="section-header">
        <div>
          <h1 className="section-title"><UserCheck size={22} className="text-primary-400" /> প্রতিনিধি ব্যবস্থাপনা</h1>
          <p className="text-sm text-gray-500 mt-1">মোট {reps.length} জন প্রতিনিধি</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary">
          <Plus size={18} /> নতুন প্রতিনিধি
        </button>
      </div>

      {/* Filters */}
      <div className="glass-card p-4 flex flex-wrap gap-3">
        <div className="flex-1 min-w-48 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input type="text" placeholder="     নাম বা ফোন দিয়ে খুঁজুন..." value={search} onChange={(e) => setSearch(e.target.value)} className="input-dark pl-9" />
        </div>
        <select value={district} onChange={(e) => setDistrict(e.target.value)} className="input-dark w-40">
          <option value="">সব জেলা</option>
          {BD_DISTRICTS.map((d) => <option key={d.id} value={d.name}>{d.name}</option>)}
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="input-dark w-36">
          <option value="">সব স্ট্যাটাস</option>
          <option value="সক্রিয়">সক্রিয়</option>
          <option value="নিষ্ক্রিয়">নিষ্ক্রিয়</option>
        </select>
      </div>

      {/* Reps Table */}
      <div className="glass-card overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-3">{Array(5).fill(0).map((_, i) => <div key={i} className="skeleton h-14" />)}</div>
        ) : reps.length === 0 ? (
          <div className="p-12 text-center">
            <UserCheck size={40} className="text-gray-700 mx-auto mb-3" />
            <p className="text-gray-500">কোনো প্রতিনিধি পাওয়া যায়নি</p>
          </div>
        ) : (
          <table className="w-full table-dark">
            <thead>
              <tr>
                <th>নাম</th>
                <th>ফোন</th>
                <th>এলাকা</th>
                <th>Telegram</th>
                <th>কমিশন</th>
                <th>স্ট্যাটাস</th>
                <th>কার্যক্রম</th>
              </tr>
            </thead>
            <tbody>
              {reps.map((rep) => (
                <tr key={rep._id}>
                  <td>
                    <div>
                      <p className="font-medium text-white">{rep.name}</p>
                    </div>
                  </td>
                  <td>
                    <a href={`tel:${rep.phone}`} className="text-primary-400 hover:text-primary-300 flex items-center gap-1">
                      <Phone size={12} /> {rep.phone}
                    </a>
                  </td>
                  <td>
                    <div className="flex items-center gap-1 text-gray-400 text-xs">
                      <MapPin size={12} /> {rep.district}, {rep.upazila}
                    </div>
                  </td>
                  <td>
                    {rep.telegramChatId ? (
                      <div className="flex items-center gap-1">
                        <span className="badge badge-blue text-[10px]">✓ যুক্ত</span>
                        {rep.telegramUsername && <span className="text-xs text-gray-500">@{rep.telegramUsername}</span>}
                      </div>
                    ) : (
                      <span className="text-xs text-gray-600">যোগ হয়নি</span>
                    )}
                  </td>
                  <td className="text-yellow-400 font-medium">{rep.commissionRate}%</td>
                  <td>
                    <span className={clsx('badge', rep.status === 'সক্রিয়' ? 'badge-green' : 'badge-gray')}>{rep.status}</span>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <Link href={`/representatives/${rep._id}`}
                        className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 hover:bg-blue-500/20 transition-colors"
                      >
                        <Eye size={14} />
                      </Link>
                      <button
                        onClick={() => handleDelete(rep._id, rep.name)}
                        className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 hover:bg-red-500/20 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add Rep Modal */}
      {showModal && (
        <div className="fixed inset-0 modal-overlay flex items-center justify-center z-50 p-4">
          <div className="glass-card w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-slide-up">
            <div className="p-6 border-b border-dark-border flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">নতুন প্রতিনিধি যোগ করুন</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-white text-2xl">&times;</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">নাম *</label>
                  <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-dark" placeholder="পূর্ণ নাম" />
                </div>
                <div>
                  <label className="form-label">ফোন *</label>
                  <input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input-dark" placeholder="০১XXXXXXXXX" />
                </div>
                <div>
                  <label className="form-label">ইমেইল</label>
                  <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-dark" placeholder="email@example.com" />
                </div>
                <div>
                  <label className="form-label">কমিশন হার (%)</label>
                  <input type="number" value={form.commissionRate} onChange={(e) => setForm({ ...form, commissionRate: +e.target.value })} className="input-dark" />
                </div>
                <div>
                  <label className="form-label">বিভাগ</label>
                  <select value={selectedDivision} onChange={(e) => setSelectedDivision(e.target.value)} className="input-dark">
                    <option value="">বিভাগ নির্বাচন করুন</option>
                    {DIVISIONS.map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label">জেলা *</label>
                  <select required value={form.district} onChange={(e) => setForm({ ...form, district: e.target.value, upazila: '' })} className="input-dark">
                    <option value="">জেলা নির্বাচন করুন</option>
                    {divisionalDistricts.map((d) => <option key={d.id} value={d.name}>{d.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label">উপজেলা *</label>
                  <select required value={form.upazila} onChange={(e) => setForm({ ...form, upazila: e.target.value })} className="input-dark">
                    <option value="">উপজেলা নির্বাচন করুন</option>
                    {upazilas.map((u) => <option key={u.id} value={u.name}>{u.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label">স্ট্যাটাস</label>
                  <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="input-dark">
                    <option value="সক্রিয়">সক্রিয়</option>
                    <option value="নিষ্ক্রিয়">নিষ্ক্রিয়</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Telegram Chat ID</label>
                  <input value={form.telegramChatId} onChange={(e) => setForm({ ...form, telegramChatId: e.target.value })} className="input-dark" placeholder="যেমন: 123456789" />
                </div>
                <div>
                  <label className="form-label">Telegram Username</label>
                  <input value={form.telegramUsername} onChange={(e) => setForm({ ...form, telegramUsername: e.target.value })} className="input-dark" placeholder="@username" />
                </div>
                <div>
                  <label className="form-label">NID নম্বর</label>
                  <input value={form.nidNumber} onChange={(e) => setForm({ ...form, nidNumber: e.target.value })} className="input-dark" placeholder="জাতীয় পরিচয়পত্র নম্বর" />
                </div>
              </div>
              <div>
                <label className="form-label">ঠিকানা *</label>
                <input required value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="input-dark" placeholder="পূর্ণ ঠিকানা" />
              </div>
              <div>
                <label className="form-label">নোট</label>
                <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="input-dark" rows={2} />
              </div>

              {/* Telegram Chat ID How-to */}
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3 text-xs text-blue-300">
                <p className="font-semibold mb-1">🤖 Telegram Chat ID কিভাবে পাবেন?</p>
                <p>১. প্রতিনিধিকে @userinfobot-এ যেকোনো বার্তা পাঠাতে বলুন</p>
                <p>২. Bot উনার Chat ID দেখাবে — সেটি এখানে লিখুন</p>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="btn-primary flex-1 justify-center">
                  {saving ? 'সংরক্ষণ হচ্ছে...' : 'সংরক্ষণ করুন'}
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
