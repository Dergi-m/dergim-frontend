import { ReactNode } from 'react';
import { Rocket } from 'lucide-react';

import { SidebarProvider } from '@/modules/ui/sidebar';
import { ToolSidebar } from '@/modules/tool-layout/tool-sidebar';

type ToolLayoutProps = {
  children: ReactNode;
};

export default async function ToolLayout({ children }: ToolLayoutProps) {
  return (
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
  );
}
