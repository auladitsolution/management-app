import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Payment from '@/models/Payment'

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    const { searchParams } = new URL(request.url)
    const clientId  = searchParams.get('clientId')
    const projectId = searchParams.get('projectId')
    const dueOnly   = searchParams.get('dueOnly') === 'true'

    const filter: any = {}
    if (clientId) filter.clientId = clientId
    if (projectId) filter.projectId = projectId
    if (dueOnly) filter.dueAmount = { $gt: 0 }

    const payments = await Payment.find(filter)
      .populate('clientId', 'name businessName phone')
      .populate('projectId', 'name')
      .sort({ createdAt: -1 })

    const totalRevenue = payments.reduce((sum, p) => sum + p.paidAmount, 0)
    const totalDue     = payments.reduce((sum, p) => sum + p.dueAmount, 0)

    return NextResponse.json({ payments, totalRevenue, totalDue })
  } catch (error) {
    return NextResponse.json({ error: 'পেমেন্ট লোড করতে সমস্যা হয়েছে' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    const body    = await request.json()
    const payment = new Payment(body)
    await payment.save()
    return NextResponse.json({ message: 'পেমেন্ট তথ্য যোগ করা হয়েছে', payment }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'পেমেন্ট যোগ করতে সমস্যা হয়েছে' }, { status: 500 })
  }
}
