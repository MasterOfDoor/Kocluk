'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { loginAction } from '@/app/actions/auth'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const result = await loginAction(email, password)
    if (result.error) {
      setError(result.error)
      setLoading(false)
      return
    }
    router.push(result.redirect!)
    router.refresh()
  }

  return (
    <>
      <Header />
      <main className="flex-1 flex items-center justify-center py-16 px-4">
        <div className="w-full max-w-md">
          <h1 className="text-2xl font-bold text-center mb-2">Giriş Yap</h1>
          <p className="text-gray-500 text-center text-sm mb-8">
            Hesabınıza giriş yapın
          </p>
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
            <Input
              id="email"
              label="E-posta"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <Input
              id="password"
              label="Şifre"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Giriş yapılıyor…' : 'Giriş Yap'}
            </Button>
            <div className="text-center">
              <Link href="/forgot-password" className="text-sm text-indigo-600 hover:underline">
                Şifremi unuttum
              </Link>
            </div>
          </form>
          <p className="text-center text-sm text-gray-500 mt-4">
            Hesabınız yok mu?{' '}
            <Link href="/register" className="text-indigo-600 hover:underline">Kayıt olun</Link>
          </p>
        </div>
      </main>
      <Footer />
    </>
  )
}
