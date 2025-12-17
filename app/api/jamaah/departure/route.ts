import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const departures = await prisma.departure.findMany({
      where: { isActive: true },
      orderBy: { departureDate: 'asc' }
    })
    
    const notifications = await prisma.notification.findMany({
      where: { 
        isActive: true,
        OR: [
          { expiresAt: null },
          { expiresAt: { gte: new Date() } }
        ]
      },
      orderBy: [
        { priority: 'desc' },
        { createdAt: 'desc' }
      ]
    })
    
    return NextResponse.json({ departures, notifications })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch departure info' }, { status: 500 })
  }
}
