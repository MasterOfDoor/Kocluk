import { createClient } from '@/lib/supabase/server'
import { getStudentTasks } from '@/lib/tasks'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import WeeklyGrid from '@/components/schedule/WeeklyGrid'

interface Props {
  params: { id: string }
}

export default async function StudentSchedulePage({ params }: Props) {
  const supabase = createClient()
  const studentId = params.id

  const [{ data: student }, tasks] = await Promise.all([
    supabase.from('users').select('name').eq('id', studentId).single(),
    getStudentTasks(studentId, supabase),
  ])

  return (
    <>
      <Header />
      <main className="flex-1 container-app py-10">
        <h1 className="text-xl font-semibold mb-6">
          {student?.name ?? 'Öğrenci'} — Haftalık Program
        </h1>
        <WeeklyGrid studentId={studentId} initialTasks={tasks} />
      </main>
      <Footer />
    </>
  )
}
