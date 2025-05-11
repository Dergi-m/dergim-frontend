'use client';

import { useMemo, useState } from 'react';
import {
  AlertCircleIcon,
  CheckCircle2Icon,
  CheckIcon,
  CircleIcon,
  ClockIcon,
  InboxIcon,
  ListTodoIcon,
  LoaderCircle,
  XIcon,
} from 'lucide-react';

import { ProjectInvitation } from '@/lib/schema/project';
import { UserTask } from '@/lib/schema/session-user';
import { toast } from '@/hooks/use-toast';
import { useSession } from '@/contexts/session-context';
import { trpc } from '@/server/api/react';
import { Button } from '@/modules/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/modules/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/modules/ui/tabs';

export function DashboardContentContainer() {
  const { userTasks, invitations, acceptInvitation, rejectInvitation } = useSession();
  const [tasks, setTasks] = useState<UserTask[]>([]);
  const [invitationLoading, setInvitationLoading] = useState(false);

  const acceptMutation = trpc.page.dashboard.acceptInvitation.useMutation();
  const declineMutation = trpc.page.dashboard.rejectInvitation.useMutation();

  useMemo(() => {
    if (userTasks.isSuccess && userTasks.data.tasks) {
      setTasks(userTasks.data.tasks);
    }
  }, [userTasks.data, userTasks.isSuccess]);

  const getTaskStatusIcon = (status: number) => {
    switch (status) {
      case 0:
        return <CircleIcon className="h-5 w-5 text-gray-400" />;
      case 1:
        return <ClockIcon className="h-5 w-5 text-blue-500" />;
      case 2:
        return <CheckCircle2Icon className="h-5 w-5 text-green-500" />;
      default:
        return <AlertCircleIcon className="h-5 w-5 text-gray-400" />;
    }
  };

  async function handleAcceptInvitation(invitation: ProjectInvitation) {
    setInvitationLoading(true);
    try {
      const accept = await acceptMutation.mutateAsync({
        invitationId: invitation.id,
        preojectId: invitation.projectId,
      });

      if (!accept.success) {
        toast({
          title: 'Invitation accept failed',
          description: accept.message,
          variant: 'destructive',
        });
      }

      acceptInvitation(invitation.id);

      toast({
        title: 'Invitation accepted',
        description: accept.message,
      });
    } catch {
      toast({
        title: 'Invitation accept failed',
        description: 'There was an error accepting the invitation.',
        variant: 'destructive',
      });
    }
    setInvitationLoading(false);
  }

  async function handleDeclineInvitation(invitation: ProjectInvitation) {
    setInvitationLoading(true);
    try {
      const decline = await declineMutation.mutateAsync({
        invitationId: invitation.id,
        preojectId: invitation.projectId,
      });

      if (!decline.success) {
        toast({
          title: 'Invitation decline failed',
          description: decline.message,
          variant: 'destructive',
        });
      }

      rejectInvitation(invitation.id);

      toast({
        title: 'Invitation declineed',
        description: decline.message,
      });
    } catch {
      toast({
        title: 'Invitation decline failed',
        description: 'There was an error declineing the invitation.',
        variant: 'destructive',
      });
    }
    setInvitationLoading(false);
  }

  const handleUpdateTaskStatus = (taskId: string, newStatus: number) => {
    // In a real app, you would call an API to update the task status
    setTasks(
      tasks.map((task) =>
        task.id === taskId
          ? { ...task, status: newStatus, updatedAt: new Date().toISOString() }
          : task
      )
    );

    const statusText = newStatus === 2 ? 'completed' : newStatus === 1 ? 'in progress' : 'pending';
    toast({
      title: 'Task updated',
      description: `Task has been marked as ${statusText}.`,
    });
  };

  return (
    <div className="col-span-3">
      <Tabs
        defaultValue="tasks"
        className="w-full"
      >
        <TabsList className="mb-6">
          <TabsTrigger value="tasks">My Tasks</TabsTrigger>
          <TabsTrigger value="invitations">Invitations</TabsTrigger>
        </TabsList>

        <TabsContent value="tasks">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Your Assigned Tasks</h2>
            </div>

            {tasks.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <ListTodoIcon className="mb-4 h-16 w-16 text-muted-foreground" />
                  <h3 className="mb-2 text-xl font-medium">No Tasks Assigned</h3>
                  <p className="max-w-md text-center text-muted-foreground">
                    You don&apos;t have any tasks assigned to you at the moment. Tasks assigned to
                    you will appear here.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {tasks.map((task) => (
                  <Card
                    key={task.id}
                    className="w-full overflow-hidden"
                  >
                    <div className="flex">
                      <div className="flex items-center justify-center border-r p-4">
                        {getTaskStatusIcon(task.status)}
                      </div>
                      <div className="flex-1">
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">{task.name}</CardTitle>
                          </div>
                          <CardDescription>
                            Created {new Date(task.createdAt).toLocaleDateString()}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="mb-2 text-sm text-muted-foreground">{task.description}</p>
                        </CardContent>
                        <CardFooter className="flex justify-between pt-0">
                          <Button
                            variant="link"
                            size="sm"
                            asChild
                            className="px-0"
                          ></Button>
                          <div className="flex gap-2">
                            {task.status !== 2 && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleUpdateTaskStatus(task.id, 2)}
                              >
                                <CheckIcon className="mr-1 h-4 w-4" />
                                Mark Complete
                              </Button>
                            )}
                            {task.status === 2 && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleUpdateTaskStatus(task.id, 1)}
                              >
                                <ClockIcon className="mr-1 h-4 w-4" />
                                Reopen
                              </Button>
                            )}
                          </div>
                        </CardFooter>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="invitations">
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Project Invitations</h2>
            {invitationLoading ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <h3 className="mb-2 text-xl font-medium">Retrieving invitations</h3>
                  <p className="mb-4 text-muted-foreground">
                    Please wait while we fetch your invitations. This may take a moment.
                  </p>
                  <LoaderCircle className="size-20 animate-spin text-blue-600 ease-in-out" />
                </CardContent>
              </Card>
            ) : (
              <>
                {invitations.length === 0 ? (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                      <InboxIcon className="mb-4 h-16 w-16 text-muted-foreground" />
                      <h3 className="mb-2 text-xl font-medium">No Pending Invitations</h3>
                      <p className="max-w-md text-center text-muted-foreground">
                        You don&apos;t have any pending project invitations. When someone invites
                        you to a project, it will appear here.
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {invitations.map((invitation) => (
                      <Card key={invitation.id}>
                        <CardHeader>
                          <CardTitle className="text-lg">Project Invitation</CardTitle>
                          <CardDescription>
                            Received {new Date(invitation.createdAt).toLocaleDateString()}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="mb-4">{invitation.message}</p>
                        </CardContent>
                        <CardFooter className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            onClick={() => handleDeclineInvitation(invitation)}
                          >
                            <XIcon className="mr-1 h-4 w-4" />
                            Decline
                          </Button>
                          <Button onClick={() => handleAcceptInvitation(invitation)}>
                            <CheckIcon className="mr-1 h-4 w-4" />
                            Accept
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
