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

    const testimonial = await prisma.testimonial.findFirst({
      where: { jamaahId: user.jamaah.id }
    })

    return NextResponse.json(testimonial)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch testimonial' }, { status: 500 })
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
    
    // Check if already submitted
    const existing = await prisma.testimonial.findFirst({
      where: { jamaahId: user.jamaah.id }
    })

    if (existing) {
      // Update existing
      const testimonial = await prisma.testimonial.update({
        where: { id: existing.id },
        data: {
          rating: body.rating,
          content: body.content,
          packageType: body.packageType || null,
          travelDate: body.travelDate || null
        }
      })
      return NextResponse.json(testimonial)
    }

    const testimonial = await prisma.testimonial.create({
      data: {
        jamaahId: user.jamaah.id,
        jamaahName: user.name,
        rating: body.rating,
        content: body.content,
        packageType: body.packageType || null,
        travelDate: body.travelDate || null,
        isApproved: false,
        isPublic: true
      }
    })

    return NextResponse.json(testimonial)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to submit testimonial' }, { status: 500 })
  }
}
