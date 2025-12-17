'use client'

import { useJamaahAuth } from '@/hooks/useJamaahAuth'
import JamaahNavbar from '@/components/JamaahNavbar'
import Link from 'next/link'

const statusItems = [
  { 
    key: 'payment', 
    label: 'Pembayaran', 
    desc: 'Status pembayaran paket perjalanan ibadah',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    )
  },
  { 
    key: 'visa', 
    label: 'Visa', 
    desc: 'Proses pengajuan visa ke Kerajaan Saudi Arabia',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    )
  },
  { 
    key: 'ticket', 
    label: 'Tiket Pesawat', 
    desc: 'Tiket penerbangan keberangkatan dan kepulangan',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
      </svg>
    )
  },
  { 
    key: 'hotel', 
    label: 'Hotel', 
    desc: 'Akomodasi di Makkah dan Madinah',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    )
  },
  { 
    key: 'transport', 
    label: 'Transportasi', 
    desc: 'Transportasi selama di Tanah Suci',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      </svg>
    )
  },
  { 
    key: 'equipment', 
    label: 'Perlengkapan', 
    desc: 'Perlengkapan ibadah dan kebutuhan perjalanan',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    )
  },
  { 
    key: 'manasik', 
    label: 'Manasik & Doa', 
    desc: 'Pelatihan manasik dan panduan doa',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    )
  },
]

const statusConfig: Record<string, { text: string; badgeClass: string; iconBg: string }> = {
  COMPLETED: { 
    text: 'Selesai', 
    badgeClass: 'bg-green-100 text-green-700',
    iconBg: 'bg-green-100 text-green-600'
  },
  IN_PROGRESS: { 
    text: 'Proses', 
    badgeClass: 'bg-yellow-100 text-yellow-700',
    iconBg: 'bg-yellow-100 text-yellow-600'
  },
  NOT_STARTED: { 
    text: 'Belum', 
    badgeClass: 'bg-red-100 text-red-600',
    iconBg: 'bg-red-100 text-red-500'
  },
}

export default function JamaahDashboard() {
  const { data, loading } = useJamaahAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#FAFAF8] to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gold-100 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="text-navy-500">Memuat data...</p>
        </div>
      </div>
    )
  }

  if (!data) return null

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#FAFAF8] to-white">
      <JamaahNavbar userName={data.name} />

      {/* Greeting Section */}
      <section className="px-6 pt-10 pb-8">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-gold-600 text-lg font-medium mb-2">Assalamu'alaikum,</p>
          <h1 className="text-3xl md:text-4xl font-bold text-navy-900 mb-3">{data.name}</h1>
          <p className="text-navy-500 text-base">
            Berikut status persiapan perjalanan ibadah Anda menuju Tanah Suci.
          </p>
        </div>
      </section>

      {/* Status Cards Grid */}
      <section className="px-6 pb-8">
        <div className="max-w-2xl mx-auto grid gap-4 sm:grid-cols-2">
          {statusItems.map((item) => {
            const statusValue = data.status?.[item.key as keyof typeof data.status] || 'NOT_STARTED'
            const config = statusConfig[statusValue] || statusConfig.NOT_STARTED
            
            return (
              <div 
                key={item.key} 
                className="relative bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                {/* Status Badge - Top Right */}
                <span className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold ${config.badgeClass}`}>
                  {config.text}
                </span>

                {/* Icon */}
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${config.iconBg}`}>
                  {item.icon}
                </div>

                {/* Content */}
                <h3 className="text-navy-900 font-semibold text-lg mb-1">{item.label}</h3>
                <p className="text-navy-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 pb-12">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-navy-900 mb-2">
                Ada pertanyaan seputar ibadah atau perjalanan?
              </h3>
              <p className="text-navy-500 text-sm">
                Tanyakan kepada Mabrur AI tentang doa, niat, lokasi mustajab, atau informasi perjalanan Anda.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link 
                href="/jamaah/chat" 
                className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-gold-500 to-gold-600 text-navy-900 font-semibold rounded-xl hover:from-gold-400 hover:to-gold-500 transition-all shadow-md shadow-gold-500/20"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                Tanya Mabrur AI
              </Link>
              <Link 
                href="/jamaah/panduan" 
                className="inline-flex items-center justify-center px-6 py-3 bg-white text-navy-700 font-medium rounded-xl hover:bg-navy-50 transition-all border-2 border-navy-200"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                Lihat Panduan
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-6 text-center border-t border-gray-100">
        <p className="text-navy-400 text-sm">
          © 2024 Mabrur.ai — Semoga Menjadi Haji Mabrur
        </p>
      </footer>
    </main>
  )
}
