'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { AdminLayout, AdminCard, StatusBadge, ProgressBar } from '@/components/admin'

interface Jamaah {
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

export default function AdminJamaahList() {
  const [jamaahList, setJamaahList] = useState<Jamaah[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetch('/api/admin/jamaah')
      .then(res => {
        if (res.status === 401) {
          router.push('/admin/login')
          throw new Error('Unauthorized')
        }
        return res.json()
      })
      .then(setJamaahList)
      .catch(() => {})
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
    <AdminLayout 
      title="Kelola Jamaah" 
      breadcrumb={[{ label: 'Dashboard', href: '/admin/dashboard' }, { label: 'Jamaah' }]}
    >
      <div className="flex items-center justify-between mb-6">
        <p className="text-gray-500">{jamaahList.length} jamaah terdaftar</p>
        <Link 
          href="/admin/jamaah/create"
          className="px-4 py-2 bg-gold-500 text-navy-900 font-medium rounded-xl hover:bg-gold-400 transition-colors text-sm"
        >
          + Tambah Jamaah
        </Link>
      </div>

      <AdminCard noPadding>
        <table className="w-full">
          <thead>
            <tr className="text-left text-xs text-gray-500 uppercase tracking-wider border-b border-gray-100">
              <th className="px-5 py-3 font-medium">Nama</th>
              <th className="px-5 py-3 font-medium">Telepon</th>
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
                </td>
                <td className="px-5 py-4 text-gray-600">{jamaah.phone || '-'}</td>
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
                  <Link href={`/admin/jamaah/${jamaah.id}`} className="text-sm text-gold-600 hover:text-gold-700 font-medium">
                    Detail
                  </Link>
                </td>
              </tr>
            ))}
            {jamaahList.length === 0 && (
              <tr><td colSpan={6} className="px-5 py-12 text-center text-gray-400">Belum ada data jamaah</td></tr>
            )}
          </tbody>
        </table>
      </AdminCard>
    </AdminLayout>
  )
}
