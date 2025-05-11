import { z } from 'zod';

export const FileItem = z.object({
  id: z.string(),
  name: z.string(),
  type: z.string(),
  blobName: z.string(),
  updatedAt: z.date(),
});

export type FileItem = z.infer<typeof FileItem>;

export const BackendFile = z.object({
  id: z.string(),
  localFileUrl: z.string(),
  fileUrl: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type BackendFile = z.infer<typeof BackendFile>;
