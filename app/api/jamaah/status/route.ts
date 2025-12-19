import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get('x-jamaah-token')

    if (!token) {
      return NextResponse.json({ error: 'Token required' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { token },
      include: {
        jamaah: {
          include: { status: true }
        }
      }
    })

    if (!user || user.role !== 'JAMAAH' || !user.jamaah) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const status = user.jamaah.status || {
      payment: 'NOT_STARTED',
      visa: 'NOT_STARTED',
      ticket: 'NOT_STARTED',
      hotel: 'NOT_STARTED',
      transport: 'NOT_STARTED',
      equipment: 'NOT_STARTED',
      manasik: 'NOT_STARTED',
    }

    return NextResponse.json({
      name: user.name,
      status: {
        payment: status.payment,
        visa: status.visa,
        ticket: status.ticket,
        hotel: status.hotel,
        transport: status.transport,
        equipment: status.equipment,
        manasik: status.manasik,
      }
    })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
