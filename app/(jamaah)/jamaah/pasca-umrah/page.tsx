'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import JamaahNavbar from '@/components/JamaahNavbar'

interface Testimonial {
  id: string
  rating: number
  content: string
  packageType: string | null
  travelDate: string | null
  isApproved: boolean
}

interface LoyaltyData {
  points: number
  tier: string
  referralCode: string
  totalReferrals: number
}

const tierConfig: Record<string, { label: string; color: string; bgColor: string; minPoints: number; discount: string }> = {
  BRONZE: { label: 'Bronze', color: 'text-amber-700', bgColor: 'bg-gradient-to-br from-amber-100 to-amber-200', minPoints: 0, discount: '5%' },
  SILVER: { label: 'Silver', color: 'text-slate-600', bgColor: 'bg-gradient-to-br from-slate-200 to-slate-300', minPoints: 500, discount: '10%' },
  GOLD: { label: 'Gold', color: 'text-yellow-700', bgColor: 'bg-gradient-to-br from-yellow-200 to-yellow-300', minPoints: 1000, discount: '15%' },
  PLATINUM: { label: 'Platinum', color: 'text-purple-700', bgColor: 'bg-gradient-to-br from-purple-200 to-purple-300', minPoints: 2500, discount: '20%' }
}

export default function PascaUmrahPage() {
  const [loading, setLoading] = useState(true)
  const [userName, setUserName] = useState('')
  const [token, setToken] = useState('')
  const [activeTab, setActiveTab] = useState<'certificate' | 'testimonial' | 'loyalty' | 'referral'>('certificate')
  const [testimonial, setTestimonial] = useState<Testimonial | null>(null)
  const [loyalty, setLoyalty] = useState<LoyaltyData | null>(null)
  const [testimonialForm, setTestimonialForm] = useState({ rating: 5, content: '', packageType: '', travelDate: '' })
  const [submitting, setSubmitting] = useState(false)
  const [copied, setCopied] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const savedToken = localStorage.getItem('jamaah-token')
    if (!savedToken) { router.push('/jamaah'); return }
    setToken(savedToken)
    
    fetch('/api/jamaah/auth', {
      headers: { 'Authorization': `Bearer ${savedToken}` }
    }).then(res => res.json()).then(data => {
      if (data.user) setUserName(data.user.name)
      else router.push('/jamaah')
    })

    fetchData(savedToken)
  }, [router])

  const fetchData = async (t: string) => {
    const [testRes, loyaltyRes] = await Promise.all([
      fetch('/api/jamaah/testimonial', { headers: { 'Authorization': `Bearer ${t}` } }),
      fetch('/api/jamaah/loyalty', { headers: { 'Authorization': `Bearer ${t}` } })
    ])
    
    const testData = await testRes.json()
    const loyaltyData = await loyaltyRes.json()
    
    if (testData && testData.id) {
      setTestimonial(testData)
      setTestimonialForm({
        rating: testData.rating,
        content: testData.content,
        packageType: testData.packageType || '',
        travelDate: testData.travelDate || ''
      })
    }
    
    if (loyaltyData && loyaltyData.referralCode) {
      setLoyalty(loyaltyData)
    }
    
    setLoading(false)
  }

  const handleSubmitTestimonial = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    
    await fetch('/api/jamaah/testimonial', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(testimonialForm)
    })
    
    fetchData(token)
    setSubmitting(false)
  }

  const copyReferralCode = () => {
    if (loyalty?.referralCode) {
      navigator.clipboard.writeText(loyalty.referralCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const currentTier = loyalty ? tierConfig[loyalty.tier] : tierConfig.BRONZE

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-navy-50 to-white flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-gold-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-navy-50 to-white">
      <JamaahNavbar userName={userName} />
      
      <main className="max-w-4xl mx-auto px-4 py-6 pb-12">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-navy-900">Pasca Umrah</h1>
          <p className="text-navy-500">Sertifikat, testimoni & program loyalitas</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {[
            { id: 'certificate', label: 'Sertifikat', icon: '📜' },
            { id: 'testimonial', label: 'Testimoni', icon: '⭐' },
            { id: 'loyalty', label: 'Loyalitas', icon: '🏆' },
            { id: 'referral', label: 'Referral', icon: '🎁' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap transition-colors ${
                activeTab === tab.id 
                  ? 'bg-navy-900 text-white' 
                  : 'bg-white text-navy-600 border border-navy-200'
              }`}
            >
              <span>{tab.icon}</span>
              <span className="text-sm font-medium">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Certificate Tab */}
        {activeTab === 'certificate' && (
          <div className="space-y-4">
            {/* Digital Certificate */}
            <div className="bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 rounded-2xl border-2 border-emerald-200 p-6 relative overflow-hidden">
              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-200/30 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gold-200/30 rounded-full translate-y-1/2 -translate-x-1/2" />
              
              <div className="relative text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-gold-400 to-gold-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                
                <p className="text-emerald-600 text-sm font-medium mb-2">SERTIFIKAT DIGITAL</p>
                <h2 className="text-2xl font-bold text-emerald-900 mb-1">Umrah Mabrur</h2>
                <p className="text-emerald-700 mb-4">Diberikan kepada:</p>
                
                <p className="text-3xl font-bold text-navy-900 mb-4">{userName}</p>
                
                <p className="text-emerald-700 text-sm mb-6">
                  Telah menyelesaikan ibadah Umrah dengan bimbingan<br />
                  <span className="font-semibold">Mabrur.ai Travel</span>
                </p>
                
                <div className="flex items-center justify-center gap-2 text-emerald-600 text-sm">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                </div>
              </div>
            </div>

            {/* Download Button */}
            <button className="w-full py-3 px-4 bg-emerald-600 text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-emerald-700 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Unduh Sertifikat (PDF)
            </button>

            <p className="text-center text-navy-500 text-sm">
              Sertifikat digital ini dapat diverifikasi melalui QR code
            </p>
          </div>
        )}

        {/* Testimonial Tab */}
        {activeTab === 'testimonial' && (
          <div className="space-y-4">
            {testimonial?.isApproved && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-green-800">Testimoni Anda telah disetujui!</p>
                  <p className="text-sm text-green-600">Terima kasih atas ulasan Anda</p>
                </div>
              </div>
            )}

            <div className="bg-white rounded-2xl border border-navy-100 p-5">
              <h3 className="font-semibold text-navy-900 mb-4">
                {testimonial ? 'Edit Testimoni Anda' : 'Bagikan Pengalaman Anda'}
              </h3>
              
              <form onSubmit={handleSubmitTestimonial} className="space-y-4">
                {/* Rating */}
                <div>
                  <label className="block text-sm font-medium text-navy-700 mb-2">Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setTestimonialForm({...testimonialForm, rating: star})}
                        className="text-3xl transition-transform hover:scale-110"
                      >
                        {star <= testimonialForm.rating ? '⭐' : '☆'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Content */}
                <div>
                  <label className="block text-sm font-medium text-navy-700 mb-1">Testimoni *</label>
                  <textarea
                    required
                    value={testimonialForm.content}
                    onChange={(e) => setTestimonialForm({...testimonialForm, content: e.target.value})}
                    rows={4}
                    className="w-full px-4 py-2 border border-navy-200 rounded-xl focus:ring-2 focus:ring-gold-500"
                    placeholder="Ceritakan pengalaman umrah Anda bersama kami..."
                  />
                </div>

                {/* Package Type */}
                <div>
                  <label className="block text-sm font-medium text-navy-700 mb-1">Paket Umrah</label>
                  <select
                    value={testimonialForm.packageType}
                    onChange={(e) => setTestimonialForm({...testimonialForm, packageType: e.target.value})}
                    className="w-full px-4 py-2 border border-navy-200 rounded-xl focus:ring-2 focus:ring-gold-500"
                  >
                    <option value="">Pilih paket</option>
                    <option value="Reguler">Paket Reguler</option>
                    <option value="VIP">Paket VIP</option>
                    <option value="Ramadhan">Paket Ramadhan</option>
                    <option value="Plus Turki">Paket Plus Turki</option>
                  </select>
                </div>

                {/* Travel Date */}
                <div>
                  <label className="block text-sm font-medium text-navy-700 mb-1">Periode Keberangkatan</label>
                  <input
                    type="text"
                    value={testimonialForm.travelDate}
                    onChange={(e) => setTestimonialForm({...testimonialForm, travelDate: e.target.value})}
                    className="w-full px-4 py-2 border border-navy-200 rounded-xl focus:ring-2 focus:ring-gold-500"
                    placeholder="Contoh: Desember 2024"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 px-4 bg-gold-500 text-navy-900 rounded-xl font-medium hover:bg-gold-400 disabled:opacity-50 transition-colors"
                >
                  {submitting ? 'Mengirim...' : testimonial ? 'Perbarui Testimoni' : 'Kirim Testimoni'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Loyalty Tab */}
        {activeTab === 'loyalty' && loyalty && (
          <div className="space-y-4">
            {/* Loyalty Card */}
            <div className={`${currentTier.bgColor} rounded-2xl p-6 relative overflow-hidden`}>
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
              
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm opacity-70">Member Status</p>
                    <p className={`text-2xl font-bold ${currentTier.color}`}>{currentTier.label}</p>
                  </div>
                  <div className="w-14 h-14 bg-white/30 rounded-full flex items-center justify-center">
                    <span className="text-3xl">🏆</span>
                  </div>
                </div>
                
                <div className="bg-white/40 rounded-xl p-4 mb-4">
                  <p className="text-sm opacity-70 mb-1">Total Poin</p>
                  <p className="text-4xl font-bold">{loyalty.points.toLocaleString()}</p>
                </div>
                
                <p className="text-sm opacity-80">
                  Diskon {currentTier.discount} untuk perjalanan berikutnya
                </p>
              </div>
            </div>

            {/* Tier Progress */}
            <div className="bg-white rounded-2xl border border-navy-100 p-5">
              <h3 className="font-semibold text-navy-900 mb-4">Level Keanggotaan</h3>
              <div className="space-y-3">
                {Object.entries(tierConfig).map(([key, tier]) => {
                  const isActive = key === loyalty.tier
                  const isUnlocked = loyalty.points >= tier.minPoints
                  
                  return (
                    <div key={key} className={`flex items-center gap-3 p-3 rounded-xl ${isActive ? 'bg-gold-50 border border-gold-200' : ''}`}>
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isUnlocked ? tier.bgColor : 'bg-gray-100'}`}>
                        {isUnlocked ? '✓' : '🔒'}
                      </div>
                      <div className="flex-1">
                        <p className={`font-medium ${isActive ? 'text-gold-700' : 'text-navy-700'}`}>{tier.label}</p>
                        <p className="text-sm text-navy-500">{tier.minPoints.toLocaleString()} poin • Diskon {tier.discount}</p>
                      </div>
                      {isActive && <span className="px-2 py-1 bg-gold-500 text-navy-900 rounded text-xs font-medium">Aktif</span>}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* How to Earn Points */}
            <div className="bg-white rounded-2xl border border-navy-100 p-5">
              <h3 className="font-semibold text-navy-900 mb-4">Cara Mendapatkan Poin</h3>
              <div className="space-y-3">
                {[
                  { icon: '✈️', title: 'Selesaikan Perjalanan', points: '+100', desc: 'Setiap perjalanan umrah' },
                  { icon: '👥', title: 'Referral Berhasil', points: '+200', desc: 'Setiap teman yang mendaftar' },
                  { icon: '⭐', title: 'Kirim Testimoni', points: '+50', desc: 'Testimoni yang disetujui' },
                  { icon: '🎂', title: 'Bonus Ulang Tahun', points: '+25', desc: 'Setiap tahun' }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-navy-50 rounded-xl">
                    <span className="text-2xl">{item.icon}</span>
                    <div className="flex-1">
                      <p className="font-medium text-navy-900">{item.title}</p>
                      <p className="text-sm text-navy-500">{item.desc}</p>
                    </div>
                    <span className="text-green-600 font-bold">{item.points}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Referral Tab */}
        {activeTab === 'referral' && loyalty && (
          <div className="space-y-4">
            {/* Referral Card */}
            <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl p-6 text-white">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🎁</span>
                </div>
                <div>
                  <h3 className="font-bold text-lg">Program Referral</h3>
                  <p className="text-purple-200 text-sm">Ajak teman, dapat bonus!</p>
                </div>
              </div>
              
              <div className="bg-white/10 rounded-xl p-4 mb-4">
                <p className="text-purple-200 text-sm mb-2">Kode Referral Anda</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold tracking-wider flex-1">{loyalty.referralCode}</p>
                  <button
                    onClick={copyReferralCode}
                    className="px-4 py-2 bg-white text-purple-600 rounded-lg font-medium text-sm hover:bg-purple-50 transition-colors"
                  >
                    {copied ? '✓ Tersalin' : 'Salin'}
                  </button>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-purple-200">Total Referral Berhasil</span>
                <span className="font-bold text-lg">{loyalty.totalReferrals}</span>
              </div>
            </div>

            {/* Referral Benefits */}
            <div className="bg-white rounded-2xl border border-navy-100 p-5">
              <h3 className="font-semibold text-navy-900 mb-4">Keuntungan Referral</h3>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">💰</span>
                  </div>
                  <div>
                    <p className="font-medium text-navy-900">Untuk Anda</p>
                    <p className="text-sm text-navy-500">Dapatkan 200 poin + cashback Rp 500.000 untuk setiap referral yang berhasil mendaftar</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">🎉</span>
                  </div>
                  <div>
                    <p className="font-medium text-navy-900">Untuk Teman Anda</p>
                    <p className="text-sm text-navy-500">Teman Anda mendapat diskon Rp 300.000 untuk pendaftaran pertama</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Share Buttons */}
            <div className="bg-white rounded-2xl border border-navy-100 p-5">
              <h3 className="font-semibold text-navy-900 mb-4">Bagikan ke Teman</h3>
              <div className="grid grid-cols-2 gap-3">
                <button className="py-3 px-4 bg-green-500 text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-green-600">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  WhatsApp
                </button>
                <button className="py-3 px-4 bg-blue-500 text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-blue-600">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                  Twitter
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
