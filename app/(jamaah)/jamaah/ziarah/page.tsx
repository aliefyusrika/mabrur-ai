'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import JamaahNavbar from '@/components/JamaahNavbar'
import GoogleMapView from '@/components/GoogleMapView'

interface ZiarahLocation {
  id: string
  city: string
  name: string
  arabicName: string | null
  description: string
  history: string | null
  virtues: string | null
  practices: string | null
  imagePath: string | null
  latitude: number | null
  longitude: number | null
  placeId: string | null
  address: string | null
}

// Predefined AI responses for tour guide
const aiResponses: Record<string, string[]> = {
  MASJIDIL_HARAM: [
    "Masjidil Haram adalah masjid terbesar di dunia dan merupakan kiblat umat Islam. Di dalamnya terdapat Ka'bah yang menjadi pusat ibadah haji dan umrah.",
    "Keutamaan shalat di Masjidil Haram adalah 100.000 kali lipat dibanding shalat di masjid lain. Subhanallah!",
    "Tips: Waktu terbaik untuk tawaf adalah setelah Subuh atau menjelang Isya ketika jamaah lebih sedikit."
  ],
  MASJID_NABAWI: [
    "Masjid Nabawi adalah masjid kedua tersuci dalam Islam, dibangun oleh Rasulullah SAW setelah hijrah ke Madinah.",
    "Di dalam masjid ini terdapat Raudhah, area antara mimbar dan makam Nabi yang disebut sebagai taman surga.",
    "Shalat di Masjid Nabawi pahalanya 1.000 kali lipat dibanding shalat di masjid lain selain Masjidil Haram."
  ],
  JABAL_RAHMAH: [
    "Jabal Rahmah adalah bukit tempat bertemunya Nabi Adam AS dan Hawa setelah diturunkan ke bumi.",
    "Bukit ini terletak di Padang Arafah dan menjadi salah satu tempat mustajab untuk berdoa.",
    "Pada saat wukuf, jamaah haji berkumpul di sekitar bukit ini untuk bermunajat kepada Allah SWT."
  ],
  GHAR_HIRA: [
    "Gua Hira adalah tempat Rasulullah SAW menerima wahyu pertama dari Allah SWT melalui Malaikat Jibril.",
    "Gua ini terletak di Jabal Nur, sekitar 4 km dari Masjidil Haram. Pendakian membutuhkan waktu sekitar 1-2 jam.",
    "Di sinilah turun Surah Al-Alaq ayat 1-5, perintah pertama untuk membaca."
  ],
  GHAR_TSUR: [
    "Gua Tsur adalah tempat persembunyian Rasulullah SAW dan Abu Bakar As-Siddiq saat hijrah ke Madinah.",
    "Mereka bersembunyi selama 3 hari 3 malam di gua ini dari kejaran kaum Quraisy.",
    "Allah SWT melindungi mereka dengan sarang laba-laba dan sarang burung merpati di mulut gua."
  ],
  DEFAULT: [
    "Tempat ini memiliki nilai sejarah yang penting dalam perjalanan Islam.",
    "Banyak keutamaan yang bisa didapatkan dengan mengunjungi tempat-tempat bersejarah ini.",
    "Semoga ziarah ini menambah keimanan dan ketakwaan kita kepada Allah SWT."
  ]
}

const cities = [
  { id: 'MAKKAH', label: 'Makkah Al-Mukarramah', icon: '🕋' },
  { id: 'MADINAH', label: 'Madinah Al-Munawwarah', icon: '🕌' }
]

