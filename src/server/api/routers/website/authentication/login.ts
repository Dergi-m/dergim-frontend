import { z } from 'zod';

import { publicProcedure } from '@/server/api/trpc';
import { backendRequest } from '@/server/lib/backend/request';

const LoginResponseSchema = z.object({
  sessionToken: z.string(),
});

export default publicProcedure
  .input(
    z.object({
      userName: z.string(),
      password: z.string(),
    })
  )
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  .mutation(async ({ ctx, input }) => {
    const body = JSON.stringify({ ...input });

    const response = await backendRequest({
      url: `/api/users/login`,
      method: 'POST',
      cache: 'no-cache',
      schema: LoginResponseSchema,
      body,
    });

    if (!response.success) {
      throw response.error;
    }

    return response.data;
  });
