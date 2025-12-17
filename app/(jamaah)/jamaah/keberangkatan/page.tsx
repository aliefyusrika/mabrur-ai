'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import JamaahNavbar from '@/components/JamaahNavbar'

interface Departure {
  id: string
  flightNumber: string
  airline: string
  departureDate: string
  departureTime: string
  arrivalTime: string | null
  origin: string
  destination: string
  terminal: string | null
  gate: string | null
  status: string
  delayMinutes: number | null
  notes: string | null
}

interface Notification {
  id: string
  type: string
  title: string
  message: string
  priority: string
}

const statusConfig: Record<string, { label: string; color: string; bgColor: string; icon: JSX.Element }> = {
  ON_TIME: { 
    label: 'Tepat Waktu', 
    color: 'text-green-700', 
    bgColor: 'bg-green-50 border-green-200',
    icon: <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
  },
  DELAYED: { 
    label: 'Tertunda', 
    color: 'text-yellow-700', 
    bgColor: 'bg-yellow-50 border-yellow-200',
    icon: <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
  },
  BOARDING: { 
    label: 'Boarding', 
    color: 'text-blue-700', 
    bgColor: 'bg-blue-50 border-blue-200',
    icon: <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
  },
  DEPARTED: { 
    label: 'Berangkat', 
    color: 'text-navy-700', 
    bgColor: 'bg-navy-50 border-navy-200',
    icon: <svg className="w-5 h-5 text-navy-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3l14 9-14 9V3z" /></svg>
  },
  CANCELLED: { 
    label: 'Dibatalkan', 
    color: 'text-red-700', 
    bgColor: 'bg-red-50 border-red-200',
    icon: <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
  }
}

