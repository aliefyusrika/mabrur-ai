'use client'

import { useState, useEffect } from 'react'
import AdminSidebar from '@/components/admin/AdminSidebar'
import GoogleMapPicker from '@/components/GoogleMapPicker'
import ImageUpload from '@/components/ImageUpload'

interface ZiarahLocation {
  id: string
  city: string
  name: string
  arabicName: string | null
  description: string
  history: string | null
  virtues: string | null
  practices: string | null
  imagePath: string | null
  latitude: number | null
  longitude: number | null
  placeId: string | null
  address: string | null
  orderIndex: number
  isActive: boolean
}

const cities = [
  { id: 'MAKKAH', label: 'Makkah' },
  { id: 'MADINAH', label: 'Madinah' }
]

const initialForm = {
  city: 'MAKKAH' as 'MAKKAH' | 'MADINAH',
  name: '',
  arabicName: '',
  description: '',
  history: '',
  virtues: '',
  practices: '',
  imagePath: '',
  latitude: '',
  longitude: '',
  placeId: '',
  address: '',
  orderIndex: '0',
  isActive: true
}

export default function ZiarahAdminPage() {
  const [locations, setLocations] = useState<ZiarahLocation[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [filterCity, setFilterCity] = useState('')
  const [form, setForm] = useState(initialForm)

  useEffect(() => { fetchLocations() }, [])

  const fetchLocations = async () => {
    const res = await fetch('/api/admin/ziarah')
    const data = await res.json()
    setLocations(data)
    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const url = editingId ? `/api/admin/ziarah/${editingId}` : '/api/admin/ziarah'
    const method = editingId ? 'PUT' : 'POST'
    
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        orderIndex: parseInt(form.orderIndex) || 0,
        imagePath: form.imagePath || null,
        latitude: form.latitude || null,
        longitude: form.longitude || null,
        placeId: form.placeId || null,
        address: form.address || null
      })
    })
    
    setShowModal(false)
    resetForm()
    fetchLocations()
  }

  const handleEdit = (loc: ZiarahLocation) => {
    setEditingId(loc.id)
    setForm({
      city: loc.city as 'MAKKAH' | 'MADINAH',
      name: loc.name,
      arabicName: loc.arabicName || '',
      description: loc.description,
      history: loc.history || '',
      virtues: loc.virtues || '',
      practices: loc.practices || '',
      imagePath: loc.imagePath || '',
      latitude: loc.latitude?.toString() || '',
      longitude: loc.longitude?.toString() || '',
      placeId: loc.placeId || '',
      address: loc.address || '',
      orderIndex: loc.orderIndex.toString(),
      isActive: loc.isActive
    })
    setShowModal(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus lokasi ziarah ini?')) return
    await fetch(`/api/admin/ziarah/${id}`, { method: 'DELETE' })
    fetchLocations()
  }

  const resetForm = () => {
    setEditingId(null)
    setForm(initialForm)
  }

  const handleLocationSelect = (location: { latitude: number; longitude: number; placeId?: string; address?: string }) => {
    setForm(prev => ({
      ...prev,
      latitude: location.latitude.toString(),
      longitude: location.longitude.toString(),
      placeId: location.placeId || '',
      address: location.address || ''
    }))
  }

  const filteredLocations = filterCity ? locations.filter(l => l.city === filterCity) : locations

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminSidebar />
      <main className="ml-64 p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-navy-900">Lokasi Ziarah</h1>
            <p className="text-navy-500">Kelola tempat-tempat bersejarah di Tanah Suci</p>
          </div>
          <button onClick={() => { resetForm(); setShowModal(true) }}
            className="px-4 py-2 bg-gold-500 text-navy-900 rounded-xl font-medium hover:bg-gold-400 transition-colors flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Tambah Lokasi
          </button>
        </div>

        <div className="mb-6">
          <select value={filterCity} onChange={(e) => setFilterCity(e.target.value)}
            className="px-4 py-2 border border-navy-200 rounded-xl focus:ring-2 focus:ring-gold-500">
            <option value="">Semua Kota</option>
            {cities.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
          </select>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-gold-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredLocations.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-navy-100">
            <div className="w-16 h-16 bg-navy-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-navy-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
            </div>
            <h3 className="text-navy-900 font-semibold mb-2">Belum ada lokasi</h3>
            <p className="text-navy-500 text-sm">Tambahkan lokasi ziarah pertama</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredLocations.map((loc) => (
              <div key={loc.id} className={`bg-white rounded-2xl p-5 border ${loc.isActive ? 'border-navy-100' : 'border-red-200 bg-red-50/30'}`}>
                <div className="flex items-start gap-4">
                  {/* Image */}
                  <div className="w-24 h-24 bg-gradient-to-br from-gold-100 to-gold-200 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {loc.imagePath ? (
                      <img src={loc.imagePath} alt={loc.name} className="w-full h-full object-cover" />
                    ) : (
                      <svg className="w-10 h-10 text-gold-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    )}
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${loc.city === 'MAKKAH' ? 'bg-emerald-100 text-emerald-700' : 'bg-green-100 text-green-700'}`}>
                        {loc.city === 'MAKKAH' ? 'Makkah' : 'Madinah'}
                      </span>
                      {loc.latitude && loc.longitude && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs flex items-center gap-1">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          </svg>
                          Maps
                        </span>
                      )}
                      {!loc.isActive && <span className="px-2 py-1 bg-red-100 text-red-600 rounded text-xs">Nonaktif</span>}
                    </div>
                    <h3 className="font-semibold text-navy-900">{loc.name}</h3>
                    {loc.arabicName && <p className="text-gold-600 font-arabic text-sm">{loc.arabicName}</p>}
                    {loc.address && <p className="text-xs text-navy-400 mt-1 truncate">{loc.address}</p>}
                    <p className="text-sm text-navy-500 line-clamp-2 mt-1">{loc.description}</p>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(loc)} className="p-2 text-navy-400 hover:text-navy-600 hover:bg-navy-50 rounded-lg">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button onClick={() => handleDelete(loc.id)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
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
            <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white p-6 border-b border-navy-100 z-10">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-navy-900">{editingId ? 'Edit Lokasi' : 'Tambah Lokasi Ziarah'}</h2>
                  <button onClick={() => setShowModal(false)} className="p-2 text-navy-400 hover:text-navy-600 rounded-lg">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Basic Info */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-navy-900 flex items-center gap-2">
                    <span className="w-6 h-6 bg-navy-100 rounded-full flex items-center justify-center text-xs text-navy-600">1</span>
                    Informasi Dasar
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-navy-700 mb-1">Kota *</label>
                      <select value={form.city} onChange={(e) => setForm({...form, city: e.target.value as 'MAKKAH' | 'MADINAH'})}
                        className="w-full px-4 py-2 border border-navy-200 rounded-xl focus:ring-2 focus:ring-gold-500">
                        {cities.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-navy-700 mb-1">Urutan</label>
                      <input type="number" value={form.orderIndex} onChange={(e) => setForm({...form, orderIndex: e.target.value})}
                        className="w-full px-4 py-2 border border-navy-200 rounded-xl focus:ring-2 focus:ring-gold-500" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-navy-700 mb-1">Nama Lokasi *</label>
                      <input type="text" required value={form.name} onChange={(e) => setForm({...form, name: e.target.value})}
                        className="w-full px-4 py-2 border border-navy-200 rounded-xl focus:ring-2 focus:ring-gold-500" placeholder="Masjidil Haram" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-navy-700 mb-1">Nama Arab</label>
                      <input type="text" value={form.arabicName} onChange={(e) => setForm({...form, arabicName: e.target.value})}
                        className="w-full px-4 py-2 border border-navy-200 rounded-xl focus:ring-2 focus:ring-gold-500 text-right font-arabic" dir="rtl" placeholder="المسجد الحرام" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-navy-700 mb-1">Deskripsi *</label>
                    <textarea required value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} rows={2}
                      className="w-full px-4 py-2 border border-navy-200 rounded-xl focus:ring-2 focus:ring-gold-500" placeholder="Deskripsi singkat lokasi..." />
                  </div>
                </div>

                {/* Image Upload */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-navy-900 flex items-center gap-2">
                    <span className="w-6 h-6 bg-navy-100 rounded-full flex items-center justify-center text-xs text-navy-600">2</span>
                    Gambar Lokasi
                  </h3>
                  <ImageUpload 
                    value={form.imagePath} 
                    onChange={(path) => setForm({...form, imagePath: path || ''})} 
                  />
                </div>

                {/* Google Maps */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-navy-900 flex items-center gap-2">
                    <span className="w-6 h-6 bg-navy-100 rounded-full flex items-center justify-center text-xs text-navy-600">3</span>
                    Lokasi di Peta
                  </h3>
                  <GoogleMapPicker
                    latitude={form.latitude ? parseFloat(form.latitude) : null}
                    longitude={form.longitude ? parseFloat(form.longitude) : null}
                    city={form.city}
                    onLocationSelect={handleLocationSelect}
                  />
                  {form.address && (
                    <div className="p-3 bg-blue-50 rounded-xl border border-blue-200">
                      <p className="text-sm text-blue-800">
                        <span className="font-medium">Alamat:</span> {form.address}
                      </p>
                      <p className="text-xs text-blue-600 mt-1">
                        Koordinat: {form.latitude}, {form.longitude}
                      </p>
                    </div>
                  )}
                </div>

                {/* Additional Info */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-navy-900 flex items-center gap-2">
                    <span className="w-6 h-6 bg-navy-100 rounded-full flex items-center justify-center text-xs text-navy-600">4</span>
                    Informasi Tambahan
                  </h3>
                  <div>
                    <label className="block text-sm font-medium text-navy-700 mb-1">Sejarah</label>
                    <textarea value={form.history} onChange={(e) => setForm({...form, history: e.target.value})} rows={2}
                      className="w-full px-4 py-2 border border-navy-200 rounded-xl focus:ring-2 focus:ring-gold-500" placeholder="Sejarah lokasi..." />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-navy-700 mb-1">Keutamaan</label>
                    <textarea value={form.virtues} onChange={(e) => setForm({...form, virtues: e.target.value})} rows={2}
                      className="w-full px-4 py-2 border border-navy-200 rounded-xl focus:ring-2 focus:ring-gold-500" placeholder="Keutamaan mengunjungi lokasi..." />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-navy-700 mb-1">Amalan yang Dianjurkan</label>
                    <textarea value={form.practices} onChange={(e) => setForm({...form, practices: e.target.value})} rows={2}
                      className="w-full px-4 py-2 border border-navy-200 rounded-xl focus:ring-2 focus:ring-gold-500" placeholder="Amalan yang dianjurkan..." />
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="isActive" checked={form.isActive} onChange={(e) => setForm({...form, isActive: e.target.checked})} className="rounded" />
                    <label htmlFor="isActive" className="text-sm text-navy-700">Aktif (tampil di halaman jamaah)</label>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t border-navy-100">
                  <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-3 border border-navy-200 text-navy-700 rounded-xl hover:bg-navy-50 font-medium">
                    Batal
                  </button>
                  <button type="submit" className="flex-1 px-4 py-3 bg-gold-500 text-navy-900 rounded-xl font-medium hover:bg-gold-400">
                    {editingId ? 'Simpan Perubahan' : 'Tambah Lokasi'}
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
