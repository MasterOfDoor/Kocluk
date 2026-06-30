import type { TeacherProfile } from '@/types'
import Avatar from '@/components/ui/Avatar'
import Card from '@/components/ui/Card'

interface Props {
  teacher: TeacherProfile
  onSelect: (teacher: TeacherProfile) => void
  requestStatus?: string
}

export default function TeacherCard({ teacher, onSelect, requestStatus }: Props) {
  return (
    <Card hover onClick={() => onSelect(teacher)}>
      <div className="flex items-start gap-4">
        <Avatar src={teacher.avatar_url} name={teacher.name} size="lg" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-semibold text-gray-900 truncate">{teacher.name}</h3>
            {requestStatus && (
              <span className="text-xs text-indigo-600 font-medium shrink-0">
                {requestStatus === 'pending' && 'İstek gönderildi'}
                {requestStatus === 'accepted' && 'Eşleşildi'}
                {requestStatus === 'rejected' && 'Reddedildi'}
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-2 line-clamp-3">
            {teacher.bio || 'Henüz açıklama eklenmemiş.'}
          </p>
        </div>
      </div>
    </Card>
  )
}
