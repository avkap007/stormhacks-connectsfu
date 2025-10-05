import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
import { IBM_Plex_Sans } from "next/font/google";
import AuthModalWrapper from '@/components/AuthModalWrapper';

const inter = Inter({ subsets: ['latin'] })

const roboto = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-roboto",
})

export const metadata: Metadata = {
  title: 'ConnectSFU - Find Your Campus Community',
  description: 'Discover events, find buddies, and connect with your SFU community',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={roboto.variable}>
      <body className="font-sans lg:snap-y lg:snap-mandatory">
        <AuthProvider>
          {children}
          <AuthModalWrapper />
        </AuthProvider>
      </body>
    </html>
  )
}