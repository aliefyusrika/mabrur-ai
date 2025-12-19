import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const departure = await prisma.departure.findUnique({
      where: { id: params.id }
    })
    if (!departure) {
      return NextResponse.json({ error: 'Departure not found' }, { status: 404 })
    }
    return NextResponse.json(departure)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch departure' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const departure = await prisma.departure.update({
      where: { id: params.id },
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
        status: body.status,
        delayMinutes: body.delayMinutes || null,
        notes: body.notes || null,
        isActive: body.isActive
      }
    })
    return NextResponse.json(departure)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update departure' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.departure.delete({
      where: { id: params.id }
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete departure' }, { status: 500 })
  }
}
