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

export const ProjectFile = z.any();

export const ProjectTask = z.any();

export const Project = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  creator: Creator,
  projectInvitations: ProjectInvitation.array().optional(),
  // projectFiles: ProjectFile.array().optional(),
  // projectTasks: ProjectTask.array().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
