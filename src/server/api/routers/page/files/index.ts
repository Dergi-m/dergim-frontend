import deleteProjectFile from '@/server/api/routers/page/files/delete-project-file';
import getProjectFiles from '@/server/api/routers/page/files/get-project-files';
import { createTRPCRouter } from '@/server/api/trpc';

export default createTRPCRouter({
  deleteProjectFile,
  getProjectFiles,
});
