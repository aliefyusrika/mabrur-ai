'use client'

import { useJamaahAuth } from '@/hooks/useJamaahAuth'
import JamaahNavbar from '@/components/JamaahNavbar'
import Link from 'next/link'

const panduanItems = [
  {
    title: 'Niat Ihram Umrah',
    content: 'لَبَّيْكَ اللَّهُمَّ عُمْرَةً\n\nLabbaikallahumma umratan\n\nArtinya: "Aku penuhi panggilan-Mu ya Allah untuk umrah"',
    category: 'Doa & Niat'
  },
  {
    title: 'Niat Ihram Haji',
    content: 'لَبَّيْكَ اللَّهُمَّ حَجًّا\n\nLabbaikallahumma hajjan\n\nArtinya: "Aku penuhi panggilan-Mu ya Allah untuk haji"',
    category: 'Doa & Niat'
  },
  {
    title: 'Doa Masuk Masjidil Haram',
    content: 'بِسْمِ اللهِ وَالصَّلاَةُ وَالسَّلاَمُ عَلَى رَسُوْلِ اللهِ، اللَّهُمَّ افْتَحْ لِيْ أَبْوَابَ رَحْمَتِكَ\n\nArtinya: "Dengan nama Allah, shalawat dan salam kepada Rasulullah. Ya Allah, bukakanlah untukku pintu-pintu rahmat-Mu"',
    category: 'Doa & Niat'
  },
  {
    title: 'Talbiyah',
    content: 'لَبَّيْكَ اللَّهُمَّ لَبَّيْكَ، لَبَّيْكَ لاَ شَرِيْكَ لَكَ لَبَّيْكَ، إِنَّ الْحَمْدَ وَالنِّعْمَةَ لَكَ وَالْمُلْكَ، لاَ شَرِيْكَ لَكَ\n\nArtinya: "Aku penuhi panggilan-Mu ya Allah, aku penuhi panggilan-Mu. Aku penuhi panggilan-Mu, tiada sekutu bagi-Mu, aku penuhi panggilan-Mu. Sesungguhnya segala puji, nikmat dan kerajaan adalah milik-Mu, tiada sekutu bagi-Mu"',
    category: 'Doa & Niat'
  },
  {
    title: 'Larangan Saat Ihram',
    content: '1. Mencukur atau mencabut rambut\n2. Memotong kuku\n3. Memakai wangi-wangian\n4. Berburu binatang darat\n5. Menikah atau menikahkan\n6. Berhubungan suami istri\n7. Bagi pria: memakai pakaian berjahit, menutup kepala\n8. Bagi wanita: memakai cadar dan sarung tangan',
    category: 'Panduan'
  },
  {
    title: 'Rukun Umrah',
    content: '1. Ihram (niat)\n2. Thawaf (mengelilingi Ka\'bah 7 kali)\n3. Sa\'i (berjalan antara Shafa dan Marwah 7 kali)\n4. Tahallul (mencukur/memotong rambut)',
    category: 'Panduan'
  },
  {
    title: 'Lokasi Mustajab',
    content: '• Multazam (antara Hajar Aswad dan pintu Ka\'bah)\n• Hijr Ismail\n• Maqam Ibrahim\n• Bukit Shafa dan Marwah\n• Jabal Rahmah di Arafah\n• Masjid Nabawi di Madinah',
    category: 'Lokasi'
  },
]

export default function JamaahPanduan() {
  const { data, loading } = useJamaahAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#FAFAF8] to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gold-100 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="text-navy-500">Memuat...</p>
        </div>
      </div>
    )
  }

  if (!data) return null

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#FAFAF8] to-white">
      <JamaahNavbar userName={data.name} />

      {/* Header */}
      <section className="px-6 pt-10 pb-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-navy-900 mb-3">Panduan Ibadah</h1>
          <p className="text-navy-500 text-base">
            Panduan ini dapat Anda akses kapan saja selama perjalanan ibadah.
          </p>
        </div>
      </section>

      {/* Panduan Cards */}
      <section className="px-6 pb-12">
        <div className="max-w-2xl mx-auto space-y-4">
          {panduanItems.map((item, index) => (
            <details 
              key={index} 
              className="bg-white rounded-2xl shadow-sm border border-navy-100/50 overflow-hidden group"
            >
              <summary className="px-6 py-5 cursor-pointer flex items-center justify-between hover:bg-navy-50/50 transition-colors">
                <div>
                  <span className="text-xs font-medium text-gold-600 uppercase tracking-wide">{item.category}</span>
                  <h3 className="text-navy-900 font-semibold mt-1">{item.title}</h3>
                </div>
                <svg className="w-5 h-5 text-navy-400 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-6 pb-5 pt-2 border-t border-navy-100/50">
                <p className="text-navy-600 text-sm leading-relaxed whitespace-pre-line">{item.content}</p>
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 pb-12">
        <div className="max-w-2xl mx-auto">
          <div className="bg-navy-50/50 rounded-2xl p-6 text-center">
            <p className="text-navy-600 mb-4">Ada pertanyaan lain seputar ibadah?</p>
            <Link 
              href="/jamaah/chat" 
              className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-gold-500 to-gold-600 text-navy-900 font-semibold rounded-xl hover:from-gold-400 hover:to-gold-500 transition-all shadow-md"
            >
              Tanya Mabrur AI
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-6 text-center border-t border-navy-100/50">
        <p className="text-navy-400 text-sm">
          © 2024 Mabrur.ai — Semoga Menjadi Haji Mabrur
        </p>
      </footer>
    </main>
  )
}
