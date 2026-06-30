import { createClient } from '@/lib/supabase/client'
import type { TeacherRequest, RequestStatus } from '@/types'

export async function getIncomingRequests(): Promise<TeacherRequest[]> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('teacher_requests')
    .select('*, student:users!student_id(id, name, email)')
    .eq('teacher_id', user.id)
    .eq('status', 'pending')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as TeacherRequest[]
}

export async function respondToRequest(
  requestId: string,
  status: Extract<RequestStatus, 'accepted' | 'rejected'>
): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase
    .from('teacher_requests')
    .update({ status })
    .eq('id', requestId)

  if (error) throw error
}
