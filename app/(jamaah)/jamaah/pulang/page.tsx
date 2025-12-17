'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import JamaahNavbar from '@/components/JamaahNavbar'

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
}

interface JourneyMemory {
  id: string
  title: string
  content: string
  imageUrl: string | null
  location: string | null
  memoryDate: string
}

const statusConfig: Record<string, { label: string; color: string; bgColor: string }> = {
  ON_TIME: { label: 'Tepat Waktu', color: 'text-green-700', bgColor: 'bg-green-50 border-green-200' },
  DELAYED: { label: 'Tertunda', color: 'text-yellow-700', bgColor: 'bg-yellow-50 border-yellow-200' },
  BOARDING: { label: 'Boarding', color: 'text-blue-700', bgColor: 'bg-blue-50 border-blue-200' },
  DEPARTED: { label: 'Berangkat', color: 'text-navy-700', bgColor: 'bg-navy-50 border-navy-200' },
  CANCELLED: { label: 'Dibatalkan', color: 'text-red-700', bgColor: 'bg-red-50 border-red-200' }
}

const locationOptions = ['Masjidil Haram', 'Masjid Nabawi', 'Jabal Rahmah', 'Mina', 'Muzdalifah', 'Hotel', 'Lainnya']

export default function PulangPage() {
  const [flights, setFlights] = useState<ReturnFlight[]>([])
  const [memories, setMemories] = useState<JourneyMemory[]>([])
  const [loading, setLoading] = useState(true)
  const [userName, setUserName] = useState('')
  const [token, setToken] = useState('')
  const [activeTab, setActiveTab] = useState<'schedule' | 'memories'>('schedule')
  const [showMemoryModal, setShowMemoryModal] = useState(false)
  const [memoryForm, setMemoryForm] = useState({ title: '', content: '', location: '', imageUrl: '' })
  const router = useRouter()

  useEffect(() => {
    const savedToken = localStorage.getItem('jamaah-token')
    if (!savedToken) { router.push('/jamaah'); return }
    setToken(savedToken)
    
    fetch('/api/jamaah/auth', {
      headers: { 'Authorization': `Bearer ${savedToken}` }
    }).then(res => res.json()).then(data => {
      if (data.user) setUserName(data.user.name)
      else router.push('/jamaah')
    })

    fetchData(savedToken)
  }, [router])

  const fetchData = async (t: string) => {
    const res = await fetch('/api/jamaah/return', {
      headers: { 'Authorization': `Bearer ${t}` }
    })
    const data = await res.json()
    setFlights(data.flights || [])
    setMemories(data.memories || [])
    setLoading(false)
  }

  const handleAddMemory = async (e: React.FormEvent) => {
    e.preventDefault()
    await fetch('/api/jamaah/memories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(memoryForm)
    })
    setShowMemoryModal(false)
    setMemoryForm({ title: '', content: '', location: '', imageUrl: '' })
    fetchData(token)
  }

  const handleDeleteMemory = async (id: string) => {
    if (!confirm('Hapus catatan ini?')) return
    await fetch(`/api/jamaah/memories/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    })
    fetchData(token)
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('id-ID', { 
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' 
    })
  }

  const getDaysUntil = (dateStr: string) => {
    const diff = Math.ceil((new Date(dateStr).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    if (diff < 0) return 'Sudah lewat'
    if (diff === 0) return 'Hari ini!'
    if (diff === 1) return 'Besok'
    return `${diff} hari lagi`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-navy-50 to-white flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-gold-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-navy-50 to-white">
      <JamaahNavbar userName={userName} />
      
      <main className="max-w-4xl mx-auto px-4 py-6 pb-12">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-navy-900">Kepulangan</h1>
          <p className="text-navy-500">Jadwal pulang & kenangan perjalanan</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('schedule')}
            className={`flex-1 py-3 px-4 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 ${
              activeTab === 'schedule' ? 'bg-navy-900 text-white' : 'bg-white text-navy-600 border border-navy-200'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3l14 9-14 9V3z" />
            </svg>
            Jadwal Pulang
          </button>
          <button
            onClick={() => setActiveTab('memories')}
            className={`flex-1 py-3 px-4 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 ${
              activeTab === 'memories' ? 'bg-navy-900 text-white' : 'bg-white text-navy-600 border border-navy-200'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Kenangan
          </button>
        </div>

        {/* Schedule Tab */}
        {activeTab === 'schedule' && (
          <>
            {flights.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center border border-navy-100">
                <div className="w-16 h-16 bg-navy-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-navy-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3l14 9-14 9V3z" />
                  </svg>
                </div>
                <h3 className="text-navy-900 font-semibold mb-2">Belum ada jadwal</h3>
                <p className="text-navy-500 text-sm">Jadwal kepulangan akan ditampilkan di sini</p>
              </div>
            ) : (
              <div className="space-y-4">
                {flights.map((flight) => {
                  const config = statusConfig[flight.status] || statusConfig.ON_TIME
                  const daysUntil = getDaysUntil(flight.returnDate)
                  const isToday = daysUntil === 'Hari ini!'
                  
                  return (
                    <div key={flight.id} className={`bg-white rounded-2xl border overflow-hidden ${isToday ? 'border-gold-300 ring-2 ring-gold-100' : 'border-navy-100'}`}>
                      {/* Status Banner */}
                      <div className={`px-5 py-3 ${config.bgColor} border-b flex items-center justify-between`}>
                        <span className={`font-medium ${config.color}`}>
                          {config.label}
                          {flight.status === 'DELAYED' && flight.delayMinutes && ` (+${flight.delayMinutes} menit)`}
                        </span>
                        <span className={`text-sm font-medium ${isToday ? 'text-gold-600' : 'text-navy-500'}`}>{daysUntil}</span>
                      </div>
                      
                      {/* Flight Info */}
                      <div className="p-5">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <p className="text-2xl font-bold text-navy-900">{flight.flightNumber}</p>
                            <p className="text-navy-500">{flight.airline}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-navy-500">Tanggal</p>
                            <p className="font-medium text-navy-700">{formatDate(flight.returnDate)}</p>
                          </div>
                        </div>
                        
                        {/* Route */}
                        <div className="flex items-center gap-4 py-4 border-t border-b border-navy-100">
                          <div className="flex-1">
                            <p className="text-xs text-navy-400 mb-1">Keberangkatan</p>
                            <p className="font-bold text-navy-900 text-lg">{flight.departureTime}</p>
                            <p className="text-sm text-navy-600">{flight.origin}</p>
                          </div>
                          <div className="flex flex-col items-center">
                            <svg className="w-6 h-6 text-gold-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                          </div>
                          <div className="flex-1 text-right">
                            <p className="text-xs text-navy-400 mb-1">Kedatangan</p>
                            <p className="font-bold text-navy-900 text-lg">{flight.arrivalTime || '-'}</p>
                            <p className="text-sm text-navy-600">{flight.destination}</p>
                          </div>
                        </div>
                        
                        {/* Terminal & Gate */}
                        {(flight.terminal || flight.gate) && (
                          <div className="flex gap-6 mt-4">
                            {flight.terminal && (
                              <div className="flex-1 bg-navy-50 rounded-xl p-3 text-center">
                                <p className="text-xs text-navy-400">Terminal</p>
                                <p className="text-xl font-bold text-navy-900">{flight.terminal}</p>
                              </div>
                            )}
                            {flight.gate && (
                              <div className="flex-1 bg-navy-50 rounded-xl p-3 text-center">
                                <p className="text-xs text-navy-400">Gate</p>
                                <p className="text-xl font-bold text-navy-900">{flight.gate}</p>
                              </div>
                            )}
                          </div>
                        )}
                        
                        {flight.notes && (
                          <div className="mt-4 p-3 bg-gold-50 rounded-xl border border-gold-200">
                            <p className="text-sm text-gold-800">{flight.notes}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {/* Homecoming Message */}
            <div className="mt-6 p-5 bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl border border-emerald-200">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">🏠</span>
                </div>
                <div>
                  <h3 className="font-semibold text-emerald-900 mb-1">Selamat Pulang!</h3>
                  <p className="text-sm text-emerald-700">
                    Semoga perjalanan ibadah Anda diterima Allah SWT. Haji Mabrur, Mabruroh!
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Memories Tab */}
        {activeTab === 'memories' && (
          <>
            {/* Add Memory Button */}
            <button
              onClick={() => setShowMemoryModal(true)}
              className="w-full mb-6 py-4 px-4 bg-gradient-to-r from-gold-400 to-gold-500 text-navy-900 rounded-2xl font-medium flex items-center justify-center gap-2 hover:from-gold-500 hover:to-gold-600 transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Tambah Kenangan Baru
            </button>

            {memories.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center border border-navy-100">
                <div className="w-16 h-16 bg-navy-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-navy-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-navy-900 font-semibold mb-2">Belum ada kenangan</h3>
                <p className="text-navy-500 text-sm">Abadikan momen perjalanan ibadah Anda</p>
              </div>
            ) : (
              <div className="space-y-4">
                {memories.map((memory) => (
                  <div key={memory.id} className="bg-white rounded-2xl border border-navy-100 overflow-hidden">
                    {/* Image Placeholder */}
                    {memory.imageUrl ? (
                      <div className="aspect-video bg-navy-100">
                        <img src={memory.imageUrl} alt={memory.title} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="aspect-video bg-gradient-to-br from-navy-100 to-navy-200 flex items-center justify-center">
                        <div className="text-center">
                          <svg className="w-12 h-12 text-navy-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <p className="text-navy-400 text-sm">Foto kenangan</p>
                        </div>
                      </div>
                    )}
                    
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-navy-900">{memory.title}</h3>
                          {memory.location && (
                            <p className="text-sm text-gold-600 flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              </svg>
                              {memory.location}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => handleDeleteMemory(memory.id)}
                          className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                      <p className="text-navy-600 text-sm">{memory.content}</p>
                      <p className="text-navy-400 text-xs mt-2">
                        {new Date(memory.memoryDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Add Memory Modal */}
        {showMemoryModal && (
          <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-4">
            <div className="bg-white rounded-t-3xl sm:rounded-2xl w-full max-w-lg">
              <div className="p-5 border-b border-navy-100">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-navy-900 text-lg">Tambah Kenangan</h3>
                  <button onClick={() => setShowMemoryModal(false)} className="p-2 text-navy-400 hover:text-navy-600 rounded-lg">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              <form onSubmit={handleAddMemory} className="p-5 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-navy-700 mb-1">Judul *</label>
                  <input
                    type="text"
                    required
                    value={memoryForm.title}
                    onChange={(e) => setMemoryForm({...memoryForm, title: e.target.value})}
                    className="w-full px-4 py-2 border border-navy-200 rounded-xl focus:ring-2 focus:ring-gold-500"
                    placeholder="Shalat di Raudhah"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-navy-700 mb-1">Lokasi</label>
                  <select
                    value={memoryForm.location}
                    onChange={(e) => setMemoryForm({...memoryForm, location: e.target.value})}
                    className="w-full px-4 py-2 border border-navy-200 rounded-xl focus:ring-2 focus:ring-gold-500"
                  >
                    <option value="">Pilih lokasi</option>
                    {locationOptions.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-navy-700 mb-1">Catatan *</label>
                  <textarea
                    required
                    value={memoryForm.content}
                    onChange={(e) => setMemoryForm({...memoryForm, content: e.target.value})}
                    rows={3}
                    className="w-full px-4 py-2 border border-navy-200 rounded-xl focus:ring-2 focus:ring-gold-500"
                    placeholder="Ceritakan pengalaman Anda..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-navy-700 mb-1">URL Gambar (opsional)</label>
                  <input
                    type="url"
                    value={memoryForm.imageUrl}
                    onChange={(e) => setMemoryForm({...memoryForm, imageUrl: e.target.value})}
                    className="w-full px-4 py-2 border border-navy-200 rounded-xl focus:ring-2 focus:ring-gold-500"
                    placeholder="https://..."
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowMemoryModal(false)} className="flex-1 px-4 py-2 border border-navy-200 text-navy-700 rounded-xl hover:bg-navy-50">
                    Batal
                  </button>
                  <button type="submit" className="flex-1 px-4 py-2 bg-gold-500 text-navy-900 rounded-xl font-medium hover:bg-gold-400">
                    Simpan
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
