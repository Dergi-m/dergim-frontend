import { fetchRequestHandler } from '@trpc/server/adapters/fetch';

import { appRouter } from '@/server/api/root';
import { createTRPCContext } from '@/server/api/trpc';

// this is the server RPC API handler
function handler(request: Request) {
  return fetchRequestHandler({
    endpoint: '/api/trpc',
    req: request,
    router: appRouter,
    createContext(opts) {
      const ctx = createTRPCContext(opts);

      return ctx;
    },
  });
}

export const GET = handler;
export const POST = handler;
