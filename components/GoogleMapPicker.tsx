'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

interface GoogleMapPickerProps {
  latitude?: number | null
  longitude?: number | null
  onLocationSelect: (location: {
    latitude: number
    longitude: number
    placeId?: string
    address?: string
  }) => void
  city?: 'MAKKAH' | 'MADINAH'
}

// Default centers for Makkah and Madinah
const cityDefaults = {
  MAKKAH: { lat: 21.4225, lng: 39.8262 },
  MADINAH: { lat: 24.4672, lng: 39.6024 }
}

declare global {
  interface Window {
    google: any
    initGoogleMaps: () => void
  }
}

export default function GoogleMapPicker({ latitude, longitude, onLocationSelect, city = 'MAKKAH' }: GoogleMapPickerProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)
  const [map, setMap] = useState<any>(null)
  const [marker, setMarker] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const defaultCenter = cityDefaults[city]
  const initialCenter = latitude && longitude 
    ? { lat: latitude, lng: longitude }
    : defaultCenter

  const updateMarker = useCallback((position: any, map: any, existingMarker: any) => {
    if (existingMarker) {
      existingMarker.setPosition(position)
      return existingMarker
    }
    
    const newMarker = new window.google.maps.Marker({
      position,
      map,
      draggable: true,
      animation: window.google.maps.Animation.DROP
    })

    newMarker.addListener('dragend', () => {
      const pos = newMarker.getPosition()
      if (pos) {
        reverseGeocode(pos.lat(), pos.lng())
      }
    })

    return newMarker
  }, [])

  const reverseGeocode = useCallback((lat: number, lng: number) => {
    const geocoder = new window.google.maps.Geocoder()
    geocoder.geocode({ location: { lat, lng } }, (results: any, status: any) => {
      if (status === 'OK' && results?.[0]) {
        onLocationSelect({
          latitude: lat,
          longitude: lng,
          placeId: results[0].place_id,
          address: results[0].formatted_address
        })
      } else {
        onLocationSelect({ latitude: lat, longitude: lng })
      }
    })
  }, [onLocationSelect])

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

    if (!apiKey) {
      setError('Google Maps API key not configured')
      setLoading(false)
      return
    }

    // Check if already loaded
    if (window.google?.maps) {
      initMap()
      return
    }

    // Load Google Maps script
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initGoogleMaps`
    script.async = true
    script.defer = true

    window.initGoogleMaps = () => {
      initMap()
    }

    script.onerror = () => {
      setError('Failed to load Google Maps')
      setLoading(false)
    }

    document.head.appendChild(script)

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script)
      }
    }
  }, [])

  const initMap = () => {
    if (!mapRef.current || !window.google) return

    const mapInstance = new window.google.maps.Map(mapRef.current, {
      center: initialCenter,
      zoom: 15,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false
    })

    setMap(mapInstance)

    // Add initial marker if coordinates exist
    if (latitude && longitude) {
      const pos = new window.google.maps.LatLng(latitude, longitude)
      const newMarker = updateMarker(pos, mapInstance, null)
      setMarker(newMarker)
    }

    // Click to place marker
    mapInstance.addListener('click', (e: any) => {
      if (e.latLng) {
        const newMarker = updateMarker(e.latLng, mapInstance, marker)
        setMarker(newMarker)
        reverseGeocode(e.latLng.lat(), e.latLng.lng())
      }
    })

    // Setup autocomplete
    if (searchRef.current) {
      const autocomplete = new window.google.maps.places.Autocomplete(searchRef.current, {
        types: ['establishment', 'geocode'],
        componentRestrictions: { country: 'sa' }
      })

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace()
        if (place.geometry?.location) {
          const pos = place.geometry.location
          mapInstance.setCenter(pos)
          mapInstance.setZoom(17)
          
          const newMarker = updateMarker(pos, mapInstance, marker)
          setMarker(newMarker)

          onLocationSelect({
            latitude: pos.lat(),
            longitude: pos.lng(),
            placeId: place.place_id,
            address: place.formatted_address
          })
        }
      })
    }

    setLoading(false)
  }

  // Update marker when props change
  useEffect(() => {
    if (map && latitude && longitude) {
      const pos = new window.google.maps.LatLng(latitude, longitude)
      map.setCenter(pos)
      const newMarker = updateMarker(pos, map, marker)
      setMarker(newMarker)
    }
  }, [latitude, longitude, map])

  if (error) {
    return (
      <div className="h-[280px] bg-gray-100 rounded-xl flex items-center justify-center border border-gray-200">
        <div className="text-center text-gray-500">
          <svg className="w-12 h-12 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {/* Search Input */}
      <div className="relative">
        <input
          ref={searchRef}
          type="text"
          placeholder="Cari lokasi..."
          className="w-full px-4 py-2 pl-10 border border-navy-200 rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-transparent"
        />
        <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      {/* Map Container */}
      <div className="relative">
        {loading && (
          <div className="absolute inset-0 bg-gray-100 rounded-xl flex items-center justify-center z-10">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-gold-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <p className="text-sm text-gray-500">Memuat peta...</p>
            </div>
          </div>
        )}
        <div 
          ref={mapRef} 
          className="h-[280px] rounded-xl border border-gray-200"
          style={{ minHeight: '280px' }}
        />
      </div>

      <p className="text-xs text-gray-500">
        Klik pada peta atau cari lokasi untuk menentukan posisi
      </p>
    </div>
  )
}

