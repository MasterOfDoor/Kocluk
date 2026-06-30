import type { SupabaseClient } from '@supabase/supabase-js'
import { createClient as createBrowserClient } from '@/lib/supabase/client'
import type { Task, TaskFormValues, SlotCoords } from '@/types'

function getClient(supabase?: SupabaseClient) {
  return supabase ?? createBrowserClient()
}

export async function getStudentTasks(
  studentId: string,
  supabase?: SupabaseClient
): Promise<Task[]> {
  const client = getClient(supabase)
  const { data, error } = await client
    .from('tasks')
    .select('*')
    .eq('student_id', studentId)
    .order('day_of_week')
    .order('slot_index')
  if (error) throw error
  return data as Task[]
}

export async function createTask(
  studentId: string,
  coords: SlotCoords,
  values: TaskFormValues,
  supabase?: SupabaseClient
): Promise<Task> {
  const client = getClient(supabase)
  const { data, error } = await client
    .from('tasks')
    .insert({
      student_id: studentId,
      day_of_week: coords.day,
      slot_index: coords.slot,
      ...values,
    })
    .select()
    .single()
  if (error) throw error
  return data as Task
}

export async function copyTaskToSlot(
  task: Task,
  target: SlotCoords,
  supabase?: SupabaseClient
): Promise<Task> {
  const { id: _drop, student_id, day_of_week: _d, slot_index: _s, ...rest } = task
  return createTask(student_id, target, rest as TaskFormValues, supabase)
}

export async function updateTask(
  taskId: string,
  updates: Partial<TaskFormValues>,
  supabase?: SupabaseClient
): Promise<Task> {
  const client = getClient(supabase)
  const { data, error } = await client
    .from('tasks')
    .update(updates)
    .eq('id', taskId)
    .select()
    .single()
  if (error) throw error
  return data as Task
}

export async function deleteTask(taskId: string, supabase?: SupabaseClient): Promise<void> {
  const client = getClient(supabase)
  const { error } = await client.from('tasks').delete().eq('id', taskId)
  if (error) throw error
}
