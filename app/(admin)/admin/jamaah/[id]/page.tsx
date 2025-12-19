'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { AdminLayout, AdminCard, StatusBadge } from '@/components/admin'

// For static export - return empty array to skip pre-rendering
export function generateStaticParams() {
  return []
}

interface JamaahDetail {
  id: string
  user: { name: string; token: string }
  phone: string | null
  passportNo: string | null
  status: Record<string, string>
}

const statusItems = [
  { key: 'payment', label: 'Pembayaran' },
  { key: 'visa', label: 'Visa' },
  { key: 'ticket', label: 'Tiket Pesawat' },
  { key: 'hotel', label: 'Hotel' },
  { key: 'transport', label: 'Transportasi' },
  { key: 'equipment', label: 'Perlengkapan' },
  { key: 'manasik', label: 'Manasik & Doa' },
]

const statusOptions = [
  { value: 'NOT_STARTED', label: 'Belum Mulai' },
  { value: 'IN_PROGRESS', label: 'Dalam Proses' },
  { value: 'COMPLETED', label: 'Selesai' },
]

export default function JamaahDetail() {
  const [jamaah, setJamaah] = useState<JamaahDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)
  const router = useRouter()
  const params = useParams()

  useEffect(() => {
    fetch(`/api/admin/jamaah/${params.id}`)
      .then(res => {
        if (res.status === 401) router.push('/admin/login')
        if (!res.ok) throw new Error('Not found')
        return res.json()
      })
      .then(setJamaah)
      .catch(() => router.push('/admin/jamaah'))
      .finally(() => setLoading(false))
  }, [params.id, router])

  const updateStatus = async (field: string, value: string) => {
    if (!jamaah) return
    setSaving(field)

    try {
      const res = await fetch(`/api/admin/jamaah/${params.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: value })
      })

      if (res.ok) {
        setJamaah(prev => prev ? { ...prev, status: { ...prev.status, [field]: value } } : null)
      }
    } finally {
      setSaving(null)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-navy-800 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!jamaah) return null

  return (
    <AdminLayout 
      title={jamaah.user.name}
      breadcrumb={[
        { label: 'Dashboard', href: '/admin/dashboard' },
        { label: 'Jamaah', href: '/admin/jamaah' },
        { label: jamaah.user.name }
      ]}
    >
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Info Card */}
        <AdminCard title="Informasi Jamaah">
          <div className="space-y-4">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Nama Lengkap</p>
              <p className="font-medium text-navy-900">{jamaah.user.name}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Token Akses</p>
              <code className="text-sm bg-gray-100 px-3 py-1.5 rounded-lg font-mono">{jamaah.user.token}</code>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Telepon</p>
              <p className="text-navy-900">{jamaah.phone || '-'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">No. Paspor</p>
              <p className="text-navy-900">{jamaah.passportNo || '-'}</p>
            </div>
          </div>
        </AdminCard>

        {/* Status Grid */}
        <div className="lg:col-span-2">
          <AdminCard title="Status Persiapan">
            <div className="grid sm:grid-cols-2 gap-4">
              {statusItems.map((item) => {
                const currentStatus = jamaah.status[item.key] || 'NOT_STARTED'
                const isSaving = saving === item.key

                return (
                  <div key={item.key} className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center justify-between mb-3">
                      <p className="font-medium text-navy-900">{item.label}</p>
                      <StatusBadge status={currentStatus} />
                    </div>
                    <select
                      value={currentStatus}
                      onChange={(e) => updateStatus(item.key, e.target.value)}
                      disabled={isSaving}
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none disabled:opacity-50"
                    >
                      {statusOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                )
              })}
            </div>
          </AdminCard>
        </div>
      </div>
    </AdminLayout>
  )
}
