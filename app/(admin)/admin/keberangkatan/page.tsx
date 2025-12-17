'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import AdminSidebar from '@/components/admin/AdminSidebar'

interface Departure {
  id: string
  flightNumber: string
  airline: string
  departureDate: string
  departureTime: string
  arrivalTime: string | null
  origin: string
  destination: string
  terminal: string | null
  gate: string | null
  status: string
  delayMinutes: number | null
  notes: string | null
  isActive: boolean
}

const statusLabels: Record<string, { label: string; color: string }> = {
  ON_TIME: { label: 'Tepat Waktu', color: 'bg-green-100 text-green-700' },
  DELAYED: { label: 'Tertunda', color: 'bg-yellow-100 text-yellow-700' },
  BOARDING: { label: 'Boarding', color: 'bg-blue-100 text-blue-700' },
  DEPARTED: { label: 'Berangkat', color: 'bg-navy-100 text-navy-700' },
  CANCELLED: { label: 'Dibatalkan', color: 'bg-red-100 text-red-700' }
}

export default function KeberangkatanPage() {
  const [departures, setDepartures] = useState<Departure[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({
    flightNumber: '', airline: '', departureDate: '', departureTime: '',
    arrivalTime: '', origin: 'CGK - Jakarta', destination: 'JED - Jeddah',
    terminal: '', gate: '', status: 'ON_TIME', delayMinutes: '', notes: '', isActive: true
  })

  useEffect(() => { fetchDepartures() }, [])

  const fetchDepartures = async () => {
    const res = await fetch('/api/admin/departure')
    const data = await res.json()
    setDepartures(data)
    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const url = editingId ? `/api/admin/departure/${editingId}` : '/api/admin/departure'
    const method = editingId ? 'PUT' : 'POST'
    
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        delayMinutes: form.delayMinutes ? parseInt(form.delayMinutes) : null
      })
    })
    
    setShowModal(false)
    resetForm()
    fetchDepartures()
  }

  const handleEdit = (departure: Departure) => {
    setEditingId(departure.id)
    setForm({
      flightNumber: departure.flightNumber,
      airline: departure.airline,
      departureDate: departure.departureDate.split('T')[0],
      departureTime: departure.departureTime,
      arrivalTime: departure.arrivalTime || '',
      origin: departure.origin,
      destination: departure.destination,
      terminal: departure.terminal || '',
      gate: departure.gate || '',
      status: departure.status,
      delayMinutes: departure.delayMinutes?.toString() || '',
      notes: departure.notes || '',
      isActive: departure.isActive
    })
    setShowModal(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus jadwal keberangkatan ini?')) return
    await fetch(`/api/admin/departure/${id}`, { method: 'DELETE' })
    fetchDepartures()
  }

  const resetForm = () => {
    setEditingId(null)
    setForm({
      flightNumber: '', airline: '', departureDate: '', departureTime: '',
      arrivalTime: '', origin: 'CGK - Jakarta', destination: 'JED - Jeddah',
      terminal: '', gate: '', status: 'ON_TIME', delayMinutes: '', notes: '', isActive: true
    })
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminSidebar />
      <main className="ml-64 p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-navy-900">Keberangkatan</h1>
            <p className="text-navy-500">Kelola jadwal penerbangan jamaah</p>
          </div>
          <button
            onClick={() => { resetForm(); setShowModal(true) }}
            className="px-4 py-2 bg-gold-500 text-navy-900 rounded-xl font-medium hover:bg-gold-400 transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Tambah Jadwal
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-gold-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : departures.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-navy-100">
            <div className="w-16 h-16 bg-navy-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-navy-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3l14 9-14 9V3z" />
              </svg>
            </div>
            <h3 className="text-navy-900 font-semibold mb-2">Belum ada jadwal</h3>
            <p className="text-navy-500 text-sm">Tambahkan jadwal keberangkatan pertama</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {departures.map((dep) => (
              <div key={dep.id} className={`bg-white rounded-2xl p-6 border ${dep.isActive ? 'border-navy-100' : 'border-red-200 bg-red-50/30'}`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-xl font-bold text-navy-900">{dep.flightNumber}</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusLabels[dep.status]?.color || 'bg-gray-100'}`}>
                        {statusLabels[dep.status]?.label || dep.status}
                        {dep.status === 'DELAYED' && dep.delayMinutes && ` (+${dep.delayMinutes} menit)`}
                      </span>
                      {!dep.isActive && <span className="px-2 py-1 bg-red-100 text-red-600 rounded text-xs">Nonaktif</span>}
                    </div>
                    <p className="text-navy-600 font-medium mb-2">{dep.airline}</p>
                    <div className="flex items-center gap-6 text-sm text-navy-500">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {new Date(dep.departureDate).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                      </div>
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {dep.departureTime} {dep.arrivalTime && `→ ${dep.arrivalTime}`}
                      </div>
                    </div>
                    <div className="flex items-center gap-4 mt-3 text-sm">
                      <span className="text-navy-700">{dep.origin}</span>
                      <svg className="w-4 h-4 text-gold-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                      <span className="text-navy-700">{dep.destination}</span>
                    </div>
                    {(dep.terminal || dep.gate) && (
                      <div className="flex gap-4 mt-2 text-sm text-navy-500">
                        {dep.terminal && <span>Terminal: {dep.terminal}</span>}
                        {dep.gate && <span>Gate: {dep.gate}</span>}
                      </div>
                    )}
                    {dep.notes && <p className="mt-3 text-sm text-navy-500 bg-navy-50 p-3 rounded-lg">{dep.notes}</p>}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(dep)} className="p-2 text-navy-400 hover:text-navy-600 hover:bg-navy-50 rounded-lg">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button onClick={() => handleDelete(dep.id)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
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
                <h2 className="text-xl font-bold text-navy-900">{editingId ? 'Edit Jadwal' : 'Tambah Jadwal Keberangkatan'}</h2>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-navy-700 mb-1">Nomor Penerbangan *</label>
                    <input type="text" required value={form.flightNumber} onChange={(e) => setForm({...form, flightNumber: e.target.value})}
                      className="w-full px-4 py-2 border border-navy-200 rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-transparent" placeholder="GA 986" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-navy-700 mb-1">Maskapai *</label>
                    <input type="text" required value={form.airline} onChange={(e) => setForm({...form, airline: e.target.value})}
                      className="w-full px-4 py-2 border border-navy-200 rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-transparent" placeholder="Garuda Indonesia" />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-navy-700 mb-1">Tanggal *</label>
                    <input type="date" required value={form.departureDate} onChange={(e) => setForm({...form, departureDate: e.target.value})}
                      className="w-full px-4 py-2 border border-navy-200 rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-navy-700 mb-1">Jam Berangkat *</label>
                    <input type="time" required value={form.departureTime} onChange={(e) => setForm({...form, departureTime: e.target.value})}
                      className="w-full px-4 py-2 border border-navy-200 rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-navy-700 mb-1">Jam Tiba</label>
                    <input type="time" value={form.arrivalTime} onChange={(e) => setForm({...form, arrivalTime: e.target.value})}
                      className="w-full px-4 py-2 border border-navy-200 rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-transparent" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-navy-700 mb-1">Asal *</label>
                    <input type="text" required value={form.origin} onChange={(e) => setForm({...form, origin: e.target.value})}
                      className="w-full px-4 py-2 border border-navy-200 rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-navy-700 mb-1">Tujuan *</label>
                    <input type="text" required value={form.destination} onChange={(e) => setForm({...form, destination: e.target.value})}
                      className="w-full px-4 py-2 border border-navy-200 rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-transparent" />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-navy-700 mb-1">Terminal</label>
                    <input type="text" value={form.terminal} onChange={(e) => setForm({...form, terminal: e.target.value})}
                      className="w-full px-4 py-2 border border-navy-200 rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-transparent" placeholder="3" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-navy-700 mb-1">Gate</label>
                    <input type="text" value={form.gate} onChange={(e) => setForm({...form, gate: e.target.value})}
                      className="w-full px-4 py-2 border border-navy-200 rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-transparent" placeholder="A12" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-navy-700 mb-1">Status *</label>
                    <select value={form.status} onChange={(e) => setForm({...form, status: e.target.value})}
                      className="w-full px-4 py-2 border border-navy-200 rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-transparent">
                      <option value="ON_TIME">Tepat Waktu</option>
                      <option value="DELAYED">Tertunda</option>
                      <option value="BOARDING">Boarding</option>
                      <option value="DEPARTED">Berangkat</option>
                      <option value="CANCELLED">Dibatalkan</option>
                    </select>
                  </div>
                </div>
                {form.status === 'DELAYED' && (
                  <div>
                    <label className="block text-sm font-medium text-navy-700 mb-1">Keterlambatan (menit)</label>
                    <input type="number" value={form.delayMinutes} onChange={(e) => setForm({...form, delayMinutes: e.target.value})}
                      className="w-full px-4 py-2 border border-navy-200 rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-transparent" placeholder="30" />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-navy-700 mb-1">Catatan</label>
                  <textarea value={form.notes} onChange={(e) => setForm({...form, notes: e.target.value})} rows={2}
                    className="w-full px-4 py-2 border border-navy-200 rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-transparent" placeholder="Informasi tambahan..." />
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="isActive" checked={form.isActive} onChange={(e) => setForm({...form, isActive: e.target.checked})} className="rounded" />
                  <label htmlFor="isActive" className="text-sm text-navy-700">Aktif (tampil di halaman jamaah)</label>
                </div>
                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 border border-navy-200 text-navy-700 rounded-xl hover:bg-navy-50">Batal</button>
                  <button type="submit" className="flex-1 px-4 py-2 bg-gold-500 text-navy-900 rounded-xl font-medium hover:bg-gold-400">
                    {editingId ? 'Simpan Perubahan' : 'Tambah Jadwal'}
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
