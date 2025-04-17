import { z } from 'zod';

export const AuthenticationToken = z.object({
  accessToken: z.string(),
  expiresIn: z.number(),
});

export type AuthenticationToken = z.infer<typeof AuthenticationToken>;
