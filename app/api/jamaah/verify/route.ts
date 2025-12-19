import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json(
        { error: 'Token required' },
        { status: 400 }
      )
    }

    const prisma = new PrismaClient()

    const user = await prisma.user.findUnique({
      where: { token },
      include: {
        jamaah: {
          include: {
            status: true
          }
        }
      }
    })

    await prisma.$disconnect()

    if (!user || user.role !== 'JAMAAH') {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        token: user.token
      },
      jamaah: user.jamaah,
      status: user.jamaah?.status
    })
  } catch (error) {
    console.error('Verify error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
