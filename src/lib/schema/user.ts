import { z } from 'zod';

export const User = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  email: z.string().email(),
  avatar: z.string(),
});
export type User = z.infer<typeof User>;
