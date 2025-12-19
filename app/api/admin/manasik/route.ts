import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth'

export async function GET() {
  try {
    const session = await getSession()
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const contents = await prisma.manasikContent.findMany({
      orderBy: [{ type: 'asc' }, { orderIndex: 'asc' }]
    })

    return NextResponse.json(contents)
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

    const { type, title, content, videoUrl, orderIndex } = await req.json()

    if (!type || !title || !content) {
      return NextResponse.json({ error: 'Data tidak lengkap' }, { status: 400 })
    }

    const manasik = await prisma.manasikContent.create({
      data: { type, title, content, videoUrl, orderIndex: orderIndex || 0 }
    })

    return NextResponse.json(manasik)
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
