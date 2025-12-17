'use client'

import { useState, useEffect } from 'react'
import AdminSidebar from '@/components/admin/AdminSidebar'

interface Testimonial {
  id: string
  jamaahName: string
  rating: number
  content: string
  packageType: string | null
  travelDate: string | null
  isApproved: boolean
  isPublic: boolean
  createdAt: string
}

export default function TestimonialAdminPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('all')

  useEffect(() => { fetchTestimonials() }, [])

  const fetchTestimonials = async () => {
    const res = await fetch('/api/admin/testimonial')
    const data = await res.json()
    setTestimonials(data)
    setLoading(false)
  }

  const handleApprove = async (id: string, isApproved: boolean) => {
    await fetch(`/api/admin/testimonial/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isApproved, isPublic: true })
    })
    fetchTestimonials()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus testimoni ini?')) return
    await fetch(`/api/admin/testimonial/${id}`, { method: 'DELETE' })
    fetchTestimonials()
  }

  const filteredTestimonials = testimonials.filter(t => {
    if (filter === 'pending') return !t.isApproved
    if (filter === 'approved') return t.isApproved
    return true
  })

  const pendingCount = testimonials.filter(t => !t.isApproved).length

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminSidebar />
      <main className="ml-64 p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-navy-900">Testimoni</h1>
            <p className="text-navy-500">Kelola testimoni dari jamaah</p>
          </div>
          {pendingCount > 0 && (
            <div className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-xl font-medium">
              {pendingCount} testimoni menunggu persetujuan
            </div>
          )}
        </div>

        {/* Filter */}
        <div className="flex gap-2 mb-6">
          {[
            { id: 'all', label: 'Semua' },
            { id: 'pending', label: 'Menunggu' },
            { id: 'approved', label: 'Disetujui' }
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id as typeof filter)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                filter === f.id ? 'bg-navy-900 text-white' : 'bg-white text-navy-600 border border-navy-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-gold-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredTestimonials.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-navy-100">
            <div className="w-16 h-16 bg-navy-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">⭐</span>
            </div>
            <h3 className="text-navy-900 font-semibold mb-2">Belum ada testimoni</h3>
            <p className="text-navy-500 text-sm">Testimoni dari jamaah akan muncul di sini</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredTestimonials.map((t) => (
              <div key={t.id} className={`bg-white rounded-2xl p-5 border ${t.isApproved ? 'border-navy-100' : 'border-yellow-200 bg-yellow-50/30'}`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-gold-100 rounded-full flex items-center justify-center text-gold-600 font-bold">
                        {t.jamaahName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-navy-900">{t.jamaahName}</p>
                        <div className="flex items-center gap-2 text-sm text-navy-500">
                          <span>{'⭐'.repeat(t.rating)}</span>
                          {t.packageType && <span>• {t.packageType}</span>}
                          {t.travelDate && <span>• {t.travelDate}</span>}
                        </div>
                      </div>
                    </div>
                    <p className="text-navy-700 mb-3">{t.content}</p>
                    <div className="flex items-center gap-3">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${t.isApproved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {t.isApproved ? 'Disetujui' : 'Menunggu'}
                      </span>
                      <span className="text-xs text-navy-400">
                        {new Date(t.createdAt).toLocaleDateString('id-ID')}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    {!t.isApproved && (
                      <button onClick={() => handleApprove(t.id, true)} className="p-2 text-green-500 hover:text-green-700 hover:bg-green-50 rounded-lg" title="Setujui">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </button>
                    )}
                    {t.isApproved && (
                      <button onClick={() => handleApprove(t.id, false)} className="p-2 text-yellow-500 hover:text-yellow-700 hover:bg-yellow-50 rounded-lg" title="Batalkan">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </button>
                    )}
                    <button onClick={() => handleDelete(t.id)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
