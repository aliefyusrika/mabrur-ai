import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { generateOpenAIResponse } from '@/lib/openai'

const FALLBACK_MESSAGE = 
  'Mohon maaf, sistem sedang menyesuaikan. 🤲\n' +
  'Silakan ulangi pertanyaan Anda, insyaAllah saya siap membantu.'

export async function POST(req: NextRequest) {
  try {
    const { question, message } = await req.json()
    const userMessage = question || message

    if (!userMessage || typeof userMessage !== 'string') {
      return NextResponse.json({ 
        answer: 'Silakan ketik pertanyaan Anda. 🤲',
        source: 'validation' 
      })
    }

    console.log('[Chatbot] Received:', userMessage.substring(0, 80))

    // Fetch context from database
    let dbContext = ''
    try {
      const searchTerms = userMessage.toLowerCase().split(/\s+/).filter((t: string) => t.length > 2)
      
      if (searchTerms.length > 0) {
        const contents = await prisma.chatbotContent.findMany({
          where: {
            isActive: true,
            OR: searchTerms.slice(0, 3).map((term: string) => ({
              OR: [
                { question: { contains: term } },
                { keywords: { contains: term } },
              ]
            }))
          },
          take: 3,
        })

        if (contents.length > 0) {
          dbContext = contents.map((c: { question: string; answer: string }) => 
            `Q: ${c.question}\nA: ${c.answer}`
          ).join('\n\n')
        }
      }
    } catch (dbError) {
      console.warn('[Chatbot] DB query failed:', dbError)
    }

    const aiResponse = await generateOpenAIResponse(userMessage, dbContext || undefined)

    return NextResponse.json({ 
      answer: aiResponse,
      source: 'openai'
    })

  } catch (error) {
    console.error('[Chatbot] ERROR:', error)
    
    // Return fallback - never expose raw error
    return NextResponse.json({ 
      answer: FALLBACK_MESSAGE,
      source: 'fallback'
    })
  }
}
