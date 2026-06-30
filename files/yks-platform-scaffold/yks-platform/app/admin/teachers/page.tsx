'use client'

import { useEffect, useState } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Avatar from '@/components/ui/Avatar'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import EmptyState from '@/components/ui/EmptyState'
import { getPendingTeachers, getApprovedTeachersAdmin, updateTeacherApproval } from '@/lib/admin'
import type { TeacherProfile } from '@/types'

export default function AdminTeachersPage() {
  const [pending, setPending] = useState<TeacherProfile[]>([])
  const [approved, setApproved] = useState<TeacherProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  async function loadData() {
    setLoading(true)
    try {
      const [pendingData, approvedData] = await Promise.all([
        getPendingTeachers(),
        getApprovedTeachersAdmin(),
      ])
      setPending(pendingData)
      setApproved(approvedData)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadData() }, [])

  async function handleAction(teacherId: string, status: 'approved' | 'rejected') {
    setActionLoading(teacherId)
    try {
      await updateTeacherApproval(teacherId, status)
      await loadData()
    } finally {
      setActionLoading(null)
    }
  }

  return (
    <>
      <Header />
      <main className="flex-1 container-app py-10">
        <h1 className="text-2xl font-bold mb-8">Öğretmen Yönetimi</h1>

        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            <section className="mb-12">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                Onay Bekleyenler
                {pending.length > 0 && <Badge variant="warning">{pending.length}</Badge>}
              </h2>
              {pending.length === 0 ? (
                <EmptyState title="Onay bekleyen öğretmen yok" />
              ) : (
                <div className="space-y-3">
                  {pending.map(teacher => (
                    <div key={teacher.id} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <Avatar src={teacher.avatar_url} name={teacher.name} />
                        <div>
                          <p className="font-medium">{teacher.name}</p>
                          <p className="text-sm text-gray-500">{teacher.email}</p>
                        </div>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <Button
                          size="sm"
                          onClick={() => handleAction(teacher.id, 'approved')}
                          disabled={actionLoading === teacher.id}
                        >
                          Onayla
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => handleAction(teacher.id, 'rejected')}
                          disabled={actionLoading === teacher.id}
                        >
                          Reddet
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-4">Onaylı Öğretmenler</h2>
              {approved.length === 0 ? (
                <EmptyState title="Onaylı öğretmen yok" />
              ) : (
                <div className="grid md:grid-cols-2 gap-3">
                  {approved.map(teacher => (
                    <div key={teacher.id} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3">
                      <Avatar src={teacher.avatar_url} name={teacher.name} />
                      <div>
                        <p className="font-medium">{teacher.name}</p>
                        <p className="text-sm text-gray-500">{teacher.email}</p>
                      </div>
                      <Badge variant="success">Onaylı</Badge>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </main>
      <Footer />
    </>
  )
}
