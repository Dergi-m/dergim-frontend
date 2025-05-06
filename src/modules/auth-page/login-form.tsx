'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { LoginFormSchema } from '@/lib/schema/auth';
import { trpc } from '@/server/api/react';
import { Button } from '@/modules/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/modules/ui/form';
import { Input } from '@/modules/ui/input';
import { SpinAnim } from '@/modules/ui/spin-anim';

function LoginForm() {
  const router = useRouter();

  const loginForm = useForm<z.infer<typeof LoginFormSchema>>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      userName: '',
      password: '',
    },
  });

  const loginMutation = trpc.website.authentication.login.useMutation();

  useMemo(async () => {
    if (loginMutation.isSuccess) {
      const body = JSON.stringify({ sessionToken: loginMutation.data.sessionToken });

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
  }, [loginMutation.isSuccess]);

  async function onLogin(data: LoginFormSchema) {
    try {
      await loginMutation.mutateAsync(data);
    } catch {
      loginForm.setError('root', {
        type: 'validate',
        message: 'Invalid username or password',
      });
    }
  }

  return (
    <Form {...loginForm}>
      <form
        onSubmit={loginForm.handleSubmit(onLogin)}
        className="flex size-full flex-col justify-start"
      >
        <div className="space-y-4">
          <FormField
            name="userName"
            control={loginForm.control}
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel htmlFor="userName">Username</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    id="userName"
                    placeholder="Your Username"
                    required
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={loginForm.control}
            name="password"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <div className="flex items-center justify-between">
                  <FormLabel htmlFor="password">Password</FormLabel>
                </div>
                <FormControl>
                  <Input
                    {...field}
                    id="password"
                    type="password"
                    placeholder="********"
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <div className="space-y-4">
          <div>
            {loginMutation.error && <FormMessage>Invalid username or password</FormMessage>}
          </div>
          <Button
            className="w-full py-6"
            type="submit"
            disabled={loginMutation.status === 'pending' || loginMutation.isSuccess}
          >
            {loginMutation.status === 'pending' || loginMutation.isSuccess ? (
              <SpinAnim />
            ) : (
              'Sign in'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export { LoginForm };
