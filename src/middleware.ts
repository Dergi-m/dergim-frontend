import { NextRequest, NextResponse } from 'next/server';

import { createBackendAccessToken } from '@/server/lib/backend/auth';

const ACCESS_TOKEN_EXPIRATION_THRESHOLD = 5 * 60 * 1000; // 5 mins

export async function middleware(request: NextRequest) {
  const accessToken = request.cookies.get('accessToken')?.value;
  const expiresAt = Number(request.cookies.get('expiresAt')?.value);
  const now = Date.now();

  const response = NextResponse.next();

  const isMissing = !accessToken || !expiresAt;
  const isExpiringSoon =
    (expiresAt ?? Number.MAX_SAFE_INTEGER) <= now + ACCESS_TOKEN_EXPIRATION_THRESHOLD;

  if (isMissing || isExpiringSoon) {
    try {
      const accessTokenResponse = await createBackendAccessToken();

      response.cookies.set('accessToken', accessTokenResponse.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 60 * 29, // 29 minutes
        sameSite: 'lax',
        expires: Date.now() + accessTokenResponse.expiresIn,
      });

      const _expiresAt = Date.now() + accessTokenResponse.expiresIn;

      response.cookies.set('tokenExpiresIn', _expiresAt.toString(), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 60 * 29, // 29 minutes
        sameSite: 'lax',
        expires: Date.now() + accessTokenResponse.expiresIn,
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
