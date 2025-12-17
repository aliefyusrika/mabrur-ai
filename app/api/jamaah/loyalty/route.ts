import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { nanoid } from '@/lib/nanoid'

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '')
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const user = await prisma.user.findUnique({
      where: { token },
      include: { jamaah: true }
    })

    if (!user || !user.jamaah) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    let loyalty = await prisma.loyaltyPoints.findUnique({
      where: { jamaahId: user.jamaah.id }
    })

    // Create loyalty record if not exists
    if (!loyalty) {
      loyalty = await prisma.loyaltyPoints.create({
        data: {
          jamaahId: user.jamaah.id,
          points: 100, // Welcome bonus
          tier: 'BRONZE',
          referralCode: `MABRUR-${nanoid(6).toUpperCase()}`,
          totalReferrals: 0
        }
      })
    }

    return NextResponse.json(loyalty)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch loyalty data' }, { status: 500 })
  }
}
