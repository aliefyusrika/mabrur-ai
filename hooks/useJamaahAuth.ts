'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface JamaahData {
  name: string
  status?: {
    payment: string
    visa: string
    ticket: string
    hotel: string
    transport: string
    equipment: string
    manasik: string
  }
}

export function useJamaahAuth() {
  const [data, setData] = useState<JamaahData | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('jamaah-token')
    
    if (!token) {
      setLoading(false)
      setIsAuthenticated(false)
      router.push('/jamaah')
      return
    }

    fetch('/api/jamaah/status', {
      headers: { 'x-jamaah-token': token }
    })
      .then(res => {
        if (!res.ok) throw new Error('Unauthorized')
        return res.json()
      })
      .then(data => {
        setData(data)
        setIsAuthenticated(true)
      })
      .catch(() => {
        localStorage.removeItem('jamaah-token')
        setIsAuthenticated(false)
        router.push('/jamaah')
      })
      .finally(() => setLoading(false))
  }, [router])

  return { data, loading, isAuthenticated }
}

export function checkJamaahToken(): boolean {
  if (typeof window === 'undefined') return false
  return !!localStorage.getItem('jamaah-token')
}
