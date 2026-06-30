import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/middleware'

const PUBLIC_ROUTES = ['/', '/login', '/register', '/verify-email']
const STUDENT_ROUTES = ['/teachers', '/my-schedule']
const TEACHER_ROUTES = ['/dashboard']
const ADMIN_ROUTES = ['/admin']

export async function middleware(request: NextRequest) {
  const tag = 'MIDDLEWARE'
  const pathname = request.nextUrl.pathname

  // Skip logging for static assets
  const isAsset = pathname.startsWith('/_next') || pathname.startsWith('/api/auth')
  if (!isAsset) {
    console.log(`[${tag}] ${new Date().toISOString()} → ${pathname}`)
  }

  const { supabase, response } = createClient(request)
  const { data: { user } } = await supabase.auth.getUser()

  const isPublic = PUBLIC_ROUTES.some(r => pathname === r || (r !== '/' && pathname.startsWith(r)))
  const isAuthRoute = pathname === '/login' || pathname === '/register'

  // ── Unauthenticated user ──
  if (!user) {
    if (!isAsset) {
      console.log(`[${tag}] No user session | public=${isPublic} | path=${pathname}`)
    }
    if (isPublic || isAuthRoute) return response
    console.log(`[${tag}] ⛔ Redirecting unauthenticated user to /login`)
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // ── Authenticated user — fetch profile ──
  const { data: profile, error: profileError } = await supabase
    .from('users')
    .select('role, approval_status')
    .eq('id', user.id)
    .single()

  if (!profile) {
    if (!isAsset) {
      console.log(`[${tag}] ⚠ Profile not found for userId=${user.id} | error=${profileError?.message}`)
    }
    if (isAuthRoute) return response
    return NextResponse.redirect(new URL('/login', request.url))
  }

  const { role, approval_status: approvalStatus } = profile

  if (!isAsset) {
    console.log(`[${tag}] User OK | id=${user.id} | role=${role} | approval=${approvalStatus} | path=${pathname}`)
  }

  // ── Already logged in + visiting login/register → redirect to home ──
  if (isAuthRoute) {
    const dest = getDefaultRoute(role, approvalStatus)
    console.log(`[${tag}] Authenticated user on auth page → redirect to ${dest}`)
    return NextResponse.redirect(new URL(dest, request.url))
  }

  // ── Teacher approval check ──
  if (role === 'teacher' && (approvalStatus === 'pending' || approvalStatus === 'rejected')) {
    if (pathname !== '/pending-approval') {
      console.log(`[${tag}] Teacher not approved (${approvalStatus}) → /pending-approval`)
      return NextResponse.redirect(new URL('/pending-approval', request.url))
    }
    return response
  }

  // ── Route-level authorization ──
  if (ADMIN_ROUTES.some(r => pathname.startsWith(r)) && role !== 'admin') {
    console.log(`[${tag}] ⛔ Non-admin on admin route → redirect`)
    return NextResponse.redirect(new URL(getDefaultRoute(role, approvalStatus), request.url))
  }

  if (STUDENT_ROUTES.some(r => pathname.startsWith(r)) && role !== 'student') {
    console.log(`[${tag}] ⛔ Non-student on student route → redirect`)
    return NextResponse.redirect(new URL(getDefaultRoute(role, approvalStatus), request.url))
  }

  if (TEACHER_ROUTES.some(r => pathname.startsWith(r)) && role !== 'teacher') {
    console.log(`[${tag}] ⛔ Non-teacher on teacher route → redirect`)
    return NextResponse.redirect(new URL(getDefaultRoute(role, approvalStatus), request.url))
  }

  if (pathname.startsWith('/student/') && role !== 'teacher') {
    console.log(`[${tag}] ⛔ Non-teacher on /student/:id → redirect`)
    return NextResponse.redirect(new URL(getDefaultRoute(role, approvalStatus), request.url))
  }

  return response
}

function getDefaultRoute(role: string, approvalStatus: string): string {
  if (role === 'admin') return '/admin/teachers'
  if (role === 'teacher') {
    if (approvalStatus !== 'approved') return '/pending-approval'
    return '/dashboard'
  }
  return '/teachers'
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
