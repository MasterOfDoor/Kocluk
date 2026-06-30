import { createClient } from '@/lib/supabase/server'
import { getStudentTasks } from '@/lib/tasks'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import WeeklyGrid from '@/components/schedule/WeeklyGrid'
import Avatar from '@/components/ui/Avatar'

interface Props {
  params: { id: string }
}

export default async function StudentSchedulePage({ params }: Props) {
  const supabase = createClient()
  const studentId = params.id

  const [{ data: student }, tasks] = await Promise.all([
    supabase.from('users').select('name, email, avatar_url, bio').eq('id', studentId).single(),
    getStudentTasks(studentId, supabase),
  ])

  return (
    <>
      <Header />
      <main className="flex-1 container-app py-10 space-y-8">
        
        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <Avatar src={student?.avatar_url} name={student?.name ?? 'Öğrenci'} size="lg" />
          <div className="text-center sm:text-left flex-1">
            <h1 className="text-2xl font-bold text-gray-900">{student?.name ?? 'Öğrenci'}</h1>
            <p className="text-sm text-gray-500 mt-1">{student?.email}</p>
            {student?.bio && (
              <div className="mt-4 p-4 bg-indigo-50/50 rounded-lg text-sm text-gray-700 italic border border-indigo-100/50 inline-block">
                "{student.bio}"
              </div>
            )}
          </div>
        </div>

        {/* Schedule */}
        <div>
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Haftalık Çalışma Programı</h2>
          <WeeklyGrid studentId={studentId} initialTasks={tasks} />
        </div>

      </main>
      <Footer />
    </>
  )
}
