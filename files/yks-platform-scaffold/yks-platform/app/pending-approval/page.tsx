'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Button from '@/components/ui/Button'
import { createClient } from '@/lib/supabase/client'

export default function PendingApprovalPage() {
  const router = useRouter()
  const [status, setStatus] = useState<'pending' | 'approved' | 'rejected'>('pending')

  useEffect(() => {
    async function checkStatus() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      const { data: profile } = await supabase
        .from('users')
        .select('approval_status, role')
        .eq('id', user.id)
        .single()

      if (!profile || profile.role !== 'teacher') {
        router.push('/')
        return
      }

      if (profile.approval_status === 'approved') {
        router.push('/dashboard')
        return
      }

      setStatus(profile.approval_status)
    }
    checkStatus()
  }, [router])

  const messages = {
    pending: {
      title: 'Onay Bekleniyor',
      description: 'Öğretmen kaydınız alındı. Admin ekibimiz profilinizi inceledikten sonra hesabınız aktif edilecektir.',
      color: 'text-amber-600',
    },
    rejected: {
      title: 'Başvuru Reddedildi',
      description: 'Öğretmen başvurunuz onaylanmadı. Daha fazla bilgi için destek ekibiyle iletişime geçin.',
      color: 'text-red-600',
    },
    approved: {
      title: 'Onaylandı',
      description: 'Hesabınız onaylandı, yönlendiriliyorsunuz…',
      color: 'text-green-600',
    },
  }

  const msg = messages[status]

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <>
      <Header />
      <main className="flex-1 flex items-center justify-center py-16 px-4">
        <div className="max-w-md text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-amber-100 flex items-center justify-center">
            <svg className={`w-8 h-8 ${msg.color}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-3">{msg.title}</h1>
          <p className="text-gray-500 mb-8">{msg.description}</p>
          <Button variant="ghost" onClick={handleLogout}>Çıkış Yap</Button>
        </div>
      </main>
      <Footer />
    </>
  )
}
