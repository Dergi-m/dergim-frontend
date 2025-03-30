import 'server-only';

import { headers as nextHeaders } from 'next/headers';

const NONCE_HEADER = 'x-nonce';

export function setNonce(headers: Headers, nonce: string) {
  headers.set(NONCE_HEADER, nonce);
}

export async function getNonce(headers?: Headers): Promise<string | null> {
  if (headers) {
    return headers.get(NONCE_HEADER);
  }

  const readonlyHeaders = await nextHeaders();
  return readonlyHeaders.get(NONCE_HEADER);
}

export function setContentSecurityPolicy(headers: Headers, cspHeader: string) {
  headers.set('Content-Security-Policy', cspHeader);
}

type SetCorsOptions = {
  allowOrigin: string;
  allowMethods: string[];
  allowHeaders: string[];
};

export function setCrossOriginResourceSharing(
  response: Response,
  { allowOrigin, allowMethods, allowHeaders }: SetCorsOptions
) {
  response.headers.set('Access-Control-Allow-Origin', allowOrigin);
  response.headers.set('Access-Control-Allow-Methods', allowMethods.join(','));
  response.headers.set('Access-Control-Allow-Headers', allowHeaders.join(','));
}

/**
 * Reads and returns the request origin
 * @param request incoming request (optional)
 * @returns origin (protocol and hostname)
 */
export async function getRequestOrigin(request?: Request) {
  let headers: Headers;

  if (request) {
    headers = request.headers;
  } else {
    headers = new Headers();
    const readonlyHeaders = await nextHeaders();
    readonlyHeaders.forEach((value, key) => {
      headers.set(key, value);
    });
  }

  const forwardedHost = headers.get('x-forwarded-host');
  const firstHost = forwardedHost?.split(',', 2)[0];
  const host = firstHost ?? headers.get('host');

  if (!host) {
    throw new Error('Unable to get origin from request.');
  }

  const forwardedProtocol = headers.get('x-forwarded-proto');
  const firstProto = forwardedProtocol?.split(',', 2)[0];
  const protocol = firstProto ?? 'https';

  return `${protocol}://${host}`;
}
