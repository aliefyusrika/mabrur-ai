'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import JamaahNavbar from '@/components/JamaahNavbar'

interface IbadahContent {
  id: string
  category: string
  location: string
  title: string
  arabicText: string | null
  latinText: string | null
  translation: string | null
  audioPath: string | null
  description: string | null
}

const categories = [
  { id: 'TAWAF', label: 'Tawaf', icon: '🕋' },
  { id: 'SAII', label: "Sa'i", icon: '🚶' },
  { id: 'WUKUF', label: 'Wukuf', icon: '⛰️' },
  { id: 'MABIT', label: 'Mabit', icon: '🌙' },
  { id: 'JUMRAH', label: 'Jumrah', icon: '🪨' },
  { id: 'DOA_HARIAN', label: 'Doa Harian', icon: '🤲' }
]

const locations: Record<string, { label: string; color: string }> = {
  MASJIDIL_HARAM: { label: 'Masjidil Haram', color: 'bg-emerald-100 text-emerald-700' },
  MASJID_NABAWI: { label: 'Masjid Nabawi', color: 'bg-green-100 text-green-700' },
  ARAFAH: { label: 'Arafah', color: 'bg-amber-100 text-amber-700' },
  MINA: { label: 'Mina', color: 'bg-orange-100 text-orange-700' },
  MUZDALIFAH: { label: 'Muzdalifah', color: 'bg-purple-100 text-purple-700' }
}

