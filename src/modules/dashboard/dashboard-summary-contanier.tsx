'use client';

import { useMemo, useState } from 'react';
import { CheckCircle2Icon, InboxIcon, ListTodoIcon, LoaderCircle } from 'lucide-react';

import { UserTask } from '@/lib/schema/session-user';
import { useSession } from '@/contexts/session-context';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/modules/ui/card';

export function DashboardSummaryContainer() {
  const [tasks, setTasks] = useState<UserTask[]>([]);
  const [activeTasks, setActiveTasks] = useState<number>();
  const { userTasks } = useSession();

  const { invitations } = useSession();

  useMemo(() => {
    if (userTasks.isSuccess && userTasks.data.tasks) {
      setTasks(userTasks.data.tasks);
      setActiveTasks(userTasks.data.tasks.length);
    }
  }, [userTasks.data, userTasks.isSuccess]);

  return (
    <>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Pending Invitations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <InboxIcon className="mr-3 h-8 w-8 text-blue-500" />
            <span className="text-3xl font-bold">{invitations.length}</span>
          </div>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-muted-foreground">
            {invitations.length === 0
              ? 'No pending invitations'
              : invitations.length === 1
                ? '1 project invitation awaiting your response'
                : `${invitations.length} project invitations awaiting your response`}
          </p>
        </CardFooter>
      </Card>

      {userTasks.isPending ? (
        <Card className="col-span-2 w-full">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <h3 className="mb-2 text-xl font-medium">Retrieving your tasks</h3>
            <LoaderCircle className="size-20 animate-spin text-blue-600 ease-in-out" />
          </CardContent>
        </Card>
      ) : (
        <>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Active Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <ListTodoIcon className="mr-3 h-8 w-8 text-amber-500" />
                <span className="text-3xl font-bold">{activeTasks}</span>
              </div>
            </CardContent>
            <CardFooter>
              <p className="text-sm text-muted-foreground">
                {activeTasks === 0
                  ? 'No active tasks'
                  : activeTasks === 1
                    ? '1 task requires your attention'
                    : `${activeTasks} tasks require your attention`}
              </p>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Completed Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <CheckCircle2Icon className="mr-3 h-8 w-8 text-green-500" />
                <span className="text-3xl font-bold">
                  {tasks.filter((task) => task.status === 2).length}
                </span>
              </div>
            </CardContent>
            <CardFooter>
              <p className="text-sm text-muted-foreground">
                {tasks.filter((task) => task.status === 2).length} tasks completed
              </p>
            </CardFooter>
          </Card>
        </>
      )}
    </>
  );
}
