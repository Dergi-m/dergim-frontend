import { z } from 'zod';

export const ProjectSummary = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
});
export type ProjectSummary = z.infer<typeof ProjectSummary>;

export const ProjectInvitation = z.object({
  id: z.string(),
  projectId: z.string(),
  senderUserId: z.string(),
  targetUserId: z.string(),
  message: z.string(),
  status: z.number(),
  createdAt: z.string(),
});
export type ProjectInvitation = z.infer<typeof ProjectInvitation>;

export const UserTask = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  status: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type UserTask = z.infer<typeof UserTask>;

export const SessionUser = z.object({
  id: z.string(),
  name: z.string(),
  userName: z.string(),
  email: z.string(),
  organisationId: z.string(),
  projects: ProjectSummary.array().optional(),
  projectInvitations: ProjectInvitation.array().optional(),
});
export type SessionUser = z.infer<typeof SessionUser>;
