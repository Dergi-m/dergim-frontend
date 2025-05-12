import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Member } from '@/lib/schema/project';
import { UpdateTaskSchema } from '@/lib/schema/task';
import { Button } from '@/modules/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/modules/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/modules/ui/form';
import { Input } from '@/modules/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/modules/ui/select';
import { Textarea } from '@/modules/ui/textarea';

type TaskEditorProps = {
  isEditDialogOpen: boolean;
  setIsEditDialogOpen: (open: boolean) => void;
  editingTask: UpdateTaskSchema;
  handleEditTask: (data: UpdateTaskSchema) => Promise<void>;
  members?: Member[];
};

export function TaskEditor({
  editingTask,
  handleEditTask,
  isEditDialogOpen,
  setIsEditDialogOpen,
  members,
}: TaskEditorProps) {
  const updateTaskForm = useForm<z.infer<typeof UpdateTaskSchema>>({
    resolver: zodResolver(UpdateTaskSchema),
    defaultValues: {
      id: editingTask.id,
      name: editingTask.name,
      description: editingTask.description,
      status: editingTask.status,
      assignedToUserId: editingTask.assignedToUserId,
    },
  });

  return (
    <Dialog
      open={isEditDialogOpen}
      onOpenChange={setIsEditDialogOpen}
    >
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
          <DialogDescription>Make changes to the task details.</DialogDescription>
        </DialogHeader>
        <Form {...updateTaskForm}>
          <form
            className="grid gap-4 py-4"
            onSubmit={updateTaskForm.handleSubmit(handleEditTask)}
          >
            <FormField
              control={updateTaskForm.control}
              name="name"
              render={({ field }) => (
                <FormItem className="grid gap-2">
                  <FormLabel htmlFor="task-name">Task Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      id="task-name"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={updateTaskForm.control}
              name="description"
              render={({ field }) => (
                <FormItem className="grid gap-2">
                  <FormLabel htmlFor="task-description">Description</FormLabel>
                  <Textarea
                    {...field}
                    id="task-description"
                    className="min-h-[100px]"
                  />
                </FormItem>
              )}
            />

            <FormField
              control={updateTaskForm.control}
              name="status"
              render={({ field }) => (
                <FormItem className="grid gap-2">
                  <FormLabel htmlFor="task-status">Status</FormLabel>
                  <FormControl>
                    <Select
                      {...field}
                      value={editingTask.status?.toString() || '0'}
                      onValueChange={(value) => field.onChange(value ? parseInt(value) : 0)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">Created</SelectItem>
                        <SelectItem value="1">In Progress</SelectItem>
                        <SelectItem value="2">In Review</SelectItem>
                        <SelectItem value="3">Done</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={updateTaskForm.control}
              name="assignedToUserId"
              render={({ field }) => (
                <FormItem className="grid gap-2">
                  <FormLabel htmlFor="task-assignee">Assigned To</FormLabel>
                  <FormControl>
                    <Select
                      {...field}
                      onValueChange={(value) => field.onChange(value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select assignee" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="unassigned">Unassigned</SelectItem>
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
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="flex w-full justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
