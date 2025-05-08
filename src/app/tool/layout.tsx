import { ReactNode } from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { NextRequest } from 'next/server';

import { SessionProvider } from '@/contexts/session-context';
import { createServerCaller } from '@/server/api/root';
import { SidebarProvider } from '@/modules/ui/sidebar';
import { ToolSidebar } from '@/modules/tool-layout/tool-sidebar';

type ToolLayoutProps = {
  children: ReactNode;
  request?: NextRequest;
};

export default async function ToolLayout({ children }: ToolLayoutProps) {
  const api = await createServerCaller();
  const session = await api.website.authentication.getSession();
  const cookieStore = cookies();

  if (!session.success || !session.user) {
    const sessionToken = cookieStore.get('sessionToken');
    if (sessionToken) {
      await fetch(`${process.env.BASE_URL}/api/remove-session-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
    }
    redirect('/');
  }

  return (
    <>
      <div className="z-50 h-screen w-screen bg-black lg:hidden">
        <div className="flex h-full w-full items-center justify-center">
          <h1 className="text-2xl font-bold text-white">Tool is not available on mobile</h1>
        </div>
        <div className="absolute bottom-0 left-0 right-0 flex h-16 items-center justify-center bg-black">
          <p className="text-sm text-white">Please use a desktop browser to access the tool.</p>
        </div>
      </div>
      <div className="hidden lg:block">
        <SessionProvider session={session.user}>
          <SidebarProvider>
            <ToolSidebar />
            <div className="ml-60 h-screen w-full p-4">{children}</div>
          </SidebarProvider>
        </SessionProvider>
      </div>
    </>
  );
}
