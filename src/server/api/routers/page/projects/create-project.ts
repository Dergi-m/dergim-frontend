import { z } from 'zod';

import { publicProcedure } from '@/server/api/trpc';
import { backendRequest } from '@/server/lib/backend/request';

const CreateProjectResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default publicProcedure
  .input(
    z.object({
      name: z.string(),
      description: z.string(),
      organisationId: z.string(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    try {
      if (ctx.headers.get('SessionToken')) {
        throw new Error('There is no valid session');
      }

      const response = await backendRequest({
        url: `/api/projects`,
        method: 'POST',
        schema: CreateProjectResponseSchema,
        body: JSON.stringify({ ...input }),
      });

      if (!response.success) {
        throw response.error;
      }

      return {
        success: true,
        message: 'Project created successfully',
        data: response.data,
      };
    } catch {
      return {
        success: false,
        message: 'There was an error creating the project',
        data: null,
      };
    }
  });
