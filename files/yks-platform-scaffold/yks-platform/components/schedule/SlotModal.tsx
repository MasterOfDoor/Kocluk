// components/schedule/SlotModal.tsx
'use client'
import { useState } from 'react'
import type { TaskCategory, TaskFormValues } from '@/types'

const CATEGORIES: TaskCategory[] = ['Soru Bankası', 'Konu Tekrarı', 'Deneme', 'Video']

interface Props {
  onConfirm: (values: TaskFormValues) => void
  onClose: () => void
  initialData?: TaskFormValues
}

export default function SlotModal({ onConfirm, onClose, initialData }: Props) {
  const [form, setForm] = useState<TaskFormValues>(initialData ?? {
    category: 'Soru Bankası',
    title: '',
    content: '',
    duration_hours: 1,
  })

  function set<K extends keyof TaskFormValues>(key: K, value: TaskFormValues[K]) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={onClose}>
      <div
        className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold mb-4">Görev Ekle</h2>

        <div className="space-y-4">
          {/* Category */}
          <div>
            <label className="text-sm text-gray-500 block mb-1">Kategori</label>
            <select
              value={form.category}
              onChange={e => set('category', e.target.value as TaskCategory)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Title */}
          <div>
            <label className="text-sm text-gray-500 block mb-1">Başlık</label>
            <input
              type="text"
              value={form.title}
              onChange={e => set('title', e.target.value)}
              placeholder="örn. Paragraf soruları"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          {/* Content */}
          <div>
            <label className="text-sm text-gray-500 block mb-1">İçerik / Notlar</label>
            <textarea
              value={form.content}
              onChange={e => set('content', e.target.value)}
              rows={3}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
            />
          </div>

          {/* Duration */}
          <div>
            <label className="text-sm text-gray-500 block mb-1">Süre (saat)</label>
            <input
              type="number"
              min={0.5}
              max={12}
              step={0.5}
              value={form.duration_hours}
              onChange={e => set('duration_hours', parseFloat(e.target.value))}
              className="w-32 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
        </div>

        <div className="mt-6 flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            İptal
          </button>
          <button
            onClick={() => form.title.trim() && onConfirm(form)}
            disabled={!form.title.trim()}
            className="px-5 py-2 text-sm font-medium bg-indigo-600 text-white rounded-lg 
                       hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Kaydet
          </button>
        </div>
      </div>
    </div>
  )
}
