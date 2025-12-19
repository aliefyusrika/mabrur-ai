import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth'

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const updates = await req.json()

    // Validate status values
    const validStatuses = ['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED']
    for (const value of Object.values(updates)) {
      if (!validStatuses.includes(value as string)) {
        return NextResponse.json({ error: 'Invalid status value' }, { status: 400 })
      }
    }

    const jamaah = await prisma.jamaah.findUnique({
      where: { id: params.id },
      include: { status: true }
    })

    if (!jamaah) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    let status
    if (jamaah.status) {
      status = await prisma.jamaahStatus.update({
        where: { jamaahId: params.id },
        data: updates,
      })
    } else {
      status = await prisma.jamaahStatus.create({
        data: {
          jamaahId: params.id,
          ...updates,
        }
      })
    }

    return NextResponse.json(status)
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
