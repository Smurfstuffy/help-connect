import {NextResponse} from 'next/server';
import type {NextRequest} from 'next/server';

const SESSION_COOKIE = `sb-${process.env.NEXT_PUBLIC_SUPABASE_PROJECT_REF}-auth-token`;

const PROTECTED_PATHS = ['/', '/home'];
const UNPROTECTED_PATHS = ['/login', '/register', '/confirm'];

export function middleware(request: NextRequest) {
  const {pathname} = request.nextUrl;
  const sessionCookie = request.cookies.get(SESSION_COOKIE);
  const isProtected = PROTECTED_PATHS.includes(pathname);
  const isUnprotected = UNPROTECTED_PATHS.includes(pathname);

  // If user is authenticated and on unprotected route, redirect to home
  if (sessionCookie && isUnprotected) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // If user is not authenticated and on protected route, redirect to login
  if (!sessionCookie && isProtected) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Otherwise, allow
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next|api|static|favicon.ico).*)'],
};
