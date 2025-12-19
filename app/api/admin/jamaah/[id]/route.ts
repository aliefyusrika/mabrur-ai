import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const jamaah = await prisma.jamaah.findUnique({
      where: { id: params.id },
      include: {
        user: { select: { name: true, token: true } },
        status: true,
      }
    })

    if (!jamaah) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    return NextResponse.json(jamaah)
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { name, phone, passportNo } = await req.json()

    const jamaah = await prisma.jamaah.update({
      where: { id: params.id },
      data: {
        phone,
        passportNo,
        user: name ? { update: { name } } : undefined,
      },
      include: { user: { select: { name: true } } }
    })

    return NextResponse.json(jamaah)
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const jamaah = await prisma.jamaah.findUnique({
      where: { id: params.id },
      select: { userId: true }
    })

    if (jamaah) {
      await prisma.user.delete({ where: { id: jamaah.userId } })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
