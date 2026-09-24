'use client'

import { AuthProvider } from '@/contexts/AuthContext'
import DashboardLayout from '@/components/layout/DashboardLayout'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <DashboardLayout>{children}</DashboardLayout>
    </AuthProvider>
  )
}
