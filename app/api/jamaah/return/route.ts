import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { token },
      include: { jamaah: true }
    })

    if (!user || !user.jamaah) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const flights = await prisma.returnFlight.findMany({
      where: { isActive: true },
      orderBy: { returnDate: 'asc' }
    })

    const memories = await prisma.journeyMemory.findMany({
      where: { jamaahId: user.jamaah.id },
      orderBy: { memoryDate: 'desc' }
    })

    return NextResponse.json({ flights, memories })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 })
  }
}
