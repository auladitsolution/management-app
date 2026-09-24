'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import {
  User,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth'
import { auth, googleProvider } from '@/lib/firebase'
import toast from 'react-hot-toast'

interface AuthContextType {
  user: User | null
  loading: boolean
  signInWithGoogle: () => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user:             null,
  loading:          true,
  signInWithGoogle: async () => {},
  logout:           async () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser]       = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })
    return unsubscribe
  }, [])

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider)
      const adminEmails = (process.env.NEXT_PUBLIC_ADMIN_EMAIL || '')
        .split(',')
        .map((e) => e.trim().toLowerCase())
        .filter(Boolean)

      // Admin email check (if configured, only listed emails can login)
      if (adminEmails.length > 0 && result.user.email) {
        const userEmail = result.user.email.trim().toLowerCase()
        if (!adminEmails.includes(userEmail)) {
          await signOut(auth)
          toast.error(`আপনার (${result.user.email}) এই অ্যাপে অ্যাক্সেস নেই।`)
          return
        }
      }
      toast.success(`স্বাগতম, ${result.user.displayName || 'অ্যাডমিন'}!`)
    } catch (error: any) {
      if (error.code !== 'auth/popup-closed-by-user') {
        toast.error('লগইন করতে সমস্যা হয়েছে')
      }
    }
  }

  const logout = async () => {
    try {
      await signOut(auth)
      toast.success('সফলভাবে লগআউট হয়েছে')
    } catch {
      toast.error('লগআউট করতে সমস্যা হয়েছে')
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
