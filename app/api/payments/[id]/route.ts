import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Payment from '@/models/Payment'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB()
    const { id } = await params
    const payment = await Payment.findById(id)
      .populate('clientId', 'name phone')
      .populate('projectId', 'name')
    if (!payment) return NextResponse.json({ error: 'পেমেন্ট পাওয়া যায়নি' }, { status: 404 })
    return NextResponse.json({ payment })
  } catch (error) {
    return NextResponse.json({ error: 'পেমেন্ট লোড করতে সমস্যা হয়েছে' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB()
    const { id } = await params
    const body    = await request.json()
    const payment = await Payment.findById(id)
    if (!payment) return NextResponse.json({ error: 'পেমেন্ট পাওয়া যায়নি' }, { status: 404 })

    if (body.newPayment) {
      payment.payments.push(body.newPayment)
      payment.paidAmount += body.newPayment.amount
    } else {
      Object.assign(payment, body)
    }

    await payment.save()
    return NextResponse.json({ message: 'পেমেন্ট আপডেট হয়েছে', payment })
  } catch (error) {
    return NextResponse.json({ error: 'পেমেন্ট আপডেট করতে সমস্যা হয়েছে' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB()
    const { id } = await params
    await Payment.findByIdAndDelete(id)
    return NextResponse.json({ message: 'পেমেন্ট মুছে ফেলা হয়েছে' })
  } catch (error) {
    return NextResponse.json({ error: 'পেমেন্ট মুছতে সমস্যা হয়েছে' }, { status: 500 })
  }
}
