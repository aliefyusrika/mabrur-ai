import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '')
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const user = await prisma.user.findUnique({
      where: { token },
      include: { jamaah: true }
    })

    if (!user || !user.jamaah) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // Verify ownership
    const memory = await prisma.journeyMemory.findUnique({ where: { id: params.id } })
    if (!memory || memory.jamaahId !== user.jamaah.id) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    await prisma.journeyMemory.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 })
  }
}
