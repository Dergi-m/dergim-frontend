import { z } from 'zod';

import { publicProcedure } from '@/server/api/trpc';
import { backendRequest } from '@/server/lib/backend/request';

const GetFilesResponseSchema = z.object({
  success: z.boolean(),
  files: z.object({
    $values: z
      .object({
        id: z.string(),
        localFileUrl: z.string(),
        fileUrl: z.string(),
        createdAt: z.string(),
        updatedAt: z.string(),
      })
      .array(),
  }),
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
      const response = await backendRequest({
        url: `/api/ProjectFile/${input.projectId}`,
        method: 'GET',
        schema: GetFilesResponseSchema,
      });

      if (!response.success) {
        throw response.error;
      }

      const data = response.data;

      return {
        success: data.success,
        message: 'Project created successfully',
        files: response.data.files.$values,
      };
    } catch {
      return {
        success: false,
        message: 'There was an error creating the project',
        files: null,
      };
    }
  });
