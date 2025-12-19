import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get('x-jamaah-token')
    if (!token) {
      return NextResponse.json({ error: 'Token required' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({ where: { token } })
    if (!user || user.role !== 'JAMAAH') {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const contents = await prisma.manasikContent.findMany({
      where: { isActive: true },
      orderBy: [{ type: 'asc' }, { orderIndex: 'asc' }]
    })

    return NextResponse.json(contents)
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
