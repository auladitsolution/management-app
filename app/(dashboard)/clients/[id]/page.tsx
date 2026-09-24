'use client'

import { useEffect, useState } from 'react'
import { use } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import {
  ArrowLeft, Eye, EyeOff, Copy, Edit2, Save, Download,
  Building2, Shield, FolderKanban, CheckCircle,
} from 'lucide-react'
import Link from 'next/link'
import clsx from 'clsx'

interface CredentialField { key: string; label: string; isPassword?: boolean }

const credentialSections = [
  {
    title: 'Gmail অ্যাকাউন্ট',
    color: 'border-red-500/40',
    fields: [
      { key: 'gmailEmail', label: 'Gmail ঠিকানা' },
      { key: 'gmailPassword', label: 'পাসওয়ার্ড', isPassword: true },
    ],
  },
  {
    title: 'MongoDB Atlas',
    color: 'border-emerald-500/40',
    fields: [
      { key: 'mongodbUri', label: 'Connection URI', isPassword: true },
      { key: 'mongodbUsername', label: 'Username' },
      { key: 'mongodbPassword', label: 'Password', isPassword: true },
      { key: 'mongodbCluster', label: 'Cluster Name' },
    ],
  },
  {
    title: 'Firebase Console',
    color: 'border-yellow-500/40',
    fields: [
      { key: 'firebaseProjectId', label: 'Project ID' },
      { key: 'firebaseApiKey', label: 'API Key', isPassword: true },
      { key: 'firebaseAuthDomain', label: 'Auth Domain' },
    ],
  },
  {
    title: 'Cloudinary',
    color: 'border-blue-500/40',
    fields: [
      { key: 'cloudinaryCloudName', label: 'Cloud Name' },
      { key: 'cloudinaryApiKey', label: 'API Key', isPassword: true },
      { key: 'cloudinaryApiSecret', label: 'API Secret', isPassword: true },
      { key: 'cloudinaryUploadPreset', label: 'Upload Preset' },
    ],
  },
  {
    title: 'Vercel',
    color: 'border-gray-500/40',
    fields: [
      { key: 'vercelProjectUrl', label: 'Project URL' },
      { key: 'vercelProjectId', label: 'Project ID' },
      { key: 'vercelToken', label: 'Token', isPassword: true },
    ],
  },
]

