import { createClient } from '@/lib/supabase/client'
import type { TeacherProfile, ApprovalStatus } from '@/types'

export async function getPendingTeachers(): Promise<TeacherProfile[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('users')
    .select('id, name, email, role, avatar_url, bio, approval_status, created_at')
    .eq('role', 'teacher')
    .eq('approval_status', 'pending')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as TeacherProfile[]
}

export async function getApprovedTeachersAdmin(): Promise<TeacherProfile[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('users')
    .select('id, name, email, role, avatar_url, bio, approval_status')
    .eq('role', 'teacher')
    .eq('approval_status', 'approved')
    .order('name')

  if (error) throw error
  return data as TeacherProfile[]
}

export async function updateTeacherApproval(
  teacherId: string,
  status: Extract<ApprovalStatus, 'approved' | 'rejected'>
): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase
    .from('users')
    .update({ approval_status: status })
    .eq('id', teacherId)

  if (error) throw error
}
