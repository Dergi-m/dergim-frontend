import { z } from 'zod';

export const Creator = z.object({
  id: z.string(),
  name: z.string(),
});

export const ProjectInvitation = z.object({
  id: z.string(),
  projectId: z.string(),
  senderUserId: z.string(),
  targetUserId: z.string(),
});
export type ProjectInvitation = z.infer<typeof ProjectInvitation>;

export const Member = z.object({
  id: z.string(),
  name: z.string(),
  userName: z.string(),
  email: z.string(),
});
export type Member = z.infer<typeof Member>;

export const Project = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  creatorId: z.string(),
  projectInvitations: ProjectInvitation.array().optional(),
  members: Member.array().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type Project = z.infer<typeof Project>;
