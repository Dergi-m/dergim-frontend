import dashboard from '@/server/api/routers/page/dashboard';
import files from '@/server/api/routers/page/files';
import projects from '@/server/api/routers/page/projects';
import { createTRPCRouter } from '@/server/api/trpc';

export default createTRPCRouter({
  projects,
  files,
  dashboard,
});
