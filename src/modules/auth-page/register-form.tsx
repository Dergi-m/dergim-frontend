'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { RegisterFormSchema } from '@/lib/schema/auth';
import { trpc } from '@/server/api/react';
import { Button } from '@/modules/ui/button';
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/modules/ui/form';
import { Input } from '@/modules/ui/input';
import { SpinAnim } from '@/modules/ui/spin-anim';

function RegisterForm() {
  const router = useRouter();
  const registerForm = useForm({
    resolver: zodResolver(RegisterFormSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      age: 0,
      gender: '',
      userName: '',
    },
  });

  const registerMutation = trpc.website.authentication.register.useMutation();

  useMemo(async () => {
    if (registerMutation.isSuccess) {
      const body = JSON.stringify({ sessionToken: registerMutation.data.sessionToken });

      const sessionSetter = await fetch('/api/set-session-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body,
        credentials: 'include',
      });

      if (sessionSetter.ok) {
        router.push('/tool');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [registerMutation.isSuccess]);

  async function onRegister(data: RegisterFormSchema) {
    try {
      registerMutation.mutateAsync({
        userName: data.userName,
        password: data.password,
        name: data.name,
        email: data.email,
      });
    } catch {
      registerForm.setError('root', {
        type: 'validate',
        message: 'Email or username already exists',
      });
    }
  }

  return (
    <Form {...registerForm}>
      <form
        onSubmit={registerForm.handleSubmit(onRegister)}
        className="space-y-4"
      >
        <FormField
          name="name"
          control={registerForm.control}
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel htmlFor="name">Full Name</FormLabel>
              <Input
                id="name"
                {...field}
                placeholder="John Doe"
                required
              />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="userName"
          control={registerForm.control}
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel htmlFor="name">Username</FormLabel>
              <Input
                id="userName"
                {...field}
                placeholder="Johndoeisawesome001"
                required
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={registerForm.control}
          name="email"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel htmlFor="register-email">Email</FormLabel>
              <Input
                {...field}
                id="email"
                type="email"
                placeholder="name@example.com"
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="password"
          control={registerForm.control}
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel htmlFor="register-password">Password</FormLabel>
              <Input
                {...field}
                id="password"
                type="password"
                required
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="confirmPassword"
          control={registerForm.control}
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel htmlFor="register-password">Confirm Password</FormLabel>
              <Input
                {...field}
                id="confirmPassword"
                type="password"
                required
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          className="w-full py-6"
          type="submit"
          disabled={registerMutation.status === 'pending'}
        >
          {registerMutation.status === 'pending' ? <SpinAnim /> : 'Create Account'}
        </Button>
      </form>
    </Form>
  );
}

export { RegisterForm };
