import 'server-only';

export function forwardSetCookies(resHeaders: Headers, cookies: string[]) {
  if (!cookies.length) {
    return;
  }

  cookies.forEach((cookie) => resHeaders.append('set-cookie', cookie));
}
