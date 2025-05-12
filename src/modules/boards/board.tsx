'use client';

import { useEffect, useMemo, useState } from 'react';
import { redirect } from 'next/navigation';
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import { LoaderCircle, PlusIcon } from 'lucide-react';

import { Project } from '@/lib/schema/project';
import { CreateTaskSchema, Task, UpdateTaskSchema } from '@/lib/schema/task';
import { toast } from '@/hooks/use-toast';
import { useSession } from '@/contexts/session-context';
import { trpc } from '@/server/api/react';
import { Badge } from '@/modules/ui/badge';
import { Button } from '@/modules/ui/button';
import { TaskCard } from '@/modules/boards/task-card';
import { TaskCreator } from '@/modules/boards/task-creator';
import { TaskEditor } from '@/modules/boards/task-editor';

const statusColumns = [
  { code: 0, name: 'Created', color: 'bg-gray-100' },
  { code: 1, name: 'In Progress', color: 'bg-blue-100' },
  { code: 2, name: 'In Review', color: 'bg-amber-100' },
  { code: 3, name: 'Done', color: 'bg-green-100' },
];

type BoardProps = {
  project: Project;
};

export function Board({ project }: BoardProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<UpdateTaskSchema>();
  const [tasks, setTasks] = useState<Task[]>();

  const [isNewTaskDialogOpen, setIsNewTaskDialogOpen] = useState(false);
  const projectTasks = trpc.page.boards.getTasks.useQuery({ projectId: project.id });
  const createTaskMutation = trpc.page.boards.createTask.useMutation();
  const updateTaskMutation = trpc.page.boards.updateTask.useMutation();
  const deleteTaskMutation = trpc.page.boards.deleteTask.useMutation();
  const { activeProject, sessionUser } = useSession();

  useEffect(() => {
    if (projectTasks.isSuccess) {
      const { tasks: pt, success } = projectTasks.data;

      if (!pt || !success) return;
      const fixedTasks = pt.map((task) => {
        if (!task.assignedToUser) return task;

        if (task.assignedToUser.$ref) {
          return {
            ...task,
            assignedToUser: {
              id: sessionUser.id,
              name: sessionUser.name,
              email: sessionUser.email,
              userName: sessionUser.userName,
            },
          };
        }

        return task;
      }) as Task[];

      setTasks(fixedTasks);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectTasks.data, projectTasks.isSuccess]);

  useMemo(() => {
    if (project.id !== activeProject?.id && activeProject)
      redirect(`/tool/boards/${activeProject.id}`);
  }, [activeProject, project.id]);

  // Group tasks by status
  const getTasksByStatus = (status: number) => {
    if (!tasks) return [];

    return tasks.filter((task) => task.status === status);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async function onDragEnd(result: any) {
    if (!tasks) return;

    const { destination, source, draggableId } = result;

    // If there's no destination or the item was dropped back in its original position
    if (
      !destination ||
      (destination.droppableId === source.droppableId && destination.index === source.index)
    ) {
      return;
    }

    // Get the new status from the destination droppableId
    const newStatus = Number.parseInt(destination.droppableId);

    // Update the task status
    const updatedTasks = tasks.map((task) => {
      if (task.id === draggableId) {
        return {
          ...task,
          status: newStatus,
        };
      }

      return task;
    });

    const task = tasks.find((task) => task.id === draggableId);

    setTasks(updatedTasks);

    if (!task) return;

    await updateTaskMutation.mutateAsync({
      id: task.id,
      name: task.name,
      description: task.description,
      status: newStatus,
      assignedToUserId: task.assignedToUser?.id,
    });

    projectTasks.refetch();
  }

  async function handleEditTask(data: UpdateTaskSchema) {
    await updateTaskMutation.mutateAsync(data);
    projectTasks.refetch();
    setEditingTask(undefined);
    setIsEditDialogOpen(false);
  }

  async function handleCreateTask(data: CreateTaskSchema) {
    await createTaskMutation.mutateAsync({
      name: data.name,
      description: data.description,
      projectId: project.id,
      status: data.status,
      assignedToUserId: data.assignedToUserId,
    });
    projectTasks.refetch();
    setIsNewTaskDialogOpen(false);
  }

  async function deleteTask(taskId: string) {
    if (!tasks) return;
    const res = await deleteTaskMutation.mutateAsync({ id: taskId });

    if (!res.success) {
      toast({
        title: 'Task deletion failed',
        description: res.message,
        variant: 'destructive',
      });
      return;
    }

    setTasks(tasks.filter((task) => task.id !== taskId));
    toast({
      title: 'Task deleted',
      description: 'Task has been removed',
      variant: 'default',
    });
  }

  if (projectTasks.isFetching) {
    return (
      <div className="container mx-auto flex h-screen w-full flex-col items-center justify-center space-y-4 px-4 py-8">
        <LoaderCircle className="size-44 animate-spin text-blue-800 ease-in-out" />
        <h1 className="text-4xl">Loading board...</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{project.name}</h1>
        </div>
        <Button onClick={() => setIsNewTaskDialogOpen(true)}>
          <PlusIcon className="mr-2 h-4 w-4" />
          Add Task
        </Button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {statusColumns.map((statusColumn) => (
            <div
              key={statusColumn.code}
              className="flex flex-col"
            >
              <div className="mb-4 flex items-center justify-between">
                <h2 className="flex items-center font-semibold">
                  <Badge
                    variant="outline"
                    className={`${statusColumn.color} mr-2`}
                  >
                    {getTasksByStatus(statusColumn.code).length}
                  </Badge>
                  {statusColumn.name}
                </h2>
              </div>
              <Droppable droppableId={statusColumn.code.toString()}>
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="min-h-[500px] flex-1 rounded-lg bg-gray-50 p-4"
                  >
                    {getTasksByStatus(statusColumn.code).map((task, index) => (
                      <Draggable
                        key={task.id}
                        draggableId={task.id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="mb-3"
                          >
                            <TaskCard
                              task={task}
                              onEdit={() => {
                                setEditingTask(task);
                                setIsEditDialogOpen(true);
                              }}
                              onDelete={deleteTask}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>

      {editingTask && (
        <TaskEditor
          editingTask={editingTask}
          handleEditTask={handleEditTask}
          isEditDialogOpen={isEditDialogOpen}
          members={project.members}
          setIsEditDialogOpen={setIsEditDialogOpen}
        />
      )}

      <TaskCreator
        handleTaskCreate={handleCreateTask}
        isNewTaskDialogOpen={isNewTaskDialogOpen}
        setIsNewTaskDialogOpen={setIsNewTaskDialogOpen}
        members={project.members}
      />
    </div>
  );
}

// Task Card Component
