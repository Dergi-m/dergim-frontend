import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Member } from '@/lib/schema/project';
import { CreateTaskSchema } from '@/lib/schema/task';
import { useSession } from '@/contexts/session-context';
import { Button } from '@/modules/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/modules/ui/dialog';
import { Form, FormField, FormItem, FormLabel } from '@/modules/ui/form';
import { Input } from '@/modules/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/modules/ui/select';
import { Textarea } from '@/modules/ui/textarea';

type TaskCreatorProps = {
  isNewTaskDialogOpen: boolean;
  setIsNewTaskDialogOpen: (open: boolean) => void;
  handleTaskCreate: (data: CreateTaskSchema) => Promise<void>;
  members?: Member[];
};

export function TaskCreator({
  handleTaskCreate,
  isNewTaskDialogOpen,
  setIsNewTaskDialogOpen,
  members,
}: TaskCreatorProps) {
  const { activeProject } = useSession();

  const createTaskForm = useForm<z.infer<typeof CreateTaskSchema>>({
    resolver: zodResolver(CreateTaskSchema),
    defaultValues: {
      name: '',
      description: '',
      projectId: activeProject?.id,
      status: 0,
      assignedToUserId: undefined,
    },
  });

  return (
    <Dialog
      open={isNewTaskDialogOpen}
      onOpenChange={setIsNewTaskDialogOpen}
    >
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
          <DialogDescription>Add a new task to the board.</DialogDescription>
        </DialogHeader>
        <Form {...createTaskForm}>
          <form
            onSubmit={createTaskForm.handleSubmit(handleTaskCreate)}
            className="grid gap-4 py-4"
          >
            <FormField
              control={createTaskForm.control}
              name="name"
              render={({ field }) => (
                <FormItem className="grid gap-2">
                  <FormLabel htmlFor="new-task-name">Task Name</FormLabel>
                  <Input
                    {...field}
                    id="new-task-name"
                    placeholder="Enter task name"
                  />
                </FormItem>
              )}
            />
            <FormField
              control={createTaskForm.control}
              name="description"
              render={({ field }) => (
                <FormItem className="grid gap-2">
                  <FormLabel htmlFor="new-task-description">Description</FormLabel>
                  <Textarea
                    {...field}
                    id="new-task-description"
                    placeholder="Enter task description"
                    className="min-h-[100px]"
                  />
                </FormItem>
              )}
            />
            <FormField
              control={createTaskForm.control}
              name="assignedToUserId"
              render={({ field }) => (
                <FormItem className="grid gap-2">
                  <FormLabel htmlFor="new-task-assignee">Assigned To</FormLabel>
                  <Select
                    value={undefined}
                    onValueChange={(value) => field.onChange(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select member" />
                    </SelectTrigger>
                    <SelectContent>
                      {members?.map((member) => (
                        <SelectItem
                          key={member.id}
                          value={member.id}
                        >
                          {member.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <div className="flex w-full justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setIsNewTaskDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Create Task</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
