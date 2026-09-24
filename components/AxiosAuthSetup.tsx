'use client'

import { useEffect } from 'react'
import axios from 'axios'
import { auth } from '@/lib/firebase'

/**
 * This component sets up an Axios interceptor that automatically attaches
 * the Firebase ID token as a Bearer token to every API request.
 * Mount it once near the root of the app (inside AuthProvider).
 */
export default function AxiosAuthSetup() {
  useEffect(() => {
    const interceptorId = axios.interceptors.request.use(async (config) => {
      const user = auth.currentUser
      if (user) {
        try {
          const token = await user.getIdToken()
          config.headers = config.headers || {}
          config.headers['Authorization'] = `Bearer ${token}`
        } catch {
          // Token refresh failed — proceed without token (server will return 401)
        }
      }
      return config
    })

    // Cleanup interceptor on unmount
    return () => {
      axios.interceptors.request.eject(interceptorId)
    }
  }, [])

  return null
}
