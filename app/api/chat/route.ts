import { NextResponse } from 'next/server'
import Groq from 'groq-sdk'
import { retrieve } from '@/lib/retrieval'
import { prisma } from '@/lib/db'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

// llama-3.3-70b-versatile: strong quality-to-speed tradeoff on Groq's free tier,
// well suited to a short, grounded concierge reply like this one.
const MODEL = 'openai/gpt-oss-120b'

const FALLBACK_REPLY =
  "I'm having a quiet moment and can't check that right now — please try again shortly, or reach the team directly at hello@aureliaretreat.com."

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const message = typeof body?.message === 'string' ? body.message.trim() : ''
  const history = Array.isArray(body?.history) ? body.history : []

  if (!message) {
    return NextResponse.json({ reply: 'Tell me what you are curious about and I will point you in the right direction.' }, { status: 400 })
  }

  if (!process.env.GROQ_API_KEY) {
    return NextResponse.json({ reply: FALLBACK_REPLY }, { status: 200 })
  }

  const matches = retrieve(message, 3)

  const context = matches.length
    ? matches.map((chunk) => `[${chunk.topic}]\n${chunk.content}`).join('\n\n')
    : 'No matching information was found in the knowledge base for this question.'

  const systemPrompt = `You are "Ask Aurelia," the concierge for Aurelia Retreat, a boutique cliffside hotel in Positano, Italy.

Answer ONLY using the CONTEXT provided below. Do not invent room prices, policies, or details not present in the context.
If the context does not contain the answer, say so warmly and offer to connect the guest with the human concierge team at hello@aureliaretreat.com — do not guess.
Keep responses to 2-4 sentences, warm and unhurried in tone, matching a quiet luxury hotel brand voice. Do not use bullet points or markdown formatting — write in plain, natural sentences.

CONTEXT:
${context}`

  try {
    const response = await groq.chat.completions.create({
      model: MODEL,
      max_tokens: 300,
      messages: [
        { role: 'system', content: systemPrompt },
        ...history
          .filter((turn: unknown): turn is { from: string; text: string } =>
            !!turn && typeof turn === 'object' && 'from' in turn && 'text' in turn)
          .slice(-6)
          .map((turn: { from: string; text: string }) => ({
            role: turn.from === 'you' ? ('user' as const) : ('assistant' as const),
            content: turn.text,
          })),
        { role: 'user', content: message },
      ],
    })

    const reply = response.choices[0]?.message?.content?.trim() || FALLBACK_REPLY

    // Fire-and-forget conversation logging — never let logging failure break the reply.
    prisma.conciergeMessage
      .create({ data: { question: message, answer: reply, matchedTopics: matches.map((m) => m.topic).join(', ') } })
      .catch((error: unknown) => console.error('Failed to log concierge message:', error))

    return NextResponse.json({ reply })
  } catch (error) {
    console.error('Groq API error:', error)
    return NextResponse.json({ reply: FALLBACK_REPLY }, { status: 200 })
  }
}
