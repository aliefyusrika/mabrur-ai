import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const flight = await prisma.returnFlight.update({
      where: { id: params.id },
      data: {
        flightNumber: body.flightNumber,
        airline: body.airline,
        returnDate: new Date(body.returnDate),
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
    return NextResponse.json(flight)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.returnFlight.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 })
  }
}
