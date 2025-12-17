import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const departures = await prisma.departure.findMany({
      orderBy: { departureDate: 'asc' }
    })
    return NextResponse.json(departures)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch departures' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const departure = await prisma.departure.create({
      data: {
        flightNumber: body.flightNumber,
        airline: body.airline,
        departureDate: new Date(body.departureDate),
        departureTime: body.departureTime,
        arrivalTime: body.arrivalTime || null,
        origin: body.origin,
        destination: body.destination,
        terminal: body.terminal || null,
        gate: body.gate || null,
        status: body.status || 'ON_TIME',
        delayMinutes: body.delayMinutes || null,
        notes: body.notes || null,
        isActive: true
      }
    })
    return NextResponse.json(departure)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create departure' }, { status: 500 })
  }
}
