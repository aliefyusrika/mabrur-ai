'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { AdminLayout, AdminCard } from '@/components/admin'

export default function CreateManasik() {
  const [type, setType] = useState('STEP')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [videoUrl, setVideoUrl] = useState('')
  const [orderIndex, setOrderIndex] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/admin/manasik', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, title, content, videoUrl: videoUrl || null, orderIndex })
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
      setLoading(false)
    }
  }

  return (
    <AdminLayout 
      title="Tambah Konten Manasik"
      breadcrumb={[
        { label: 'Dashboard', href: '/admin/dashboard' },
        { label: 'Manasik Digital', href: '/admin/manasik' },
        { label: 'Tambah' }
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
              <label className="block text-sm font-medium text-navy-700 mb-1.5">Judul *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none"
                placeholder="Contoh: Niat Ihram Umrah"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-navy-700 mb-1.5">Konten *</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none min-h-[200px]"
                placeholder="Tulis konten lengkap dengan doa dalam bahasa Arab jika ada..."
                required
              />
            </div>

            {type === 'VIDEO' && (
              <div>
                <label className="block text-sm font-medium text-navy-700 mb-1.5">URL Video (YouTube Embed)</label>
                <input
                  type="url"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none"
                  placeholder="https://www.youtube.com/embed/..."
                />
              </div>
            )}

            {error && <p className="text-red-600 text-sm">{error}</p>}

            <div className="flex gap-3 pt-2">
              <button 
                type="submit" 
                className="px-6 py-2.5 bg-gold-500 text-navy-900 font-medium rounded-xl hover:bg-gold-400 transition-colors disabled:opacity-50"
                disabled={loading}
              >
                {loading ? 'Menyimpan...' : 'Simpan Konten'}
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
