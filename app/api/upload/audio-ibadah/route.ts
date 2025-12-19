import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import { nanoid } from '@/lib/nanoid'

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ALLOWED_TYPES = ['audio/mpeg', 'audio/wav', 'audio/mp4', 'audio/x-m4a', 'audio/m4a']
const ALLOWED_EXTENSIONS = ['.mp3', '.wav', '.m4a']

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('audio') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No audio file provided' }, { status: 400 })
    }

    // Validate file type
    const fileExtension = path.extname(file.name).toLowerCase()
    if (!ALLOWED_EXTENSIONS.includes(fileExtension) && !ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Allowed: MP3, WAV, M4A' },
        { status: 400 }
      )
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File too large. Maximum size: 10MB' },
        { status: 400 }
      )
    }

    // Create upload directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'audio-ibadah')
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true })
    }

    // Generate unique filename
    const uniqueId = nanoid()
    const fileName = `${uniqueId}${fileExtension}`
    const filePath = path.join(uploadDir, fileName)

    // Write file
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filePath, buffer)

    // Return the public path
    const publicPath = `/uploads/audio-ibadah/${fileName}`

    return NextResponse.json({
      success: true,
      audioPath: publicPath,
      fileName: file.name
    })
  } catch (error) {
    console.error('Audio upload error:', error)
    return NextResponse.json({ error: 'Failed to upload audio' }, { status: 500 })
  }
}
