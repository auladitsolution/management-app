'use client'

import { useEffect, useState } from 'react'
import { use } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import toast from 'react-hot-toast'
import { ArrowLeft, ExternalLink, Github, Edit2, Save, Calendar, Clock } from 'lucide-react'
import Link from 'next/link'
import clsx from 'clsx'

const statusColors: Record<string, string> = {
  'উন্নয়নাধীন': 'badge-blue',
  'পরীক্ষামূলক': 'badge-yellow',
  'হস্তান্তরিত': 'badge-green',
  'রক্ষণাবেক্ষণ': 'badge-purple',
  'বাতিল': 'badge-red',
}

const TECH_OPTIONS = ['Next.js', 'React', 'MongoDB', 'Firebase', 'Cloudinary', 'Tailwind CSS', 'Node.js', 'Express', 'Vercel']

export default function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id }          = use(params)
  const [project, setProject] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [editForm, setEditForm] = useState<any>(null)
  const [saving, setSaving]   = useState(false)

  useEffect(() => {
    axios.get(`/api/projects/${id}`)
      .then((r) => { setProject(r.data.project); setEditForm(r.data.project) })
      .finally(() => setLoading(false))
  }, [id])

  const handleSave = async () => {
    setSaving(true)
    try {
      await axios.put(`/api/projects/${id}`, editForm)
      toast.success('প্রজেক্ট আপডেট হয়েছে!')
      setProject(editForm)
      setEditing(false)
    } catch {
      toast.error('আপডেট করতে সমস্যা হয়েছে')
    } finally {
      setSaving(false)
    }
  }

  const toggleTech = (tech: string) => {
    setEditForm((f: any) => ({
      ...f,
      technologies: f.technologies?.includes(tech)
        ? f.technologies.filter((t: string) => t !== tech)
        : [...(f.technologies || []), tech],
    }))
  }

  if (loading) return <div className="skeleton h-96" />
  if (!project) return <p className="text-gray-500">প্রজেক্ট পাওয়া যায়নি</p>

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/projects" className="w-9 h-9 rounded-xl bg-dark-hover border border-dark-border flex items-center justify-center text-gray-400 hover:text-white">
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-white">{project.name}</h1>
            <p className="text-sm text-gray-500">{project.clientId?.name}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className={clsx('badge', statusColors[project.status])}>{project.status}</span>
          {editing ? (
            <div className="flex gap-2">
              <button onClick={handleSave} disabled={saving} className="btn-success">
                <Save size={16} /> {saving ? 'সংরক্ষণ হচ্ছে...' : 'সংরক্ষণ করুন'}
              </button>
              <button onClick={() => { setEditing(false); setEditForm(project) }} className="btn-secondary">বাতিল</button>
            </div>
          ) : (
            <button onClick={() => setEditing(true)} className="btn-primary">
              <Edit2 size={16} /> সম্পাদনা
            </button>
          )}
        </div>
      </div>

      {/* Links */}
      <div className="flex gap-3">
        {project.liveUrl && (
          <a href={project.liveUrl} target="_blank" rel="noreferrer" className="btn-success">
            <ExternalLink size={16} /> লাইভ দেখুন
          </a>
        )}
        {project.githubUrl && (
          <a href={project.githubUrl} target="_blank" rel="noreferrer" className="btn-secondary">
            <Github size={16} /> GitHub
          </a>
        )}
      </div>

      {/* Project Info */}
      <div className="glass-card p-6">
        <h2 className="font-bold text-white mb-4">প্রজেক্টের তথ্য</h2>
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: 'প্রজেক্টের নাম', key: 'name' },
            { label: 'প্রজেক্টের ধরন', key: 'projectType' },
            { label: 'Live URL', key: 'liveUrl' },
            { label: 'GitHub URL', key: 'githubUrl' },
            { label: 'মোট মূল্য (টাকা)', key: 'totalPrice', type: 'number' },
            { label: 'ওয়ারেন্টি (মাস)', key: 'warrantyMonths', type: 'number' },
          ].map(({ label, key, type }) => (
            <div key={key}>
              <p className="text-xs text-gray-500 mb-1">{label}</p>
              {editing ? (
                <input
                  type={type || 'text'}
                  value={editForm?.[key] || ''}
                  onChange={(e) => setEditForm({ ...editForm, [key]: type === 'number' ? +e.target.value : e.target.value })}
                  className="input-dark text-sm py-1.5"
                />
              ) : (
                <p className="text-sm font-medium text-white">
                  {key === 'totalPrice' ? `৳${Number(project[key] || 0).toLocaleString()}` : project[key] || '—'}
                </p>
              )}
            </div>
          ))}
          <div>
            <p className="text-xs text-gray-500 mb-1">স্ট্যাটাস</p>
            {editing ? (
              <select value={editForm?.status} onChange={(e) => setEditForm({ ...editForm, status: e.target.value })} className="input-dark text-sm py-1.5">
                <option value="উন্নয়নাধীন">উন্নয়নাধীন</option>
                <option value="পরীক্ষামূলক">পরীক্ষামূলক</option>
                <option value="হস্তান্তরিত">হস্তান্তরিত</option>
                <option value="রক্ষণাবেক্ষণ">রক্ষণাবেক্ষণ</option>
                <option value="বাতিল">বাতিল</option>
              </select>
            ) : (
              <span className={clsx('badge', statusColors[project.status])}>{project.status}</span>
            )}
          </div>
        </div>

        {/* Technologies */}
        <div className="mt-4">
          <p className="text-xs text-gray-500 mb-2">ব্যবহৃত প্রযুক্তি</p>
          {editing ? (
            <div className="flex flex-wrap gap-2">
              {TECH_OPTIONS.map((tech) => (
                <button key={tech} type="button" onClick={() => toggleTech(tech)}
                  className={clsx('px-3 py-1.5 rounded-xl text-xs font-medium border transition-all',
                    editForm?.technologies?.includes(tech)
                      ? 'bg-primary-600/30 border-primary-500/50 text-primary-300'
                      : 'bg-dark-hover border-dark-border text-gray-400'
                  )}
                >
                  {tech}
                </button>
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {project.technologies?.map((t: string) => (
                <span key={t} className="px-2.5 py-1 rounded-xl bg-primary-500/10 border border-primary-500/20 text-primary-400 text-xs">{t}</span>
              ))}
            </div>
          )}
        </div>

        {/* Description */}
        {(project.description || editing) && (
          <div className="mt-4">
            <p className="text-xs text-gray-500 mb-1">বিবরণ</p>
            {editing ? (
              <textarea
                value={editForm?.description || ''}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                className="input-dark" rows={3}
              />
            ) : (
              <p className="text-sm text-gray-300">{project.description}</p>
            )}
          </div>
        )}
      </div>

      {/* Dates */}
      <div className="grid grid-cols-2 gap-4">
        <div className="glass-card p-4 flex items-center gap-3">
          <Calendar size={18} className="text-primary-400" />
          <div>
            <p className="text-xs text-gray-500">তৈরির তারিখ</p>
            <p className="text-sm font-medium text-white">{new Date(project.createdAt).toLocaleDateString('bn-BD')}</p>
          </div>
        </div>
        {project.deliveryDate && (
          <div className="glass-card p-4 flex items-center gap-3">
            <Clock size={18} className="text-emerald-400" />
            <div>
              <p className="text-xs text-gray-500">ডেলিভারির তারিখ</p>
              <p className="text-sm font-medium text-white">{new Date(project.deliveryDate).toLocaleDateString('bn-BD')}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
