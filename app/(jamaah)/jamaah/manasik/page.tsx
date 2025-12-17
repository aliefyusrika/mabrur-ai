'use client'

import { useEffect, useState } from 'react'
import { useJamaahAuth } from '@/hooks/useJamaahAuth'
import JamaahNavbar from '@/components/JamaahNavbar'
import Link from 'next/link'

interface ManasikContent {
  id: string
  type: string
  title: string
  content: string
  videoUrl?: string
  orderIndex: number
}

const typeLabels: Record<string, { label: string; icon: JSX.Element }> = {
  VIDEO: { 
    label: 'Video Manasik',
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
  },
  DOA: { 
    label: 'Doa & Niat',
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
  },
  STEP: { 
    label: 'Langkah Umrah',
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
  },
}

// Default content if database is empty
const defaultContent: ManasikContent[] = [
  { id: '1', type: 'STEP', title: '1. Ihram', content: 'Mandi sunnah, memakai pakaian ihram (2 kain putih tanpa jahitan untuk pria), lalu berniat umrah dengan membaca:\n\nلَبَّيْكَ اللَّهُمَّ عُمْرَةً\n\nLabbaikallahumma umratan\n\n"Aku penuhi panggilan-Mu ya Allah untuk umrah"', orderIndex: 1 },
  { id: '2', type: 'STEP', title: '2. Talbiyah', content: 'Setelah ihram, perbanyak membaca talbiyah:\n\nلَبَّيْكَ اللَّهُمَّ لَبَّيْكَ، لَبَّيْكَ لاَ شَرِيْكَ لَكَ لَبَّيْكَ\n\nLabbaikallahumma labbaik, labbaika la syarika laka labbaik', orderIndex: 2 },
  { id: '3', type: 'STEP', title: '3. Thawaf', content: 'Mengelilingi Ka\'bah sebanyak 7 kali putaran dimulai dari Hajar Aswad. Setiap putaran dimulai dengan menghadap Hajar Aswad dan mengangkat tangan kanan sambil berkata "Bismillahi Allahu Akbar".', orderIndex: 3 },
  { id: '4', type: 'STEP', title: '4. Shalat 2 Rakaat', content: 'Setelah thawaf, shalat 2 rakaat di belakang Maqam Ibrahim. Rakaat pertama baca Al-Kafirun, rakaat kedua baca Al-Ikhlas.', orderIndex: 4 },
  { id: '5', type: 'STEP', title: '5. Sa\'i', content: 'Berjalan dari Bukit Shafa ke Bukit Marwah sebanyak 7 kali. Dimulai dari Shafa dan berakhir di Marwah.', orderIndex: 5 },
  { id: '6', type: 'STEP', title: '6. Tahallul', content: 'Mencukur atau memotong rambut. Untuk pria disunnahkan mencukur habis, untuk wanita cukup memotong ujung rambut sepanjang jari.', orderIndex: 6 },
  { id: '7', type: 'DOA', title: 'Doa Masuk Masjidil Haram', content: 'بِسْمِ اللهِ وَالصَّلاَةُ وَالسَّلاَمُ عَلَى رَسُوْلِ اللهِ، اللَّهُمَّ افْتَحْ لِيْ أَبْوَابَ رَحْمَتِكَ\n\nArtinya: "Dengan nama Allah, shalawat dan salam kepada Rasulullah. Ya Allah, bukakanlah untukku pintu-pintu rahmat-Mu"', orderIndex: 1 },
  { id: '8', type: 'DOA', title: 'Doa Melihat Ka\'bah', content: 'اللَّهُمَّ زِدْ هَذَا الْبَيْتَ تَشْرِيفًا وَتَعْظِيمًا وَتَكْرِيمًا وَمَهَابَةً\n\nArtinya: "Ya Allah, tambahkanlah kemuliaan, keagungan, kehormatan, dan kewibawaan rumah ini"', orderIndex: 2 },
]

export default function JamaahManasik() {
  const { data, loading: authLoading } = useJamaahAuth()
  const [contents, setContents] = useState<ManasikContent[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('STEP')

  useEffect(() => {
    if (!authLoading && data) {
      const token = localStorage.getItem('jamaah-token')
      fetch('/api/jamaah/manasik', {
        headers: { 'x-jamaah-token': token || '' }
      })
        .then(res => res.json())
        .then(data => {
          setContents(data.length > 0 ? data : defaultContent)
        })
        .catch(() => setContents(defaultContent))
        .finally(() => setLoading(false))
    }
  }, [authLoading, data])

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#FAFAF8] to-white flex items-center justify-center">
        <div className="w-12 h-12 rounded-full bg-gold-100 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    )
  }

  if (!data) return null

  const filteredContents = contents.filter(c => c.type === activeTab)

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#FAFAF8] to-white">
      <JamaahNavbar userName={data.name} />

      {/* Header */}
      <section className="px-6 pt-8 pb-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-navy-900 mb-2">Manasik Digital</h1>
          <p className="text-navy-500">Panduan lengkap tata cara ibadah umrah dan doa-doa penting.</p>
        </div>
      </section>

      {/* Tabs */}
      <section className="px-6 pb-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {Object.entries(typeLabels).map(([type, { label, icon }]) => (
              <button
                key={type}
                onClick={() => setActiveTab(type)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === type
                    ? 'bg-gold-500 text-navy-900'
                    : 'bg-white text-navy-600 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                {icon}
                {label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="px-6 pb-12">
        <div className="max-w-4xl mx-auto space-y-4">
          {filteredContents.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-navy-900 mb-3">{item.title}</h3>
              
              {item.videoUrl && (
                <div className="mb-4 rounded-xl overflow-hidden bg-gray-100 aspect-video">
                  <iframe
                    src={item.videoUrl}
                    className="w-full h-full"
                    allowFullScreen
                    title={item.title}
                  />
                </div>
              )}
              
              <div className="text-navy-600 text-base leading-relaxed whitespace-pre-line">
                {item.content}
              </div>
            </div>
          ))}

          {filteredContents.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              Belum ada konten untuk kategori ini
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-6 text-center border-t border-gray-100">
        <p className="text-navy-400 text-sm">© 2024 Mabrur.ai — Semoga Menjadi Haji Mabrur</p>
      </footer>
    </main>
  )
}
