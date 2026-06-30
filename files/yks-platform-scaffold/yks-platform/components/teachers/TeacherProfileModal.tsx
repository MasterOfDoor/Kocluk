'use client'

import { useState } from 'react'
import type { TeacherProfile } from '@/types'
import Avatar from '@/components/ui/Avatar'
import Button from '@/components/ui/Button'
import { sendTeacherRequest } from '@/lib/teachers'

interface Props {
  teacher: TeacherProfile
  existingStatus?: string
  onClose: () => void
  onRequestSent: () => void
}

export default function TeacherProfileModal({
  teacher,
  existingStatus,
  onClose,
  onRequestSent,
}: Props) {
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSendRequest() {
    setLoading(true)
    setError('')
    try {
      await sendTeacherRequest(teacher.id, message || undefined)
      onRequestSent()
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'İstek gönderilemedi.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-start gap-4 mb-5">
          <Avatar src={teacher.avatar_url} name={teacher.name} size="lg" />
          <div>
            <h2 className="text-xl font-semibold">{teacher.name}</h2>
            <p className="text-sm text-gray-500">{teacher.email}</p>
          </div>
        </div>

        <div className="mb-5">
          <h3 className="text-sm font-medium text-gray-700 mb-1">Hakkında</h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            {teacher.bio || 'Bu öğretmen henüz bir açıklama eklememiş.'}
          </p>
        </div>

        {!existingStatus && (
          <div className="mb-5">
            <label className="text-sm text-gray-600 block mb-1">Mesajınız (opsiyonel)</label>
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              rows={3}
              placeholder="Kendinizi kısaca tanıtın…"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
            />
          </div>
        )}

        {error && <p className="text-sm text-red-500 mb-3">{error}</p>}

        <div className="flex gap-3 justify-end">
          <Button variant="ghost" onClick={onClose}>Kapat</Button>
          {!existingStatus && (
            <Button onClick={handleSendRequest} disabled={loading}>
              {loading ? 'Gönderiliyor…' : 'İstek Gönder'}
            </Button>
          )}
          {existingStatus === 'pending' && (
            <span className="text-sm text-amber-600 self-center">Onay bekleniyor</span>
          )}
          {existingStatus === 'accepted' && (
            <span className="text-sm text-green-600 self-center">Eşleşme tamamlandı</span>
          )}
        </div>
      </div>
    </div>
  )
}
