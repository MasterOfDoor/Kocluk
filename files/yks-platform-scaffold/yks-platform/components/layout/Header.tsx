'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { UserRole } from '@/types'
import Button from '@/components/ui/Button'

interface NavUser {
  name: string
  role: UserRole
}

export default function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<NavUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadUser() {
      const supabase = createClient()
      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (!authUser) {
        setUser(null)
        setLoading(false)
        return
      }
      const { data: profile } = await supabase
        .from('users')
        .select('name, role')
        .eq('id', authUser.id)
        .single()
      if (profile) setUser(profile as NavUser)
      setLoading(false)
    }
    loadUser()
  }, [pathname])

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const navLinks = getNavLinks(user?.role)

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="container-app flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-indigo-600">
          <span className="w-8 h-8 bg-indigo-600 text-white rounded-lg flex items-center justify-center text-sm">YKS</span>
          Koçluk
        </Link>

        {!loading && (
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  pathname.startsWith(link.href) ? 'text-indigo-600' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}

        <div className="flex items-center gap-3">
          {loading ? null : user ? (
            <>
              <span className="text-sm text-gray-600 hidden sm:block">{user.name}</span>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                Çıkış
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">Giriş Yap</Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Kayıt Ol</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

function getNavLinks(role?: UserRole) {
  if (role === 'admin') {
    return [{ href: '/admin/teachers', label: 'Öğretmen Onayları' }]
  }
  if (role === 'teacher') {
    return [
      { href: '/dashboard', label: 'Öğrencilerim' },
      { href: '/dashboard/requests', label: 'İstekler' },
      { href: '/dashboard/profile', label: 'Profil' },
    ]
  }
  if (role === 'student') {
    return [
      { href: '/teachers', label: 'Öğretmenler' },
      { href: '/my-schedule', label: 'Programım' },
    ]
  }
  return [
    { href: '/#features', label: 'Özellikler' },
    { href: '/#how-it-works', label: 'Nasıl Çalışır' },
  ]
}
