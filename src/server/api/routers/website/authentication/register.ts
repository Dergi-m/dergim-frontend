import { z } from 'zod';

import { publicProcedure } from '@/server/api/trpc';
import { backendRequest } from '@/server/lib/backend/request';

const RegisterResponseSchema = z.object({
  sessionToken: z.string(),
});

export default publicProcedure
  .input(
    z.object({
      userName: z.string(),
      password: z.string(),
      name: z.string(),
      email: z.string().email(),
    })
  )
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  .mutation(async ({ ctx, input }) => {
    const body = JSON.stringify({ ...input });

    const response = await backendRequest({
      url: `/api/users/register`,
      method: 'POST',
      schema: RegisterResponseSchema,
      body,
    });

    if (!response.success) {
      throw response.error;
    }

    return response.data;
  });
