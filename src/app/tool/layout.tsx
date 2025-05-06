import { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { Rocket } from 'lucide-react';

import { SessionProvider } from '@/contexts/session-context';
import { createServerCaller } from '@/server/api/root';
import { SidebarProvider } from '@/modules/ui/sidebar';
import { ToolSidebar } from '@/modules/tool-layout/tool-sidebar';

type ToolLayoutProps = {
  children: ReactNode;
};

export default async function ToolLayout({ children }: ToolLayoutProps) {
  const api = await createServerCaller();
  const session = await api.website.authentication.getSession();

  if (!session.success || !session.user) {
    await fetch('/api/remove-session-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
    redirect('/');
  }

  return (
    <SessionProvider _session={session.user}>
      <SidebarProvider className="my-4">
        <ToolSidebar
          organizaton={{
            name: 'X Organization',
            projects: [
              {
                name: 'Scriptoria',
                logo: <Rocket />,
              },
              {
                name: 'DergiNest',
                logo: <Rocket />,
              },
              {
                name: 'Verba',
                logo: <Rocket />,
              },
            ],
          }}
        />
        <main id="mainContent">{children}</main>
      </SidebarProvider>
    </SessionProvider>
  );
}
