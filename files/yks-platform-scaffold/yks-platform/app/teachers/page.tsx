'use client'

import { useEffect, useState } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Input from '@/components/ui/Input'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import EmptyState from '@/components/ui/EmptyState'
import TeacherCard from '@/components/teachers/TeacherCard'
import TeacherProfileModal from '@/components/teachers/TeacherProfileModal'
import { getApprovedTeachers, getMyRequests } from '@/lib/teachers'
import type { TeacherProfile, TeacherRequest } from '@/types'

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<TeacherProfile[]>([])
  const [requests, setRequests] = useState<TeacherRequest[]>([])
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<TeacherProfile | null>(null)
  const [loading, setLoading] = useState(true)

  async function loadData(query?: string) {
    setLoading(true)
    try {
      const [teacherData, requestData] = await Promise.all([
        getApprovedTeachers(query),
        getMyRequests(),
      ])
      setTeachers(teacherData)
      setRequests(requestData)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadData() }, [])

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    loadData(search)
  }

  function getRequestStatus(teacherId: string) {
    return requests.find(r => r.teacher_id === teacherId)?.status
  }

  return (
    <>
      <Header />
      <main className="flex-1 container-app py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">Öğretmenler</h1>
          <p className="text-gray-500 text-sm">Size uygun öğretmeni bulun ve eşleşme isteği gönderin.</p>
        </div>

        <form onSubmit={handleSearch} className="mb-8 flex gap-3">
          <div className="flex-1">
            <Input
              placeholder="Öğretmen adıyla ara…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Ara
          </button>
        </form>

        {loading ? (
          <LoadingSpinner />
        ) : teachers.length === 0 ? (
          <EmptyState
            title="Öğretmen bulunamadı"
            description="Henüz onaylı öğretmen bulunmuyor veya aramanızla eşleşen sonuç yok."
          />
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {teachers.map(teacher => (
              <TeacherCard
                key={teacher.id}
                teacher={teacher}
                onSelect={setSelected}
                requestStatus={getRequestStatus(teacher.id)}
              />
            ))}
          </div>
        )}

        {selected && (
          <TeacherProfileModal
            teacher={selected}
            existingStatus={getRequestStatus(selected.id)}
            onClose={() => setSelected(null)}
            onRequestSent={() => loadData(search)}
          />
        )}
      </main>
      <Footer />
    </>
  )
}
