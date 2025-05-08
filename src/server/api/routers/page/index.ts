import projects from '@/server/api/routers/page/projects';
import { createTRPCRouter } from '@/server/api/trpc';

export default createTRPCRouter({
  projects,
});
