'use client'

import { useState, useEffect } from 'react'
import AdminSidebar from '@/components/admin/AdminSidebar'

interface Notification {
  id: string
  type: string
  title: string
  message: string
  priority: string
  isActive: boolean
  expiresAt: string | null
  createdAt: string
}

const priorityLabels: Record<string, { label: string; color: string }> = {
  LOW: { label: 'Rendah', color: 'bg-gray-100 text-gray-600' },
  NORMAL: { label: 'Normal', color: 'bg-blue-100 text-blue-700' },
  HIGH: { label: 'Tinggi', color: 'bg-yellow-100 text-yellow-700' },
  URGENT: { label: 'Urgent', color: 'bg-red-100 text-red-700' }
}

export default function NotifikasiPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({
    type: 'GENERAL', title: '', message: '', priority: 'NORMAL', expiresAt: ''
  })

  useEffect(() => { fetchNotifications() }, [])

  const fetchNotifications = async () => {
    const res = await fetch('/api/admin/notification')
    const data = await res.json()
    setNotifications(data)
    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await fetch('/api/admin/notification', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        expiresAt: form.expiresAt || null
      })
    })
    setShowModal(false)
    setForm({ type: 'GENERAL', title: '', message: '', priority: 'NORMAL', expiresAt: '' })
    fetchNotifications()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus notifikasi ini?')) return
    await fetch(`/api/admin/notification/${id}`, { method: 'DELETE' })
    fetchNotifications()
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminSidebar />
      <main className="ml-64 p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-navy-900">Notifikasi</h1>
            <p className="text-navy-500">Kelola pengumuman untuk jamaah</p>
          </div>
          <button onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-gold-500 text-navy-900 rounded-xl font-medium hover:bg-gold-400 transition-colors flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Buat Notifikasi
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-gold-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-navy-100">
            <div className="w-16 h-16 bg-navy-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-navy-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <h3 className="text-navy-900 font-semibold mb-2">Belum ada notifikasi</h3>
            <p className="text-navy-500 text-sm">Buat pengumuman untuk jamaah</p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notif) => (
              <div key={notif.id} className="bg-white rounded-2xl p-5 border border-navy-100">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-navy-900">{notif.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityLabels[notif.priority]?.color}`}>
                        {priorityLabels[notif.priority]?.label}
                      </span>
                      <span className="px-2 py-1 bg-navy-100 text-navy-600 rounded text-xs">{notif.type}</span>
                    </div>
                    <p className="text-navy-600 text-sm">{notif.message}</p>
                    <p className="text-navy-400 text-xs mt-2">
                      Dibuat: {new Date(notif.createdAt).toLocaleDateString('id-ID')}
                      {notif.expiresAt && ` • Berakhir: ${new Date(notif.expiresAt).toLocaleDateString('id-ID')}`}
                    </p>
                  </div>
                  <button onClick={() => handleDelete(notif.id)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-lg">
              <div className="p-6 border-b border-navy-100">
                <h2 className="text-xl font-bold text-navy-900">Buat Notifikasi</h2>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-navy-700 mb-1">Judul *</label>
                  <input type="text" required value={form.title} onChange={(e) => setForm({...form, title: e.target.value})}
                    className="w-full px-4 py-2 border border-navy-200 rounded-xl focus:ring-2 focus:ring-gold-500" placeholder="Judul notifikasi" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-navy-700 mb-1">Pesan *</label>
                  <textarea required value={form.message} onChange={(e) => setForm({...form, message: e.target.value})} rows={3}
                    className="w-full px-4 py-2 border border-navy-200 rounded-xl focus:ring-2 focus:ring-gold-500" placeholder="Isi pesan..." />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-navy-700 mb-1">Tipe</label>
                    <select value={form.type} onChange={(e) => setForm({...form, type: e.target.value})}
                      className="w-full px-4 py-2 border border-navy-200 rounded-xl focus:ring-2 focus:ring-gold-500">
                      <option value="GENERAL">Umum</option>
                      <option value="DEPARTURE">Keberangkatan</option>
                      <option value="REMINDER">Pengingat</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-navy-700 mb-1">Prioritas</label>
                    <select value={form.priority} onChange={(e) => setForm({...form, priority: e.target.value})}
                      className="w-full px-4 py-2 border border-navy-200 rounded-xl focus:ring-2 focus:ring-gold-500">
                      <option value="LOW">Rendah</option>
                      <option value="NORMAL">Normal</option>
                      <option value="HIGH">Tinggi</option>
                      <option value="URGENT">Urgent</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-navy-700 mb-1">Berakhir pada (opsional)</label>
                  <input type="date" value={form.expiresAt} onChange={(e) => setForm({...form, expiresAt: e.target.value})}
                    className="w-full px-4 py-2 border border-navy-200 rounded-xl focus:ring-2 focus:ring-gold-500" />
                </div>
                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 border border-navy-200 text-navy-700 rounded-xl hover:bg-navy-50">Batal</button>
                  <button type="submit" className="flex-1 px-4 py-2 bg-gold-500 text-navy-900 rounded-xl font-medium hover:bg-gold-400">Kirim</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
