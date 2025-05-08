import { z } from 'zod';

import { SessionUser } from '@/lib/schema/session-user';
import { serverProcedure } from '@/server/api/trpc';
import { backendRequest } from '@/server/lib/backend/request';

const SessionResponseSchema = z.object({
  success: z.boolean(),
  user: z
    .object({
      id: z.string(),
      name: z.string(),
      userName: z.string(),
      email: z.string(),
      organisationMemberships: z.object({
        $values: z
          .object({
            id: z.string(),
            userId: z.string(),
            organisationId: z.string(),
            roleId: z.string(),
          })
          .array()
          .optional(),
      }),
      projects: z.object({
        $values: z
          .object({
            id: z.string(),
            name: z.string(),
            description: z.string(),
          })
          .array()
          .optional(),
      }),
      projectInvitations: z.object({
        $values: z
          .object({
            id: z.string(),
            projectId: z.string(),
            senderUserId: z.string(),
            targetUserId: z.string(),
            message: z.string(),
            createdAt: z.string(),
          })
          .array()
          .optional(),
      }),
    })
    .optional(),
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default serverProcedure.query(async ({ ctx }) => {
  try {
    if (ctx.headers.get('SessionToken')) {
      throw new Error('There is no valid session');
    }

    const response = await backendRequest({
      url: `/api/Auth/Session`,
      method: 'GET',
      schema: SessionResponseSchema,
    });

    if (!response.success) {
      throw response.error;
    }

    if (!response.data.success) {
      throw new Error('Session Token is invalid');
    }

    if (!response.data.user) {
      throw new Error('User not found');
    }

    const data = response.data.user;

    const orgMemberships = data.organisationMemberships.$values;
    if (!orgMemberships) throw new Error('Organisation memberships not found');

    const org = orgMemberships[0];
    const user: SessionUser = {
      id: data.id,
      name: data.name,
      userName: data.userName,
      email: data.email,
      organisationId: org?.organisationId ?? '',
      projects: data.projects.$values,
      projectInvitations: data.projectInvitations.$values,
    };

    return {
      success: true,
      user,
    };
  } catch {
    return {
      success: false,
      user: null,
    };
  }
});
