import Link from 'next/link'
import Navbar from '@/components/Navbar'

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
    title: 'Talbiyah',
    content: 'لَبَّيْكَ اللَّهُمَّ لَبَّيْكَ، لَبَّيْكَ لاَ شَرِيْكَ لَكَ لَبَّيْكَ، إِنَّ الْحَمْدَ وَالنِّعْمَةَ لَكَ وَالْمُلْكَ، لاَ شَرِيْكَ لَكَ\n\nArtinya: "Aku penuhi panggilan-Mu ya Allah, aku penuhi panggilan-Mu. Aku penuhi panggilan-Mu, tiada sekutu bagi-Mu, aku penuhi panggilan-Mu. Sesungguhnya segala puji, nikmat dan kerajaan adalah milik-Mu, tiada sekutu bagi-Mu"',
    category: 'Doa & Niat'
  },
  {
    title: 'Rukun Umrah',
    content: '1. Ihram (niat)\n2. Thawaf (mengelilingi Ka\'bah 7 kali)\n3. Sa\'i (berjalan antara Shafa dan Marwah 7 kali)\n4. Tahallul (mencukur/memotong rambut)',
    category: 'Panduan'
  },
]

export default function PublicPanduan() {
  return (
    <main className="min-h-screen bg-[#FAFAF8]">
      <Navbar />

      {/* Header */}
      <section className="pt-28 pb-8 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-navy-900 mb-3">Panduan Ibadah</h1>
          <p className="text-navy-500 text-base">
            Panduan singkat untuk perjalanan ibadah Haji & Umrah
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
      <section className="px-6 pb-16">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-navy-100/50">
            <h3 className="text-xl font-semibold text-navy-900 mb-3">Akses Panduan Lengkap</h3>
            <p className="text-navy-500 mb-6">
              Login untuk mengakses panduan lengkap dan fitur Tanya AI
            </p>
            <Link 
              href="/jamaah" 
              className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-gold-500 to-gold-600 text-navy-900 font-semibold text-lg rounded-2xl hover:from-gold-400 hover:to-gold-500 transition-all shadow-lg shadow-gold-500/20"
            >
              Login Jamaah
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-navy-100 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-navy-400 text-sm">
            © 2024 Mabrur.ai — Semoga Menjadi Haji Mabrur
          </p>
        </div>
      </footer>
    </main>
  )
}
