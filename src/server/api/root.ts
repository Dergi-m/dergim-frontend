import { headers } from 'next/headers';
import { NextRequest } from 'next/server';

import contentRouter from '@/server/api/routers/content';
import pageRouter from '@/server/api/routers/page';
import websiteRouter from '@/server/api/routers/website';
import { createCallerFactory, createInnerTRPCContext, createTRPCRouter } from '@/server/api/trpc';

export const appRouter = createTRPCRouter({
  website: websiteRouter,
  page: pageRouter,
  content: contentRouter,
});
export type AppRouter = typeof appRouter;

const createCaller = createCallerFactory(appRouter);

export async function createServerCaller(req?: NextRequest) {
  let reqHeaders: Headers;
  let resHeaders: Headers | undefined;

  if (req) {
    // Case 1: We have a NextRequest (route handler)
    reqHeaders = req.headers;
    resHeaders = new Headers();
  } else {
    // Case 2: We're in a Server Component
    const readonlyHeaders = await headers();
    reqHeaders = new Headers();
    readonlyHeaders.forEach((value, key) => {
      reqHeaders.set(key, value);
    });
    resHeaders = undefined;
  }

  const ctx = createInnerTRPCContext({
    headers: reqHeaders,
    resHeaders,
    isServer: true,
  });

  return createCaller(ctx);
}
