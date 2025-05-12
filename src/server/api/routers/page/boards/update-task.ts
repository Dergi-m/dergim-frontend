import { z } from 'zod';

import { publicProcedure } from '@/server/api/trpc';
import { backendRequest } from '@/server/lib/backend/request';

const UpdateTaskResponseSchema = z.object({
  status: z.number(),
});

export default publicProcedure
  .input(
    z.object({
      id: z.string(),
      name: z.string().optional(),
      description: z.string().optional(),
      status: z.number().optional(),
      assignedToUserId: z.string().optional(),
    })
  )
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  .mutation(async ({ ctx, input }) => {
    const body = JSON.stringify({ ...input });
    try {
      const response = await backendRequest({
        url: `/api/ProjectTask`,
        method: 'PUT',
        schema: UpdateTaskResponseSchema,
        body,
      });

      if (!response.success) {
        throw response.error;
      }

      const newStatus = response.data.status;

      return {
        success: true,
        message: 'Updated successfully successfully',
        newStatus,
      };
    } catch {
      return {
        success: false,
        message: 'There was an error updating task',
        newStatus: input.status,
      };
    }
  });
