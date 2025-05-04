import { z } from 'zod';

import { publicProcedure } from '@/server/api/trpc';
import { backendRequest } from '@/server/lib/backend/request';

const LoginResponseSchema = z.object({
  sessionToken: z.string(),
  user: z.object({
    id: z.string(),
    name: z.string(),
    userName: z.string(),
    email: z.string(),
    age: z.number().nullish(),
    gender: z.string().nullish(),
  }),
  organisations: z.any().array(),
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
      schema: LoginResponseSchema,
      body,
    });

    if (!response.success) {
      throw response.error;
    }

    return response.data;
  });
