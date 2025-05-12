import { z } from 'zod';

export const Task = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  status: z.number(),
  assignedToUser: z
    .object({
      id: z.string(),
      name: z.string(),
      userName: z.string(),
      email: z.string(),
    })
    .nullable(),
});
export type Task = z.infer<typeof Task>;

export const UpdateTaskSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  description: z.string().optional(),
  status: z.number().optional(),
  assignedToUserId: z.string().optional(),
});
export type UpdateTaskSchema = z.infer<typeof UpdateTaskSchema>;

export const CreateTaskSchema = z.object({
  name: z.string().min(3, { message: 'Task name is required' }),
  description: z.string().min(3, { message: 'Task description is required' }),
  projectId: z.string(),
  status: z.number(),
  assignedToUserId: z.string().optional(),
});
export type CreateTaskSchema = z.infer<typeof CreateTaskSchema>;
