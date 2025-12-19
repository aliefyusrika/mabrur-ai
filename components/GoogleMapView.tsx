'use client'

import { useEffect, useRef, useState } from 'react'

interface GoogleMapViewProps {
  latitude: number
  longitude: number
  name: string
}

declare global {
  interface Window {
    google: any
    initGoogleMapsView: () => void
  }
}

export default function GoogleMapView({ latitude, longitude, name }: GoogleMapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

    if (!apiKey) {
      setError('Google Maps tidak tersedia')
      setLoading(false)
      return
    }

    // Check if already loaded
    if (window.google?.maps) {
      initMap()
      return
    }

    // Load Google Maps script
    const existingScript = document.querySelector('script[src*="maps.googleapis.com"]')
    if (existingScript) {
      // Wait for existing script to load
      const checkGoogle = setInterval(() => {
        if (window.google?.maps) {
          clearInterval(checkGoogle)
          initMap()
        }
      }, 100)
      return () => clearInterval(checkGoogle)
    }

    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initGoogleMapsView`
    script.async = true
    script.defer = true

    window.initGoogleMapsView = () => {
      initMap()
    }

    script.onerror = () => {
      setError('Gagal memuat peta')
      setLoading(false)
    }

    document.head.appendChild(script)
  }, [latitude, longitude])

  const initMap = () => {
    if (!mapRef.current || !window.google) return

    const position = { lat: latitude, lng: longitude }

    const map = new window.google.maps.Map(mapRef.current, {
      center: position,
      zoom: 16,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      zoomControl: true
    })

    new window.google.maps.Marker({
      position,
      map,
      title: name
    })

    setLoading(false)
  }

  const openInGoogleMaps = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`
    window.open(url, '_blank')
  }

  if (error) {
    return (
      <div className="h-48 bg-gray-100 rounded-xl flex items-center justify-center">
        <p className="text-sm text-gray-500">{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <div className="relative">
        {loading && (
          <div className="absolute inset-0 bg-gray-100 rounded-xl flex items-center justify-center z-10">
            <div className="w-6 h-6 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        <div ref={mapRef} className="h-48 rounded-xl border border-gray-200" />
      </div>
      <button
        onClick={openInGoogleMaps}
        className="w-full py-2 px-4 bg-blue-500 text-white rounded-xl text-sm font-medium flex items-center justify-center gap-2 hover:bg-blue-600 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
        Buka di Google Maps
      </button>
    </div>
  )
}

