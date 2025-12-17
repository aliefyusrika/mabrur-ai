'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function JamaahAccess() {
  const [token, setToken] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/jamaah/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: token.trim() })
      })

      if (res.ok) {
        localStorage.setItem('jamaah-token', token.trim())
        router.push('/jamaah/dashboard')
      } else {
        setError('Kode akses tidak valid')
      }
    } catch {
      setError('Terjadi kesalahan, coba lagi')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#FAFAF8] to-white flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        {/* Back Link - Left Aligned */}
        <div className="mb-6">
          <a 
            href="/"
            className="inline-flex items-center gap-1.5 text-navy-400 hover:text-navy-600 hover:underline transition-colors text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Kembali ke Beranda</span>
          </a>
        </div>

        {/* Main Content - Center Aligned */}
        <div className="text-center">
          {/* Logo */}
          <div className="mb-8">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src="/logo.png" 
              alt="Mabrur.ai" 
              width={80} 
              height={80} 
              className="mx-auto rounded-2xl shadow-lg mb-6"
            />
            <h1 className="text-2xl font-bold text-navy-900 mb-2">Assalamualaikum</h1>
            <p className="text-navy-500">Masukkan kode akses dari travel Anda</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Masukkan kode akses"
              className="w-full px-4 py-4 rounded-xl border border-navy-200 focus:border-gold-500 focus:ring-2 focus:ring-gold-200 outline-none transition-all text-center text-xl tracking-widest text-navy-800"
              required
            />
            
            {error && (
              <p className="text-red-600 text-sm">{error}</p>
            )}

            <button 
              type="submit" 
              className="w-full px-6 py-4 bg-gradient-to-r from-navy-800 to-navy-900 text-white font-semibold text-lg rounded-xl hover:from-navy-700 hover:to-navy-800 transition-all shadow-lg disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Memverifikasi...' : 'Masuk'}
            </button>
          </form>

          <p className="text-navy-400 text-sm mt-8">
            Kode akses diberikan oleh travel agent Anda
          </p>
        </div>
      </div>
    </main>
  )
}
