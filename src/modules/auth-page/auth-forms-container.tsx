'use client';

import { notFound } from 'next/navigation';
import { useQueryState } from 'nuqs';

import { Button } from '@/modules/ui/button';
import { LoginForm } from '@/modules/auth-page/login-form';
import { RegisterForm } from '@/modules/auth-page/register-form';

function AuthFormsContainer() {
  const [act, setAct] = useQueryState('act', {
    defaultValue: 'login',
  });

  if (act !== 'login' && act !== 'register') return notFound();

  return (
    <>
      {/* Form switcher buttons */}
      <div className="mb-6 flex space-x-2 rounded-lg bg-gray-100 p-3">
        <Button
          onClick={() => setAct('login')}
          className="flex-1 rounded-md py-2 text-sm font-medium transition-colors"
          disabled={act === 'login'}
        >
          Login
        </Button>
        <Button
          onClick={() => setAct('register')}
          className="flex-1 rounded-md py-2 text-sm font-medium transition-colors"
          disabled={act === 'register'}
        >
          Register
        </Button>
      </div>
      {/* Forms container with sliding animation */}
      <div className="relative overflow-hidden rounded-lg bg-white shadow-xl">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(${act === 'login' ? '0%' : '-50%'})`,
            width: '200%',
          }}
        >
          {/* Login form */}
          <div className="w-1/2 p-6">
            <LoginForm />
          </div>

          {/* Register form */}
          <div className="w-1/2 p-6">
            <RegisterForm />
          </div>
        </div>
      </div>
    </>
  );
}

export { AuthFormsContainer };
