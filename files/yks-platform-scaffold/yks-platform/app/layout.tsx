import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'YKS Koçluk Platformu',
  description: 'YKS hazırlık süreciniz için kişiselleştirilmiş koçluk ve haftalık program yönetimi',
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
