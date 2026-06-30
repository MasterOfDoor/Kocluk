import { createClient as createServerClient } from '@/lib/supabase/server'
import type { User, UserRole, ApprovalStatus } from '@/types'

export interface AuthUser extends User {
  approval_status: ApprovalStatus
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  return profile as AuthUser | null
}

export function isAdminEmail(email: string): boolean {
  const adminEmails = (process.env.ADMIN_EMAILS ?? '')
    .split(',')
    .map(e => e.trim().toLowerCase())
    .filter(Boolean)
  return adminEmails.includes(email.toLowerCase())
}

export function getRoleHomePath(role: UserRole, approvalStatus: ApprovalStatus): string {
  if (role === 'admin') return '/admin/teachers'
  if (role === 'teacher') {
    return approvalStatus === 'approved' ? '/dashboard' : '/pending-approval'
  }
  return '/teachers'
}
