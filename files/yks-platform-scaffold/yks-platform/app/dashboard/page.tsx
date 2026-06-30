'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import EmptyState from '@/components/ui/EmptyState'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@/types'

export default function DashboardPage() {
  const router = useRouter()
  const [students, setStudents] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      const { data, error } = await supabase
        .from('teacher_student_relations')
        .select('student:users!student_id(id, name, email)')
        .eq('teacher_id', user.id)

      if (!error && data) {
        setStudents(data.map((r: any) => r.student))
      }
      setLoading(false)
    }
    load()
  }, [router])

  return (
    <>
      <Header />
      <main className="flex-1 container-app py-10">
        <h1 className="text-2xl font-bold mb-6">Öğrencilerim</h1>
        {loading ? (
          <LoadingSpinner />
        ) : students.length === 0 ? (
          <EmptyState
            title="Henüz öğrenciniz yok"
            description="Öğrenciler size istek gönderdiğinde ve kabul ettiğinizde burada görünecekler."
          />
        ) : (
          <ul className="space-y-3 max-w-2xl">
            {students.map(s => (
              <li key={s.id}>
                <button
                  onClick={() => router.push(`/student/${s.id}`)}
                  className="w-full text-left px-5 py-4 rounded-xl border border-gray-200 bg-white
                             hover:border-indigo-400 hover:bg-indigo-50 transition-colors"
                >
                  <span className="font-medium">{s.name}</span>
                  <span className="ml-3 text-sm text-gray-400">{s.email}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </main>
      <Footer />
    </>
  )
}
