import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth'

export async function GET() {
  try {
    const session = await getSession()
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const total = await prisma.jamaah.count()

    const statuses = await prisma.jamaahStatus.findMany()

    let completed = 0
    let inProgress = 0
    let notStarted = 0

    for (const status of statuses) {
      const values = [
        status.payment,
        status.visa,
        status.ticket,
        status.hotel,
        status.transport,
        status.equipment,
        status.manasik,
      ]

      if (values.every(v => v === 'COMPLETED')) {
        completed++
      } else if (values.some(v => v === 'IN_PROGRESS' || v === 'COMPLETED')) {
        inProgress++
      } else {
        notStarted++
      }
    }

    // Count jamaah without status as not started
    notStarted += total - statuses.length

    return NextResponse.json({ total, completed, inProgress, notStarted })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
