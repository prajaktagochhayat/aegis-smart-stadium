import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { UserRole } from '@aegis/types';

// Path definitions and required roles
const routeRoles: { [key: string]: UserRole[] } = {
  '/organizer': ['Organizer', 'Administrator', 'Super Administrator'],
  '/volunteer': ['Volunteer', 'Organizer', 'Administrator', 'Super Administrator'],
  '/security': ['Security', 'Administrator', 'Super Administrator'],
  '/medical': ['Medical', 'Administrator', 'Super Administrator'],
  '/admin': ['Administrator', 'Super Administrator'],
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Find if path matches any protected role definitions
  const matchedRoute = Object.keys(routeRoles).find(
    (route) => pathname.startsWith(route)
  );

  if (matchedRoute) {
    const requiredRoles = routeRoles[matchedRoute];
    
    // Look for authorized session cookie
    const userCookie = request.cookies.get('aegis-user');

    if (!userCookie) {
      // Not authenticated -> redirect to login
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      // Store redirect target URL
      url.searchParams.set('redirect', pathname);
      return NextResponse.redirect(url);
    }

    try {
      // Decode user role from cookie
      const user = JSON.parse(decodeURIComponent(userCookie.value));
      const userRole = user.role as UserRole;

      if (!requiredRoles.includes(userRole)) {
        // Authenticated but unauthorized role -> redirect to unauthorized fallback
        const url = request.nextUrl.clone();
        url.pathname = '/unauthorized';
        return NextResponse.redirect(url);
      }
    } catch {
      // Corrupted cookie -> redirect to login
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

// Config to specify matching paths
export const config = {
  matcher: [
    '/organizer/:path*',
    '/volunteer/:path*',
    '/security/:path*',
    '/medical/:path*',
    '/admin/:path*',
  ],
};
