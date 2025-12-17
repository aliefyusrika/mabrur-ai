'use client'

import { useState, useEffect } from 'react'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AudioUpload from '@/components/AudioUpload'

interface IbadahContent {
  id: string
  category: string
  location: string
  title: string
  arabicText: string | null
  latinText: string | null
  translation: string | null
  audioPath: string | null
  description: string | null
  orderIndex: number
  isActive: boolean
}

const categories = [
  { id: 'TAWAF', label: 'Tawaf' },
  { id: 'SAII', label: "Sa'i" },
  { id: 'WUKUF', label: 'Wukuf' },
  { id: 'MABIT', label: 'Mabit' },
  { id: 'JUMRAH', label: 'Jumrah' },
  { id: 'DOA_HARIAN', label: 'Doa Harian' }
]

const locations = [
  { id: 'MASJIDIL_HARAM', label: 'Masjidil Haram' },
  { id: 'MASJID_NABAWI', label: 'Masjid Nabawi' },
  { id: 'ARAFAH', label: 'Arafah' },
  { id: 'MINA', label: 'Mina' },
  { id: 'MUZDALIFAH', label: 'Muzdalifah' }
]

export default function IbadahAdminPage() {
  const [contents, setContents] = useState<IbadahContent[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [filterCategory, setFilterCategory] = useState('')
  const [form, setForm] = useState({
    category: 'TAWAF', location: 'MASJIDIL_HARAM', title: '', arabicText: '',
    latinText: '', translation: '', audioPath: null as string | null, description: '', orderIndex: '0', isActive: true
  })

  useEffect(() => { fetchContents() }, [])

  const fetchContents = async () => {
    try {
      const res = await fetch('/api/admin/ibadah')
      const data = await res.json()
      if (Array.isArray(data)) {
        setContents(data)
      } else {
        console.error('API error:', data)
        setContents([])
      }
    } catch (error) {
      console.error('Fetch error:', error)
      setContents([])
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const url = editingId ? `/api/admin/ibadah/${editingId}` : '/api/admin/ibadah'
    const method = editingId ? 'PUT' : 'POST'
    
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, orderIndex: parseInt(form.orderIndex) || 0 })
    })
    
    setShowModal(false)
    resetForm()
    fetchContents()
  }

  const handleEdit = (content: IbadahContent) => {
    setEditingId(content.id)
    setForm({
      category: content.category,
      location: content.location,
      title: content.title,
      arabicText: content.arabicText || '',
      latinText: content.latinText || '',
      translation: content.translation || '',
      audioPath: content.audioPath,
      description: content.description || '',
      orderIndex: content.orderIndex.toString(),
      isActive: content.isActive
    })
    setShowModal(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus konten ibadah ini?')) return
    await fetch(`/api/admin/ibadah/${id}`, { method: 'DELETE' })
    fetchContents()
  }

  const resetForm = () => {
    setEditingId(null)
    setForm({
      category: 'TAWAF', location: 'MASJIDIL_HARAM', title: '', arabicText: '',
      latinText: '', translation: '', audioPath: null, description: '', orderIndex: '0', isActive: true
    })
  }

  const filteredContents = filterCategory 
    ? contents.filter(c => c.category === filterCategory)
    : contents

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminSidebar />
      <main className="ml-64 p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-navy-900">Panduan Ibadah</h1>
            <p className="text-navy-500">Kelola doa dan panduan ibadah di Tanah Suci</p>
          </div>
          <button onClick={() => { resetForm(); setShowModal(true) }}
            className="px-4 py-2 bg-gold-500 text-navy-900 rounded-xl font-medium hover:bg-gold-400 transition-colors flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Tambah Konten
          </button>
        </div>

        {/* Filter */}
        <div className="mb-6">
          <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border border-navy-200 rounded-xl focus:ring-2 focus:ring-gold-500">
            <option value="">Semua Kategori</option>
            {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.label}</option>)}
          </select>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-gold-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredContents.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-navy-100">
            <div className="w-16 h-16 bg-navy-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🤲</span>
            </div>
            <h3 className="text-navy-900 font-semibold mb-2">Belum ada konten</h3>
            <p className="text-navy-500 text-sm">Tambahkan panduan ibadah pertama</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredContents.map((content) => (
              <div key={content.id} className={`bg-white rounded-2xl p-5 border ${content.isActive ? 'border-navy-100' : 'border-red-200 bg-red-50/30'}`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-1 bg-navy-100 text-navy-700 rounded text-xs font-medium">
                        {categories.find(c => c.id === content.category)?.label}
                      </span>
                      <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-xs font-medium">
                        {locations.find(l => l.id === content.location)?.label}
                      </span>
                      {content.audioPath && <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">🔊 Audio</span>}
                      {!content.isActive && <span className="px-2 py-1 bg-red-100 text-red-600 rounded text-xs">Nonaktif</span>}
                    </div>
                    <h3 className="font-semibold text-navy-900 mb-1">{content.title}</h3>
                    {content.arabicText && (
                      <p className="text-lg text-emerald-800 font-arabic text-right mb-2 line-clamp-1" dir="rtl">{content.arabicText}</p>
                    )}
                    {content.description && <p className="text-sm text-navy-500 line-clamp-2">{content.description}</p>}
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button onClick={() => handleEdit(content)} className="p-2 text-navy-400 hover:text-navy-600 hover:bg-navy-50 rounded-lg">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button onClick={() => handleDelete(content.id)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
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

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-navy-100">
                <h2 className="text-xl font-bold text-navy-900">{editingId ? 'Edit Konten' : 'Tambah Panduan Ibadah'}</h2>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-navy-700 mb-1">Kategori *</label>
                    <select value={form.category} onChange={(e) => setForm({...form, category: e.target.value})}
                      className="w-full px-4 py-2 border border-navy-200 rounded-xl focus:ring-2 focus:ring-gold-500">
                      {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-navy-700 mb-1">Lokasi *</label>
                    <select value={form.location} onChange={(e) => setForm({...form, location: e.target.value})}
                      className="w-full px-4 py-2 border border-navy-200 rounded-xl focus:ring-2 focus:ring-gold-500">
                      {locations.map(loc => <option key={loc.id} value={loc.id}>{loc.label}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-navy-700 mb-1">Judul *</label>
                  <input type="text" required value={form.title} onChange={(e) => setForm({...form, title: e.target.value})}
                    className="w-full px-4 py-2 border border-navy-200 rounded-xl focus:ring-2 focus:ring-gold-500" placeholder="Doa Tawaf Putaran 1" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-navy-700 mb-1">Teks Arab</label>
                  <textarea value={form.arabicText} onChange={(e) => setForm({...form, arabicText: e.target.value})} rows={3}
                    className="w-full px-4 py-2 border border-navy-200 rounded-xl focus:ring-2 focus:ring-gold-500 text-right font-arabic text-lg" dir="rtl" placeholder="بِسْمِ اللَّهِ..." />
                </div>
                <div>
                  <label className="block text-sm font-medium text-navy-700 mb-1">Bacaan Latin</label>
                  <textarea value={form.latinText} onChange={(e) => setForm({...form, latinText: e.target.value})} rows={2}
                    className="w-full px-4 py-2 border border-navy-200 rounded-xl focus:ring-2 focus:ring-gold-500 italic" placeholder="Bismillahi..." />
                </div>
                <div>
                  <label className="block text-sm font-medium text-navy-700 mb-1">Terjemahan</label>
                  <textarea value={form.translation} onChange={(e) => setForm({...form, translation: e.target.value})} rows={2}
                    className="w-full px-4 py-2 border border-navy-200 rounded-xl focus:ring-2 focus:ring-gold-500" placeholder="Dengan menyebut nama Allah..." />
                </div>
                <AudioUpload
                  value={form.audioPath}
                  onChange={(audioPath) => setForm({...form, audioPath})}
                />
                <div>
                  <label className="block text-sm font-medium text-navy-700 mb-1">Deskripsi</label>
                  <textarea value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} rows={2}
                    className="w-full px-4 py-2 border border-navy-200 rounded-xl focus:ring-2 focus:ring-gold-500" placeholder="Penjelasan singkat..." />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-navy-700 mb-1">Urutan</label>
                    <input type="number" value={form.orderIndex} onChange={(e) => setForm({...form, orderIndex: e.target.value})}
                      className="w-full px-4 py-2 border border-navy-200 rounded-xl focus:ring-2 focus:ring-gold-500" />
                  </div>
                  <div className="flex items-end">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({...form, isActive: e.target.checked})} className="rounded" />
                      <span className="text-sm text-navy-700">Aktif</span>
                    </label>
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 border border-navy-200 text-navy-700 rounded-xl hover:bg-navy-50">Batal</button>
                  <button type="submit" className="flex-1 px-4 py-2 bg-gold-500 text-navy-900 rounded-xl font-medium hover:bg-gold-400">
                    {editingId ? 'Simpan' : 'Tambah'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
