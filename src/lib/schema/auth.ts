import { z } from 'zod';

export const LoginFormSchema = z.object({
  userName: z.string().min(3, 'Username is required'),
  password: z.string().min(3, 'Password is required'),
});
export type LoginFormSchema = z.infer<typeof LoginFormSchema>;

export const RegisterFormSchema = z
  .object({
    userName: z.string().min(5, 'Username should be at least 5 characters'),
    password: z
      .string()
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}$/,
        'Password must contain at least 8 characters, one uppercase letter, one lowercase letter, and one number'
      ),
    confirmPassword: z.string().min(3, 'Confirm Password is required'),
    firstName: z.string().min(3, 'First Name is required'),
    lastName: z.string().min(3, 'Last Name is required'),
    email: z.string().email(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });
export type RegisterFormSchema = z.infer<typeof RegisterFormSchema>;
