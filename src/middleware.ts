import { NextRequest, NextResponse } from 'next/server';

import { createBackendAccessToken } from '@/server/lib/backend/auth';

const TOKEN_EXPIRATION_THRESHOLD = 5 * 60 * 1000; // 5 mins

export async function middleware(request: NextRequest) {
  const accessToken = request.cookies.get('accessToken')?.value ?? '';
  const expiresAt = Number(request.cookies.get('expiresAt')?.value ?? 0);
  const now = Date.now();

  const response = NextResponse.next();

  const isMissing = !accessToken || !expiresAt;
  const isExpiringSoon = expiresAt <= now + TOKEN_EXPIRATION_THRESHOLD;

  if (isMissing || isExpiringSoon) {
    try {
      const tokenResponse = await createBackendAccessToken();

      response.cookies.set('accessToken', tokenResponse.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 60 * 60, // 1 hour
        sameSite: 'lax',
      });

      const _expiresAt = Date.now() + tokenResponse.expiresIn;

      response.cookies.set('tokenExpiresIn', _expiresAt.toString(), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 60 * 60,
        sameSite: 'lax',
      });
    } catch (err) {
      console.error('Failed to refresh access token:', err);
      return new NextResponse('Authentication failed', { status: 401 });
    }
  }

  return response;
}

export const config = {
  matcher: ['/((?!api|_next|favicon.ico).*)'], // apply to all pages except API & static assets
};
