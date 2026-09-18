import type { Metadata, Viewport } from 'next'
import { Cormorant_Garamond, DM_Sans } from 'next/font/google'
import './globals.css'
import Cursor from '@/components/aurelia/cursor'

const display = Cormorant_Garamond({ variable: '--font-display', subsets: ['latin'], weight: ['400', '500', '600'], style: ['normal', 'italic'] })
const sans = DM_Sans({ variable: '--font-sans', subsets: ['latin'], weight: ['400', '500', '600'] })

export const metadata: Metadata = {
  title: 'Aurelia Retreat — Where the cliff meets silence',
  description: 'A private cliffside retreat on the Amalfi Coast, designed for slower days.',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
}

export const viewport: Viewport = { themeColor: '#eee9df', colorScheme: 'light', userScalable: false }

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className="bg-background"><body className={`${display.variable} ${sans.variable}`}><Cursor />{children}</body></html>
}
