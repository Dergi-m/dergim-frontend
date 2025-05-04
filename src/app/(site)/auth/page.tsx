import { AuthFormsContainer } from '@/modules/auth-page/auth-forms-container';

export default async function AuthPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold">Welcome</h1>
          <p className="mt-2 text-gray-600">Please login or create an account to continue</p>
        </div>
        <AuthFormsContainer />
      </div>
    </div>
  );
}
