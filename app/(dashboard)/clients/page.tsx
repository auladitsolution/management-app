'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import {
  Plus, Search, Eye, Edit2, Trash2, MapPin, Phone,
  Building2, ArrowRight, ArrowLeft, FolderKanban, ChevronRight, Check
} from 'lucide-react'
import Link from 'next/link'
import clsx from 'clsx'
import toast from 'react-hot-toast'

const statusColors: Record<string, string> = {
  'সক্রিয়': 'badge-green',
  'নিষ্ক্রিয়': 'badge-gray',
  'অপেক্ষমান': 'badge-yellow',
}

const TECH_OPTIONS = ['Next.js', 'React', 'MongoDB', 'Firebase', 'Cloudinary', 'Tailwind CSS', 'Node.js', 'Express', 'Vercel']
const PROJECT_TYPES = ['ই-কমার্স', 'পোর্টফোলিও', 'ব্যবসায়িক', 'স্কুল/কলেজ', 'ক্লিনিক/হাসপাতাল', 'রেস্তোরাঁ', 'খবর/ব্লগ', 'অন্যান্য']

export default function ClientsPage() {
  const [clients, setClients] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [step, setStep] = useState<1 | 2>(1)

  // Step 1: Client Form Fields
  const [clientForm, setClientForm] = useState({
    name: '', businessName: '', businessType: '', phone: '', email: '',
    address: '', district: '', upazila: '', status: 'অপেক্ষমান', notes: '',
  })

  // Step 2: Project Form Fields (Distinct fields, no duplication)
  const [projectForm, setProjectForm] = useState({
    name: '', projectType: '', liveUrl: '', githubUrl: '',
    technologies: [] as string[], status: 'উন্নয়নাধীন',
    totalPrice: '', warrantyMonths: 3, description: '', deliveryDate: '',
  })

  const [saving, setSaving] = useState(false)

  const load = () => {
    setLoading(true)
    axios.get('/api/clients', { params: { search, status } })
      .then((r) => setClients(r.data.clients))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [search, status])

  const handleCloseModal = () => {
    setShowModal(false)
    setStep(1)
    setClientForm({
      name: '', businessName: '', businessType: '', phone: '', email: '',
      address: '', district: '', upazila: '', status: 'অপেক্ষমান', notes: '',
    })
    setProjectForm({
      name: '', projectType: '', liveUrl: '', githubUrl: '',
      technologies: [], status: 'উন্নয়নাধীন', totalPrice: '',
      warrantyMonths: 3, description: '', deliveryDate: '',
    })
  }

  const toggleTech = (tech: string) => {
    setProjectForm((f) => ({
      ...f,
      technologies: f.technologies.includes(tech)
        ? f.technologies.filter((t) => t !== tech)
        : [...f.technologies, tech],
    }))
  }

  const validateClientForm = () => {
    if (!clientForm.name.trim()) {
      toast.error('ক্লায়েন্টের নাম আবশ্যক')
      return false
    }
    if (!clientForm.businessType.trim()) {
      toast.error('ব্যবসার ধরন আবশ্যক')
      return false
    }
    if (!clientForm.phone.trim()) {
      toast.error('ফোন নম্বর আবশ্যক')
      return false
    }
    if (!clientForm.district.trim()) {
      toast.error('জেলা আবশ্যক')
      return false
    }
    if (!clientForm.upazila.trim()) {
      toast.error('উপজেলা আবশ্যক')
      return false
    }
    if (!clientForm.address.trim()) {
      toast.error('ঠিকানা আবশ্যক')
      return false
    }
    return true
  }

  // Next Button handler
  const handleNext = () => {
    if (validateClientForm()) {
      setStep(2)
    }
  }

  // Save Client Only
  const handleSaveClientOnly = async () => {
    if (!validateClientForm()) return
    setSaving(true)
    try {
      await axios.post('/api/clients', clientForm)
      toast.success('ক্লায়েন্ট সফলভাবে যোগ করা হয়েছে!')
      handleCloseModal()
      load()
    } catch (err: any) {
      toast.error(err?.response?.data?.error || 'ক্লায়েন্ট যোগ করতে সমস্যা হয়েছে')
    } finally {
      setSaving(false)
    }
  }

  // Save Client & Project (Full Submit)
  const handleSaveAll = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateClientForm()) {
      setStep(1)
      return
    }
    if (!projectForm.name.trim()) {
      toast.error('প্রজেক্টের নাম আবশ্যক')
      return
    }
    if (!projectForm.projectType.trim()) {
      toast.error('প্রজেক্টের ধরন নির্বাচন করুন')
      return
    }

    setSaving(true)
    try {
      // 1. Create client first
      const clientRes = await axios.post('/api/clients', clientForm)
      const newClientId = clientRes.data?.client?._id

      if (!newClientId) {
        throw new Error('ক্লায়েন্ট তৈরি করা যায়নি')
      }

      // 2. Create project associated with the newly created client
      await axios.post('/api/projects', {
        ...projectForm,
        clientId: newClientId,
        totalPrice: Number(projectForm.totalPrice) || 0,
        warrantyMonths: Number(projectForm.warrantyMonths) || 3,
        deliveryDate: projectForm.deliveryDate ? new Date(projectForm.deliveryDate) : undefined,
      })

      toast.success('ক্লায়েন্ট ও প্রজেক্ট সফলভাবে যোগ করা হয়েছে!')
      handleCloseModal()
      load()
    } catch (err: any) {
      toast.error(err?.response?.data?.error || 'তথ্য সংরক্ষণ করতে সমস্যা হয়েছে')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`"${name}" কে মুছে ফেলবেন?`)) return
    try {
      await axios.delete(`/api/clients/${id}`)
      toast.success('ক্লায়েন্ট মুছে ফেলা হয়েছে')
      load()
    } catch {
      toast.error('মুছতে সমস্যা হয়েছে')
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="section-header">
        <div>
          <h1 className="section-title"><Building2 size={22} className="text-primary-400" /> ক্লায়েন্ট তালিকা</h1>
          <p className="text-sm text-gray-500 mt-1">মোট {clients.length} জন ক্লায়েন্ট</p>
        </div>
        <button onClick={() => { setStep(1); setShowModal(true) }} className="btn-primary">
          <Plus size={18} /> নতুন ক্লায়েন্ট
        </button>
      </div>

      {/* Filters */}
      <div className="glass-card p-4 flex flex-wrap gap-3">
        <div className="flex-1 min-w-48 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text" placeholder="      নাম, ফোন বা ব্যবসার নাম দিয়ে খুঁজুন..."
            value={search} onChange={(e) => setSearch(e.target.value)}
            className="input-dark pl-9"
          />
        </div>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="input-dark w-40">
          <option value="">সব স্ট্যাটাস</option>
          <option value="সক্রিয়">সক্রিয়</option>
          <option value="নিষ্ক্রিয়">নিষ্ক্রিয়</option>
          <option value="অপেক্ষমান">অপেক্ষমান</option>
        </select>
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-3">
            {Array(5).fill(0).map((_, i) => <div key={i} className="skeleton h-12" />)}
          </div>
        ) : clients.length === 0 ? (
          <div className="p-12 text-center">
            <Building2 size={40} className="text-gray-700 mx-auto mb-3" />
            <p className="text-gray-500">কোনো ক্লায়েন্ট পাওয়া যায়নি</p>
          </div>
        ) : (
          <table className="w-full table-dark">
            <thead>
              <tr>
                <th>নাম</th>
                <th>ব্যবসার ধরন</th>
                <th>ফোন</th>
                <th>এলাকা</th>
                <th>স্ট্যাটাস</th>
                <th>কার্যক্রম</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client) => (
                <tr key={client._id}>
                  <td>
                    <div>
                      <p className="font-medium text-white">{client.name}</p>
                      {client.businessName && <p className="text-xs text-gray-500">{client.businessName}</p>}
                    </div>
                  </td>
                  <td>{client.businessType}</td>
                  <td>
                    <a href={`tel:${client.phone}`} className="flex items-center gap-1 text-primary-400 hover:text-primary-300">
                      <Phone size={13} /> {client.phone}
                    </a>
                  </td>
                  <td>
                    <div className="flex items-center gap-1 text-gray-400">
                      <MapPin size={13} /> {client.district}, {client.upazila}
                    </div>
                  </td>
                  <td>
                    <span className={clsx('badge', statusColors[client.status])}>{client.status}</span>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <Link href={`/clients/${client._id}`}
                        className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 hover:bg-blue-500/20 transition-colors"
                      >
                        <Eye size={14} />
                      </Link>
                      <Link href={`/clients/${client._id}?edit=true`}
                        className="w-8 h-8 rounded-lg bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-400 hover:bg-yellow-500/20 transition-colors"
                      >
                        <Edit2 size={14} />
                      </Link>
                      <button
                        onClick={() => handleDelete(client._id, client.name)}
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

      {/* Add Client & Project Modal (Multi-Step) */}
      {showModal && (
        <div className="fixed inset-0 modal-overlay flex items-center justify-center z-50 p-4">
          <div className="glass-card w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-slide-up flex flex-col">
            {/* Modal Header */}
            <div className="p-5 border-b border-dark-border flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white">নতুন ক্লায়েন্ট ও প্রজেক্ট যোগ</h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  {step === 1 ? 'ধাপ ১: ক্লায়েন্টের তথ্য পূরণ করুন' : 'ধাপ ২: প্রজেক্টের তথ্য পূরণ করুন'}
                </p>
              </div>
              <button onClick={handleCloseModal} className="text-gray-500 hover:text-white text-2xl leading-none">&times;</button>
            </div>

            {/* Stepper Indicator */}
            <div className="px-6 py-3 bg-dark-bg/60 border-b border-dark-border/60 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className={clsx(
                  'flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                  step === 1
                    ? 'bg-primary-500/20 text-primary-300 border border-primary-500/30 font-semibold'
                    : 'text-gray-400 hover:text-gray-200'
                )}
              >
                <span className={clsx(
                  'w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold',
                  step === 1 ? 'bg-primary-500 text-white' : 'bg-dark-hover border border-dark-border text-gray-400'
                )}>
                  ১
                </span>
                <span>ক্লায়েন্টের তথ্য</span>
              </button>

              <ChevronRight size={14} className="text-gray-600" />

              <button
                type="button"
                onClick={handleNext}
                className={clsx(
                  'flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                  step === 2
                    ? 'bg-primary-500/20 text-primary-300 border border-primary-500/30 font-semibold'
                    : 'text-gray-400 hover:text-gray-200'
                )}
              >
                <span className={clsx(
                  'w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold',
                  step === 2 ? 'bg-primary-500 text-white' : 'bg-dark-hover border border-dark-border text-gray-400'
                )}>
                  ২
                </span>
                <span>প্রজেক্টের তথ্য</span>
              </button>
            </div>

            {/* Step 1: Client Information Form */}
            {step === 1 && (
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">ক্লায়েন্টের নাম *</label>
                    <input
                      required
                      value={clientForm.name}
                      onChange={(e) => setClientForm({ ...clientForm, name: e.target.value })}
                      className="input-dark"
                      placeholder="পূর্ণ নাম"
                    />
                  </div>
                  <div>
                    <label className="form-label">ব্যবসার নাম</label>
                    <input
                      value={clientForm.businessName}
                      onChange={(e) => setClientForm({ ...clientForm, businessName: e.target.value })}
                      className="input-dark"
                      placeholder="প্রতিষ্ঠানের নাম"
                    />
                  </div>
                  <div>
                    <label className="form-label">ব্যবসার ধরন *</label>
                    <input
                      required
                      value={clientForm.businessType}
                      onChange={(e) => setClientForm({ ...clientForm, businessType: e.target.value })}
                      className="input-dark"
                      placeholder="যেমন: হোটেল, ক্লিনিক, স্কুল"
                    />
                  </div>
                  <div>
                    <label className="form-label">ফোন নম্বর *</label>
                    <input
                      required
                      value={clientForm.phone}
                      onChange={(e) => setClientForm({ ...clientForm, phone: e.target.value })}
                      className="input-dark"
                      placeholder="০১XXXXXXXXX"
                    />
                  </div>
                  <div>
                    <label className="form-label">ইমেইল</label>
                    <input
                      type="email"
                      value={clientForm.email}
                      onChange={(e) => setClientForm({ ...clientForm, email: e.target.value })}
                      className="input-dark"
                      placeholder="email@example.com"
                    />
                  </div>
                  <div>
                    <label className="form-label">ক্লায়েন্ট স্ট্যাটাস</label>
                    <select
                      value={clientForm.status}
                      onChange={(e) => setClientForm({ ...clientForm, status: e.target.value })}
                      className="input-dark"
                    >
                      <option value="অপেক্ষমান">অপেক্ষমান</option>
                      <option value="সক্রিয়">সক্রিয়</option>
                      <option value="নিষ্ক্রিয়">নিষ্ক্রিয়</option>
                    </select>
                  </div>
                  <div>
                    <label className="form-label">জেলা *</label>
                    <input
                      required
                      value={clientForm.district}
                      onChange={(e) => setClientForm({ ...clientForm, district: e.target.value })}
                      className="input-dark"
                      placeholder="জেলার নাম"
                    />
                  </div>
                  <div>
                    <label className="form-label">উপজেলা *</label>
                    <input
                      required
                      value={clientForm.upazila}
                      onChange={(e) => setClientForm({ ...clientForm, upazila: e.target.value })}
                      className="input-dark"
                      placeholder="উপজেলার নাম"
                    />
                  </div>
                </div>

                <div>
                  <label className="form-label">ঠিকানা *</label>
                  <input
                    required
                    value={clientForm.address}
                    onChange={(e) => setClientForm({ ...clientForm, address: e.target.value })}
                    className="input-dark"
                    placeholder="পূর্ণ ঠিকানা"
                  />
                </div>

                <div>
                  <label className="form-label">ক্লায়েন্টের নোট</label>
                  <textarea
                    value={clientForm.notes}
                    onChange={(e) => setClientForm({ ...clientForm, notes: e.target.value })}
                    className="input-dark"
                    rows={2}
                    placeholder="ক্লায়েন্ট সম্পর্কিত যেকোনো বিশেষ তথ্য..."
                  />
                </div>

                {/* Step 1 Actions */}
                <div className="flex items-center gap-3 pt-4 border-t border-dark-border">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="btn-secondary"
                  >
                    বাতিল
                  </button>

                  <button
                    type="button"
                    onClick={handleSaveClientOnly}
                    disabled={saving}
                    className="btn-secondary ml-auto text-xs"
                    title="প্রজেক্ট যোগ না করে শুধু ক্লায়েন্ট সংরক্ষণ করুন"
                  >
                    {saving ? 'সংরক্ষণ হচ্ছে...' : 'শুধু ক্লায়েন্ট সংরক্ষণ'}
                  </button>

                  <button
                    type="button"
                    onClick={handleNext}
                    className="btn-primary flex items-center gap-2"
                  >
                    Next (পরবর্তী) <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Project Information Form */}
            {step === 2 && (
              <form onSubmit={handleSaveAll} className="p-6 space-y-4">
                {/* Summary banner of attached client (Read-only, no duplicate fields) */}
                <div className="p-3 rounded-xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-primary-500/20 flex items-center justify-center text-primary-400">
                      <Building2 size={16} />
                    </div>
                    <div>
                      <p className="text-[11px] text-gray-400">প্রজেক্ট যুক্ত হচ্ছে ক্লায়েন্টের সাথে:</p>
                      <p className="text-sm font-semibold text-white">
                        {clientForm.name} {clientForm.businessName && <span className="text-gray-400 font-normal">({clientForm.businessName})</span>}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-xs text-primary-400 hover:text-primary-300 underline font-medium"
                  >
                    ক্লায়েন্ট তথ্য পরিবর্তন
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">প্রজেক্টের নাম *</label>
                    <input
                      required
                      value={projectForm.name}
                      onChange={(e) => setProjectForm({ ...projectForm, name: e.target.value })}
                      className="input-dark"
                      placeholder="যেমন: ই-কমার্স ওয়েবসাইট"
                    />
                  </div>

                  <div>
                    <label className="form-label">প্রজেক্টের ধরন *</label>
                    <select
                      required
                      value={projectForm.projectType}
                      onChange={(e) => setProjectForm({ ...projectForm, projectType: e.target.value })}
                      className="input-dark"
                    >
                      <option value="">ধরন নির্বাচন করুন</option>
                      {PROJECT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="form-label">প্রজেক্ট স্ট্যাটাস</label>
                    <select
                      value={projectForm.status}
                      onChange={(e) => setProjectForm({ ...projectForm, status: e.target.value })}
                      className="input-dark"
                    >
                      <option value="উন্নয়নাধীন">উন্নয়নাধীন</option>
                      <option value="পরীক্ষামূলক">পরীক্ষামূলক</option>
                      <option value="হস্তান্তরিত">হস্তান্তরিত</option>
                      <option value="রক্ষণাবেক্ষণ">রক্ষণাবেক্ষণ</option>
                      <option value="বাতিল">বাতিল</option>
                    </select>
                  </div>

                  <div>
                    <label className="form-label">মোট মূল্য (টাকা)</label>
                    <input
                      type="number"
                      value={projectForm.totalPrice}
                      onChange={(e) => setProjectForm({ ...projectForm, totalPrice: e.target.value })}
                      className="input-dark"
                      placeholder="০"
                    />
                  </div>

                  <div>
                    <label className="form-label">Live URL (Vercel/ডোমেইন)</label>
                    <input
                      value={projectForm.liveUrl}
                      onChange={(e) => setProjectForm({ ...projectForm, liveUrl: e.target.value })}
                      className="input-dark"
                      placeholder="https://project.vercel.app"
                    />
                  </div>

                  <div>
                    <label className="form-label">GitHub URL</label>
                    <input
                      value={projectForm.githubUrl}
                      onChange={(e) => setProjectForm({ ...projectForm, githubUrl: e.target.value })}
                      className="input-dark"
                      placeholder="https://github.com/..."
                    />
                  </div>

                  <div>
                    <label className="form-label">ওয়ারেন্টি (মাস)</label>
                    <input
                      type="number"
                      value={projectForm.warrantyMonths}
                      onChange={(e) => setProjectForm({ ...projectForm, warrantyMonths: +e.target.value })}
                      className="input-dark"
                      placeholder="৩"
                    />
                  </div>

                  <div>
                    <label className="form-label">ডেলিভারি তারিখ</label>
                    <input
                      type="date"
                      value={projectForm.deliveryDate}
                      onChange={(e) => setProjectForm({ ...projectForm, deliveryDate: e.target.value })}
                      className="input-dark"
                    />
                  </div>
                </div>

                <div>
                  <label className="form-label">ব্যবহৃত প্রযুক্তি</label>
                  <div className="flex flex-wrap gap-2">
                    {TECH_OPTIONS.map((tech) => (
                      <button
                        key={tech}
                        type="button"
                        onClick={() => toggleTech(tech)}
                        className={clsx(
                          'px-3 py-1.5 rounded-xl text-xs font-medium border transition-all',
                          projectForm.technologies.includes(tech)
                            ? 'bg-primary-600/30 border-primary-500/50 text-primary-300'
                            : 'bg-dark-hover border-dark-border text-gray-400 hover:border-gray-500'
                        )}
                      >
                        {tech}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="form-label">প্রজেক্টের বিবরণ</label>
                  <textarea
                    value={projectForm.description}
                    onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                    className="input-dark"
                    rows={2}
                    placeholder="প্রজেক্টের বিস্তারিত বিবরণ ও রিকোয়ারমেন্ট..."
                  />
                </div>

                {/* Step 2 Actions */}
                <div className="flex items-center gap-3 pt-4 border-t border-dark-border">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="btn-secondary flex items-center gap-1.5"
                  >
                    <ArrowLeft size={16} /> পূর্ববর্তী
                  </button>

                  <button
                    type="button"
                    onClick={handleSaveClientOnly}
                    disabled={saving}
                    className="btn-secondary text-xs"
                    title="প্রজেক্ট ছাড়া কেবল ক্লায়েন্ট সংরক্ষণ করতে চাইলে ক্লিক করুন"
                  >
                    প্রজেক্ট ছাড়া সংরক্ষণ
                  </button>

                  <button
                    type="submit"
                    disabled={saving}
                    className="btn-primary flex-1 justify-center flex items-center gap-2"
                  >
                    {saving ? 'সংরক্ষণ হচ্ছে...' : 'ক্লায়েন্ট ও প্রজেক্ট সংরক্ষণ করুন'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

