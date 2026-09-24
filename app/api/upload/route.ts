import { NextRequest, NextResponse } from 'next/server'
import { uploadToCloudinary } from '@/lib/cloudinary'
import { verifyAuth, isAuthError } from '@/lib/auth'

export async function POST(request: NextRequest) {
  const auth = await verifyAuth(request)
  if (isAuthError(auth)) return auth
  try {
    const formData = await request.formData()
    const file     = formData.get('file') as File
    const folder   = (formData.get('folder') as string) || 'aulad-management'

    if (!file) {
      return NextResponse.json({ error: 'কোনো ফাইল পাওয়া যায়নি' }, { status: 400 })
    }

    const bytes  = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const resourceType = file.type.startsWith('image/') ? 'image' : 'raw'
    const result       = await uploadToCloudinary(buffer, folder, resourceType as any)

    return NextResponse.json({
      url:      result.url,
      publicId: result.publicId,
      message:  'ফাইল সফলভাবে আপলোড হয়েছে',
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'ফাইল আপলোড করতে সমস্যা হয়েছে' }, { status: 500 })
  }
}
