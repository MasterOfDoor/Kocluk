'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { registerAction } from '@/app/actions/auth'

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<'teacher' | 'student'>('student')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    console.log('[FRONTEND] Starting registration', { name, email, role })
    setLoading(true)
    setError('')
    try {
      const result = await registerAction(name, email, password, role)
      console.log('[FRONTEND] Registration result', result)
      if (result.error) {
        console.error('[FRONTEND] Registration error:', result.error)
        setError(result.error)
        setLoading(false)
        return
      }
      console.log('[FRONTEND] Redirecting to', result.redirect)
      router.push(result.redirect!)
      router.refresh()
    } catch (error) {
      console.error('[FRONTEND] Submit error:', error)
      setError('Beklenmeyen bir hata oluştu.')
      setLoading(false)
    }
  }

  return (
    <>
      <Header />
      <main className="flex-1 flex items-center justify-center py-16 px-4">
        <div className="w-full max-w-md">
          <h1 className="text-2xl font-bold text-center mb-2">Kayıt Ol</h1>
          <p className="text-gray-500 text-center text-sm mb-8">
            YKS koçluk platformuna katılın
          </p>
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
            <Input
              id="name"
              label="Ad Soyad"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
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
              minLength={6}
              required
            />

            <div>
              <label className="text-sm text-gray-600 block mb-2">Rol</label>
              <div className="grid grid-cols-2 gap-3">
                {(['student', 'teacher'] as const).map(r => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`py-3 px-4 rounded-lg border text-sm font-medium transition-colors
                      ${role === r
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                  >
                    {r === 'student' ? 'Öğrenci' : 'Öğretmen'}
                  </button>
                ))}
              </div>
              {role === 'teacher' && (
                <p className="text-xs text-amber-600 mt-2">
                  Öğretmen kayıtları admin onayından sonra aktif olur.
                </p>
              )}
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Kaydediliyor…' : 'Kayıt Ol'}
            </Button>
          </form>
          <p className="text-center text-sm text-gray-500 mt-4">
            Zaten hesabınız var mı?{' '}
            <Link href="/login" className="text-indigo-600 hover:underline">Giriş yapın</Link>
          </p>
        </div>
      </main>
      <Footer />
    </>
  )
}
