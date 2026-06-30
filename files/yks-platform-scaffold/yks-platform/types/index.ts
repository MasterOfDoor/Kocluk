export type UserRole = 'teacher' | 'student' | 'admin'

export type ApprovalStatus = 'pending' | 'approved' | 'rejected'

export type RequestStatus = 'pending' | 'accepted' | 'rejected'

export type TaskCategory = 'Soru Bankası' | 'Konu Tekrarı' | 'Deneme' | 'Video'

export interface User {
  id: string
  name: string
  role: UserRole
  email: string
  approval_status?: ApprovalStatus
  avatar_url?: string | null
  bio?: string | null
}

export interface TeacherProfile extends User {
  avatar_url: string | null
  bio: string | null
  approval_status: ApprovalStatus
}

export interface TeacherRequest {
  id: string
  student_id: string
  teacher_id: string
  status: RequestStatus
  message: string | null
  created_at: string
  updated_at: string
  student?: Pick<User, 'id' | 'name' | 'email'>
  teacher?: Pick<User, 'id' | 'name' | 'email' | 'avatar_url' | 'bio'>
}

export interface Task {
  id: string
  student_id: string
  day_of_week: number
  slot_index: number
  category: TaskCategory
  title: string
  content: string | null
  duration_hours: number
}

export interface SlotCoords {
  day: number
  slot: number
}

export interface TaskFormValues {
  category: TaskCategory
  title: string
  content: string
  duration_hours: number
}
