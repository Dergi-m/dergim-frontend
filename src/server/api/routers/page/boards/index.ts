import createTask from '@/server/api/routers/page/boards/create-task';
import deleteTask from '@/server/api/routers/page/boards/delete-task';
import getTasks from '@/server/api/routers/page/boards/get-tasks';
import updateTask from '@/server/api/routers/page/boards/update-task';
import { createTRPCRouter } from '@/server/api/trpc';

export default createTRPCRouter({
  getTasks,
  updateTask,
  deleteTask,
  createTask,
});
