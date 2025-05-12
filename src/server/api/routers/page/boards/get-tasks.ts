import { z } from 'zod';

import { publicProcedure } from '@/server/api/trpc';
import { backendRequest } from '@/server/lib/backend/request';

const GetTasksResponseSchema = z.object({
  $values: z
    .object({
      id: z.string(),
      name: z.string(),
      description: z.string(),
      status: z.number(),
      assignedToUser: z
        .union([
          z
            .object({
              id: z.string(),
              name: z.string(),
              userName: z.string(),
              email: z.string(),
            })
            .passthrough(),
          z
            .object({
              $ref: z.string(),
            })
            .passthrough(),
        ])
        .nullable(),
    })
    .array(),
});

export default publicProcedure
  .input(
    z.object({
      projectId: z.string(),
    })
  )
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  .query(async ({ ctx, input }) => {
    try {
      const { projectId } = input;
      const response = await backendRequest({
        url: `/api/ProjectTask/project/${projectId}`,
        method: 'GET',
        schema: GetTasksResponseSchema,
      });

      if (!response.success) {
        throw response.error;
      }

      const tasks = response.data.$values;

      return {
        success: true,
        message: 'Retrieved tasks successfully',
        tasks,
      };
    } catch {
      return {
        success: false,
        message: 'There was an error retrieving tasks',
        tasks: null,
      };
    }
  });
