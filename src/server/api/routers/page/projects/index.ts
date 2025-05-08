import createProject from '@/server/api/routers/page/projects/create-project';
import updateProject from '@/server/api/routers/page/projects/update-project';
import { createTRPCRouter } from '@/server/api/trpc';

export default createTRPCRouter({
  createProject,
  updateProject,
});
