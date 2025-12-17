import OpenAI from 'openai'

// Validate API key exists
const apiKey = process.env.OPENAI_API_KEY
if (!apiKey) {
  console.error('[OpenAI] WARNING: OPENAI_API_KEY is not set!')
}

const openai = new OpenAI({
  apiKey: apiKey || '',
  timeout: 30000, // 30 second timeout
  maxRetries: 0,  // We handle retries manually
})

// Retry configuration
const MAX_RETRIES = 2
const INITIAL_DELAY_MS = 1000
const REQUEST_TIMEOUT_MS = 25000

// Helper: delay with exponential backoff
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Check if error is retryable
function isRetryableError(error: unknown): boolean {
  if (error instanceof OpenAI.APIError) {
    // Retry on 429 (rate limit), 500, 502, 503, 504
    return [429, 500, 502, 503, 504].includes(error.status)
  }
  if (error instanceof Error) {
    const message = error.message.toLowerCase()
    return (
      message.includes('timeout') ||
      message.includes('network') ||
      message.includes('econnreset') ||
      message.includes('fetch failed') ||
      message.includes('socket')
    )
  }
  return false
}

const SYSTEM_PROMPT = `Kamu adalah "Mabrur AI", asisten digital pendamping jamaah haji dan umrah.

IDENTITAS:
- Nama: Mabrur AI
- Peran: Pembimbing digital yang membantu jamaah memahami dan menjalankan ibadah haji & umrah
- Sifat: Sabar, tenang, menenangkan, dan selalu siap membantu

ATURAN UTAMA:
- SELALU jawab pertanyaan seputar ibadah dan perjalanan haji/umrah
- JANGAN PERNAH mengatakan "saya tidak tahu" secara langsung
- Jika tidak yakin, berikan panduan umum yang tetap bermanfaat
- Untuk topik kompleks, jelaskan step-by-step dengan sabar

GAYA BAHASA:
- Gunakan Bahasa Indonesia yang tenang, lembut, dan menenangkan
- Mulai dengan kalimat seperti: "Baik, saya jelaskan..." atau "InsyaAllah saya bantu jelaskan..."
- Sertakan doa dalam teks Arab beserta latin dan artinya jika relevan
- Gunakan emoji yang sesuai untuk membuat jawaban lebih hangat (🕋 🤲 ✨)

TOPIK YANG DIKUASAI:
- Rukun dan wajib haji & umrah
- Tata cara tawaf, sa'i, wukuf, mabit, lempar jumrah
- Niat dan doa-doa ibadah
- Manasik dan persiapan keberangkatan
- Lokasi ziarah dan tempat mustajab di Makkah & Madinah
- Larangan ihram dan dam/fidyah
- Tips praktis perjalanan ibadah

FORMAT JAWABAN:
- Untuk penjelasan panjang, gunakan poin-poin atau langkah bernomor
- Sertakan dalil atau hadits jika relevan
- Akhiri dengan doa atau motivasi singkat jika sesuai

BATASAN:
- Jika pertanyaan di luar konteks ibadah haji/umrah, arahkan kembali dengan sopan
- Jangan memberikan fatwa yang kontroversial, sarankan untuk bertanya ke ustadz/ulama`

export async function generateOpenAIResponse(
  userMessage: string, 
  context?: string
): Promise<string> {
  // Check API key before making request
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY tidak dikonfigurasi')
  }

  console.log('[OpenAI] Generating response for:', userMessage.substring(0, 50) + '...')

  const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
    { role: 'system', content: SYSTEM_PROMPT }
  ]

  // Add context if available
  if (context) {
    messages.push({
      role: 'system',
      content: `KONTEKS TAMBAHAN DARI DATABASE:\n${context}`
    })
  }

  messages.push({ role: 'user', content: userMessage })

  let lastError: Error | null = null

  // Retry loop with exponential backoff
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      console.log(`[OpenAI] Attempt ${attempt}/${MAX_RETRIES}`)
      
      // Create abort controller for timeout
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini', // Primary model - cost effective & fast
        messages,
        max_tokens: 1500,
        temperature: 0.7,
      }, {
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      const text = response.choices[0]?.message?.content
      
      if (!text || text.trim().length === 0) {
        throw new Error('Empty response from OpenAI')
      }

      console.log(`[OpenAI] Success on attempt ${attempt}, tokens: ${response.usage?.total_tokens}`)
      return text.trim()

    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))
      console.warn(`[OpenAI] Attempt ${attempt} failed:`, lastError.message)

      // Only retry if it's a retryable error and we have attempts left
      if (isRetryableError(error) && attempt < MAX_RETRIES) {
        const delayMs = INITIAL_DELAY_MS * Math.pow(2, attempt - 1) // 1s, 2s
        console.log(`[OpenAI] Retrying in ${delayMs}ms...`)
        await delay(delayMs)
        continue
      }

      // Non-retryable error or max retries reached
      break
    }
  }

  // All retries failed
  console.error('[OpenAI] All retries exhausted:', lastError?.message)
  throw lastError || new Error('Unknown error')
}
