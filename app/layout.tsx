import { Inter } from 'next/font/google'
import './global.css'

import { Analytics } from '@vercel/analytics/react'
import type { Metadata } from 'next'
//import { GeistMono } from "geist/font/mono";
//import { GeistSans } from "geist/font/sans";
import { cx } from 'lib/utils'

import { TRPCProvider } from 'server/trpc/query-client'
import Sidebar from '../components/sidebar'
//import { TrpcProvider } from "./providers";

export const metadata: Metadata = {
  metadataBase: new URL('http://localhost:3000'),
  title: {
    default: 'Mustaqim Arifin',
    template: '%s | Mustaqim Arifin',
  },
  description: 'Developer, writer, and creator.',
  openGraph: {
    title: 'Mustaqim Arifin',
    description: 'Developer, writer, and creator.',
    url: 'http://localhost:3000',
    siteName: 'Mustaqim Arifin',
    locale: 'en_US',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  twitter: {
    title: 'Mustaqim Arifin',
    card: 'summary_large_image',
  },
}

const inter = Inter({
  variable: '--font-sans',
  display: 'swap',
  subsets: ['latin'],
})

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={cx(
        'text-black bg-white dark:text-white dark:bg-[#111010]',
        inter.variable
      )}
    >
      <body className="mx-4 mb-40 mt-8 flex max-w-2xl flex-col antialiased md:flex-row lg:mx-auto">
        <main className="mt-6 flex min-w-0 flex-auto flex-col px-2 md:px-0">
          <Sidebar />
          <TRPCProvider>{children}</TRPCProvider>
          <Analytics />
        </main>
      </body>
    </html>
  )
}
