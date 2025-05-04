import { z } from 'zod';

import { publicProcedure } from '@/server/api/trpc';
import { backendRequest } from '@/server/lib/backend/request';

const SessionResponseSchema = z.object({
  success: z.boolean(),
  user: z
    .object({
      id: z.string(),
      name: z.string(),
      userName: z.string(),
      email: z.string(),
      age: z.number().nullish(),
      gender: z.string().nullish(),
    })
    .optional(),
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default publicProcedure.query(async ({ ctx }) => {
  try {
    if (ctx.headers.get('SessionToken')) {
      throw new Error('There is no valid session');
    }

    const response = await backendRequest({
      url: `/api/Auth/Session`,
      method: 'GET',
      schema: SessionResponseSchema,
    });

    if (!response.success) {
      throw response.error;
    }

    if (!response.data.success) {
      throw new Error('Session Token is invalid');
    }

    if (!response.data.user) {
      throw new Error('User not found');
    }

    return response.data;
  } catch {
    return {
      success: false,
      user: null,
    };
  }
});
