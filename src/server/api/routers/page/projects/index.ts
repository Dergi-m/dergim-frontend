import createProject from '@/server/api/routers/page/projects/create-project';
import getProject from '@/server/api/routers/page/projects/get-project';
import inviteUser from '@/server/api/routers/page/projects/invite-user';
import removeMember from '@/server/api/routers/page/projects/remove-member';
import updateProject from '@/server/api/routers/page/projects/update-project';
import { createTRPCRouter } from '@/server/api/trpc';

export default createTRPCRouter({
  createProject,
  updateProject,
  getProject,
  inviteUser,
  removeMember,
});
