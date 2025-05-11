import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

// const GUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// function validateEnv() {
//   const {} = process.env;

// // Allow self-signed certificates in development
// process.env.NODE_TLS_REJECT_UNAUTHORIZED = process.env.NODE_ENV === 'development' ? '0' : '1';

// Norce config
// assert.doesNotThrow(() => new URL(NORCE_API_URL), 'NORCE_API_URL is not a valid url');
// assert.doesNotThrow(() => new URL(NORCE_CDN_URL), 'NORCE_CDN_URL is not a valid url');
// assert.match(NORCE_CLIENT_ID, GUID_REGEX, 'NORCE_CLIENT_ID is not a valid UUID');
// assert.match(NORCE_CLIENT_SECRET, GUID_REGEX, 'NORCE_CLIENT_SECRET is not a valid UUID');

// assert.match(
//   NORCE_ENVIRONMENT,
//   /^(lab|production)$/,
//   'NORCE_ENVIRONMENT is invalid, it needs to be either lab or production'
// );
// assert.match(NORCE_APPLICATION_ID, /^\d+$/, 'NORCE_APPLICATION_ID needs to be a valid integer');

// // Backend config
// assert.doesNotThrow(() => new URL(BACKEND_API_URL), 'BACKEND_API_URL is not a valid url');
// assert.ok(BACKEND_CLIENT_ID, 'BACKEND_CLIENT_ID needs to be set');
// assert.ok(BACKEND_CLIENT_SECRET, 'BACKEND_CLIENT_SECRET needs to be set');
// assert.ok(BACKEND_SCOPE, 'BACKEND_SCOPE needs to be set');
// }

// function normalizeEnv() {
//   const { NORCE_API_URL, NORCE_CDN_URL } = process.env;

//   if (!NORCE_API_URL.endsWith('/')) {
//     process.env.NORCE_API_URL += '/';
//   }

//   if (!NORCE_CDN_URL.endsWith('/')) {
//     process.env.NORCE_CDN_URL += '/';
//   }
// }

export default function nextConfig() {
  // validateEnv();
  // normalizeEnv();

  // const { NODE_ENV, NORCE_CDN_URL } = process.env;
  // const isProduction = NODE_ENV === 'production';

  // TODO: check norceCdnUrl is https, otherwise error!
  // Also check if it is set at all, otherwise error!
  // const { protocol, hostname } = new URL(NORCE_CDN_URL);

  return withNextIntl({
    swcMinify: true,
    poweredByHeader: false,
    async headers() {
      return [
        {
          /*
           * Match all request paths except for the ones starting with:
           * - studio (Sanity Studio root)
           * - api (API routes)
           * - _next/static (static files)
           * - _next/image (image optimization files)
           * - favicon.ico (favicon file)
           */
          source: '/((?!api|_next/static|_next/image|favicon.ico).*)',
          headers: [
            {
              key: 'Permissions-Policy',
              value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()',
            },
            {
              key: 'Referrer-Policy',
              value: 'origin-when-cross-origin',
            },
            {
              key: 'X-DNS-Prefetch-Control',
              value: 'on',
            },
            {
              key: 'X-Content-Type-Options',
              value: 'nosniff',
            },
            {
              key: 'X-Frame-Options',
              value: 'SAMEORIGIN',
            },
          ],
        },
      ];
    },
    images: {
      loader: 'default',
      // loaderFile: './src/image-loader.ts',
      remotePatterns: [
        // {
        //   hostname,
        //   protocol: protocol.slice(0, -1),
        // },
      ],
    },
    logging: {
      fetches: {
        fullUrl: true,
      },
    },
    compiler: {
      // removeConsole: isProduction
      //   ? {
      //       exclude: ['error'],
      //     }
      //   : false,
      reactRemoveProperties: true,
    },
    experimental: {
      taint: true,
    },
  });
}
