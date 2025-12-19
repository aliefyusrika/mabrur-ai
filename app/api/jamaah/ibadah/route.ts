import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const contents = await prisma.ibadahContent.findMany({
      where: { isActive: true },
      orderBy: [{ category: 'asc' }, { orderIndex: 'asc' }]
    })
    return NextResponse.json(contents)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch ibadah content' }, { status: 500 })
  }
}
