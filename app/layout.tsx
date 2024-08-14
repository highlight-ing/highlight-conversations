import '@/app/globals.css'
import type { Metadata } from 'next'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import { meta } from '@/config/meta'
import { cn } from '@/lib/utils'

export const metadata: Metadata = {
  title: meta.title,
  metadataBase: meta.baseURL,
  description: meta.description,
  openGraph: {
    title: meta.title,
    siteName: meta.siteName,
    description: meta.description,
  },
  twitter: {
    title: meta.title,
    description: meta.description,
    card: 'summary_large_image',
  },
}

interface RootLayoutProps {
  readonly children: React.ReactNode
}

/*
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<meta name="theme-color" content="#FFFFFF">
*/

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html
      suppressHydrationWarning
      className={cn(
        'select-none overscroll-none scroll-smooth',
        GeistSans.variable,
        GeistMono.variable,
      )}
      lang="en"
    >
      <body className="bg-background text-foreground">
        <main className="font-sans antialiased min-h-screen">
          {children}
        </main>
      </body>
    </html>
  )
}