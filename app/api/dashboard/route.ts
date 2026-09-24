import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Client from '@/models/Client'
import Payment from '@/models/Payment'
import Project from '@/models/Project'
import SupportTicket from '@/models/SupportTicket'
import Representative from '@/models/Representative'

export async function GET() {
  try {
    await connectDB()

    const [
      totalClients,
      activeClients,
      totalProjects,
      activeProjects,
      totalPayments,
      openTickets,
      totalReps,
      activeReps,
    ] = await Promise.all([
      Client.countDocuments(),
      Client.countDocuments({ status: 'সক্রিয়' }),
      Project.countDocuments(),
      Project.countDocuments({ status: { $in: ['উন্নয়নাধীন', 'পরীক্ষামূলক', 'রক্ষণাবেক্ষণ'] } }),
      Payment.find(),
      SupportTicket.countDocuments({ status: { $ne: 'সমাধান হয়েছে' } }),
      Representative.countDocuments(),
      Representative.countDocuments({ status: 'সক্রিয়' }),
    ])

    const totalRevenue = totalPayments.reduce((sum, p) => sum + p.paidAmount, 0)
    const totalDue     = totalPayments.reduce((sum, p) => sum + p.dueAmount, 0)
    const dueClients   = totalPayments.filter((p) => p.dueAmount > 0).length

    // Monthly revenue for chart (last 6 months)
    const monthlyRevenue = []
    for (let i = 5; i >= 0; i--) {
      const date  = new Date()
      date.setMonth(date.getMonth() - i)
      const year  = date.getFullYear()
      const month = date.getMonth()

      const monthPayments = totalPayments.filter((p) => {
        const pd = new Date(p.updatedAt)
        return pd.getFullYear() === year && pd.getMonth() === month
      })

      const revenue = monthPayments.reduce((sum, p) => sum + p.paidAmount, 0)
      const banglaMonths = ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর']
      monthlyRevenue.push({ month: banglaMonths[month], revenue })
    }

    // Recent clients
    const recentClients = await Client.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name businessName status createdAt district')

    // Recent tickets
    const recentTickets = await SupportTicket.find({ status: { $ne: 'সমাধান হয়েছে' } })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('clientId', 'name')
      .select('title status priority createdAt clientId')

    // Due clients list
    const duePayments = await Payment.find({ dueAmount: { $gt: 0 } })
      .populate('clientId', 'name phone')
      .populate('projectId', 'name')
      .sort({ dueAmount: -1 })
      .limit(5)

    return NextResponse.json({
      stats: {
        totalClients,
        activeClients,
        totalProjects,
        activeProjects,
        totalRevenue,
        totalDue,
        dueClients,
        openTickets,
        totalReps,
        activeReps,
      },
      monthlyRevenue,
      recentClients,
      recentTickets,
      duePayments,
    })
  } catch (error) {
    console.error('Dashboard error:', error)
    return NextResponse.json({ error: 'ড্যাশবোর্ড ডেটা লোড করতে সমস্যা হয়েছে' }, { status: 500 })
  }
}
