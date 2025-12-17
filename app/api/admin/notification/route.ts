import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const notifications = await prisma.notification.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(notifications)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const notification = await prisma.notification.create({
      data: {
        type: body.type,
        title: body.title,
        message: body.message,
        priority: body.priority || 'NORMAL',
        expiresAt: body.expiresAt ? new Date(body.expiresAt) : null,
        isActive: true
      }
    })
    return NextResponse.json(notification)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create notification' }, { status: 500 })
  }
}
