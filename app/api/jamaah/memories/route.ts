import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '')
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const user = await prisma.user.findUnique({
      where: { token },
      include: { jamaah: true }
    })

    if (!user || !user.jamaah) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const memories = await prisma.journeyMemory.findMany({
      where: { jamaahId: user.jamaah.id },
      orderBy: { memoryDate: 'desc' }
    })

    return NextResponse.json(memories)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch memories' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '')
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const user = await prisma.user.findUnique({
      where: { token },
      include: { jamaah: true }
    })

    if (!user || !user.jamaah) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const memory = await prisma.journeyMemory.create({
      data: {
        jamaahId: user.jamaah.id,
        title: body.title,
        content: body.content,
        imageUrl: body.imageUrl || null,
        location: body.location || null,
        memoryDate: body.memoryDate ? new Date(body.memoryDate) : new Date()
      }
    })

    return NextResponse.json(memory)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create memory' }, { status: 500 })
  }
}
