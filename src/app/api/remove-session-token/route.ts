// app/api/login/route.ts
import { NextRequest, NextResponse } from 'next/server';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function POST(req: NextRequest) {
  const res = NextResponse.json({ success: true });
  res.cookies.delete('sessionToken');
  return res;
}