export default function IbadahPage() {
  const [contents, setContents] = useState<IbadahContent[]>([])
  const [loading, setLoading] = useState(true)
  const [userName, setUserName] = useState('')
  const [activeCategory, setActiveCategory] = useState('TAWAF')
  const [selectedContent, setSelectedContent] = useState<IbadahContent | null>(null)
  const [bookmarks, setBookmarks] = useState<string[]>([])
  const [showBookmarks, setShowBookmarks] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [readMode, setReadMode] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)
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

    // Load bookmarks from localStorage
    const saved = localStorage.getItem('ibadah-bookmarks')
    if (saved) setBookmarks(JSON.parse(saved))

    fetchContents()
  }, [router])

  const fetchContents = async () => {
    try {
      const res = await fetch('/api/jamaah/ibadah')
      const data = await res.json()
      if (Array.isArray(data)) {
        setContents(data)
      } else {
        setContents([])
      }
    } catch (error) {
      setContents([])
    } finally {
      setLoading(false)
    }
  }

  const toggleBookmark = (id: string) => {
    const newBookmarks = bookmarks.includes(id) 
      ? bookmarks.filter(b => b !== id)
      : [...bookmarks, id]
    setBookmarks(newBookmarks)
    localStorage.setItem('ibadah-bookmarks', JSON.stringify(newBookmarks))
  }

  const playAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const filteredContents = showBookmarks 
    ? contents.filter(c => bookmarks.includes(c.id))
    : contents.filter(c => c.category === activeCategory)

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
          <h1 className="text-2xl font-bold text-navy-900">Panduan Ibadah</h1>
          <p className="text-navy-500">Doa dan panduan ibadah di Tanah Suci</p>
        </div>

        {/* Bookmark Toggle */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setShowBookmarks(false)}
            className={`flex-1 py-2 px-4 rounded-xl text-sm font-medium transition-colors ${!showBookmarks ? 'bg-gold-500 text-navy-900' : 'bg-white text-navy-600 border border-navy-200'}`}
          >
            Semua Doa
          </button>
          <button
            onClick={() => setShowBookmarks(true)}
            className={`flex-1 py-2 px-4 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2 ${showBookmarks ? 'bg-gold-500 text-navy-900' : 'bg-white text-navy-600 border border-navy-200'}`}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
            Tersimpan ({bookmarks.length})
          </button>
        </div>

        {/* Category Tabs */}
        {!showBookmarks && (
          <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap transition-colors ${
                  activeCategory === cat.id 
                    ? 'bg-navy-900 text-white' 
                    : 'bg-white text-navy-600 border border-navy-200 hover:bg-navy-50'
                }`}
              >
                <span>{cat.icon}</span>
                <span className="text-sm font-medium">{cat.label}</span>
              </button>
            ))}
          </div>
        )}

        {/* Content List */}
        {filteredContents.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-navy-100">
            <div className="w-16 h-16 bg-navy-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🤲</span>
            </div>
            <h3 className="text-navy-900 font-semibold mb-2">
              {showBookmarks ? 'Belum ada doa tersimpan' : 'Belum ada konten'}
            </h3>
            <p className="text-navy-500 text-sm">
              {showBookmarks ? 'Simpan doa favorit Anda untuk akses cepat' : 'Konten akan segera ditambahkan'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredContents.map((content) => (
              <div
                key={content.id}
                className="bg-white rounded-2xl border border-navy-100 overflow-hidden"
              >
                <button
                  onClick={() => setSelectedContent(selectedContent?.id === content.id ? null : content)}
                  className="w-full p-4 text-left"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-1 rounded-lg text-xs font-medium ${locations[content.location]?.color || 'bg-gray-100'}`}>
                          {locations[content.location]?.label || content.location}
                        </span>
                        {content.audioPath && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-medium flex items-center gap-1">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                            </svg>
                            Audio
                          </span>
                        )}
                      </div>
                      <h3 className="font-semibold text-navy-900">{content.title}</h3>
                      {content.description && (
                        <p className="text-sm text-navy-500 mt-1 line-clamp-2">{content.description}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleBookmark(content.id) }}
                        className={`p-2 rounded-lg transition-colors ${bookmarks.includes(content.id) ? 'text-gold-500' : 'text-navy-300 hover:text-navy-500'}`}
                      >
                        <svg className="w-5 h-5" fill={bookmarks.includes(content.id) ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                        </svg>
                      </button>
                      <svg className={`w-5 h-5 text-navy-400 transition-transform ${selectedContent?.id === content.id ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </button>

                {/* Expanded Content */}
                {selectedContent?.id === content.id && (
                  <div className="px-4 pb-4 border-t border-navy-100 pt-4">
                    {/* Read Mode Toggle */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm text-navy-500">Mode Baca</span>
                      <button
                        onClick={() => setReadMode(!readMode)}
                        className={`relative w-12 h-6 rounded-full transition-colors ${readMode ? 'bg-gold-500' : 'bg-navy-200'}`}
                      >
                        <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${readMode ? 'left-7' : 'left-1'}`} />
                      </button>
                    </div>

                    {/* Arabic Text */}
                    {content.arabicText && (
                      <div className={`mb-4 p-4 bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl border border-emerald-100 ${readMode ? 'text-3xl' : 'text-2xl'}`}>
                        <p className="text-right font-arabic leading-loose text-emerald-900" dir="rtl">
                          {content.arabicText}
                        </p>
                      </div>
                    )}

                    {/* Latin Text */}
                    {content.latinText && (
                      <div className="mb-4">
                        <p className="text-sm font-medium text-navy-400 mb-1">Bacaan Latin</p>
                        <p className={`text-navy-700 italic ${readMode ? 'text-lg' : 'text-base'}`}>{content.latinText}</p>
                      </div>
                    )}

                    {/* Translation */}
                    {content.translation && (
                      <div className="mb-4">
                        <p className="text-sm font-medium text-navy-400 mb-1">Arti</p>
                        <p className={`text-navy-600 ${readMode ? 'text-lg' : 'text-base'}`}>{content.translation}</p>
                      </div>
                    )}

                    {/* Audio Player */}
                    {content.audioPath && (
                      <div className="bg-gradient-to-br from-navy-50 to-slate-100 rounded-xl p-4 border border-navy-100">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 bg-gold-100 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-gold-600" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-navy-900">Audio Bacaan</p>
                            <p className="text-xs text-navy-500">Dengarkan pelafalan yang benar</p>
                          </div>
                        </div>
                        <audio
                          ref={audioRef}
                          src={content.audioPath}
                          controls
                          onPlay={() => setIsPlaying(true)}
                          onPause={() => setIsPlaying(false)}
                          onEnded={() => setIsPlaying(false)}
                          className="w-full h-10 rounded-lg"
                          style={{ outline: 'none' }}
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
