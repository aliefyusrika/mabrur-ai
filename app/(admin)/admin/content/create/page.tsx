'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { AdminLayout, AdminCard } from '@/components/admin'

export default function CreateContent() {
  const [type, setType] = useState('FAQ')
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [keywords, setKeywords] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, question, answer, keywords })
      })

      if (res.ok) {
        router.push('/admin/content')
      } else {
        const data = await res.json()
        setError(data.error || 'Gagal menyimpan')
      }
    } catch {
      setError('Terjadi kesalahan')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AdminLayout 
      title="Tambah Konten"
      breadcrumb={[
        { label: 'Dashboard', href: '/admin/dashboard' },
        { label: 'Konten Chatbot', href: '/admin/content' },
        { label: 'Tambah' }
      ]}
    >
      <div className="max-w-xl">
        <AdminCard>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-navy-700 mb-1.5">Tipe Konten</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none"
              >
                <option value="FAQ">FAQ</option>
                <option value="DOA">Doa & Niat</option>
                <option value="LOCATION">Lokasi</option>
                <option value="INFO">Informasi</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-navy-700 mb-1.5">Pertanyaan / Judul *</label>
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none"
                placeholder="Contoh: Bagaimana niat ihram?"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-navy-700 mb-1.5">Jawaban *</label>
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none min-h-[120px]"
                placeholder="Tulis jawaban lengkap..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-navy-700 mb-1.5">Keywords</label>
              <input
                type="text"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none"
                placeholder="ihram, niat, umrah (pisahkan dengan koma)"
              />
            </div>

            {error && <p className="text-red-600 text-sm">{error}</p>}

            <div className="flex gap-3 pt-2">
              <button 
                type="submit" 
                className="px-6 py-2.5 bg-gold-500 text-navy-900 font-medium rounded-xl hover:bg-gold-400 transition-colors disabled:opacity-50"
                disabled={loading}
              >
                {loading ? 'Menyimpan...' : 'Simpan Konten'}
              </button>
              <Link 
                href="/admin/content"
                className="px-6 py-2.5 border border-gray-200 text-gray-600 font-medium rounded-xl hover:bg-gray-50 transition-colors"
              >
                Batal
              </Link>
            </div>
          </form>
        </AdminCard>
      </div>
    </AdminLayout>
  )
}