export default function KeberangkatanPage() {
  const [departures, setDepartures] = useState<Departure[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [userName, setUserName] = useState('')
  const [dismissedNotifs, setDismissedNotifs] = useState<string[]>([])
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

    fetchData()
  }, [router])

  const fetchData = async () => {
    const res = await fetch('/api/jamaah/departure')
    const data = await res.json()
    setDepartures(data.departures || [])
    setNotifications(data.notifications || [])
    setLoading(false)
  }

  const dismissNotif = (id: string) => {
    setDismissedNotifs([...dismissedNotifs, id])
  }

  const activeNotifs = notifications.filter(n => !dismissedNotifs.includes(n.id))
  const urgentNotifs = activeNotifs.filter(n => n.priority === 'URGENT' || n.priority === 'HIGH')

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('id-ID', { 
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' 
    })
  }

  const getDaysUntil = (dateStr: string) => {
    const diff = Math.ceil((new Date(dateStr).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    if (diff < 0) return 'Sudah lewat'
    if (diff === 0) return 'Hari ini!'
    if (diff === 1) return 'Besok'
    return `${diff} hari lagi`
  }

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
        {/* Urgent Notifications Banner */}
        {urgentNotifs.length > 0 && (
          <div className="mb-6 space-y-3">
            {urgentNotifs.map((notif) => (
              <div key={notif.id} className={`p-4 rounded-2xl border ${notif.priority === 'URGENT' ? 'bg-red-50 border-red-200' : 'bg-yellow-50 border-yellow-200'}`}>
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-full ${notif.priority === 'URGENT' ? 'bg-red-100' : 'bg-yellow-100'}`}>
                    <svg className={`w-5 h-5 ${notif.priority === 'URGENT' ? 'text-red-600' : 'text-yellow-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-semibold ${notif.priority === 'URGENT' ? 'text-red-800' : 'text-yellow-800'}`}>{notif.title}</h4>
                    <p className={`text-sm mt-1 ${notif.priority === 'URGENT' ? 'text-red-700' : 'text-yellow-700'}`}>{notif.message}</p>
                  </div>
                  <button onClick={() => dismissNotif(notif.id)} className="text-gray-400 hover:text-gray-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-navy-900">Keberangkatan</h1>
          <p className="text-navy-500">Informasi jadwal penerbangan Anda</p>
        </div>

        {/* Boarding Reminder Card */}
        {departures.some(d => d.status === 'BOARDING') && (
          <div className="mb-6 p-5 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl text-white">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-white/20 rounded-full">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-lg">Boarding Sekarang!</h3>
                <p className="text-blue-100 text-sm">Segera menuju gate keberangkatan</p>
              </div>
            </div>
          </div>
        )}

        {/* Departure Cards */}
        {departures.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-navy-100">
            <div className="w-16 h-16 bg-navy-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-navy-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3l14 9-14 9V3z" />
              </svg>
            </div>
            <h3 className="text-navy-900 font-semibold mb-2">Belum ada jadwal</h3>
            <p className="text-navy-500 text-sm">Jadwal keberangkatan akan ditampilkan di sini</p>
          </div>
        ) : (
          <div className="space-y-4">
            {departures.map((dep) => {
              const config = statusConfig[dep.status] || statusConfig.ON_TIME
              const daysUntil = getDaysUntil(dep.departureDate)
              const isToday = daysUntil === 'Hari ini!'
              
              return (
                <div key={dep.id} className={`bg-white rounded-2xl border overflow-hidden ${isToday ? 'border-gold-300 ring-2 ring-gold-100' : 'border-navy-100'}`}>
                  {/* Status Banner */}
                  <div className={`px-5 py-3 ${config.bgColor} border-b flex items-center justify-between`}>
                    <div className="flex items-center gap-2">
                      {config.icon}
                      <span className={`font-medium ${config.color}`}>
                        {config.label}
                        {dep.status === 'DELAYED' && dep.delayMinutes && ` (+${dep.delayMinutes} menit)`}
                      </span>
                    </div>
                    <span className={`text-sm font-medium ${isToday ? 'text-gold-600' : 'text-navy-500'}`}>{daysUntil}</span>
                  </div>
                  
                  {/* Flight Info */}
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-2xl font-bold text-navy-900">{dep.flightNumber}</p>
                        <p className="text-navy-500">{dep.airline}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-navy-500">Tanggal</p>
                        <p className="font-medium text-navy-700">{formatDate(dep.departureDate)}</p>
                      </div>
                    </div>
                    
                    {/* Route */}
                    <div className="flex items-center gap-4 py-4 border-t border-b border-navy-100">
                      <div className="flex-1">
                        <p className="text-xs text-navy-400 mb-1">Keberangkatan</p>
                        <p className="font-bold text-navy-900 text-lg">{dep.departureTime}</p>
                        <p className="text-sm text-navy-600">{dep.origin}</p>
                      </div>
                      <div className="flex flex-col items-center">
                        <svg className="w-6 h-6 text-gold-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </div>
                      <div className="flex-1 text-right">
                        <p className="text-xs text-navy-400 mb-1">Kedatangan</p>
                        <p className="font-bold text-navy-900 text-lg">{dep.arrivalTime || '-'}</p>
                        <p className="text-sm text-navy-600">{dep.destination}</p>
                      </div>
                    </div>
                    
                    {/* Terminal & Gate */}
                    {(dep.terminal || dep.gate) && (
                      <div className="flex gap-6 mt-4">
                        {dep.terminal && (
                          <div className="flex-1 bg-navy-50 rounded-xl p-3 text-center">
                            <p className="text-xs text-navy-400">Terminal</p>
                            <p className="text-xl font-bold text-navy-900">{dep.terminal}</p>
                          </div>
                        )}
                        {dep.gate && (
                          <div className="flex-1 bg-navy-50 rounded-xl p-3 text-center">
                            <p className="text-xs text-navy-400">Gate</p>
                            <p className="text-xl font-bold text-navy-900">{dep.gate}</p>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* Notes */}
                    {dep.notes && (
                      <div className="mt-4 p-3 bg-gold-50 rounded-xl border border-gold-200">
                        <div className="flex items-start gap-2">
                          <svg className="w-5 h-5 text-gold-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <p className="text-sm text-gold-800">{dep.notes}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Other Notifications */}
        {activeNotifs.filter(n => n.priority !== 'URGENT' && n.priority !== 'HIGH').length > 0 && (
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-navy-900 mb-4">Pengumuman</h2>
            <div className="space-y-3">
              {activeNotifs.filter(n => n.priority !== 'URGENT' && n.priority !== 'HIGH').map((notif) => (
                <div key={notif.id} className="bg-white p-4 rounded-xl border border-navy-100">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium text-navy-900">{notif.title}</h4>
                      <p className="text-sm text-navy-500 mt-1">{notif.message}</p>
                    </div>
                    <button onClick={() => dismissNotif(notif.id)} className="text-navy-300 hover:text-navy-500">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
