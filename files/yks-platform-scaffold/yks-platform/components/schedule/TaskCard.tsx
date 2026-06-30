import type { Task } from '@/types'

const CATEGORY_STYLES: Record<string, { bg: string, emoji: string }> = {
  'Soru Bankası': { bg: 'bg-gradient-to-br from-blue-100 to-blue-200 text-blue-900 border-blue-300', emoji: '📚' },
  'Konu Tekrarı': { bg: 'bg-gradient-to-br from-purple-100 to-purple-200 text-purple-900 border-purple-300', emoji: '🔄' },
  'Deneme':       { bg: 'bg-gradient-to-br from-orange-100 to-orange-200 text-orange-900 border-orange-300', emoji: '📝' },
  'Video':        { bg: 'bg-gradient-to-br from-emerald-100 to-emerald-200 text-emerald-900 border-emerald-300', emoji: '🎥' },
}

interface Props {
  task: Task
  isDragging?: boolean
  onContextMenu?: (e: React.MouseEvent) => void
}

export default function TaskCard({ task, isDragging, onContextMenu }: Props) {
  const style = CATEGORY_STYLES[task.category] ?? { bg: 'bg-gradient-to-br from-gray-100 to-gray-200 text-gray-800 border-gray-300', emoji: '📌' }
  
  return (
    <div
      onContextMenu={onContextMenu}
      className={`h-full p-2.5 rounded-xl border text-xs select-none shadow-sm
        ${style.bg}
        ${isDragging ? 'rotate-3 shadow-xl scale-105 opacity-90' : 'hover:-translate-y-0.5 hover:shadow-md'}
        transition-all duration-200 ease-out flex flex-col`}
    >
      <div className="flex items-start justify-between gap-1 mb-1">
        <p className="font-bold truncate leading-tight drop-shadow-sm">{task.title}</p>
        <span className="text-sm shrink-0 drop-shadow-sm">{style.emoji}</span>
      </div>
      <p className="opacity-80 mt-auto font-medium">{task.category}</p>
      <div className="flex items-center gap-1 mt-1 opacity-75 font-semibold">
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {task.duration_hours}s
      </div>
    </div>
  )
}
