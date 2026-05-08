import type { Metadata } from 'next'
import { Geist, Fraunces } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist', display: 'swap' })
const fraunces = Fraunces({ subsets: ['latin'], variable: '--font-fraunces', display: 'swap' })

export const metadata: Metadata = {
  title: 'Učbenik.net – Rabljeni učbeniki za Slovenijo',
  description: 'Kupi ali prodaj rabljene učbenike za slovensko srednjo šolo. Hitro, preprosto, brez provizij.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sl" className={`${geist.variable} ${fraunces.variable} h-full`}>
      <body className="min-h-full flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
