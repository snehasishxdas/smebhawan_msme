import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Inter, Space_Grotesk } from 'next/font/google'
import { BackgroundVideo } from '@/components/site/bg-video'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'smebhawan — Building Together | Raw Materials & Credit for India’s MSMEs',
  description:
    'smebhawan connects India’s MSMEs directly to vetted raw-material suppliers — cutting out middlemen and layering in embedded credit. Aligned with the Ministry of MSME ecosystem.',
  generator: 'v0.app',
  keywords: [
    'MSME',
    'raw materials',
    'B2B procurement',
    'Butamine',
    'supply chain',
    'embedded credit',
    'Udyam',
    'India manufacturing',
  ],
  openGraph: {
    title: 'smebhawan — Building Together',
    description:
      'B2B raw-materials procurement & credit platform for India’s MSMEs. Source direct, skip the middlemen, unlock credit.',
    type: 'website',
    images: ['/warehouse.png'],
  },
  icons: {
    icon: '/logo.jpg',
    apple: '/logo.jpg',
  },
}

export const viewport: Viewport = {
  themeColor: '#1f2a44',
  colorScheme: 'light',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`dark ${inter.variable} ${spaceGrotesk.variable}`}
    >
      <body className="antialiased bg-slate-950 font-sans text-foreground">
        <BackgroundVideo />
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
