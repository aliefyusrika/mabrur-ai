'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { AdminLayout, AdminCard, StatusBadge, ProgressBar } from '@/components/admin'

interface DashboardStats {
  total: number
  completed: number
  inProgress: number
  notStarted: number
}

interface JamaahItem {
  id: string
  user: { name: string; token: string }
  phone: string | null
  status: Record<string, string> | null
}

function getProgress(status: Record<string, string> | null) {
  if (!status) return 0
  const values = Object.values(status).filter(v => typeof v === 'string')
  const completed = values.filter(v => v === 'COMPLETED').length
  return Math.round((completed / values.length) * 100)
}

function getOverallStatus(status: Record<string, string> | null) {
  if (!status) return 'NOT_STARTED'
  const values = Object.values(status).filter(v => typeof v === 'string')
  if (values.every(v => v === 'COMPLETED')) return 'COMPLETED'
  if (values.some(v => v === 'IN_PROGRESS' || v === 'COMPLETED')) return 'IN_PROGRESS'
  return 'NOT_STARTED'
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [jamaahList, setJamaahList] = useState<JamaahItem[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/stats').then(res => {
        if (res.status === 401) throw new Error('Unauthorized')
        return res.json()
      }),
      fetch('/api/admin/jamaah').then(res => res.json())
    ])
      .then(([statsData, jamaahData]) => {
        setStats(statsData)
        setJamaahList(jamaahData.slice(0, 5))
      })
      .catch(() => router.push('/admin/login'))
      .finally(() => setLoading(false))
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-navy-800 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <AdminLayout title="Dashboard">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {[
          { label: 'Total Jamaah', value: stats?.total || 0, color: 'bg-navy-100 text-navy-600' },
          { label: 'Lengkap', value: stats?.completed || 0, color: 'bg-green-100 text-green-600' },
          { label: 'Dalam Proses', value: stats?.inProgress || 0, color: 'bg-yellow-100 text-yellow-600' },
          { label: 'Belum Mulai', value: stats?.notStarted || 0, color: 'bg-gray-100 text-gray-600' },
        ].map((stat) => (
          <AdminCard key={stat.label}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${stat.color}`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <p className="text-3xl font-bold text-navy-900">{stat.value}</p>
            <p className="text-gray-500 text-sm">{stat.label}</p>
          </AdminCard>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Jamaah Table */}
        <div className="lg:col-span-2">
          <AdminCard 
            title="Jamaah Terbaru" 
            action={<Link href="/admin/jamaah" className="text-sm text-gold-600 hover:text-gold-700 font-medium">Lihat Semua →</Link>}
            noPadding
          >
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs text-gray-500 uppercase tracking-wider border-b border-gray-100">
                  <th className="px-5 py-3 font-medium">Nama</th>
                  <th className="px-5 py-3 font-medium">Token</th>
                  <th className="px-5 py-3 font-medium">Progress</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {jamaahList.map((jamaah) => (
                  <tr key={jamaah.id} className="hover:bg-gray-50">
                    <td className="px-5 py-4">
                      <p className="font-medium text-navy-900">{jamaah.user.name}</p>
                      <p className="text-xs text-gray-400">{jamaah.phone || '-'}</p>
                    </td>
                    <td className="px-5 py-4">
                      <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono">{jamaah.user.token}</code>
                    </td>
                    <td className="px-5 py-4 w-32">
                      <ProgressBar value={getProgress(jamaah.status)} />
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={getOverallStatus(jamaah.status)} />
                    </td>
                    <td className="px-5 py-4">
                      <Link href={`/admin/jamaah/${jamaah.id}`} className="text-sm text-navy-600 hover:text-navy-800 font-medium">
                        Detail
                      </Link>
                    </td>
                  </tr>
                ))}
                {jamaahList.length === 0 && (
                  <tr><td colSpan={5} className="px-5 py-8 text-center text-gray-400">Belum ada data</td></tr>
                )}
              </tbody>
            </table>
          </AdminCard>
        </div>

        {/* Quick Actions */}
        <AdminCard title="Aksi Cepat">
          <div className="grid grid-cols-2 gap-3">
            {/* Tambah Jamaah - Primary */}
            <Link href="/admin/jamaah/create" className="flex flex-col items-center gap-2 p-4 rounded-xl bg-gradient-to-br from-gold-50 to-orange-50 hover:from-gold-100 hover:to-orange-100 border border-gold-200 shadow-sm transition-all hover:shadow-md">
              <div className="w-10 h-10 bg-gradient-to-br from-gold-500 to-orange-500 rounded-full flex items-center justify-center shadow-md">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
              <div className="text-center">
                <p className="font-semibold text-navy-900 text-sm">Tambah Jamaah</p>
                <p className="text-xs text-gray-500">Daftarkan baru</p>
              </div>
            </Link>

            {/* Update Status Jamaah */}
            <Link href="/admin/jamaah" className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white hover:bg-gray-50 border border-gray-200 shadow-sm transition-all hover:shadow-md">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <div className="text-center">
                <p className="font-medium text-navy-900 text-sm">Update Status</p>
                <p className="text-xs text-gray-500">Status perjalanan</p>
              </div>
            </Link>

            {/* Kirim Notifikasi */}
            <Link href="/admin/notifikasi" className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white hover:bg-gray-50 border border-gray-200 shadow-sm transition-all hover:shadow-md">
              <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <div className="text-center">
                <p className="font-medium text-navy-900 text-sm">Notifikasi</p>
                <p className="text-xs text-gray-500">Info ke jamaah</p>
              </div>
            </Link>

            {/* Tambah Lokasi Ziarah */}
            <Link href="/admin/ziarah" className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white hover:bg-gray-50 border border-gray-200 shadow-sm transition-all hover:shadow-md">
              <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div className="text-center">
                <p className="font-medium text-navy-900 text-sm">Lokasi Ziarah</p>
                <p className="text-xs text-gray-500">Kelola lokasi</p>
              </div>
            </Link>

            {/* Tambah Panduan Ibadah */}
            <Link href="/admin/ibadah" className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white hover:bg-gray-50 border border-gray-200 shadow-sm transition-all hover:shadow-md">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div className="text-center">
                <p className="font-medium text-navy-900 text-sm">Panduan Ibadah</p>
                <p className="text-xs text-gray-500">Doa & panduan</p>
              </div>
            </Link>

            {/* Atur Keberangkatan */}
            <Link href="/admin/keberangkatan" className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white hover:bg-gray-50 border border-gray-200 shadow-sm transition-all hover:shadow-md">
              <div className="w-10 h-10 bg-sky-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </div>
              <div className="text-center">
                <p className="font-medium text-navy-900 text-sm">Keberangkatan</p>
                <p className="text-xs text-gray-500">Jadwal & status</p>
              </div>
            </Link>
          </div>
        </AdminCard>
      </div>
    </AdminLayout>
  )
}
