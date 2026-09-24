import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Project from '@/models/Project'

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    const { searchParams } = new URL(request.url)
    const clientId = searchParams.get('clientId')
    const status   = searchParams.get('status')
    const search   = searchParams.get('search') || ''

    const filter: any = {}
    if (clientId) filter.clientId = clientId
    if (status) filter.status = status
    if (search) filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { projectType: { $regex: search, $options: 'i' } },
    ]

    const projects = await Project.find(filter)
      .populate('clientId', 'name businessName phone')
      .sort({ createdAt: -1 })

    return NextResponse.json({ projects, total: projects.length })
  } catch (error) {
    return NextResponse.json({ error: 'প্রজেক্ট লোড করতে সমস্যা হয়েছে' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    const body    = await request.json()
    const project = new Project(body)
    await project.save()
    return NextResponse.json({ message: 'প্রজেক্ট সফলভাবে যোগ করা হয়েছে', project }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'প্রজেক্ট যোগ করতে সমস্যা হয়েছে' }, { status: 500 })
  }
}
