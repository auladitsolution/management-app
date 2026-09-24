'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import { Plus, Search, Eye, Edit2, Trash2, FolderKanban, ExternalLink, Github } from 'lucide-react'
import Link from 'next/link'
import clsx from 'clsx'
import toast from 'react-hot-toast'

const statusColors: Record<string, string> = {
  'উন্নয়নাধীন': 'badge-blue',
  'পরীক্ষামূলক': 'badge-yellow',
  'হস্তান্তরিত': 'badge-green',
  'রক্ষণাবেক্ষণ': 'badge-purple',
  'বাতিল': 'badge-red',
}

const TECH_OPTIONS = ['Next.js', 'React', 'MongoDB', 'Firebase', 'Cloudinary', 'Tailwind CSS', 'Node.js', 'Express', 'Vercel']
const PROJECT_TYPES = ['ই-কমার্স', 'পোর্টফোলিও', 'ব্যবসায়িক', 'স্কুল/কলেজ', 'ক্লিনিক/হাসপাতাল', 'রেস্তোরাঁ', 'খবর/ব্লগ', 'অন্যান্য']

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([])
  const [clients, setClients]   = useState<any[]>([])
  const [loading, setLoading]   = useState(true)
  const [search, setSearch]     = useState('')
  const [status, setStatus]     = useState('')
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({
    name: '', projectType: '', liveUrl: '', githubUrl: '',
    technologies: [] as string[], status: 'উন্নয়নাধীন',
    clientId: '', description: '', totalPrice: 0, warrantyMonths: 3,
  })
  const [saving, setSaving] = useState(false)

  const load = () => {
    setLoading(true)
    axios.get('/api/projects', { params: { search, status } })
      .then((r) => setProjects(r.data.projects))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [search, status])
  useEffect(() => {
    axios.get('/api/clients').then((r) => setClients(r.data.clients))
  }, [])

  const toggleTech = (tech: string) => {
    setForm((f) => ({
      ...f,
      technologies: f.technologies.includes(tech)
        ? f.technologies.filter((t) => t !== tech)
        : [...f.technologies, tech],
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      await axios.post('/api/projects', form)
      toast.success('প্রজেক্ট সফলভাবে যোগ করা হয়েছে!')
      setShowModal(false)
      load()
    } catch {
      toast.error('প্রজেক্ট যোগ করতে সমস্যা হয়েছে')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`"${name}" প্রজেক্টটি মুছে ফেলবেন?`)) return
    await axios.delete(`/api/projects/${id}`)
    toast.success('প্রজেক্ট মুছে ফেলা হয়েছে')
    load()
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="section-header">
        <div>
          <h1 className="section-title"><FolderKanban size={22} className="text-primary-400" /> প্রজেক্ট তালিকা</h1>
          <p className="text-sm text-gray-500 mt-1">মোট {projects.length}টি প্রজেক্ট</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary">
          <Plus size={18} /> নতুন প্রজেক্ট
        </button>
      </div>

      {/* Filters */}
      <div className="glass-card p-4 flex flex-wrap gap-3">
        <div className="flex-1 min-w-48 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input type="text" placeholder="প্রজেক্টের নাম দিয়ে খুঁজুন..." value={search} onChange={(e) => setSearch(e.target.value)} className="input-dark pl-9" />
        </div>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="input-dark w-44">
          <option value="">সব স্ট্যাটাস</option>
          <option value="উন্নয়নাধীন">উন্নয়নাধীন</option>
          <option value="পরীক্ষামূলক">পরীক্ষামূলক</option>
          <option value="হস্তান্তরিত">হস্তান্তরিত</option>
          <option value="রক্ষণাবেক্ষণ">রক্ষণাবেক্ষণ</option>
          <option value="বাতিল">বাতিল</option>
        </select>
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array(6).fill(0).map((_, i) => <div key={i} className="skeleton h-48" />)}
        </div>
      ) : projects.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <FolderKanban size={40} className="text-gray-700 mx-auto mb-3" />
          <p className="text-gray-500">কোনো প্রজেক্ট পাওয়া যায়নি</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <div key={project._id} className="glass-card p-5 hover:border-primary-500/30 transition-all duration-200 hover:-translate-y-1">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 mr-2">
                  <h3 className="font-bold text-white text-sm line-clamp-1">{project.name}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">{project.clientId?.name}</p>
                </div>
                <span className={clsx('badge flex-shrink-0', statusColors[project.status])}>{project.status}</span>
              </div>

              <p className="text-xs text-gray-400 mb-3">{project.projectType}</p>

              {/* Tech badges */}
              {project.technologies?.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {project.technologies.slice(0, 3).map((t: string) => (
                    <span key={t} className="px-2 py-0.5 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-[10px]">{t}</span>
                  ))}
                  {project.technologies.length > 3 && (
                    <span className="px-2 py-0.5 rounded-full bg-dark-muted text-gray-400 text-[10px]">+{project.technologies.length - 3}</span>
                  )}
                </div>
              )}

              <div className="flex items-center gap-2 mt-auto pt-3 border-t border-dark-border/50">
                {project.liveUrl && (
                  <a href={project.liveUrl} target="_blank" rel="noreferrer"
                    className="flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 transition-colors"
                  >
                    <ExternalLink size={12} /> লাইভ
                  </a>
                )}
                {project.githubUrl && (
                  <a href={project.githubUrl} target="_blank" rel="noreferrer"
                    className="flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors"
                  >
                    <Github size={12} /> GitHub
                  </a>
                )}
                <div className="flex gap-1 ml-auto">
                  <Link href={`/projects/${project._id}`}
                    className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 hover:bg-blue-500/20 transition-colors"
                  >
                    <Eye size={12} />
                  </Link>
                  <button onClick={() => handleDelete(project._id, project.name)}
                    className="w-7 h-7 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 hover:bg-red-500/20 transition-colors"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Project Modal */}
      {showModal && (
        <div className="fixed inset-0 modal-overlay flex items-center justify-center z-50 p-4">
          <div className="glass-card w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-slide-up">
            <div className="p-6 border-b border-dark-border flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">নতুন প্রজেক্ট যোগ করুন</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-white text-2xl">&times;</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">প্রজেক্টের নাম *</label>
                  <input required value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} className="input-dark" placeholder="প্রজেক্টের নাম" />
                </div>
                <div>
                  <label className="form-label">ক্লায়েন্ট *</label>
                  <select required value={form.clientId} onChange={(e) => setForm({...form, clientId: e.target.value})} className="input-dark">
                    <option value="">ক্লায়েন্ট নির্বাচন করুন</option>
                    {clients.map((c) => <option key={c._id} value={c._id}>{c.name} {c.businessName ? `(${c.businessName})` : ''}</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label">প্রজেক্টের ধরন *</label>
                  <select required value={form.projectType} onChange={(e) => setForm({...form, projectType: e.target.value})} className="input-dark">
                    <option value="">ধরন নির্বাচন করুন</option>
                    {PROJECT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label">স্ট্যাটাস</label>
                  <select value={form.status} onChange={(e) => setForm({...form, status: e.target.value})} className="input-dark">
                    <option value="উন্নয়নাধীন">উন্নয়নাধীন</option>
                    <option value="পরীক্ষামূলক">পরীক্ষামূলক</option>
                    <option value="হস্তান্তরিত">হস্তান্তরিত</option>
                    <option value="রক্ষণাবেক্ষণ">রক্ষণাবেক্ষণ</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Live URL (Vercel)</label>
                  <input value={form.liveUrl} onChange={(e) => setForm({...form, liveUrl: e.target.value})} className="input-dark" placeholder="https://project.vercel.app" />
                </div>
                <div>
                  <label className="form-label">GitHub URL</label>
                  <input value={form.githubUrl} onChange={(e) => setForm({...form, githubUrl: e.target.value})} className="input-dark" placeholder="https://github.com/..." />
                </div>
                <div>
                  <label className="form-label">মোট মূল্য (টাকা)</label>
                  <input type="number" value={form.totalPrice} onChange={(e) => setForm({...form, totalPrice: +e.target.value})} className="input-dark" placeholder="০" />
                </div>
                <div>
                  <label className="form-label">ওয়ারেন্টি (মাস)</label>
                  <input type="number" value={form.warrantyMonths} onChange={(e) => setForm({...form, warrantyMonths: +e.target.value})} className="input-dark" placeholder="৩" />
                </div>
              </div>

              <div>
                <label className="form-label">ব্যবহৃত প্রযুক্তি</label>
                <div className="flex flex-wrap gap-2">
                  {TECH_OPTIONS.map((tech) => (
                    <button
                      key={tech} type="button"
                      onClick={() => toggleTech(tech)}
                      className={clsx(
                        'px-3 py-1.5 rounded-xl text-xs font-medium border transition-all',
                        form.technologies.includes(tech)
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
                <label className="form-label">বিবরণ</label>
                <textarea value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} className="input-dark" rows={3} placeholder="প্রজেক্টের বিস্তারিত..." />
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
