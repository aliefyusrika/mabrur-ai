import Link from 'next/link'
import Navbar from '@/components/Navbar'

export default function Home() {
  return (
    <main className="min-h-screen bg-[#FAFAF8]">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* Background Image Layer */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/hero-makkah.jpg')" }}
        />
        {/* Warm Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#FAFAF8]/75 via-[#FAFAF8]/70 to-[#FAFAF8]/90" />
        
        {/* Content */}
        <div className="relative max-w-3xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold-100 rounded-full mb-8">
            <span className="w-2 h-2 bg-gold-500 rounded-full" />
            <span className="text-gold-700 text-sm font-medium">Asisten Digital Haji & Umrah</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-navy-900 leading-tight mb-6">
            Perjalanan Ibadah{' '}
            <br className="hidden sm:block" />
            <span className="text-gold-600">Tenang</span>
            {', '}
            <span className="text-gold-600">Nyaman</span>
            {' & '}
            <span className="text-gold-600">Terbimbing</span>
          </h1>
          
          {/* Description */}
          <p className="text-navy-500 text-lg md:text-xl leading-relaxed mb-10 max-w-2xl mx-auto">
            Mabrur.ai membantu jamaah memantau status perjalanan dan bertanya seputar ibadah tanpa rasa khawatir.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/jamaah" 
              className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-gold-500 to-gold-600 text-navy-900 font-semibold text-lg rounded-2xl hover:from-gold-400 hover:to-gold-500 transition-all shadow-lg shadow-gold-500/20 hover:shadow-gold-500/30"
            >
              Login Jamaah
            </Link>
            <Link 
              href="/panduan" 
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-navy-800 font-medium text-lg rounded-2xl hover:bg-navy-50 transition-all border-2 border-navy-200"
            >
              Panduan Singkat
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="panduan" className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-navy-900 mb-4">Cara Menggunakan</h2>
            <p className="text-navy-500 text-lg">Tiga langkah sederhana untuk memulai</p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { step: '1', title: 'Dapatkan Kode Akses', desc: 'Terima kode akses unik dari travel agent Anda' },
              { step: '2', title: 'Pantau Status', desc: 'Lihat status persiapan visa, tiket, hotel, dan lainnya' },
              { step: '3', title: 'Tanya AI', desc: 'Tanyakan tentang doa, niat, dan lokasi mustajab' },
            ].map((item) => (
              <div key={item.step} className="bg-[#FAFAF8] rounded-2xl p-8 text-center hover:shadow-lg transition-shadow border border-navy-100/50">
                <div className="w-12 h-12 mx-auto mb-5 rounded-full bg-gold-500 flex items-center justify-center text-navy-900 font-bold text-xl">
                  {item.step}
                </div>
                <h3 className="text-navy-900 font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-navy-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Layanan Terintegrasi */}
      <section className="py-20 px-6 bg-[#FAF9F6]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-navy-900 mb-4">Layanan Terintegrasi</h2>
            <p className="text-navy-500 text-lg max-w-2xl mx-auto">
              Semua yang Anda butuhkan dalam satu pendamping perjalanan ibadah
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {[
              { title: 'Pembayaran', desc: 'Pantau status pembayaran perjalanan Anda secara jelas.', icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg> },
              { title: 'Tiket', desc: 'Informasi tiket penerbangan yang terkelola rapi.', icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" /></svg> },
              { title: 'Hotel', desc: 'Detail hotel dan jarak ke Masjid.', icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg> },
              { title: 'Visa', desc: 'Status pengurusan visa dan dokumen.', icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg> },
              { title: 'Transport Saudi', desc: 'Jadwal dan transportasi selama di Tanah Suci.', icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg> },
              { title: 'Perlengkapan', desc: 'Checklist perlengkapan sebelum keberangkatan.', icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg> },
              { title: 'Manasik', desc: 'Panduan manasik dan doa harian.', icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg> },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-2xl p-6 shadow-sm border border-navy-100/30 hover:shadow-md transition-shadow">
                <div className="w-11 h-11 mb-4 rounded-xl bg-gold-100 flex items-center justify-center text-gold-600">{item.icon}</div>
                <h3 className="text-navy-900 font-semibold text-base mb-2">{item.title}</h3>
                <p className="text-navy-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Positioning Statement */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-2xl md:text-3xl font-medium text-navy-800 leading-relaxed">
            Dirancang untuk jamaah,
            <br />
            digunakan dengan <span className="text-gold-600">tenang</span>,
            <br />
            dan dibimbing dengan <span className="text-gold-600">aman</span>.
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 px-6 bg-[#FAFAF8]">
        <div className="max-w-xl mx-auto text-center">
          <h3 className="text-2xl font-bold text-navy-900 mb-4">Siap Memulai?</h3>
          <p className="text-navy-500 mb-8">Masukkan kode akses dari travel agent Anda</p>
          <Link 
            href="/jamaah" 
            className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-gold-500 to-gold-600 text-navy-900 font-semibold text-lg rounded-2xl hover:from-gold-400 hover:to-gold-500 transition-all shadow-lg shadow-gold-500/20"
          >
            Login Jamaah
          </Link>
        </div>
      </section>

      {/* Status Preview Section */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h3 className="text-xl font-semibold text-navy-800 mb-3">Tampilan Status yang Jelas & Tenang</h3>
            <p className="text-navy-500 text-sm max-w-md mx-auto">
              Setelah login, jamaah dapat memantau status persiapan perjalanan dalam tampilan yang rapi dan mudah dipahami.
            </p>
          </div>
          
          {/* Subtle Preview */}
          <div className="bg-[#FAF9F6] rounded-2xl p-6 max-w-sm mx-auto border border-navy-100/30">
            <p className="text-navy-400 text-xs uppercase tracking-wide mb-4">Contoh Tampilan</p>
            <div className="space-y-2.5">
              {[
                { label: 'Pembayaran', status: 'Selesai', color: 'bg-green-50 text-green-600' },
                { label: 'Visa', status: 'Proses', color: 'bg-gold-50 text-gold-600' },
                { label: 'Hotel', status: 'Belum', color: 'bg-red-50 text-red-500' },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between py-2 px-3 bg-white/80 rounded-lg">
                  <span className="text-navy-600 text-sm">{item.label}</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${item.color}`}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
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
