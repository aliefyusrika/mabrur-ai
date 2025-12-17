'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { AdminLayout, AdminCard } from '@/components/admin'

export default function EditManasik() {
  const [type, setType] = useState('STEP')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [videoUrl, setVideoUrl] = useState('')
  const [orderIndex, setOrderIndex] = useState(0)
  const [isActive, setIsActive] = useState(true)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const params = useParams()

  useEffect(() => {
    fetch(`/api/admin/manasik/${params.id}`)
      .then(res => {
        if (!res.ok) throw new Error('Not found')
        return res.json()
      })
      .then(data => {
        setType(data.type)
        setTitle(data.title)
        setContent(data.content)
        setVideoUrl(data.videoUrl || '')
        setOrderIndex(data.orderIndex)
        setIsActive(data.isActive)
      })
      .catch(() => router.push('/admin/manasik'))
      .finally(() => setLoading(false))
  }, [params.id, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    try {
      const res = await fetch(`/api/admin/manasik/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, title, content, videoUrl: videoUrl || null, orderIndex, isActive })
      })

      if (res.ok) {
        router.push('/admin/manasik')
      } else {
        const data = await res.json()
        setError(data.error || 'Gagal menyimpan')
      }
    } catch {
      setError('Terjadi kesalahan')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-navy-800 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <AdminLayout 
      title="Edit Konten Manasik"
      breadcrumb={[
        { label: 'Dashboard', href: '/admin/dashboard' },
        { label: 'Manasik Digital', href: '/admin/manasik' },
        { label: 'Edit' }
      ]}
    >
      <div className="max-w-2xl">
        <AdminCard>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-navy-700 mb-1.5">Tipe Konten</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none"
                >
                  <option value="STEP">Langkah Umrah</option>
                  <option value="DOA">Doa & Niat</option>
                  <option value="VIDEO">Video Manasik</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-navy-700 mb-1.5">Urutan</label>
                <input
                  type="number"
                  value={orderIndex}
                  onChange={(e) => setOrderIndex(parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none"
                  min="0"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-navy-700 mb-1.5">Judul</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-navy-700 mb-1.5">Konten</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none min-h-[200px]"
                required
              />
            </div>

            {type === 'VIDEO' && (
              <div>
                <label className="block text-sm font-medium text-navy-700 mb-1.5">URL Video</label>
                <input
                  type="url"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none"
                />
              </div>
            )}

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-5 h-5 rounded border-gray-300 text-gold-500 focus:ring-gold-500"
              />
              <span className="text-navy-700">Aktif</span>
            </label>

            {error && <p className="text-red-600 text-sm">{error}</p>}

            <div className="flex gap-3 pt-2">
              <button 
                type="submit" 
                className="px-6 py-2.5 bg-gold-500 text-navy-900 font-medium rounded-xl hover:bg-gold-400 transition-colors disabled:opacity-50"
                disabled={saving}
              >
                {saving ? 'Menyimpan...' : 'Update Konten'}
              </button>
              <Link 
                href="/admin/manasik"
                className="px-6 py-2.5 border border-gray-200 text-gray-600 font-medium rounded-xl hover:bg-gray-50 transition-colors"
              >
                Batal
              </Link>
            </div>
          </form>
        </AdminCard>
      </div>
    </AdminLayout>
  )
}
