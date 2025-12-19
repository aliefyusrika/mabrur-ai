import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json()

    if (!token) {
      return NextResponse.json({ error: 'Token required' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { token },
      include: { jamaah: true }
    })

    if (!user || user.role !== 'JAMAAH') {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    return NextResponse.json({ valid: true })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
