import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { SimpleNotificationProvider } from '@/components/ui/SimpleNotificationProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Trust TAI OS - Project Management',
  description: 'Advanced project management and team collaboration platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SimpleNotificationProvider>
          {children}
        </SimpleNotificationProvider>
      </body>
    </html>
  )
} 