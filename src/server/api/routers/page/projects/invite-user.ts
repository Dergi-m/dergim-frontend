import { z } from 'zod';

import { publicProcedure } from '@/server/api/trpc';
import { backendRequest } from '@/server/lib/backend/request';

const GetUserResponse = z.object({
  id: z.string(),
  userName: z.string(),
});

const SendInviteResponse = z.object({
  success: z.boolean(),
  message: z.string(),
});

export default publicProcedure
  .input(
    z.object({
      targetUserName: z.string(),
      projectId: z.string(),
      message: z.string(),
    })
  )
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  .mutation(async ({ ctx, input }) => {
    try {
      const targetUser = await backendRequest({
        url: `/api/projects/users/${input.targetUserName}`,
        method: 'GET',
        schema: GetUserResponse,
      });

      if (!targetUser.success) {
        return {
          success: false,
          status: 404,
          message: 'User with this username not found',
        };
      }

      const targetUserId = targetUser.data.id;

      const inviteBody = JSON.stringify({
        projectId: input.projectId,
        targetUserId: targetUserId,
        message: input.message,
      });

      const inviteResponse = await backendRequest({
        url: `/api/projects/invite`,
        method: 'POST',
        schema: SendInviteResponse,
        body: inviteBody,
      });

      if (!inviteResponse.success) {
        throw inviteResponse.error;
      }

      return {
        success: true,
        status: 200,
        message: 'Invitation sent successfully',
      };
    } catch {
      return {
        success: false,
        status: 500,
        message: 'There was an error sending the project invite',
      };
    }
  });
