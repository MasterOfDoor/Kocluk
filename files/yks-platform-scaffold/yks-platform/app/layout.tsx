import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'Zeynobot The Koç',
  description: 'Zeynep Naz Karahangil (Sayısal 13.105) ile YKS hazırlık sürecinde kişiye özel koçluk ve hedef odaklı çalışma programı.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body className={`${inter.variable} font-sans min-h-screen flex flex-col`}>
        {children}
      </body>
    </html>
  )
}
