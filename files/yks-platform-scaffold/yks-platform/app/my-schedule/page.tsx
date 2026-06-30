'use client'

import { useEffect, useState } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import EmptyState from '@/components/ui/EmptyState'
import WeeklyGrid from '@/components/schedule/WeeklyGrid'
import { createClient } from '@/lib/supabase/client'
import { getStudentTasks } from '@/lib/tasks'
import type { Task } from '@/types'

export default function MySchedulePage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [hasTeacher, setHasTeacher] = useState(false)
  const [userId, setUserId] = useState('')

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      setUserId(user.id)

      const { data: relation } = await supabase
        .from('teacher_student_relations')
        .select('teacher_id')
        .eq('student_id', user.id)
        .limit(1)
        .maybeSingle()

      setHasTeacher(!!relation)

      if (relation) {
        const taskData = await getStudentTasks(user.id)
        setTasks(taskData)
      }
      setLoading(false)
    }
    load()
  }, [])

  return (
    <>
      <Header />
      <main className="flex-1 container-app py-10">
        <h1 className="text-2xl font-bold mb-6">Programım</h1>
        {loading ? (
          <LoadingSpinner />
        ) : !hasTeacher ? (
          <EmptyState
            title="Henüz öğretmeniniz yok"
            description="Bir öğretmene istek gönderip kabul edildikten sonra programınız burada görünecek."
          />
        ) : (
          <WeeklyGrid studentId={userId} initialTasks={tasks} readOnly />
        )}
      </main>
      <Footer />
    </>
  )
}
