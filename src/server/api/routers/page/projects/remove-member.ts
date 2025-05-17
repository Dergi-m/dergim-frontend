import { z } from 'zod';

import { publicProcedure } from '@/server/api/trpc';
import { backendRequest } from '@/server/lib/backend/request';

const RemoveMemberResponseSchema = z.any();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default publicProcedure
  .input(
    z.object({
      projectId: z.string(),
      userId: z.string(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    try {
      if (ctx.headers.get('SessionToken')) {
        throw new Error('There is no valid session');
      }

      const response = await backendRequest({
        url: `/api/projects/${input.projectId}/remove-member`,
        method: 'PUT',
        schema: RemoveMemberResponseSchema,
        query: {
          userId: input.userId,
        },
      });
      console.log(response);
      if (!response.success) {
        throw response.error;
      }
      return {
        success: true,
        message: 'Member removed successfully',
      };
    } catch {
      return {
        success: false,
        message: 'There was an error removing the member',
      };
    }
  });
