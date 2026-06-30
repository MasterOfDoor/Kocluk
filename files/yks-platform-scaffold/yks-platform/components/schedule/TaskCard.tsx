// components/schedule/TaskCard.tsx
import type { Task } from '@/types'

const CATEGORY_COLORS: Record<string, string> = {
  'Soru Bankası': 'bg-blue-100 text-blue-800 border-blue-200',
  'Konu Tekrarı': 'bg-purple-100 text-purple-800 border-purple-200',
  'Deneme':       'bg-orange-100 text-orange-800 border-orange-200',
  'Video':        'bg-green-100 text-green-800 border-green-200',
}

interface Props {
  task: Task
  isDragging?: boolean
}

export default function TaskCard({ task, isDragging }: Props) {
  const colorClass = CATEGORY_COLORS[task.category] ?? 'bg-gray-100 text-gray-700'
  return (
    <div
      className={`h-full p-2 rounded-lg border text-xs select-none
        ${colorClass}
        ${isDragging ? 'rotate-2 shadow-lg scale-105' : ''}
        transition-transform`}
    >
      <p className="font-semibold truncate">{task.title}</p>
      <p className="opacity-70 mt-0.5">{task.category}</p>
      <p className="opacity-60 mt-0.5">{task.duration_hours}s</p>
    </div>
  )
}
