'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { AdminLayout, AdminCard } from '@/components/admin'

interface ManasikContent {
  id: string
  type: string
  title: string
  content: string
  videoUrl?: string
  isActive: boolean
  orderIndex: number
}

const typeLabels: Record<string, string> = {
  VIDEO: 'Video',
  DOA: 'Doa & Niat',
  STEP: 'Langkah Umrah',
}

export default function AdminManasik() {
  const [contents, setContents] = useState<ManasikContent[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('ALL')
  const router = useRouter()

  useEffect(() => {
    fetch('/api/admin/manasik')
      .then(res => {
        if (res.status === 401) {
          router.push('/admin/login')
          throw new Error('Unauthorized')
        }
        return res.json()
      })
      .then(setContents)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [router])

  const filteredContents = filter === 'ALL' ? contents : contents.filter(c => c.type === filter)

  const deleteContent = async (id: string) => {
    if (!confirm('Hapus konten ini?')) return
    await fetch(`/api/admin/manasik/${id}`, { method: 'DELETE' })
    setContents(prev => prev.filter(c => c.id !== id))
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
      title="Manasik Digital"
      breadcrumb={[{ label: 'Dashboard', href: '/admin/dashboard' }, { label: 'Manasik Digital' }]}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
          {['ALL', 'STEP', 'DOA', 'VIDEO'].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                filter === type 
                  ? 'bg-navy-800 text-white' 
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {type === 'ALL' ? 'Semua' : typeLabels[type]}
            </button>
          ))}
        </div>
        <Link 
          href="/admin/manasik/create"
          className="px-4 py-2 bg-gold-500 text-navy-900 font-medium rounded-xl hover:bg-gold-400 transition-colors text-sm"
        >
          + Tambah Konten
        </Link>
      </div>

      <div className="space-y-4">
        {filteredContents.map((content) => (
          <AdminCard key={content.id}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                    content.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {typeLabels[content.type]}
                  </span>
                  <span className="text-xs text-gray-400">Urutan: {content.orderIndex}</span>
                </div>
                <h3 className="font-semibold text-navy-900 mb-1">{content.title}</h3>
                <p className="text-gray-500 text-sm line-clamp-2">{content.content}</p>
                {content.videoUrl && (
                  <p className="text-xs text-blue-500 mt-2 truncate">{content.videoUrl}</p>
                )}
              </div>
              <div className="flex gap-3 flex-shrink-0">
                <Link href={`/admin/manasik/${content.id}`} className="text-sm text-navy-600 hover:text-navy-800">
                  Edit
                </Link>
                <button onClick={() => deleteContent(content.id)} className="text-sm text-red-500 hover:text-red-700">
                  Hapus
                </button>
              </div>
            </div>
          </AdminCard>
        ))}
      </div>

      {filteredContents.length === 0 && (
        <div className="text-center py-12 text-gray-400">Belum ada konten manasik</div>
      )}
    </AdminLayout>
  )
}
