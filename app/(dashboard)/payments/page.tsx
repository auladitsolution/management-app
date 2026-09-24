'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import { Plus, CreditCard, AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react'
import toast from 'react-hot-toast'
import clsx from 'clsx'

const formatTaka = (v: number) => `৳${Number(v || 0).toLocaleString('bn-BD')}`

export default function PaymentsPage() {
  const [payments, setPayments]   = useState<any[]>([])
  const [loading, setLoading]     = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState<any>(null)
  const [clients, setClients]     = useState<any[]>([])
  const [projects, setProjects]   = useState<any[]>([])
  const [dueOnly, setDueOnly]     = useState(false)

  const [newPaymentForm, setNewPaymentForm] = useState({
    clientId: '', projectId: '', totalAmount: 0, dueDate: '',
  })
  const [addAmountForm, setAddAmountForm] = useState({
    amount: 0, method: 'বিকাশ', transactionId: '', note: '',
  })
  const [saving, setSaving] = useState(false)

  const load = () => {
    setLoading(true)
    axios.get('/api/payments', { params: { dueOnly } })
      .then((r) => setPayments(r.data.payments))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [dueOnly])
  useEffect(() => {
    axios.get('/api/clients').then((r) => setClients(r.data.clients))
  }, [])

  const loadProjects = (clientId: string) => {
    axios.get('/api/projects', { params: { clientId } })
      .then((r) => setProjects(r.data.projects))
  }

  const totalRevenue = payments.reduce((s, p) => s + p.paidAmount, 0)
  const totalDue     = payments.reduce((s, p) => s + p.dueAmount, 0)

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      await axios.post('/api/payments', newPaymentForm)
      toast.success('পেমেন্ট তথ্য যোগ হয়েছে!')
      setShowModal(false)
      load()
    } catch {
      toast.error('যোগ করতে সমস্যা হয়েছে')
    } finally {
      setSaving(false)
    }
  }

  const handleAddPayment = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      await axios.put(`/api/payments/${selectedPayment._id}`, { newPayment: { ...addAmountForm, date: new Date() } })
      toast.success('পেমেন্ট রেকর্ড যোগ হয়েছে!')
      setShowAddModal(false)
      load()
    } catch {
      toast.error('পেমেন্ট যোগ করতে সমস্যা হয়েছে')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="section-header">
        <div>
          <h1 className="section-title"><CreditCard size={22} className="text-primary-400" /> পেমেন্ট ব্যবস্থাপনা</h1>
          <p className="text-sm text-gray-500 mt-1">মোট {payments.length}টি পেমেন্ট রেকর্ড</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary">
          <Plus size={18} /> নতুন পেমেন্ট
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="glass-card p-5">
          <p className="text-xs text-gray-500 mb-1">মোট আয়</p>
          <p className="text-2xl font-bold text-emerald-400">{formatTaka(totalRevenue)}</p>
        </div>
        <div className="glass-card p-5">
          <p className="text-xs text-gray-500 mb-1">মোট বকেয়া</p>
          <p className="text-2xl font-bold text-red-400">{formatTaka(totalDue)}</p>
        </div>
        <div className="glass-card p-5">
          <p className="text-xs text-gray-500 mb-1">বকেয়া ক্লায়েন্ট</p>
          <p className="text-2xl font-bold text-yellow-400">{payments.filter(p => p.dueAmount > 0).length} জন</p>
        </div>
      </div>

      {/* Filter */}
      <div className="glass-card p-4 flex gap-3 items-center">
        <button
          onClick={() => setDueOnly(false)}
          className={clsx('px-4 py-2 rounded-xl text-sm font-medium transition-all', !dueOnly ? 'bg-primary-600 text-white' : 'bg-dark-hover text-gray-400 hover:text-white')}
        >
          সব পেমেন্ট
        </button>
        <button
          onClick={() => setDueOnly(true)}
          className={clsx('px-4 py-2 rounded-xl text-sm font-medium transition-all', dueOnly ? 'bg-red-600 text-white' : 'bg-dark-hover text-gray-400 hover:text-white')}
        >
          <AlertTriangle size={14} className="inline mr-1" /> শুধু বকেয়া
        </button>
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-3">{Array(5).fill(0).map((_, i) => <div key={i} className="skeleton h-14" />)}</div>
        ) : payments.length === 0 ? (
          <div className="p-12 text-center">
            <CheckCircle size={40} className="text-gray-700 mx-auto mb-3" />
            <p className="text-gray-500">কোনো পেমেন্ট রেকর্ড নেই</p>
          </div>
        ) : (
          <table className="w-full table-dark">
            <thead>
              <tr>
                <th>ক্লায়েন্ট</th>
                <th>প্রজেক্ট</th>
                <th>মোট মূল্য</th>
                <th>পরিশোধিত</th>
                <th>বকেয়া</th>
                <th>কার্যক্রম</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p._id}>
                  <td>
                    <div>
                      <p className="font-medium text-white">{p.clientId?.name}</p>
                      <p className="text-xs text-gray-500">{p.clientId?.phone}</p>
                    </div>
                  </td>
                  <td className="text-sm">{p.projectId?.name || '—'}</td>
                  <td className="font-semibold">{formatTaka(p.totalAmount)}</td>
                  <td className="text-emerald-400 font-semibold">{formatTaka(p.paidAmount)}</td>
                  <td>
                    <span className={clsx('font-bold', p.dueAmount > 0 ? 'text-red-400' : 'text-emerald-400')}>
                      {p.dueAmount > 0 ? formatTaka(p.dueAmount) : '✓ পরিশোধিত'}
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={() => { setSelectedPayment(p); setShowAddModal(true) }}
                      className="text-xs btn-primary py-1.5 px-3"
                    >
                      <Plus size={12} /> পেমেন্ট যোগ
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* New Payment Modal */}
      {showModal && (
        <div className="fixed inset-0 modal-overlay flex items-center justify-center z-50 p-4">
          <div className="glass-card w-full max-w-lg animate-slide-up">
            <div className="p-6 border-b border-dark-border flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">নতুন পেমেন্ট রেকর্ড</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-white text-2xl">&times;</button>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div>
                <label className="form-label">ক্লায়েন্ট *</label>
                <select required value={newPaymentForm.clientId}
                  onChange={(e) => { setNewPaymentForm({...newPaymentForm, clientId: e.target.value}); loadProjects(e.target.value) }}
                  className="input-dark"
                >
                  <option value="">ক্লায়েন্ট নির্বাচন করুন</option>
                  {clients.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="form-label">প্রজেক্ট *</label>
                <select required value={newPaymentForm.projectId} onChange={(e) => setNewPaymentForm({...newPaymentForm, projectId: e.target.value})} className="input-dark">
                  <option value="">প্রজেক্ট নির্বাচন করুন</option>
                  {projects.map((p) => <option key={p._id} value={p._id}>{p.name}</option>)}
                </select>
              </div>
              <div>
                <label className="form-label">মোট মূল্য (টাকা) *</label>
                <input required type="number" value={newPaymentForm.totalAmount} onChange={(e) => setNewPaymentForm({...newPaymentForm, totalAmount: +e.target.value})} className="input-dark" placeholder="০" />
              </div>
              <div>
                <label className="form-label">পেমেন্টের শেষ তারিখ</label>
                <input type="date" value={newPaymentForm.dueDate} onChange={(e) => setNewPaymentForm({...newPaymentForm, dueDate: e.target.value})} className="input-dark" />
              </div>
              <div className="flex gap-3">
                <button type="submit" disabled={saving} className="btn-primary flex-1 justify-center">
                  {saving ? 'সংরক্ষণ হচ্ছে...' : 'সংরক্ষণ করুন'}
                </button>
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">বাতিল</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Payment Modal */}
      {showAddModal && selectedPayment && (
        <div className="fixed inset-0 modal-overlay flex items-center justify-center z-50 p-4">
          <div className="glass-card w-full max-w-lg animate-slide-up">
            <div className="p-6 border-b border-dark-border flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white">পেমেন্ট যোগ করুন</h2>
                <p className="text-xs text-gray-500">বকেয়া: {formatTaka(selectedPayment.dueAmount)}</p>
              </div>
              <button onClick={() => setShowAddModal(false)} className="text-gray-500 hover:text-white text-2xl">&times;</button>
            </div>
            <form onSubmit={handleAddPayment} className="p-6 space-y-4">
              <div>
                <label className="form-label">পরিমাণ (টাকা) *</label>
                <input required type="number" max={selectedPayment.dueAmount} value={addAmountForm.amount} onChange={(e) => setAddAmountForm({...addAmountForm, amount: +e.target.value})} className="input-dark" placeholder="০" />
              </div>
              <div>
                <label className="form-label">পেমেন্ট পদ্ধতি *</label>
                <select required value={addAmountForm.method} onChange={(e) => setAddAmountForm({...addAmountForm, method: e.target.value})} className="input-dark">
                  <option value="বিকাশ">বিকাশ</option>
                  <option value="নগদ">নগদ</option>
                  <option value="রকেট">রকেট</option>
                  <option value="ব্যাংক ট্রান্সফার">ব্যাংক ট্রান্সফার</option>
                  <option value="নগদ অর্থ">নগদ অর্থ (হাতে হাতে)</option>
                </select>
              </div>
              <div>
                <label className="form-label">লেনদেন আইডি</label>
                <input value={addAmountForm.transactionId} onChange={(e) => setAddAmountForm({...addAmountForm, transactionId: e.target.value})} className="input-dark" placeholder="Transaction ID" />
              </div>
              <div>
                <label className="form-label">নোট</label>
                <input value={addAmountForm.note} onChange={(e) => setAddAmountForm({...addAmountForm, note: e.target.value})} className="input-dark" placeholder="অতিরিক্ত তথ্য..." />
              </div>
              <div className="flex gap-3">
                <button type="submit" disabled={saving} className="btn-success flex-1 justify-center">
                  {saving ? 'যোগ হচ্ছে...' : 'পেমেন্ট যোগ করুন'}
                </button>
                <button type="button" onClick={() => setShowAddModal(false)} className="btn-secondary">বাতিল</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
