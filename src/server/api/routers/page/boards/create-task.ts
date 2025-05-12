import { z } from 'zod';

import { publicProcedure } from '@/server/api/trpc';
import { backendRequest } from '@/server/lib/backend/request';

const CreateTaskResponseSchema = z.any();

export default publicProcedure
  .input(
    z.object({
      name: z.string(),
      description: z.string(),
      projectId: z.string(),
      status: z.number(),
      assignedToUserId: z.string().optional(),
    })
  )
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  .mutation(async ({ ctx, input }) => {
    const body = JSON.stringify({ ...input });
    try {
      const response = await backendRequest({
        url: `/api/ProjectTask`,
        method: 'POST',
        schema: CreateTaskResponseSchema,
        body,
      });

      if (!response.success) {
        throw response.error;
      }

      return {
        success: true,
        message: 'Created task successfully',
      };
    } catch {
      return {
        success: false,
        message: 'There was an error creating task',
      };
    }
  });
