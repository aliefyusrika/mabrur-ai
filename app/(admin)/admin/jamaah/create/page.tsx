'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { AdminLayout } from '@/components/admin'

export default function CreateJamaah() {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [passportNo, setPassportNo] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/admin/jamaah', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, passportNo })
      })

      if (res.ok) {
        router.push('/admin/jamaah')
      } else {
        const data = await res.json()
        setError(data.error || 'Gagal membuat jamaah')
      }
    } catch {
      setError('Terjadi kesalahan')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AdminLayout 
      title="Tambah Jamaah"
      breadcrumb={[
        { label: 'Dashboard', href: '/admin/dashboard' },
        { label: 'Jamaah', href: '/admin/jamaah' },
        { label: 'Tambah Jamaah' }
      ]}
    >
      <div className="max-w-2xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-navy-900 mb-2">Tambah Jamaah Baru</h2>
          <p className="text-gray-500">
            Tambahkan data jamaah baru untuk mulai monitoring perjalanan ibadah
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Section Header */}
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
            <h3 className="font-semibold text-navy-900">Informasi Jamaah</h3>
            <p className="text-sm text-gray-500 mt-0.5">Data dasar jamaah yang akan didaftarkan</p>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-6">
              {/* Nama Lengkap */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-navy-700 mb-2">
                  Nama Lengkap <span className="text-red-500">*</span>
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoFocus
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-navy-900 placeholder-gray-400 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 outline-none transition-all"
                  placeholder="Masukkan nama lengkap sesuai paspor"
                  required
                />
                <p className="mt-1.5 text-xs text-gray-400">Nama harus sesuai dengan dokumen resmi</p>
              </div>

              {/* No. Telepon */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-navy-700 mb-2">
                  No. Telepon
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-navy-900 placeholder-gray-400 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 outline-none transition-all"
                  placeholder="08xxxxxxxxxx"
                />
                <p className="mt-1.5 text-xs text-gray-400">Nomor yang dapat dihubungi selama perjalanan</p>
              </div>

              {/* No. Paspor */}
              <div>
                <label htmlFor="passport" className="block text-sm font-medium text-navy-700 mb-2">
                  No. Paspor
                </label>
                <input
                  id="passport"
                  type="text"
                  value={passportNo}
                  onChange={(e) => setPassportNo(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-navy-900 placeholder-gray-400 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 outline-none transition-all"
                  placeholder="Masukkan nomor paspor"
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-4 bg-red-50 border border-red-100 rounded-xl">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-gray-100">
              <Link 
                href="/admin/jamaah"
                className="px-5 py-2.5 text-gray-600 font-medium rounded-xl hover:bg-gray-100 transition-colors"
              >
                Batal
              </Link>
              <button 
                type="submit" 
                className="px-6 py-2.5 bg-gradient-to-r from-gold-500 to-gold-600 text-navy-900 font-semibold rounded-xl hover:from-gold-400 hover:to-gold-500 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Menyimpan...
                  </span>
                ) : (
                  'Simpan Jamaah'
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Info Note */}
        <div className="mt-6 p-4 bg-navy-50 rounded-xl">
          <div className="flex gap-3">
            <div className="w-8 h-8 bg-navy-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-navy-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-navy-700 font-medium">Kode Akses Otomatis</p>
              <p className="text-xs text-navy-500 mt-0.5">
                Setelah jamaah disimpan, sistem akan membuat kode akses unik yang dapat digunakan jamaah untuk login.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
