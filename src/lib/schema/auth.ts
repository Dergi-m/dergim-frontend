import { z } from 'zod';

export const LoginFormSchema = z.object({
  userName: z.string().min(3, 'Username is required'),
  password: z.string().min(3, 'Password is required'),
});
export type LoginFormSchema = z.infer<typeof LoginFormSchema>;

export const RegisterFormSchema = z
  .object({
    userName: z.string(),
    password: z
      .string()
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}$/,
        'Password must contain at least 8 characters, one uppercase letter, one lowercase letter, and one number'
      ),
    confirmPassword: z.string().min(3, 'Confirm Password is required'),
    name: z.string(),
    email: z.string().email(),
    age: z.number().nullish(),
    gender: z.string().nullish(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });
export type RegisterFormSchema = z.infer<typeof RegisterFormSchema>;
