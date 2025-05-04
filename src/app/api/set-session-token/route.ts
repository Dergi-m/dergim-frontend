// app/api/login/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { sessionToken } = body;

  const res = NextResponse.json({ success: true });
  res.cookies.set('sessionToken', sessionToken, {
    httpOnly: true,
    secure: true,
    path: '/',
    sameSite: 'lax',
    maxAge: 60 * 60 * 12, // 12 hours
  });

  return res;
}
