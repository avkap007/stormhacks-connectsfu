import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
import { Roboto } from "next/font/google";

const inter = Inter({ subsets: ['latin'] })

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-roboto",
});

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
        </AuthProvider>
      </body>
    </html>
  )
}