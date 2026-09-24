import { NextRequest, NextResponse } from 'next/server'
import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'

// Initialize Firebase Admin (once)
function getAdminApp() {
  if (getApps().length > 0) return getApps()[0]
  return initializeApp({
    credential: cert({
      projectId:   process.env.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      // The private key comes with escaped \n — replace them with real newlines
      privateKey:  process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  })
}

/**
 * Verify the Firebase ID token from the Authorization header.
 * Returns the decoded token if valid, or a 401 NextResponse if not.
 */
export async function verifyAuth(request: NextRequest): Promise<
  { uid: string; email?: string } | NextResponse
> {
  const authorization = request.headers.get('Authorization')
  if (!authorization?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'অনুমোদন প্রয়োজন' }, { status: 401 })
  }

  const idToken = authorization.split('Bearer ')[1]
  try {
    getAdminApp()
    const decoded = await getAuth().verifyIdToken(idToken)
    // Optional: check admin email whitelist
    const adminEmails = (process.env.ADMIN_EMAIL || '')
      .split(',')
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean)

    if (adminEmails.length > 0 && decoded.email) {
      if (!adminEmails.includes(decoded.email.toLowerCase())) {
        return NextResponse.json({ error: 'অ্যাক্সেস অস্বীকৃত' }, { status: 403 })
      }
    }

    return { uid: decoded.uid, email: decoded.email }
  } catch {
    return NextResponse.json({ error: 'অবৈধ টোকেন' }, { status: 401 })
  }
}

/** Helper: returns true if verifyAuth returned a NextResponse (i.e. failed) */
export function isAuthError(result: unknown): result is NextResponse {
  return result instanceof NextResponse
}
