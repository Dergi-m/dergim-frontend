import { z } from 'zod';

export const BoardDataSchema = z.object({
  id: z.string(),
  key: z.string(),
  title: z.string(),
  type: z.enum(['bug', 'task', 'feature']),
  status: z.string(),
  priority: z.enum(['highest', 'high', 'medium', 'low']),
  assignee: z.string(),
  assigneeId: z.string(),
  labels: z.array(z.string()),
  dueDate: z.string().optional(),
  attachments: z.number(),
  comments: z.number(),
});

export type BoardData = z.infer<typeof BoardDataSchema>;
