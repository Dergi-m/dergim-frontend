import { ReactNode } from 'react';

import { SidebarProvider } from '@/modules/ui/sidebar';
import { ToolSideBar } from '@/modules/tool-layout/tool-sidebar';

type ToolLayoutProps = {
  children: ReactNode;
};

export default async function ToolLayout({ children }: ToolLayoutProps) {
  return (
    <SidebarProvider className="my-4">
      <ToolSideBar />
      <main id="mainContent">{children}</main>
    </SidebarProvider>
  );
}
