import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { unlink } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'

async function deleteAudioFile(audioPath: string | null) {
  if (!audioPath) return
  try {
    const fullPath = path.join(process.cwd(), 'public', audioPath)
    if (existsSync(fullPath)) {
      await unlink(fullPath)
    }
  } catch (error) {
    console.error('Failed to delete audio file:', error)
  }
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const content = await prisma.ibadahContent.findUnique({ where: { id: params.id } })
    if (!content) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(content)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    
    // Get existing content to check if audio changed
    const existing = await prisma.ibadahContent.findUnique({ where: { id: params.id } })
    
    // Delete old audio if it's being replaced or removed
    if (existing?.audioPath && existing.audioPath !== body.audioPath) {
      await deleteAudioFile(existing.audioPath)
    }
    
    const content = await prisma.ibadahContent.update({
      where: { id: params.id },
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
        isActive: body.isActive
      }
    })
    return NextResponse.json(content)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Get content to delete associated audio file
    const content = await prisma.ibadahContent.findUnique({ where: { id: params.id } })
    
    if (content?.audioPath) {
      await deleteAudioFile(content.audioPath)
    }
    
    await prisma.ibadahContent.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 })
  }
}
