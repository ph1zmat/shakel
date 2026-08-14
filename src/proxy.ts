import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Публичные роуты
  const publicPaths = [
    '/',
    '/login',
    '/signup',
    '/features',
    '/pricing',
    '/docs',
    '/contact',
  ];
  const isPublicPath =
    publicPaths.includes(pathname) ||
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/logos/') ||
    pathname.startsWith('/logo') ||
    pathname.includes('.');

  if (isPublicPath) {
    return NextResponse.next();
  }

  // Проверяем сессию через cookie better-auth
  const sessionCookie =
    request.cookies.get('better-auth.session_token') ||
    request.cookies.get('__Secure-better-auth.session_token');

  if (!sessionCookie) {
    // Если нет сессии, редиректим на логин
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
