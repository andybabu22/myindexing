import { NextResponse } from 'next/server';

export function middleware(req) {
  const { pathname } = req.nextUrl;

  // Allow public routes
  const publicPaths = ['/login', '/api/login', '/api/logout', '/_next', '/favicon.ico'];
  if (publicPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Check auth cookie
  const isAuth = req.cookies.get('auth')?.value === 'true';
  if (!isAuth) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
}
