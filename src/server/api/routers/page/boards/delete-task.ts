import { z } from 'zod';

import { publicProcedure } from '@/server/api/trpc';
import { backendRequest } from '@/server/lib/backend/request';

export default publicProcedure
  .input(
    z.object({
      id: z.string(),
    })
  )
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  .mutation(async ({ ctx, input }) => {
    try {
      const response = await backendRequest({
        url: `/api/ProjectTask/${input.id}/`,
        method: 'DELETE',
      });

      if (!response.success) {
        throw response.error;
      }

      return {
        success: true,
        message: 'Deleted task successfully',
      };
    } catch {
      return {
        success: false,
        message: 'There was an error deleting task',
      };
    }
  });
