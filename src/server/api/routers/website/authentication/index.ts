import getSession from '@/server/api/routers/website/authentication/get-session';
import login from '@/server/api/routers/website/authentication/login';
import register from '@/server/api/routers/website/authentication/register';
import { createTRPCRouter } from '@/server/api/trpc';

export default createTRPCRouter({
  login,
  register,
  getSession,
});
