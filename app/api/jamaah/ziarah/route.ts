import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

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
  latitude: any
  longitude: any
  placeId: string | null
  address: string | null
  orderIndex: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export async function GET() {
  try {
    const locations = await prisma.ziarahLocation.findMany({
      where: { isActive: true },
      orderBy: [{ city: 'asc' }, { orderIndex: 'asc' }]
    })
    // Convert Decimal to number for JSON serialization
    const serialized = locations.map((loc: ZiarahLocation) => ({
      ...loc,
      latitude: loc.latitude ? Number(loc.latitude) : null,
      longitude: loc.longitude ? Number(loc.longitude) : null
    }))
    return NextResponse.json(serialized)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch ziarah locations' }, { status: 500 })
  }
}
