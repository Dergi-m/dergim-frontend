import { z } from 'zod';

import { publicProcedure } from '@/server/api/trpc';
import { backendRequest } from '@/server/lib/backend/request';

const GetUserTasksResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});

export default publicProcedure
  .input(
    z.object({
      preojectId: z.string(),
      invitationId: z.string(),
    })
  )
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  .mutation(async ({ ctx, input }) => {
    try {
      const { preojectId, invitationId } = input;
      const response = await backendRequest({
        url: `/api/projects/${preojectId}/accept-invitation`,
        query: {
          invitationId: invitationId,
        },
        method: 'PUT',
        schema: GetUserTasksResponseSchema,
      });

      if (!response.success) {
        throw response.error;
      }

      return {
        success: true,
        message: 'Declined invitation successfully',
      };
    } catch {
      return {
        success: false,
        message: 'There was an error declining invitation',
      };
    }
  });
