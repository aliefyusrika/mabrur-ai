'use client'

import { useState, useEffect } from 'react'
import AdminSidebar from '@/components/admin/AdminSidebar'

interface ReturnFlight {
  id: string
  flightNumber: string
  airline: string
  returnDate: string
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

export default function KepulanganPage() {
  const [flights, setFlights] = useState<ReturnFlight[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({
    flightNumber: '', airline: '', returnDate: '', departureTime: '',
    arrivalTime: '', origin: 'JED - Jeddah', destination: 'CGK - Jakarta',
    terminal: '', gate: '', status: 'ON_TIME', delayMinutes: '', notes: '', isActive: true
  })

  useEffect(() => { fetchFlights() }, [])

  const fetchFlights = async () => {
    const res = await fetch('/api/admin/return-flight')
    const data = await res.json()
    setFlights(data)
    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const url = editingId ? `/api/admin/return-flight/${editingId}` : '/api/admin/return-flight'
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
    fetchFlights()
  }

  const handleEdit = (flight: ReturnFlight) => {
    setEditingId(flight.id)
    setForm({
      flightNumber: flight.flightNumber,
      airline: flight.airline,
      returnDate: flight.returnDate.split('T')[0],
      departureTime: flight.departureTime,
      arrivalTime: flight.arrivalTime || '',
      origin: flight.origin,
      destination: flight.destination,
      terminal: flight.terminal || '',
      gate: flight.gate || '',
      status: flight.status,
      delayMinutes: flight.delayMinutes?.toString() || '',
      notes: flight.notes || '',
      isActive: flight.isActive
    })
    setShowModal(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus jadwal kepulangan ini?')) return
    await fetch(`/api/admin/return-flight/${id}`, { method: 'DELETE' })
    fetchFlights()
  }

  const resetForm = () => {
    setEditingId(null)
    setForm({
      flightNumber: '', airline: '', returnDate: '', departureTime: '',
      arrivalTime: '', origin: 'JED - Jeddah', destination: 'CGK - Jakarta',
      terminal: '', gate: '', status: 'ON_TIME', delayMinutes: '', notes: '', isActive: true
    })
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminSidebar />
      <main className="ml-64 p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-navy-900">Kepulangan</h1>
            <p className="text-navy-500">Kelola jadwal penerbangan pulang jamaah</p>
          </div>
          <button onClick={() => { resetForm(); setShowModal(true) }}
            className="px-4 py-2 bg-gold-500 text-navy-900 rounded-xl font-medium hover:bg-gold-400 transition-colors flex items-center gap-2">
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
        ) : flights.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-navy-100">
            <div className="w-16 h-16 bg-navy-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-navy-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <h3 className="text-navy-900 font-semibold mb-2">Belum ada jadwal</h3>
            <p className="text-navy-500 text-sm">Tambahkan jadwal kepulangan pertama</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {flights.map((flight) => (
              <div key={flight.id} className={`bg-white rounded-2xl p-6 border ${flight.isActive ? 'border-navy-100' : 'border-red-200 bg-red-50/30'}`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-xl font-bold text-navy-900">{flight.flightNumber}</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusLabels[flight.status]?.color}`}>
                        {statusLabels[flight.status]?.label}
                        {flight.status === 'DELAYED' && flight.delayMinutes && ` (+${flight.delayMinutes} menit)`}
                      </span>
                      {!flight.isActive && <span className="px-2 py-1 bg-red-100 text-red-600 rounded text-xs">Nonaktif</span>}
                    </div>
                    <p className="text-navy-600 font-medium mb-2">{flight.airline}</p>
                    <div className="flex items-center gap-6 text-sm text-navy-500">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {new Date(flight.returnDate).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                      </div>
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {flight.departureTime} {flight.arrivalTime && `→ ${flight.arrivalTime}`}
                      </div>
                    </div>
                    <div className="flex items-center gap-4 mt-3 text-sm">
                      <span className="text-navy-700">{flight.origin}</span>
                      <svg className="w-4 h-4 text-gold-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                      <span className="text-navy-700">{flight.destination}</span>
                    </div>
                    {(flight.terminal || flight.gate) && (
                      <div className="flex gap-4 mt-2 text-sm text-navy-500">
                        {flight.terminal && <span>Terminal: {flight.terminal}</span>}
                        {flight.gate && <span>Gate: {flight.gate}</span>}
                      </div>
                    )}
                    {flight.notes && <p className="mt-3 text-sm text-navy-500 bg-navy-50 p-3 rounded-lg">{flight.notes}</p>}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(flight)} className="p-2 text-navy-400 hover:text-navy-600 hover:bg-navy-50 rounded-lg">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button onClick={() => handleDelete(flight.id)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
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

        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-navy-100">
                <h2 className="text-xl font-bold text-navy-900">{editingId ? 'Edit Jadwal' : 'Tambah Jadwal Kepulangan'}</h2>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-navy-700 mb-1">Nomor Penerbangan *</label>
                    <input type="text" required value={form.flightNumber} onChange={(e) => setForm({...form, flightNumber: e.target.value})}
                      className="w-full px-4 py-2 border border-navy-200 rounded-xl focus:ring-2 focus:ring-gold-500" placeholder="GA 987" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-navy-700 mb-1">Maskapai *</label>
                    <input type="text" required value={form.airline} onChange={(e) => setForm({...form, airline: e.target.value})}
                      className="w-full px-4 py-2 border border-navy-200 rounded-xl focus:ring-2 focus:ring-gold-500" placeholder="Garuda Indonesia" />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-navy-700 mb-1">Tanggal *</label>
                    <input type="date" required value={form.returnDate} onChange={(e) => setForm({...form, returnDate: e.target.value})}
                      className="w-full px-4 py-2 border border-navy-200 rounded-xl focus:ring-2 focus:ring-gold-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-navy-700 mb-1">Jam Berangkat *</label>
                    <input type="time" required value={form.departureTime} onChange={(e) => setForm({...form, departureTime: e.target.value})}
                      className="w-full px-4 py-2 border border-navy-200 rounded-xl focus:ring-2 focus:ring-gold-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-navy-700 mb-1">Jam Tiba</label>
                    <input type="time" value={form.arrivalTime} onChange={(e) => setForm({...form, arrivalTime: e.target.value})}
                      className="w-full px-4 py-2 border border-navy-200 rounded-xl focus:ring-2 focus:ring-gold-500" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-navy-700 mb-1">Asal *</label>
                    <input type="text" required value={form.origin} onChange={(e) => setForm({...form, origin: e.target.value})}
                      className="w-full px-4 py-2 border border-navy-200 rounded-xl focus:ring-2 focus:ring-gold-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-navy-700 mb-1">Tujuan *</label>
                    <input type="text" required value={form.destination} onChange={(e) => setForm({...form, destination: e.target.value})}
                      className="w-full px-4 py-2 border border-navy-200 rounded-xl focus:ring-2 focus:ring-gold-500" />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-navy-700 mb-1">Terminal</label>
                    <input type="text" value={form.terminal} onChange={(e) => setForm({...form, terminal: e.target.value})}
                      className="w-full px-4 py-2 border border-navy-200 rounded-xl focus:ring-2 focus:ring-gold-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-navy-700 mb-1">Gate</label>
                    <input type="text" value={form.gate} onChange={(e) => setForm({...form, gate: e.target.value})}
                      className="w-full px-4 py-2 border border-navy-200 rounded-xl focus:ring-2 focus:ring-gold-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-navy-700 mb-1">Status *</label>
                    <select value={form.status} onChange={(e) => setForm({...form, status: e.target.value})}
                      className="w-full px-4 py-2 border border-navy-200 rounded-xl focus:ring-2 focus:ring-gold-500">
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
                      className="w-full px-4 py-2 border border-navy-200 rounded-xl focus:ring-2 focus:ring-gold-500" />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-navy-700 mb-1">Catatan</label>
                  <textarea value={form.notes} onChange={(e) => setForm({...form, notes: e.target.value})} rows={2}
                    className="w-full px-4 py-2 border border-navy-200 rounded-xl focus:ring-2 focus:ring-gold-500" />
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="isActive" checked={form.isActive} onChange={(e) => setForm({...form, isActive: e.target.checked})} className="rounded" />
                  <label htmlFor="isActive" className="text-sm text-navy-700">Aktif</label>
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
