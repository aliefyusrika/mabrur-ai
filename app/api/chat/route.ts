import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
})

export async function POST(req: Request) {
  try {
    const { message } = await req.json()

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { 
          role: 'system', 
          content: 'Kamu adalah asisten ibadah haji dan umrah. Jawab dengan bahasa Indonesia yang lembut dan menenangkan.' 
        },
        { role: 'user', content: message },
      ],
    })

    return NextResponse.json({
      answer: completion.choices[0].message.content,
      source: 'openai'
    })

  } catch (error) {
    console.error('[Chat] Error:', error)
    return NextResponse.json({
      answer: 'Mohon maaf, sistem sedang sibuk. Silakan coba lagi.',
      source: 'fallback'
    })
  }
}
