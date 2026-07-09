import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Path definitions and required roles (aligned with @aegis/types roles)
const routeRoles: { [key: string]: string[] } = {
  '/organizer': ['Organizer', 'Admin', 'Administrator', 'Super Administrator'],
  '/volunteer': ['Volunteer', 'Organizer', 'Admin', 'Administrator', 'Super Administrator'],
  '/security': ['Security', 'Admin', 'Administrator', 'Super Administrator'],
  '/medical': ['Medical', 'Admin', 'Administrator', 'Super Administrator'],
  '/admin': ['Admin', 'Administrator', 'Super Administrator'],
};

// In-memory sliding window rate limiter fallback (used if Upstash keys are missing or fail)
const rateLimitMap = new Map<string, number[]>();
const LIMIT = 60; // 60 requests per minute
const WINDOW_MS = 60 * 1000;

function isInMemoryRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = rateLimitMap.get(ip) || [];
  
  // Filter timestamps within current window
  const activeTimestamps = timestamps.filter((time) => now - time < WINDOW_MS);
  
  if (activeTimestamps.length >= LIMIT) {
    return true;
  }
  
  activeTimestamps.push(now);
  rateLimitMap.set(ip, activeTimestamps);
  return false;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const ip = (request as unknown as { ip?: string }).ip || request.headers.get('x-forwarded-for') || '127.0.0.1';

  // --- Rate Limiting Layer ---
  let isLimited = false;

  const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (redisUrl && redisToken) {
    try {
      // Lazy load Upstash to avoid compilation/loading overhead if variables are missing
      const { Redis } = await import('@upstash/redis');
      const { Ratelimit } = await import('@upstash/ratelimit');

      const redis = new Redis({
        url: redisUrl,
        token: redisToken,
      });

      const ratelimit = new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(LIMIT, '60 s'),
        analytics: true,
        prefix: '@upstash/ratelimit',
      });

      const { success } = await ratelimit.limit(ip);
      isLimited = !success;
    } catch (err) {
      console.warn('[AEGIS RateLimit] Upstash Redis call failed. Falling back to in-memory rate limiting.', err);
      isLimited = isInMemoryRateLimited(ip);
    }
  } else {
    // No Redis configuration -> fall back to in-memory
    isLimited = isInMemoryRateLimited(ip);
  }

  if (isLimited) {
    return new NextResponse(
      JSON.stringify({ error: 'Too Many Requests. Security policy rate limit exceeded.' }),
      { status: 429, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // --- RBAC Access Control Layer ---
  const matchedRoute = Object.keys(routeRoles).find(
    (route) => pathname.startsWith(route)
  );

  if (matchedRoute) {
    const requiredRoles = routeRoles[matchedRoute];
    const userCookie = request.cookies.get('aegis-user');

    if (!userCookie) {
      // Not authenticated -> redirect to login
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      url.searchParams.set('redirect', pathname);
      return NextResponse.redirect(url);
    }

    try {
      // Decode user role from cookie
      const user = JSON.parse(decodeURIComponent(userCookie.value));
      const userRole = user.role as string;

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

export const config = {
  matcher: [
    '/organizer/:path*',
    '/volunteer/:path*',
    '/security/:path*',
    '/medical/:path*',
    '/admin/:path*',
    '/api/:path*',
  ],
};
