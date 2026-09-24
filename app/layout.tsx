import type { Metadata } from 'next'
import { Hind_Siliguri } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'

const hindSiliguri = Hind_Siliguri({
  weight:   ['300', '400', '500', '600', '700'],
  subsets:  ['bengali', 'latin'],
  variable: '--font-hind-siliguri',
  display:  'swap',
})

export const metadata: Metadata = {
  title:       'Aulad IT Solution — ম্যানেজমেন্ট সিস্টেম',
  description: 'Aulad IT Solution এর সম্পূর্ণ ব্যবসায়িক ম্যানেজমেন্ট প্ল্যাটফর্ম',
  keywords:    'IT Solution, MERN Stack, Web Development, Bangladesh',
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="bn" className={hindSiliguri.variable}>
      <body className={`${hindSiliguri.className} bg-dark-bg text-white antialiased`}>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background:  '#1a1a2e',
              color:       '#fff',
              border:      '1px solid #2d2d4a',
              borderRadius: '12px',
              fontFamily:  'Hind Siliguri, sans-serif',
            },
            success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
            error:   { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
          }}
        />
      </body>
    </html>
  )
}
