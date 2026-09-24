import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Representative from '@/models/Representative'
import BroadcastMessage from '@/models/BroadcastMessage'
import { broadcastMessage } from '@/lib/telegram'

export async function GET() {
  try {
    await connectDB()
    const messages = await BroadcastMessage.find().sort({ createdAt: -1 }).limit(50)
    return NextResponse.json({ messages })
  } catch (error) {
    return NextResponse.json({ error: 'বার্তার ইতিহাস লোড করতে সমস্যা হয়েছে' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    const body = await request.json()
    const { title, message, imageUrl, targetDistrict, sentBy } = body

    // Find representatives with Telegram Chat IDs
    const filter: any = { status: 'সক্রিয়', telegramChatId: { $exists: true, $ne: '' } }
    if (targetDistrict) filter.district = targetDistrict

    const reps = await Representative.find(filter)

    if (reps.length === 0) {
      return NextResponse.json({ error: 'কোনো প্রতিনিধির Telegram Chat ID পাওয়া যায়নি' }, { status: 400 })
    }

    const chatIds = reps.map((r) => r.telegramChatId!)

    // Send broadcast
    const result = await broadcastMessage(chatIds, message, imageUrl)

    // Save broadcast record
    const broadcastRecord = new BroadcastMessage({
      title,
      message,
      imageUrl,
      targetDistrict,
      recipientCount: reps.length,
      successCount:   result.success,
      failedCount:    result.failed,
      sentBy,
      results: result.results.map((r, i) => ({
        representativeId: reps[chatIds.indexOf(r.chatId)]?._id,
        name:             reps[chatIds.indexOf(r.chatId)]?.name || 'অজানা',
        chatId:           r.chatId,
        success:          r.ok,
      })),
    })

    await broadcastRecord.save()

    return NextResponse.json({
      message: `${result.success} জনকে সফলভাবে বার্তা পাঠানো হয়েছে, ${result.failed} জনের ক্ষেত্রে ব্যর্থ হয়েছে`,
      result,
      broadcastId: broadcastRecord._id,
    })
  } catch (error) {
    console.error('Broadcast error:', error)
    return NextResponse.json({ error: 'বার্তা পাঠাতে সমস্যা হয়েছে' }, { status: 500 })
  }
}
