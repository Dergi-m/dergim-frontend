import acceptInvitation from '@/server/api/routers/page/dashboard/accept-invitation';
import getUserTasks from '@/server/api/routers/page/dashboard/get-user-tasks';
import rejectInvitation from '@/server/api/routers/page/dashboard/reject-invitation';
import { createTRPCRouter } from '@/server/api/trpc';

export default createTRPCRouter({
  getUserTasks,
  acceptInvitation,
  rejectInvitation,
});
