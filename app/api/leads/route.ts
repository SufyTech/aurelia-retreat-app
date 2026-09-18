import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)

  const name = typeof body?.name === 'string' ? body.name.trim() : ''
  const email = typeof body?.email === 'string' ? body.email.trim() : ''

  if (!name || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'A valid name and email are required.' }, { status: 400 })
  }

  const checkIn = body?.checkIn ? new Date(body.checkIn) : null
  const checkOut = body?.checkOut ? new Date(body.checkOut) : null

  if (checkIn && isNaN(checkIn.getTime())) {
    return NextResponse.json({ error: 'Check-in date is invalid.' }, { status: 400 })
  }
  if (checkOut && isNaN(checkOut.getTime())) {
    return NextResponse.json({ error: 'Check-out date is invalid.' }, { status: 400 })
  }
  if (checkIn && checkOut && checkOut <= checkIn) {
    return NextResponse.json({ error: 'Check-out must be after check-in.' }, { status: 400 })
  }

  let guests: number | null = null
  if (typeof body?.guests === 'number') {
    if (!Number.isInteger(body.guests) || body.guests < 1 || body.guests > 8) {
      return NextResponse.json({ error: 'Guests must be between 1 and 8.' }, { status: 400 })
    }
    guests = body.guests
  }

  const lead = await prisma.bookingLead.create({
    data: {
      name,
      email,
      checkIn,
      checkOut,
      guests,
      roomInterest: typeof body?.roomInterest === 'string' ? body.roomInterest : null,
      message: typeof body?.message === 'string' ? body.message : null,
    },
  })

  return NextResponse.json({ success: true, id: lead.id })
}

// Simple protected read endpoint so you can see submitted inquiries without
// setting up a full admin dashboard yet. Visit /api/leads?key=YOUR_ADMIN_KEY
export async function GET(request: Request) {
  const url = new URL(request.url)
  const key = url.searchParams.get('key')

  if (!process.env.ADMIN_KEY || key !== process.env.ADMIN_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const leads = await prisma.bookingLead.findMany({ orderBy: { createdAt: 'desc' } })
  return NextResponse.json({ leads })
}