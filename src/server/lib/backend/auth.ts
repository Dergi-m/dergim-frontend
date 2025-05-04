import 'server-only';

import { z } from 'zod';

import { request } from '@/server/lib/request';

// Converts a time span string in the format HH:MM:SS to miliseconds
function timeSpanToMiliseconds(timeSpan: string): number {
  if (!timeSpan) {
    throw new Error('Invalid timeSpan format');
  }
  const parts = timeSpan.split(':').map(Number);
  const [hours = 0, minutes = 0, seconds = 0] = parts;

  return (hours * 3600 + minutes * 60 + seconds) * 1000;
}

export const AuthenticationTokenResponse = z
  .object({
    accessToken: z.string(),
    // expiresIn is a time span string in the format HH:MM:SS
    expiresIn: z.string(),
  })
  .transform((object) => ({
    accessToken: object.accessToken,
    expiresIn: Date.now() + timeSpanToMiliseconds(object.expiresIn),
  }));

export async function createBackendAccessToken() {
  const body = new URLSearchParams({
    clientId: process.env.BACKEND_CLIENT_ID ?? '',
    clientSecret: process.env.BACKEND_CLIENT_SECRET ?? '',
  });

  const url: URL = new URL('/api/Auth/Token', process.env.BACKEND_API_URL);

  const tokenResponse = await request({
    url: url,
    method: 'POST',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
    },
    body: body.toString(),
    schema: AuthenticationTokenResponse,
  });

  if (!tokenResponse.ok) {
    throw new Error(
      `Could not recieve a valid token from Backend API.\n\nThe request to '${url}' returned HTTP Error ${tokenResponse.statusCode} ${tokenResponse.statusText}.\n\n${tokenResponse.body}`
    );
  }

  return tokenResponse.body;
}
