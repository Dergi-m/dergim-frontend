import authentication from '@/server/api/routers/website/authentication';
import { createTRPCRouter } from '@/server/api/trpc';

export default createTRPCRouter({
  authentication,
});
