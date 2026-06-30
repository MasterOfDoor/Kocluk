import { createClient } from '@/lib/supabase/client'
import type { TeacherProfile, TeacherRequest } from '@/types'

export async function getApprovedTeachers(search?: string): Promise<TeacherProfile[]> {
  const supabase = createClient()
  let query = supabase
    .from('users')
    .select('id, name, email, role, avatar_url, bio, approval_status')
    .eq('role', 'teacher')
    .eq('approval_status', 'approved')

  if (search?.trim()) {
    query = query.ilike('name', `%${search.trim()}%`)
  }

  const { data, error } = await query.order('name')
  if (error) throw error
  return data as TeacherProfile[]
}

export async function sendTeacherRequest(teacherId: string, message?: string): Promise<TeacherRequest> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('teacher_requests')
    .insert({ student_id: user.id, teacher_id: teacherId, message: message ?? null })
    .select()
    .single()

  if (error) throw error
  return data as TeacherRequest
}

export async function getMyRequests(): Promise<TeacherRequest[]> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('teacher_requests')
    .select('*, teacher:users!teacher_id(id, name, avatar_url, bio)')
    .eq('student_id', user.id)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as TeacherRequest[]
}

export async function updateTeacherProfile(updates: {
  bio?: string
  avatar_url?: string
}): Promise<void> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', user.id)

  if (error) throw error
}

export async function uploadAvatar(file: File): Promise<string> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const ext = file.name.split('.').pop() ?? 'jpg'
  const path = `${user.id}/avatar.${ext}`

  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(path, file, { upsert: true })

  if (uploadError) throw uploadError

  const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(path)
  await updateTeacherProfile({ avatar_url: publicUrl })
  return publicUrl
}
