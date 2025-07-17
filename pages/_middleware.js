import { NextResponse } from 'next/server';

export function middleware(req) {
  const publicPaths = ['/login', '/api/login', '/api/logout', '/_next'];

  if (publicPaths.some((p) => req.nextUrl.pathname.startsWith(p))) {
    return NextResponse.next();
  }

  const isAuth = req.cookies.get('auth')?.value === 'true';
  if (!isAuth) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
}
