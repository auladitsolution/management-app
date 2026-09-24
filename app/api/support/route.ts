import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import SupportTicket from '@/models/SupportTicket'
import { verifyAuth, isAuthError } from '@/lib/auth'

export async function GET(request: NextRequest) {
  const auth = await verifyAuth(request)
  if (isAuthError(auth)) return auth
  try {
    await connectDB()
    const { searchParams } = new URL(request.url)
    const status   = searchParams.get('status')
    const priority = searchParams.get('priority')
    const clientId = searchParams.get('clientId')

    const filter: any = {}
    if (status) filter.status = status
    if (priority) filter.priority = priority
    if (clientId) filter.clientId = clientId

    const tickets = await SupportTicket.find(filter)
      .populate('clientId', 'name phone')
      .populate('projectId', 'name liveUrl')
      .sort({ createdAt: -1 })

    return NextResponse.json({ tickets, total: tickets.length })
  } catch (error) {
    return NextResponse.json({ error: 'টিকেট লোড করতে সমস্যা হয়েছে' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const auth = await verifyAuth(request)
  if (isAuthError(auth)) return auth
  try {
    await connectDB()
    const body   = await request.json()
    const ticket = new SupportTicket(body)
    await ticket.save()
    return NextResponse.json({ message: 'সাপোর্ট টিকেট তৈরি হয়েছে', ticket }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'টিকেট তৈরি করতে সমস্যা হয়েছে' }, { status: 500 })
  }
}
