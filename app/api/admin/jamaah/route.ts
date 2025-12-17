import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth'
import { nanoid } from '@/lib/nanoid'

function generateToken() {
  return nanoid(8)
}

export async function GET() {
  try {
    const session = await getSession()
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const jamaahList = await prisma.jamaah.findMany({
      include: {
        user: { select: { name: true, token: true } },
        status: true,
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(jamaahList)
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { name, phone, passportNo } = await req.json()

    if (!name) {
      return NextResponse.json({ error: 'Nama diperlukan' }, { status: 400 })
    }

    const token = generateToken()

    const user = await prisma.user.create({
      data: {
        name,
        role: 'JAMAAH',
        token,
        jamaah: {
          create: {
            phone,
            passportNo,
            status: {
              create: {}
            }
          }
        }
      },
      include: { jamaah: true }
    })

    return NextResponse.json({ id: user.jamaah?.id, token })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
