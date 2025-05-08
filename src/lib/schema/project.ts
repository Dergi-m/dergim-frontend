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

export const ProjectFile = z.any();

export const ProjectTask = z.any();

export const Project = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  creatorId: z.string(),
  projectInvitations: ProjectInvitation.array().optional(),
  members: Member.array().optional(),
  // projectFiles: ProjectFile.array().optional(),
  // projectTasks: ProjectTask.array().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type Project = z.infer<typeof Project>;
