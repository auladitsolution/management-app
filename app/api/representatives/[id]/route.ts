import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Representative from '@/models/Representative'
import { verifyAuth, isAuthError } from '@/lib/auth'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await verifyAuth(request)
  if (isAuthError(auth)) return auth
  try {
    await connectDB()
    const { id } = await params
    const rep = await Representative.findById(id)
    if (!rep) return NextResponse.json({ error: 'প্রতিনিধি পাওয়া যায়নি' }, { status: 404 })
    return NextResponse.json({ representative: rep })
  } catch (error) {
    return NextResponse.json({ error: 'প্রতিনিধি লোড করতে সমস্যা হয়েছে' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await verifyAuth(request)
  if (isAuthError(auth)) return auth
  try {
    await connectDB()
    const { id } = await params
    const body = await request.json()
    const rep  = await Representative.findByIdAndUpdate(id, { $set: body }, { new: true })
    if (!rep) return NextResponse.json({ error: 'প্রতিনিধি পাওয়া যায়নি' }, { status: 404 })
    return NextResponse.json({ message: 'প্রতিনিধি আপডেট হয়েছে', representative: rep })
  } catch (error) {
    return NextResponse.json({ error: 'প্রতিনিধি আপডেট করতে সমস্যা হয়েছে' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await verifyAuth(request)
  if (isAuthError(auth)) return auth
  try {
    await connectDB()
    const { id } = await params
    await Representative.findByIdAndDelete(id)
    return NextResponse.json({ message: 'প্রতিনিধি মুছে ফেলা হয়েছে' })
  } catch (error) {
    return NextResponse.json({ error: 'প্রতিনিধি মুছতে সমস্যা হয়েছে' }, { status: 500 })
  }
}
