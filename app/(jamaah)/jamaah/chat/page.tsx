'use client'

import { useState, useRef, useEffect } from 'react'
import { useJamaahAuth } from '@/hooks/useJamaahAuth'
import Link from 'next/link'
import Image from 'next/image'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  isFallback?: boolean // Track if this was a fallback response
}

export default function JamaahChat() {
  const { data, loading: authLoading } = useJamaahAuth()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Assalamualaikum! Saya asisten Mabrur.ai. Silakan tanyakan tentang doa, niat, lokasi mustajab, atau informasi perjalanan Anda.'
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [lastQuestion, setLastQuestion] = useState('') // For retry functionality
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async (e?: React.FormEvent, retryMessage?: string) => {
    if (e) e.preventDefault()
    
    const messageToSend = retryMessage || input.trim()
    if (!messageToSend || loading) return

    // Only add user message if not a retry
    if (!retryMessage) {
      const userMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content: messageToSend
      }
      setMessages(prev => [...prev, userMessage])
      setInput('')
    }
    
    setLastQuestion(messageToSend)
    setLoading(true)

    try {
      const res = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: messageToSend })
      })

      const data = await res.json()
      console.log('[Chat] Response:', data.source, data.duration ? `${data.duration}ms` : '')
      
      // If retrying, remove the last fallback message first
      if (retryMessage) {
        setMessages(prev => prev.filter(m => !m.isFallback || m.id !== prev[prev.length - 1]?.id))
      }
      
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.answer,
        isFallback: data.source === 'fallback'
      }])
    } catch (error) {
      console.error('[Chat] Network error:', error)
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Mohon maaf, tidak dapat terhubung ke server. Periksa koneksi internet Anda dan coba lagi. 🤲',
        isFallback: true
      }])
    } finally {
      setLoading(false)
    }
  }

  const retryLastQuestion = () => {
    if (lastQuestion && !loading) {
      sendMessage(undefined, lastQuestion)
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#FAFAF8] to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gold-100 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="text-navy-500">Memuat...</p>
        </div>
      </div>
    )
  }

  if (!data) return null

  return (
    <main className="min-h-screen bg-[#FAFAF8] flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-navy-100/50 px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center gap-4">
          <Link href="/jamaah/dashboard" className="p-2 -ml-2 hover:bg-navy-50 rounded-xl transition-colors">
            <svg className="w-6 h-6 text-navy-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="Mabrur.ai" width={36} height={36} className="rounded-xl" />
            <div>
              <h1 className="font-semibold text-navy-900">Tanya Mabrur AI</h1>
              <p className="text-navy-400 text-xs">Asisten Ibadah Anda</p>
            </div>
          </div>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 pb-28">
        <div className="max-w-2xl mx-auto space-y-4">
          {messages.map((msg, index) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl ${
                  msg.role === 'user'
                    ? 'bg-navy-800 text-white rounded-br-sm p-4'
                    : 'bg-white border border-navy-100 text-navy-800 rounded-bl-sm shadow-sm'
                }`}
              >
                <p className={`whitespace-pre-wrap text-sm leading-relaxed ${msg.role === 'assistant' ? 'p-4' : ''}`}>
                  {msg.content}
                </p>
                {/* Show retry button for fallback messages (last message only) */}
                {msg.isFallback && index === messages.length - 1 && !loading && (
                  <div className="px-4 pb-3 pt-0">
                    <button
                      onClick={retryLastQuestion}
                      className="text-xs text-gold-600 hover:text-gold-700 font-medium flex items-center gap-1"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Coba lagi
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-white border border-navy-100 p-4 rounded-2xl rounded-bl-sm shadow-sm">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-navy-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-navy-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-navy-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <form onSubmit={sendMessage} className="fixed bottom-0 left-0 right-0 bg-white border-t border-navy-100 p-4">
        <div className="flex gap-3 max-w-2xl mx-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ketik pertanyaan..."
            className="flex-1 px-4 py-3 rounded-xl border border-navy-200 focus:border-gold-500 focus:ring-2 focus:ring-gold-200 outline-none transition-all text-navy-800"
            disabled={loading}
          />
          <button 
            type="submit" 
            className="px-6 py-3 bg-gradient-to-r from-gold-500 to-gold-600 text-navy-900 font-semibold rounded-xl hover:from-gold-400 hover:to-gold-500 transition-all disabled:opacity-50"
            disabled={loading || !input.trim()}
          >
            Kirim
          </button>
        </div>
      </form>
    </main>
  )
}
