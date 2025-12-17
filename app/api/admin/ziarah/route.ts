import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const locations = await prisma.ziarahLocation.findMany({
      orderBy: [{ city: 'asc' }, { orderIndex: 'asc' }]
    })
    // Convert Decimal to number for JSON serialization
    const serialized = locations.map(loc => ({
      ...loc,
      latitude: loc.latitude ? Number(loc.latitude) : null,
      longitude: loc.longitude ? Number(loc.longitude) : null
    }))
    return NextResponse.json(serialized)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch ziarah locations' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const location = await prisma.ziarahLocation.create({
      data: {
        city: body.city,
        name: body.name,
        arabicName: body.arabicName || null,
        description: body.description,
        history: body.history || null,
        virtues: body.virtues || null,
        practices: body.practices || null,
        imagePath: body.imagePath || null,
        latitude: body.latitude ? parseFloat(body.latitude) : null,
        longitude: body.longitude ? parseFloat(body.longitude) : null,
        placeId: body.placeId || null,
        address: body.address || null,
        orderIndex: body.orderIndex || 0,
        isActive: true
      }
    })
    return NextResponse.json({
      ...location,
      latitude: location.latitude ? Number(location.latitude) : null,
      longitude: location.longitude ? Number(location.longitude) : null
    })
  } catch (error) {
    console.error('Create error:', error)
    return NextResponse.json({ error: 'Failed to create ziarah location' }, { status: 500 })
  }
}
