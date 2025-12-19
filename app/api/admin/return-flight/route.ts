import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const flights = await prisma.returnFlight.findMany({
      orderBy: { returnDate: 'asc' }
    })
    return NextResponse.json(flights)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch return flights' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const flight = await prisma.returnFlight.create({
      data: {
        flightNumber: body.flightNumber,
        airline: body.airline,
        returnDate: new Date(body.returnDate),
        departureTime: body.departureTime,
        arrivalTime: body.arrivalTime || null,
        origin: body.origin || 'JED - Jeddah',
        destination: body.destination || 'CGK - Jakarta',
        terminal: body.terminal || null,
        gate: body.gate || null,
        status: body.status || 'ON_TIME',
        delayMinutes: body.delayMinutes || null,
        notes: body.notes || null,
        isActive: true
      }
    })
    return NextResponse.json(flight)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create return flight' }, { status: 500 })
  }
}
