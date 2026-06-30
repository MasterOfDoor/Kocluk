import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * Supabase email confirmation callback handler.
 *
 * When a user clicks the confirmation link in their email, Supabase redirects
 * to this route with `?code=<code>` in the URL. We exchange the code for a
 * session, then redirect the user to their role-appropriate home page.
 *
 * Configure this URL in Supabase Dashboard:
 *   Authentication → URL Configuration → Redirect URLs
 *   → add: https://your-domain.com/api/auth/callback
 */
export async function GET(request: NextRequest) {
  const tag = 'AUTH_CALLBACK'
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  console.log(`[${tag}] ${new Date().toISOString()} Callback received`, {
    hasCode: !!code,
    next,
  })

  if (code) {
    const supabase = createClient()

    // Exchange the auth code for a session
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      console.error(`[${tag}] exchangeCodeForSession failed:`, error.message)
      // PKCE hatası (başka cihazdan tıklama) veya linke ikinci kez tıklama.
      // Her iki durumda da Supabase e-postayı aslında DOĞRULADI. 
      // Sadece bu cihazda otomatik oturum açılamıyor. Kullanıcıyı manuel girişe yönlendiriyoruz.
      return NextResponse.redirect(
        new URL('/login?message=E-postanız doğrulandı. Lütfen giriş yapın.', request.url)
      )
    }

    console.log(`[${tag}] Session created`, {
      userId: data.user?.id,
      email: data.user?.email,
      confirmedAt: data.user?.confirmed_at,
    })

    // Fetch user profile to determine redirect destination
    if (data.user) {
      const { data: profile } = await supabase
        .from('users')
        .select('role, approval_status')
        .eq('id', data.user.id)
        .single()

      if (profile) {
        const redirectMap: Record<string, string> = {
          admin: '/admin/teachers',
          teacher: profile.approval_status === 'approved' ? '/dashboard' : '/pending-approval',
          student: '/teachers',
        }
        const dest = redirectMap[profile.role] ?? '/teachers'
        console.log(`[${tag}] Redirecting to role-based page`, {
          role: profile.role,
          approval: profile.approval_status,
          dest,
        })
        return NextResponse.redirect(new URL(dest, request.url))
      }

      console.log(`[${tag}] No profile found for user — redirecting to /teachers`)
    }
  } else {
    console.log(`[${tag}] No code in callback URL — redirecting to ${next}`)
  }

  return NextResponse.redirect(new URL(next, request.url))
}