function CredFieldRow({ label, value, isPassword, onChange }: {
  label: string; value: string; isPassword?: boolean; onChange?: (v: string) => void
}) {
  const [show, setShow] = useState(false)
  const copyToClipboard = () => {
    navigator.clipboard.writeText(value)
    toast.success('কপি হয়েছে!')
  }

  return (
    <div className="grid grid-cols-3 gap-3 items-center py-2 border-b border-dark-border/30 last:border-0">
      <label className="text-xs font-medium text-gray-400 col-span-1">{label}</label>
      <div className="col-span-2 flex items-center gap-2">
        {onChange ? (
          <input
            type={isPassword && !show ? 'password' : 'text'}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="input-dark text-sm py-1.5 flex-1"
            placeholder={`${label} লিখুন...`}
          />
        ) : (
          <div className="flex-1 px-3 py-1.5 bg-dark-hover border border-dark-border rounded-lg text-sm text-gray-300 font-mono overflow-hidden overflow-ellipsis">
            {isPassword && !show ? '••••••••••••' : (value || '—')}
          </div>
        )}
        <div className="flex gap-1">
          {isPassword && (
            <button
              onClick={() => setShow(!show)}
              className="w-7 h-7 rounded-lg bg-dark-hover border border-dark-border flex items-center justify-center text-gray-400 hover:text-white transition-colors"
            >
              {show ? <EyeOff size={12} /> : <Eye size={12} />}
            </button>
          )}
          {!onChange && value && (
            <button
              onClick={copyToClipboard}
              className="w-7 h-7 rounded-lg bg-dark-hover border border-dark-border flex items-center justify-center text-gray-400 hover:text-white transition-colors"
            >
              <Copy size={12} />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  // Next.js 15: unwrap Promise params with React.use()
  const { id } = use(params)

  const [client, setClient]   = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [editForm, setEditForm] = useState<any>(null)
  const [saving, setSaving]   = useState(false)

  useEffect(() => {
    axios.get(`/api/clients/${id}`)
      .then((r) => {
        setClient(r.data.client)
        setEditForm(r.data.client)
      })
      .finally(() => setLoading(false))
  }, [id])

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await axios.put(`/api/clients/${id}`, editForm)
      toast.success('ক্লায়েন্ট তথ্য আপডেট হয়েছে!')
      if (res.data?.client) {
        setClient(res.data.client)
        setEditForm(res.data.client)
      } else {
        setClient(editForm)
      }
      setEditing(false)
    } catch (err: any) {
      console.error(err)
      toast.error(err?.response?.data?.error || 'আপডেট করতে সমস্যা হয়েছে')
    } finally {
      setSaving(false)
    }
  }

  // Generate .env file content from credentials
  const generateEnvContent = () => {
    const creds = (editing ? editForm?.credentials : client?.credentials) || {}

    const envMapping = [
      {
        title: 'Gmail Configuration',
        fields: [
          { key: 'gmailEmail', envVar: 'GMAIL_EMAIL' },
          { key: 'gmailPassword', envVar: 'GMAIL_PASSWORD' },
        ],
      },
      {
        title: 'MongoDB Atlas',
        fields: [
          { key: 'mongodbUri', envVar: 'MONGODB_URI' },
          { key: 'mongodbUsername', envVar: 'MONGODB_USERNAME' },
          { key: 'mongodbPassword', envVar: 'MONGODB_PASSWORD' },
          { key: 'mongodbCluster', envVar: 'MONGODB_CLUSTER' },
        ],
      },
      {
        title: 'Firebase Configuration',
        fields: [
          { key: 'firebaseProjectId', envVar: 'NEXT_PUBLIC_FIREBASE_PROJECT_ID' },
          { key: 'firebaseApiKey', envVar: 'NEXT_PUBLIC_FIREBASE_API_KEY' },
          { key: 'firebaseAuthDomain', envVar: 'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN' },
        ],
      },
      {
        title: 'Cloudinary Media Service',
        fields: [
          { key: 'cloudinaryCloudName', envVar: 'NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME' },
          { key: 'cloudinaryApiKey', envVar: 'CLOUDINARY_API_KEY' },
          { key: 'cloudinaryApiSecret', envVar: 'CLOUDINARY_API_SECRET' },
          { key: 'cloudinaryUploadPreset', envVar: 'NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET' },
        ],
      },
      {
        title: 'Vercel Deployment',
        fields: [
          { key: 'vercelProjectUrl', envVar: 'VERCEL_PROJECT_URL' },
          { key: 'vercelProjectId', envVar: 'VERCEL_PROJECT_ID' },
          { key: 'vercelToken', envVar: 'VERCEL_TOKEN' },
        ],
      },
    ]

    const lines: string[] = [
      `# ========================================================`,
      `# Client: ${client?.name || 'Client'}${client?.businessName ? ` (${client?.businessName})` : ''}`,
      `# Export Date: ${new Date().toISOString().replace('T', ' ').substring(0, 19)}`,
      `# System: Aulad IT Solution Management`,
      `# ========================================================`,
      ``,
    ]

    let count = 0
    for (const group of envMapping) {
      lines.push(`# --- ${group.title} ---`)
      for (const item of group.fields) {
        const val = creds[item.key] || ''
        if (val) count++
        const escaped = String(val).replace(/\\/g, '\\\\').replace(/"/g, '\\"')
        lines.push(`${item.envVar}="${escaped}"`)
      }
      lines.push(``)
    }

    return { content: lines.join('\n'), count }
  }

  // Trigger .env file download
  const handleDownloadEnv = () => {
    const { content, count } = generateEnvContent()
    if (count === 0) {
      toast.error('ডাউনলোড করার জন্য কোনো Credential তথ্য নেই!')
      return
    }

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    const safeName = (client?.businessName || client?.name || 'client')
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9\-_]/g, '')
    a.href = url
    a.download = `${safeName || 'client'}.env`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast.success('.env ফাইল সফলভাবে ডাউনলোড হয়েছে!')
  }

  // Copy .env content to clipboard
  const handleCopyEnv = () => {
    const { content, count } = generateEnvContent()
    if (count === 0) {
      toast.error('কপি করার জন্য কোনো Credential তথ্য নেই!')
      return
    }
    navigator.clipboard.writeText(content)
    toast.success('সম্পূর্ণ .env ফরম্যাট কপি হয়েছে!')
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="skeleton h-32" />
        <div className="skeleton h-64" />
      </div>
    )
  }

  if (!client) return <p className="text-gray-500">ক্লায়েন্ট পাওয়া যায়নি</p>

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/clients" className="w-9 h-9 rounded-xl bg-dark-hover border border-dark-border flex items-center justify-center text-gray-400 hover:text-white transition-colors">
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-white">{client.name}</h1>
            {client.businessName && <p className="text-sm text-gray-500">{client.businessName}</p>}
          </div>
        </div>
        {editing ? (
          <div className="flex gap-2">
            <button onClick={handleSave} disabled={saving} className="btn-success">
              <Save size={16} /> {saving ? 'সংরক্ষণ হচ্ছে...' : 'সংরক্ষণ করুন'}
            </button>
            <button onClick={() => { setEditing(false); setEditForm(client) }} className="btn-secondary">বাতিল</button>
          </div>
        ) : (
          <button onClick={() => setEditing(true)} className="btn-primary">
            <Edit2 size={16} /> সম্পাদনা
          </button>
        )}
      </div>

      {/* Basic Info */}
      <div className="glass-card p-6">
        <h2 className="font-bold text-white mb-4 flex items-center gap-2">
          <Building2 size={18} className="text-primary-400" /> মৌলিক তথ্য
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { label: 'নাম', key: 'name' },
            { label: 'ব্যবসার নাম', key: 'businessName' },
            { label: 'ব্যবসার ধরন', key: 'businessType' },
            { label: 'ফোন', key: 'phone' },
            { label: 'ইমেইল', key: 'email' },
            { label: 'জেলা', key: 'district' },
            { label: 'উপজেলা', key: 'upazila' },
          ].map(({ label, key }) => (
            <div key={key}>
              <p className="text-xs text-gray-500 mb-1">{label}</p>
              {editing ? (
                <input
                  value={editForm?.[key] || ''}
                  onChange={(e) => setEditForm({ ...editForm, [key]: e.target.value })}
                  className="input-dark text-sm py-1.5"
                />
              ) : (
                <p className="text-sm font-medium text-white">{client[key] || '—'}</p>
              )}
            </div>
          ))}
          <div>
            <p className="text-xs text-gray-500 mb-1">স্ট্যাটাস</p>
            {editing ? (
              <select value={editForm?.status} onChange={(e) => setEditForm({ ...editForm, status: e.target.value })} className="input-dark text-sm py-1.5">
                <option value="সক্রিয়">সক্রিয়</option>
                <option value="নিষ্ক্রিয়">নিষ্ক্রিয়</option>
                <option value="অপেক্ষমান">অপেক্ষমান</option>
              </select>
            ) : (
              <span className={clsx('badge', {
                'badge-green':  client.status === 'সক্রিয়',
                'badge-gray':   client.status === 'নিষ্ক্রিয়',
                'badge-yellow': client.status === 'অপেক্ষমান',
              })}>{client.status}</span>
            )}
          </div>
        </div>
        {editing && (
          <div className="mt-4">
            <p className="form-label">ঠিকানা</p>
            <input value={editForm?.address || ''} onChange={(e) => setEditForm({ ...editForm, address: e.target.value })} className="input-dark" />
          </div>
        )}
        {editing && (
          <div className="mt-4">
            <p className="form-label">নোট</p>
            <textarea value={editForm?.notes || ''} onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })} className="input-dark" rows={3} />
          </div>
        )}
      </div>

      {/* Credential Vault */}
      <div className="glass-card p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-2">
            <Shield size={18} className="text-primary-400" />
            <h2 className="font-bold text-white">Credential Vault</h2>
            <span className="badge badge-purple">AES-256 এনক্রিপ্টেড</span>
          </div>

          {/* Action Buttons for .env */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyEnv}
              type="button"
              className="px-3 py-1.5 rounded-lg bg-dark-hover border border-dark-border text-xs text-gray-300 hover:text-white flex items-center gap-1.5 transition-colors"
              title="সমস্ত ক্রেডেনশিয়াল .env ফরম্যাটে কপি করুন"
            >
              <Copy size={13} />
              <span>.env কপি করুন</span>
            </button>
            <button
              onClick={handleDownloadEnv}
              type="button"
              className="px-3 py-1.5 rounded-lg bg-primary-600/20 border border-primary-500/40 text-xs text-primary-300 hover:bg-primary-600/30 flex items-center gap-1.5 transition-colors font-medium shadow-sm"
              title=".env ফাইল ডাউনলোড করুন"
            >
              <Download size={13} />
              <span>.env ডাউনলোড</span>
            </button>
          </div>
        </div>
        <p className="text-xs text-gray-500 mb-6">সকল তথ্য এনক্রিপ্ট করে সংরক্ষিত। শুধুমাত্র এখানে দেখা যাবে।</p>

        <div className="space-y-6">
          {credentialSections.map((section) => (
            <div key={section.title} className={clsx('p-4 rounded-xl border', section.color, 'bg-dark-hover/30')}>
              <h3 className="text-sm font-bold text-white mb-3">{section.title}</h3>
              {section.fields.map((field) => (
                <CredFieldRow
                  key={field.key}
                  label={field.label}
                  value={editing ? editForm?.credentials?.[field.key] || '' : client?.credentials?.[field.key] || ''}
                  isPassword={field.isPassword}
                  onChange={editing ? (v) => setEditForm({
                    ...editForm,
                    credentials: { ...editForm.credentials, [field.key]: v }
                  }) : undefined}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 gap-4">
        <Link href={`/projects?clientId=${id}`} className="glass-card p-4 flex items-center gap-3 hover:border-primary-500/30 transition-colors">
          <FolderKanban size={20} className="text-primary-400" />
          <div>
            <p className="font-medium text-white text-sm">প্রজেক্ট দেখুন</p>
            <p className="text-xs text-gray-500">এই ক্লায়েন্টের প্রজেক্ট</p>
          </div>
        </Link>
        <Link href={`/support?clientId=${id}`} className="glass-card p-4 flex items-center gap-3 hover:border-yellow-500/30 transition-colors">
          <CheckCircle size={20} className="text-yellow-400" />
          <div>
            <p className="font-medium text-white text-sm">টিকেট দেখুন</p>
            <p className="text-xs text-gray-500">সাপোর্ট ইতিহাস</p>
          </div>
        </Link>
      </div>
    </div>
  )
}
