import { z } from 'zod';

import { publicProcedure } from '@/server/api/trpc';
import { backendRequest } from '@/server/lib/backend/request';

const DeleteProjectFileResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default publicProcedure
  .input(
    z.object({
      fileId: z.string(),
    })
  )
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  .mutation(async ({ ctx, input }) => {
    try {
      const { fileId } = input;

      const response = await backendRequest({
        url: `/api/ProjectFile/${fileId}`,
        method: 'DELETE',
        schema: DeleteProjectFileResponseSchema,
      });

      console.log(response);

      if (!response.success) {
        throw response.error;
      }

      return response.data;
    } catch {
      return {
        success: false,
        message: 'There was an error uploading the file',
      };
    }
  });
