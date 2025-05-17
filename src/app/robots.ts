import { MetadataRoute } from 'next';

import { getRequestOrigin } from '@/server/lib/headers';

export default async function robots() {
  const origin = await getRequestOrigin();
  const sitemapUrl = new URL('/sitemap.xml', origin);

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/'],
    },
    sitemap: sitemapUrl.href,
  } as MetadataRoute.Robots;
}
