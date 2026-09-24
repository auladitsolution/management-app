import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Client from '@/models/Client'
import { encryptCredentials, decryptCredentials } from '@/lib/encryption'
import { verifyAuth, isAuthError } from '@/lib/auth'

// GET single client with decrypted credentials
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await verifyAuth(request)
  if (isAuthError(auth)) return auth
  try {
    await connectDB()
    const { id } = await params
    const client = await Client.findById(id).populate('representativeId', 'name phone')

    if (!client) {
      return NextResponse.json({ error: 'ক্লায়েন্ট পাওয়া যায়নি' }, { status: 404 })
    }

    // Decrypt credentials before sending
    const clientObj = client.toObject()
    if (clientObj.credentials) {
      clientObj.credentials = decryptCredentials(clientObj.credentials)
    }

    return NextResponse.json({ client: clientObj })
  } catch (error) {
    return NextResponse.json({ error: 'ক্লায়েন্ট লোড করতে সমস্যা হয়েছে' }, { status: 500 })
  }
}

// PUT update client
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await verifyAuth(request)
  if (isAuthError(auth)) return auth
  try {
    await connectDB()
    const { id } = await params
    const body = await request.json()

    // 1. Remove immutable and system metadata fields from update payload
    delete body._id
    delete body.createdAt
    delete body.updatedAt
    delete body.__v

    // 2. Normalize representativeId if populated as object
    if (body.representativeId && typeof body.representativeId === 'object' && body.representativeId._id) {
      body.representativeId = body.representativeId._id
    }

    // 3. Encrypt credentials before updating
    if (body.credentials && typeof body.credentials === 'object') {
      delete body.credentials._id
      body.credentials = encryptCredentials(body.credentials)
    }

    const client = await Client.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true }
    )

    if (!client) {
      return NextResponse.json({ error: 'ক্লায়েন্ট পাওয়া যায়নি' }, { status: 404 })
    }

    // Decrypt credentials before returning to client
    const clientObj = client.toObject()
    if (clientObj.credentials) {
      clientObj.credentials = decryptCredentials(clientObj.credentials)
    }

    return NextResponse.json({ message: 'ক্লায়েন্ট সফলভাবে আপডেট হয়েছে', client: clientObj })
  } catch (error: any) {
    console.error('Client update error:', error)
    return NextResponse.json({ error: error?.message || 'ক্লায়েন্ট আপডেট করতে সমস্যা হয়েছে' }, { status: 500 })
  }
}

// DELETE client
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await verifyAuth(request)
  if (isAuthError(auth)) return auth
  try {
    await connectDB()
    const { id } = await params
    await Client.findByIdAndDelete(id)
    return NextResponse.json({ message: 'ক্লায়েন্ট মুছে ফেলা হয়েছে' })
  } catch (error) {
    return NextResponse.json({ error: 'ক্লায়েন্ট মুছতে সমস্যা হয়েছে' }, { status: 500 })
  }
}
