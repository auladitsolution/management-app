import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Representative from '@/models/Representative'
import { verifyAuth, isAuthError } from '@/lib/auth'

export async function GET(request: NextRequest) {
  const auth = await verifyAuth(request)
  if (isAuthError(auth)) return auth
  try {
    await connectDB()
    const { searchParams } = new URL(request.url)
    const district = searchParams.get('district')
    const status   = searchParams.get('status')
    const search   = searchParams.get('search') || ''

    const filter: any = {}
    if (district) filter.district = district
    if (status) filter.status = status
    if (search) filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { phone: { $regex: search, $options: 'i' } },
    ]

    const reps = await Representative.find(filter).sort({ createdAt: -1 })
    return NextResponse.json({ representatives: reps, total: reps.length })
  } catch (error) {
    return NextResponse.json({ error: 'প্রতিনিধি লোড করতে সমস্যা হয়েছে' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const auth = await verifyAuth(request)
  if (isAuthError(auth)) return auth
  try {
    await connectDB()
    const body = await request.json()
    const rep  = new Representative(body)
    await rep.save()
    return NextResponse.json({ message: 'প্রতিনিধি সফলভাবে যোগ করা হয়েছে', representative: rep }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'প্রতিনিধি যোগ করতে সমস্যা হয়েছে' }, { status: 500 })
  }
}
