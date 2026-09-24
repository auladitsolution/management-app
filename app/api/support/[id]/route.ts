import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import SupportTicket from '@/models/SupportTicket'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB()
    const { id } = await params
    const ticket = await SupportTicket.findById(id)
      .populate('clientId', 'name phone email businessName')
      .populate('projectId', 'name liveUrl')
    if (!ticket) return NextResponse.json({ error: 'টিকেট পাওয়া যায়নি' }, { status: 404 })
    return NextResponse.json({ ticket })
  } catch (error) {
    return NextResponse.json({ error: 'টিকেট লোড করতে সমস্যা হয়েছে' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB()
    const { id } = await params
    const body   = await request.json()
    const ticket = await SupportTicket.findById(id)
    if (!ticket) return NextResponse.json({ error: 'টিকেট পাওয়া যায়নি' }, { status: 404 })

    if (body.newUpdate) {
      ticket.updates.push(body.newUpdate)
      delete body.newUpdate
    }

    if (body.status === 'সমাধান হয়েছে' && !ticket.resolvedAt) {
      body.resolvedAt = new Date()
    }

    Object.assign(ticket, body)
    await ticket.save()
    return NextResponse.json({ message: 'টিকেট আপডেট হয়েছে', ticket })
  } catch (error) {
    return NextResponse.json({ error: 'টিকেট আপডেট করতে সমস্যা হয়েছে' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB()
    const { id } = await params
    await SupportTicket.findByIdAndDelete(id)
    return NextResponse.json({ message: 'টিকেট মুছে ফেলা হয়েছে' })
  } catch (error) {
    return NextResponse.json({ error: 'টিকেট মুছতে সমস্যা হয়েছে' }, { status: 500 })
  }
}
