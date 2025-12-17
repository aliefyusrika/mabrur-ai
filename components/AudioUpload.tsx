'use client'

import { useState, useRef } from 'react'

interface AudioUploadProps {
  value: string | null
  onChange: (audioPath: string | null) => void
  disabled?: boolean
}

export default function AudioUpload({ value, onChange, disabled }: AudioUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fileName, setFileName] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setError(null)
    setUploading(true)

    // Validate file type
    const allowedTypes = ['audio/mpeg', 'audio/wav', 'audio/mp4', 'audio/x-m4a', 'audio/m4a']
    const allowedExtensions = ['.mp3', '.wav', '.m4a']
    const ext = file.name.toLowerCase().slice(file.name.lastIndexOf('.'))
    
    if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(ext)) {
      setError('Format tidak didukung. Gunakan MP3, WAV, atau M4A')
      setUploading(false)
      return
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('Ukuran file maksimal 10MB')
      setUploading(false)
      return
    }

    try {
      const formData = new FormData()
      formData.append('audio', file)

      const res = await fetch('/api/upload/audio-ibadah', {
        method: 'POST',
        body: formData
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Upload gagal')
      }

      onChange(data.audioPath)
      setFileName(file.name)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload gagal')
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleRemove = () => {
    onChange(null)
    setFileName(null)
    setError(null)
  }

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-navy-700">
        Audio Bacaan (opsional)
      </label>

      {value ? (
        <div className="bg-navy-50 rounded-xl p-4 border border-navy-200">
          {/* Audio Preview */}
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-gold-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-gold-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-navy-900 truncate">
                {fileName || 'Audio tersimpan'}
              </p>
              <p className="text-xs text-navy-500">Audio siap diputar</p>
            </div>
          </div>

          {/* Audio Player */}
          <audio
            src={value}
            controls
            className="w-full h-10 rounded-lg"
            style={{ outline: 'none' }}
          />

          {/* Actions */}
          <div className="flex gap-2 mt-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled || uploading}
              className="flex-1 px-3 py-2 text-sm font-medium text-navy-700 bg-white border border-navy-200 rounded-lg hover:bg-navy-50 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Ganti Audio
            </button>
            <button
              type="button"
              onClick={handleRemove}
              disabled={disabled}
              className="px-3 py-2 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 disabled:opacity-50"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => !disabled && !uploading && fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors cursor-pointer
            ${uploading ? 'border-gold-300 bg-gold-50' : 'border-navy-200 hover:border-gold-400 hover:bg-gold-50/50'}
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {uploading ? (
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 border-3 border-gold-500 border-t-transparent rounded-full animate-spin mb-3" />
              <p className="text-sm text-gold-700 font-medium">Mengunggah audio...</p>
            </div>
          ) : (
            <>
              <div className="w-12 h-12 bg-navy-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-navy-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
              </div>
              <p className="text-sm font-medium text-navy-700 mb-1">Unggah audio bacaan doa</p>
              <p className="text-xs text-navy-500">MP3, WAV, M4A • Maks 10MB</p>
            </>
          )}
        </div>
      )}

      {error && (
        <p className="text-sm text-red-600 flex items-center gap-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept=".mp3,.wav,.m4a,audio/mpeg,audio/wav,audio/mp4,audio/x-m4a"
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled || uploading}
      />
    </div>
  )
}
