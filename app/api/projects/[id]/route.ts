import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Project from '@/models/Project'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB()
    const { id } = await params
    const project = await Project.findById(id).populate('clientId', 'name businessName phone email')
    if (!project) return NextResponse.json({ error: 'প্রজেক্ট পাওয়া যায়নি' }, { status: 404 })
    return NextResponse.json({ project })
  } catch (error) {
    return NextResponse.json({ error: 'প্রজেক্ট লোড করতে সমস্যা হয়েছে' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB()
    const { id } = await params
    const body    = await request.json()
    const project = await Project.findByIdAndUpdate(id, { $set: body }, { new: true })
    if (!project) return NextResponse.json({ error: 'প্রজেক্ট পাওয়া যায়নি' }, { status: 404 })
    return NextResponse.json({ message: 'প্রজেক্ট আপডেট হয়েছে', project })
  } catch (error) {
    return NextResponse.json({ error: 'প্রজেক্ট আপডেট করতে সমস্যা হয়েছে' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB()
    const { id } = await params
    await Project.findByIdAndDelete(id)
    return NextResponse.json({ message: 'প্রজেক্ট মুছে ফেলা হয়েছে' })
  } catch (error) {
    return NextResponse.json({ error: 'প্রজেক্ট মুছতে সমস্যা হয়েছে' }, { status: 500 })
  }
}
