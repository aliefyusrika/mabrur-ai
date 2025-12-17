import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const contents = await prisma.ibadahContent.findMany({
      orderBy: [{ category: 'asc' }, { orderIndex: 'asc' }]
    })
    return NextResponse.json(contents)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch ibadah content' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const content = await prisma.ibadahContent.create({
      data: {
        category: body.category,
        location: body.location,
        title: body.title,
        arabicText: body.arabicText || null,
        latinText: body.latinText || null,
        translation: body.translation || null,
        audioPath: body.audioPath || null,
        description: body.description || null,
        orderIndex: body.orderIndex || 0,
        isActive: true
      }
    })
    return NextResponse.json(content)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create ibadah content' }, { status: 500 })
  }
}