export default function ZiarahPage() {
  const [locations, setLocations] = useState<ZiarahLocation[]>([])
  const [loading, setLoading] = useState(true)
  const [userName, setUserName] = useState('')
  const [activeCity, setActiveCity] = useState('MAKKAH')
  const [selectedLocation, setSelectedLocation] = useState<ZiarahLocation | null>(null)
  const [showAiGuide, setShowAiGuide] = useState(false)
  const [aiMessage, setAiMessage] = useState('')
  const [aiTyping, setAiTyping] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('jamaah-token')
    if (!token) { router.push('/jamaah'); return }
    
    fetch('/api/jamaah/auth', {
      headers: { 'Authorization': `Bearer ${token}` }
    }).then(res => res.json()).then(data => {
      if (data.user) setUserName(data.user.name)
      else router.push('/jamaah')
    })

    fetchLocations()
  }, [router])

  const fetchLocations = async () => {
    try {
      const res = await fetch('/api/jamaah/ziarah')
      const data = await res.json()
      if (Array.isArray(data)) {
        setLocations(data)
      } else {
        console.error('Ziarah API error:', data)
        setLocations([])
      }
    } catch (error) {
      console.error('Fetch ziarah error:', error)
      setLocations([])
    } finally {
      setLoading(false)
    }
  }

  const getAiResponse = (location: ZiarahLocation) => {
    setShowAiGuide(true)
    setAiTyping(true)
    setAiMessage('')
    
    // Get responses based on location name keywords
    let responses = aiResponses.DEFAULT
    const nameUpper = location.name.toUpperCase()
    
    if (nameUpper.includes('MASJIDIL HARAM') || nameUpper.includes('KABAH')) {
      responses = aiResponses.MASJIDIL_HARAM
    } else if (nameUpper.includes('NABAWI') || nameUpper.includes('MADINAH')) {
      responses = aiResponses.MASJID_NABAWI
    } else if (nameUpper.includes('RAHMAH') || nameUpper.includes('ARAFAH')) {
      responses = aiResponses.JABAL_RAHMAH
    } else if (nameUpper.includes('HIRA') || nameUpper.includes('NUR')) {
      responses = aiResponses.GHAR_HIRA
    } else if (nameUpper.includes('TSUR')) {
      responses = aiResponses.GHAR_TSUR
    }
    
    const randomResponse = responses[Math.floor(Math.random() * responses.length)]
    
    // Simulate typing effect
    setTimeout(() => {
      setAiTyping(false)
      setAiMessage(randomResponse)
    }, 1500)
  }

  const filteredLocations = locations.filter(l => l.city === activeCity)

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
          <h1 className="text-2xl font-bold text-navy-900">Ziarah</h1>
          <p className="text-navy-500">Jelajahi tempat-tempat bersejarah di Tanah Suci</p>
        </div>

        {/* City Tabs */}
        <div className="flex gap-3 mb-6">
          {cities.map((city) => (
            <button
              key={city.id}
              onClick={() => setActiveCity(city.id)}
              className={`flex-1 py-3 px-4 rounded-2xl font-medium transition-all ${
                activeCity === city.id 
                  ? 'bg-gradient-to-r from-navy-800 to-navy-900 text-white shadow-lg' 
                  : 'bg-white text-navy-600 border border-navy-200 hover:bg-navy-50'
              }`}
            >
              <span className="text-xl mb-1 block">{city.icon}</span>
              <span className="text-sm">{city.label}</span>
            </button>
          ))}
        </div>

        {/* Map Placeholder */}
        <div className="bg-gradient-to-br from-amber-50 to-yellow-100 rounded-2xl p-6 mb-6 border border-amber-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-amber-900">Peta {activeCity === 'MAKKAH' ? 'Makkah' : 'Madinah'}</h3>
              <p className="text-sm text-amber-700">Lokasi ziarah di sekitar kota</p>
            </div>
            <div className="w-12 h-12 bg-amber-200 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
          </div>
          <div className="aspect-video bg-white/50 rounded-xl flex items-center justify-center border border-amber-200">
            <div className="text-center">
              <svg className="w-16 h-16 text-amber-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <p className="text-amber-600 text-sm">Peta interaktif akan tersedia</p>
              <p className="text-amber-500 text-xs">Pilih lokasi di bawah untuk detail</p>
            </div>
          </div>
        </div>

        {/* Location List */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-navy-900 mb-3">Tempat Bersejarah</h2>
        </div>

        {filteredLocations.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-navy-100">
            <div className="w-16 h-16 bg-navy-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-navy-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
            </div>
            <h3 className="text-navy-900 font-semibold mb-2">Belum ada lokasi</h3>
            <p className="text-navy-500 text-sm">Lokasi ziarah akan segera ditambahkan</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredLocations.map((location) => (
              <div
                key={location.id}
                className="bg-white rounded-2xl border border-navy-100 overflow-hidden"
              >
                <button
                  onClick={() => setSelectedLocation(selectedLocation?.id === location.id ? null : location)}
                  className="w-full p-4 text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-gold-100 to-gold-200 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {location.imagePath ? (
                        <img src={location.imagePath} alt={location.name} className="w-full h-full object-cover" />
                      ) : (
                        <svg className="w-7 h-7 text-gold-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-navy-900">{location.name}</h3>
                      {location.arabicName && (
                        <p className="text-gold-600 font-arabic text-sm">{location.arabicName}</p>
                      )}
                      <p className="text-sm text-navy-500 line-clamp-1">{location.description}</p>
                    </div>
                    <svg className={`w-5 h-5 text-navy-400 transition-transform flex-shrink-0 ${selectedLocation?.id === location.id ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>

                {/* Expanded Content */}
                {selectedLocation?.id === location.id && (
                  <div className="px-4 pb-4 border-t border-navy-100 pt-4 space-y-4">
                    {/* Image */}
                    {location.imagePath && (
                      <div className="rounded-xl overflow-hidden">
                        <img 
                          src={location.imagePath} 
                          alt={location.name} 
                          className="w-full h-48 object-cover"
                        />
                      </div>
                    )}

                    {/* Description */}
                    <div>
                      <p className="text-navy-700">{location.description}</p>
                    </div>

                    {/* Address */}
                    {location.address && (
                      <div className="flex items-start gap-2 text-sm text-navy-600 bg-navy-50 p-3 rounded-xl">
                        <svg className="w-5 h-5 text-navy-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>{location.address}</span>
                      </div>
                    )}

                    {/* Google Map */}
                    {location.latitude && location.longitude && (
                      <GoogleMapView
                        latitude={location.latitude}
                        longitude={location.longitude}
                        name={location.name}
                      />
                    )}

                    {/* History */}
                    {location.history && (
                      <div className="bg-amber-50 p-4 rounded-xl border border-amber-200">
                        <h4 className="font-medium text-amber-800 mb-2 flex items-center gap-2">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Sejarah
                        </h4>
                        <p className="text-amber-900 text-sm">{location.history}</p>
                      </div>
                    )}

                    {/* Virtues */}
                    {location.virtues && (
                      <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200">
                        <h4 className="font-medium text-emerald-800 mb-2 flex items-center gap-2">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                          </svg>
                          Keutamaan
                        </h4>
                        <p className="text-emerald-900 text-sm">{location.virtues}</p>
                      </div>
                    )}

                    {/* Practices */}
                    {location.practices && (
                      <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                        <h4 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                          </svg>
                          Amalan yang Dianjurkan
                        </h4>
                        <p className="text-blue-900 text-sm">{location.practices}</p>
                      </div>
                    )}

                    {/* AI Tour Guide Button */}
                    <button
                      onClick={() => getAiResponse(location)}
                      className="w-full py-3 px-4 bg-gradient-to-r from-gold-400 to-gold-500 text-navy-900 rounded-xl font-medium flex items-center justify-center gap-2 hover:from-gold-500 hover:to-gold-600 transition-all"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      Tanya AI Tour Guide
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* AI Tour Guide Modal */}
        {showAiGuide && (
          <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-4">
            <div className="bg-white rounded-t-3xl sm:rounded-2xl w-full max-w-lg">
              <div className="p-5 border-b border-navy-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-gold-400 to-gold-500 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-navy-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-navy-900">AI Tour Guide</h3>
                      <p className="text-xs text-navy-500">Mabrur.ai Assistant</p>
                    </div>
                  </div>
                  <button onClick={() => setShowAiGuide(false)} className="p-2 text-navy-400 hover:text-navy-600 rounded-lg">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="p-5">
                {selectedLocation && (
                  <div className="mb-4 p-3 bg-navy-50 rounded-xl">
                    <p className="text-sm text-navy-500">Tentang:</p>
                    <p className="font-medium text-navy-900">{selectedLocation.name}</p>
                  </div>
                )}
                <div className="bg-gradient-to-br from-gold-50 to-amber-50 p-4 rounded-xl border border-gold-200">
                  {aiTyping ? (
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-gold-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-2 h-2 bg-gold-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-2 h-2 bg-gold-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                      <span className="text-sm text-gold-700">Sedang mengetik...</span>
                    </div>
                  ) : (
                    <p className="text-navy-800 leading-relaxed">{aiMessage}</p>
                  )}
                </div>
                <button
                  onClick={() => selectedLocation && getAiResponse(selectedLocation)}
                  disabled={aiTyping}
                  className="w-full mt-4 py-2 px-4 border border-gold-300 text-gold-700 rounded-xl text-sm font-medium hover:bg-gold-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Tanya lagi
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
