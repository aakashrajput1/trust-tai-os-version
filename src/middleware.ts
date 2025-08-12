import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // If no session, redirect to login
  if (!session) {
    if (req.nextUrl.pathname.startsWith('/dashboard') || req.nextUrl.pathname.startsWith('/onboarding')) {
      return NextResponse.redirect(new URL('/login', req.url))
    }
    // Allow access to auth callback even without session (for OAuth redirects)
    if (req.nextUrl.pathname.startsWith('/auth/callback')) {
      return res
    }
    return res
  }

  // Get user details
  const { data: userDetails } = await supabase
    .from('users')
    .select('role')
    .eq('id', session.user.id)
    .single()

  // If user hasn't selected a role yet, redirect to onboarding
  if (!userDetails?.role) {
    if (req.nextUrl.pathname.startsWith('/dashboard')) {
      return NextResponse.redirect(new URL('/onboarding', req.url))
    }
    return res
  }

  // If user has already selected a role, redirect them away from onboarding
  if (userDetails?.role && req.nextUrl.pathname === '/onboarding') {
    const rolePath = userDetails.role.toLowerCase().replace(/\s+/g, '-')
    return NextResponse.redirect(new URL(`/dashboard/${rolePath}`, req.url))
  }

  // Check role-based access for dashboard routes
  if (req.nextUrl.pathname.startsWith('/dashboard')) {
    const pathRole = req.nextUrl.pathname.split('/')[2] // /dashboard/role -> role
    
    // Map URL-friendly role names to database role names
    const roleMap: { [key: string]: string } = {
      'executive': 'Executive',
      'project-manager': 'Project Manager',
      'developer': 'Developer',
      'support-lead': 'Support Lead',
      'support-agent': 'Support Agent',
      'hr': 'HR',
      'sales': 'Sales'
    }

    const expectedRole = roleMap[pathRole]
    
    if (!expectedRole || userDetails.role !== expectedRole) {
      // Redirect to user's actual dashboard
      const userRolePath = userDetails.role.toLowerCase().replace(' ', '-')
      return NextResponse.redirect(new URL(`/dashboard/${userRolePath}`, req.url))
    }
  }

  return res
}

export const config = {
  matcher: ['/dashboard/:path*', '/onboarding', '/auth/callback']
} 