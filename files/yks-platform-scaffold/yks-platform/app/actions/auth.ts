'use server'

import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/admin'
import { isAdminEmail, getRoleHomePath } from '@/lib/auth'
import type { UserRole } from '@/types'

// ─── Diagnostic helpers ────────────────────────────────────────
function ts() {
  return new Date().toISOString()
}

function diag(tag: string, msg: string, data?: Record<string, unknown>) {
  const payload = data ? ` | ${JSON.stringify(data)}` : ''
  console.log(`[AUTH:${tag}] ${ts()} ${msg}${payload}`)
}

function diagErr(tag: string, msg: string, err: unknown) {
  let detail: string
  if (err instanceof Error) {
    // AuthError has message, status, name — JSON.stringify loses them
    detail = `${err.name}: ${err.message}`
    if ('status' in err) detail += ` (status: ${(err as any).status})`
    if ('code' in err) detail += ` (code: ${(err as any).code})`
  } else if (typeof err === 'object' && err !== null) {
    detail = JSON.stringify(err, Object.getOwnPropertyNames(err))
  } else {
    detail = String(err)
  }
  console.error(`[AUTH:${tag}] ${ts()} ❌ ${msg} | ${detail}`)
}

// ─── LOGIN ─────────────────────────────────────────────────────
export async function loginAction(email: string, password: string) {
  const tag = 'LOGIN'
  diag(tag, 'Attempt started', { email })

  const supabase = createClient()

  // Step 1: Authenticate
  diag(tag, 'Calling signInWithPassword')
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    diagErr(tag, 'signInWithPassword failed', error)
    // Give user-friendly messages for common cases
    if (error.message.includes('Email not confirmed')) {
      return { error: 'E-posta adresiniz henüz doğrulanmamış. Lütfen e-postanızı kontrol edin.' }
    }
    if (error.message.includes('Invalid login credentials')) {
      return { error: 'E-posta veya şifre hatalı.' }
    }
    return { error: error.message }
  }

  diag(tag, 'signInWithPassword OK', {
    userId: data.user.id,
    hasSession: !!data.session,
    confirmedAt: data.user.confirmed_at ?? 'null',
  })

  // Step 2: Fetch profile
  diag(tag, 'Fetching user profile')
  let profile = await supabase
    .from('users')
    .select('role, approval_status')
    .eq('id', data.user.id)
    .single()

  // Step 3: Auto-create profile if missing (signup trigger may have failed)
  if (!profile.data) {
    diag(tag, 'Profile not found — auto-creating', { profileError: profile.error?.message })
    const { error: insertError } = await supabase
      .from('users')
      .insert({
        id: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata?.name || email.split('@')[0],
        role: data.user.user_metadata?.role || 'student',
        approval_status: 'approved'
      })

    if (insertError) {
      diagErr(tag, 'Profile auto-creation failed', insertError)
      return { error: 'Profil oluşturulamadı. Lütfen yöneticiyle iletişime geçin.' }
    }

    diag(tag, 'Profile auto-created, re-fetching')
    profile = await supabase
      .from('users')
      .select('role, approval_status')
      .eq('id', data.user.id)
      .single()
  }

  if (!profile.data) {
    diagErr(tag, 'Profile still null after auto-creation', profile.error)
    return { error: 'Profil bulunamadı.' }
  }

  const redirect = getRoleHomePath(profile.data.role as UserRole, profile.data.approval_status)
  diag(tag, 'Login complete', { role: profile.data.role, approval: profile.data.approval_status, redirect })

  return { redirect }
}

// ─── REGISTER ──────────────────────────────────────────────────
export async function registerAction(
  name: string,
  email: string,
  password: string,
  role: 'teacher' | 'student'
) {
  const tag = 'REGISTER'
  diag(tag, 'Attempt started', { email, name, role })

  // Environment diagnostics — detect missing Vercel env vars
  const hasUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL
  const hasAnon = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const hasService = !!process.env.SUPABASE_SERVICE_ROLE_KEY
  diag(tag, 'Env check', { hasUrl, hasAnon, hasService })

  if (!hasUrl || !hasAnon) {
    console.error(`[AUTH:${tag}] ❌ Missing Supabase environment variables!`)
    return { error: 'Sunucu yapılandırma hatası. Lütfen yöneticiyle iletişime geçin.' }
  }

  try {
    const supabase = createClient()
    const serviceClient = createServiceClient()

    // Step 1: Check duplicate email
    diag(tag, 'Checking existing user')
    const { data: existingProfile } = await serviceClient
      .from('users')
      .select('email')
      .eq('email', email)
      .single()

    if (existingProfile) {
      diag(tag, 'Duplicate email detected')
      return { error: 'Bu e-posta adresi zaten kayıtlı.' }
    }

    // Step 2: Create auth user with standard client (writes session cookies)
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
      || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')

    diag(tag, 'Calling auth.signUp with standard server client', { siteUrl })
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name, role },
        emailRedirectTo: `${siteUrl}/api/auth/callback`,
      },
    })

    if (error) {
      diagErr(tag, 'auth.signUp failed', error)
      return { error: error.message }
    }

    if (!data.user) {
      diagErr(tag, 'No user returned from signUp', 'data.user is null')
      return { error: 'Kayıt başarısız. Kullanıcı oluşturulamadı.' }
    }

    diag(tag, 'auth.signUp OK', {
      userId: data.user.id,
      hasSession: !!data.session,
      confirmedAt: data.user.confirmed_at ?? 'null',
      identitiesCount: data.user.identities?.length ?? 0,
    })

    // ⚠️ Email confirmation is ON — session will be null until user confirms.
    // We do NOT auto-login here. Instead we redirect to a "check your email" page.
    if (!data.session) {
      diag(tag, 'No session (email confirmation pending) — redirecting to verify-email')
      return { redirect: '/verify-email' }
    }

    // If session exists (email confirmation OFF), proceed normally
    diag(tag, 'Session exists — checking admin email')

    // Step 3: Admin email check
    if (isAdminEmail(email)) {
      diag(tag, 'Admin email detected, assigning admin role')
      try {
        const { error: updateError } = await serviceClient
          .from('users')
          .update({ role: 'admin', approval_status: 'approved' })
          .eq('id', data.user.id)

        if (updateError) {
          diagErr(tag, 'Admin role assignment failed (non-fatal)', updateError)
        } else {
          diag(tag, 'Admin role assigned — redirecting to /admin/teachers')
          return { redirect: '/admin/teachers' }
        }
      } catch (err) {
        diagErr(tag, 'Admin role assignment exception (non-fatal)', err)
      }
    }

    // Step 4: Role-based redirect
    if (role === 'teacher') {
      diag(tag, 'Teacher — redirecting to /pending-approval')
      return { redirect: '/pending-approval' }
    }

    diag(tag, 'Student — redirecting to /teachers')
    return { redirect: '/teachers' }
  } catch (error) {
    diagErr(tag, 'Unhandled exception', error)
    return { error: 'Kayıt sırasında bir hata oluştu. Lütfen tekrar deneyin.' }
  }
}

// ─── LOGOUT ────────────────────────────────────────────────────
export async function logoutAction() {
  diag('LOGOUT', 'Signing out')
  const supabase = createClient()
  await supabase.auth.signOut()
}
