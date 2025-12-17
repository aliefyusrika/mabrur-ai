import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth'

export async function GET() {
  try {
    const session = await getSession()
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const contents = await prisma.chatbotContent.findMany({
      orderBy: { createdAt: 'desc' }
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

    const { type, question, answer, keywords } = await req.json()

    if (!type || !question || !answer) {
      return NextResponse.json({ error: 'Data tidak lengkap' }, { status: 400 })
    }

    const content = await prisma.chatbotContent.create({
      data: {
        type,
        question,
        answer,
        keywords,
      }
    })

    return NextResponse.json(content)
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
