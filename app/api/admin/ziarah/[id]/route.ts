import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { unlink } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const location = await prisma.ziarahLocation.findUnique({ where: { id: params.id } })
    if (!location) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json({
      ...location,
      latitude: location.latitude ? Number(location.latitude) : null,
      longitude: location.longitude ? Number(location.longitude) : null
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    
    // Get existing record to check for old image
    const existing = await prisma.ziarahLocation.findUnique({ where: { id: params.id } })
    
    // If image changed and old image exists, delete it
    if (existing?.imagePath && body.imagePath !== existing.imagePath) {
      const oldPath = path.join(process.cwd(), 'public', existing.imagePath)
      if (existsSync(oldPath)) {
        await unlink(oldPath).catch(() => {})
      }
    }

    const location = await prisma.ziarahLocation.update({
      where: { id: params.id },
      data: {
        city: body.city,
        name: body.name,
        arabicName: body.arabicName || null,
        description: body.description,
        history: body.history || null,
        virtues: body.virtues || null,
        practices: body.practices || null,
        imagePath: body.imagePath || null,
        latitude: body.latitude ? parseFloat(body.latitude) : null,
        longitude: body.longitude ? parseFloat(body.longitude) : null,
        placeId: body.placeId || null,
        address: body.address || null,
        orderIndex: body.orderIndex || 0,
        isActive: body.isActive
      }
    })
    return NextResponse.json({
      ...location,
      latitude: location.latitude ? Number(location.latitude) : null,
      longitude: location.longitude ? Number(location.longitude) : null
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Get record to delete associated image
    const location = await prisma.ziarahLocation.findUnique({ where: { id: params.id } })
    
    if (location?.imagePath) {
      const imagePath = path.join(process.cwd(), 'public', location.imagePath)
      if (existsSync(imagePath)) {
        await unlink(imagePath).catch(() => {})
      }
    }

    await prisma.ziarahLocation.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 })
  }
}
