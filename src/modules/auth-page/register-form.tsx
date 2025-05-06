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
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      userName: '',
    },
  });

  const registerMutation = trpc.website.authentication.register.useMutation();

  useMemo(async () => {
    if (registerMutation.isSuccess) {
      console.log('sucus');
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
      const name = `${data.firstName} ${data.lastName}`;

      await registerMutation.mutateAsync({
        userName: data.userName,
        password: data.password,
        name,
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
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <FormField
            name="firstName"
            control={registerForm.control}
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel htmlFor="register-firstName">First Name</FormLabel>
                <Input
                  id="register-firstName"
                  {...field}
                  placeholder="John"
                  required
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="lastName"
            control={registerForm.control}
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel htmlFor="register-lastName">Last Name</FormLabel>
                <Input
                  id="register-lastName"
                  {...field}
                  placeholder="Doe"
                  required
                />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          name="userName"
          control={registerForm.control}
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel htmlFor="register-userName">Username</FormLabel>
              <Input
                id="register-userName"
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
                id="register-email"
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
                id="register-password"
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
              <FormLabel htmlFor="confirmPassword">Confirm Password</FormLabel>
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
        <div>
          {registerMutation.error && <FormMessage>Username or email is already used</FormMessage>}
        </div>
        <Button
          className="w-full py-6"
          type="submit"
          disabled={registerMutation.status === 'pending' || registerMutation.isSuccess}
        >
          {registerMutation.status === 'pending' || registerMutation.isSuccess ? (
            <SpinAnim />
          ) : (
            'Create Account'
          )}
        </Button>
      </form>
    </Form>
  );
}

export { RegisterForm };
