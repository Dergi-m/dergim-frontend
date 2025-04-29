'use client';

import type React from 'react';
import { useState } from 'react';
import Link from 'next/link';

import { Button } from '@/modules/ui/button';
import { Checkbox } from '@/modules/ui/checkbox';
import { Input } from '@/modules/ui/input';
import { Label } from '@/modules/ui/label';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
    console.log('Login attempt with:', { email, password, rememberMe });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex size-full flex-col justify-between"
    >
      <div className="space-y-4">
        <div className="space-y-1">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            required
          />
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link
              href="/forgot-password"
              className="text-sm text-primary hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
      </div>
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="remember"
            checked={rememberMe}
            onCheckedChange={(checked) => setRememberMe(checked as boolean)}
          />
          <Label
            htmlFor="remember"
            className="text-sm font-normal"
          >
            Remember me
          </Label>
        </div>

        <Button
          type="submit"
          className="w-full"
        >
          Sign in
        </Button>
      </div>
    </form>
  );
}
