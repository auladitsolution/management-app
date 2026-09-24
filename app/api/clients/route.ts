import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Client from '@/models/Client'
import { encryptCredentials, decryptCredentials } from '@/lib/encryption'
import { verifyAuth, isAuthError } from '@/lib/auth'

// GET all clients
export async function GET(request: NextRequest) {
  const auth = await verifyAuth(request)
  if (isAuthError(auth)) return auth
  try {
    await connectDB()
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || ''
    const district = searchParams.get('district') || ''

    const filter: any = {}
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { businessName: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ]
    }
    if (status) filter.status = status
    if (district) filter.district = district

    const clients = await Client.find(filter)
      .select('-credentials')  // Don't send credentials in list view
      .sort({ createdAt: -1 })

    return NextResponse.json({ clients, total: clients.length })
  } catch (error) {
    return NextResponse.json({ error: 'ক্লায়েন্ট লোড করতে সমস্যা হয়েছে' }, { status: 500 })
  }
}

// POST create new client
export async function POST(request: NextRequest) {
  const auth = await verifyAuth(request)
  if (isAuthError(auth)) return auth
  try {
    await connectDB()
    const body = await request.json()

    // Encrypt credentials before saving
    if (body.credentials) {
      body.credentials = encryptCredentials(body.credentials)
    }

    const client = new Client(body)
    await client.save()

    return NextResponse.json({ message: 'ক্লায়েন্ট সফলভাবে যোগ করা হয়েছে', client }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'ক্লায়েন্ট যোগ করতে সমস্যা হয়েছে' }, { status: 500 })
  }
}
