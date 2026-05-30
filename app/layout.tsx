import type { Metadata } from 'next'
import './globals.css'
import SyncOnline from '@/components/SyncOnline'

export const metadata: Metadata = {
  title: 'Ritasi App',
  description: 'Pencatatan perjalanan truk digital',
  manifest: '/manifest.json',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <head>
        <meta name="theme-color" content="#15803d" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Ritasi" />
      </head>
      <body>
        <SyncOnline />
        {children}
      </body>
    </html>
  )
}