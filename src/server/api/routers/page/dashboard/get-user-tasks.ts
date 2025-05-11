import { z } from 'zod';

import { publicProcedure } from '@/server/api/trpc';
import { backendRequest } from '@/server/lib/backend/request';

const GetUserTasksResponseSchema = z.object({
  $values: z
    .object({
      id: z.string(),
      name: z.string(),
      description: z.string(),
      status: z.number(),
      projectId: z.string(),
      createdAt: z.string(),
      updatedAt: z.string(),
    })
    .array(),
});

export default publicProcedure
  .input(
    z.object({
      userId: z.string(),
    })
  )
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  .query(async ({ ctx, input }) => {
    try {
      const response = await backendRequest({
        url: `/api/ProjectTask/user/${input.userId}`,
        method: 'GET',
        schema: GetUserTasksResponseSchema,
      });

      if (!response.success) {
        throw response.error;
      }

      return {
        success: true,
        message: 'User tasks retrieved successfully',
        tasks: response.data.$values,
      };
    } catch {
      return {
        success: false,
        message: 'There was an error retrieving tasks',
        tasks: null,
      };
    }
  });
