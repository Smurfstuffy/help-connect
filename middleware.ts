import {NextResponse} from 'next/server';
import type {NextRequest} from 'next/server';

// Replace with your actual project ref
const PROJECT_REF = 'ximrifdiofrpjeunriry';
const SESSION_COOKIE = `sb-${PROJECT_REF}-auth-token`;

const PROTECTED_PATHS = ['/', '/home'];
const UNPROTECTED_PATHS = ['/login', '/register'];

export function middleware(request: NextRequest) {
  const {pathname} = request.nextUrl;
  const sessionCookie = request.cookies.get(SESSION_COOKIE);
  console.log('sessionCookie', sessionCookie);
  const isProtected = PROTECTED_PATHS.includes(pathname);
  const isUnprotected = UNPROTECTED_PATHS.includes(pathname);

  // If user is authenticated and on login/register, redirect to home
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
