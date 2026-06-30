'use client'

import { useEffect, useState } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Button from '@/components/ui/Button'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import EmptyState from '@/components/ui/EmptyState'
import { getIncomingRequests, respondToRequest } from '@/lib/requests'
import type { TeacherRequest } from '@/types'

export default function RequestsPage() {
  const [requests, setRequests] = useState<TeacherRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  async function loadRequests() {
    setLoading(true)
    try {
      setRequests(await getIncomingRequests())
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadRequests() }, [])

  async function handleRespond(id: string, status: 'accepted' | 'rejected') {
    setActionLoading(id)
    try {
      await respondToRequest(id, status)
      await loadRequests()
    } finally {
      setActionLoading(null)
    }
  }

  return (
    <>
      <Header />
      <main className="flex-1 container-app py-10">
        <h1 className="text-2xl font-bold mb-2">Gelen İstekler</h1>
        <p className="text-gray-500 text-sm mb-8">Öğrencilerden gelen eşleşme isteklerini yönetin.</p>

        {loading ? (
          <LoadingSpinner />
        ) : requests.length === 0 ? (
          <EmptyState title="Bekleyen istek yok" description="Yeni istekler burada görünecek." />
        ) : (
          <div className="space-y-4 max-w-2xl">
            {requests.map(req => (
              <div key={req.id} className="bg-white rounded-xl border border-gray-200 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium">{req.student?.name}</p>
                    <p className="text-sm text-gray-500">{req.student?.email}</p>
                    {req.message && (
                      <p className="text-sm text-gray-600 mt-2 italic">&ldquo;{req.message}&rdquo;</p>
                    )}
                    <p className="text-xs text-gray-400 mt-2">
                      {new Date(req.created_at).toLocaleDateString('tr-TR')}
                    </p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Button
                      size="sm"
                      onClick={() => handleRespond(req.id, 'accepted')}
                      disabled={actionLoading === req.id}
                    >
                      Kabul Et
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleRespond(req.id, 'rejected')}
                      disabled={actionLoading === req.id}
                    >
                      Reddet
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  )
}
