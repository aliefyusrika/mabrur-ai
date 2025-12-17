import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Mabrur.ai - Pendamping Digital Haji & Umrah',
  description: 'Asisten digital untuk perjalanan ibadah Haji dan Umrah Anda',
  manifest: '/manifest.json',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#102a43',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <body className="min-h-screen">{children}</body>
    </html>
  )
}
