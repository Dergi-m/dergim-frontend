import { z } from 'zod';

import { publicProcedure } from '@/server/api/trpc';
import { backendRequest } from '@/server/lib/backend/request';

const SessionResponseSchema = z.any();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default publicProcedure
  .input(
    z.object({
      id: z.string(),
      name: z.string(),
      description: z.string(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    try {
      if (ctx.headers.get('SessionToken')) {
        throw new Error('There is no valid session');
      }

      const body = JSON.stringify({
        ...input,
      });

      const response = await backendRequest({
        url: `/api/projects`,
        method: 'PUT',
        schema: SessionResponseSchema,
        body,
      });

      if (!response.success) {
        throw response.error;
      }

      return {
        success: true,
      };
    } catch {
      return {
        success: false,
      };
    }
  });
