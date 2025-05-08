import { z } from 'zod';

import { Project } from '@/lib/schema/project';
import { serverProcedure } from '@/server/api/trpc';
import { backendRequest } from '@/server/lib/backend/request';

const GetProjectResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  creatorId: z.string(),
  members: z.object({
    $values: z
      .object({
        id: z.string(),
        name: z.string(),
        userName: z.string(),
        email: z.string(),
      })
      .array()
      .optional(),
  }),
  invitations: z.any(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default serverProcedure
  .input(
    z.object({
      id: z.string(),
    })
  )
  .query(async ({ ctx, input }) => {
    try {
      if (ctx.headers.get('SessionToken')) {
        throw new Error('There is no valid session');
      }

      const response = await backendRequest({
        url: `/api/projects/${input.id}`,
        method: 'GET',
        schema: GetProjectResponseSchema,
      });

      if (!response.success) {
        throw response.error;
      }

      const project = response.data;

      return {
        success: true,
        message: 'Project retrieved successfully',
        project: {
          id: project.id,
          name: project.name,
          description: project.description,
          creatorId: project.creatorId,
          members: project.members.$values,
          projectInvitations: project.invitations,
          createdAt: project.createdAt,
          updatedAt: project.updatedAt,
        } as Project,
      };
    } catch {
      return {
        success: false,
        message: 'There was an error retrieving the project',
        project: null,
      };
    }
  });
