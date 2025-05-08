'use client';

import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { BookText, ClipboardList, Files, LayoutTemplate } from 'lucide-react';

import { useSession } from '@/contexts/session-context';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from '@/modules/ui/sidebar';
import { NavMain } from '@/modules/tool-layout/nav-main';
import { NavUser } from '@/modules/tool-layout/nav-user';
import { ProjectSwitcher } from '@/modules/tool-layout/project-switcher';

export type navItem = {
  title: string;
  url: string;
  icon: ReactNode;
  isActive: boolean;
  group: 'Project' | 'User';
};

export function ToolSidebar() {
  const { projects } = useSession();

  const path = usePathname();

  const navMain: navItem[] = [
    {
      title: 'Dashboard',
      url: '/tool/dashboard',
      icon: <LayoutTemplate className="size-5" />,
      isActive: path.includes('/dashboard'),
      group: 'Project',
    },
    {
      title: 'Projects',
      url: '/tool/projects',
      icon: <BookText className="size-5" />,
      isActive: path.includes('/projects'),
      group: 'Project',
    },
    {
      title: 'Boards',
      url: '/tool/boards',
      icon: <ClipboardList className="size-5" />,
      isActive: path.includes('/boards'),
      group: 'Project',
    },
    {
      title: 'Files',
      url: '/tool/files',
      icon: <Files className="size-5" />,
      isActive: path.includes('/files'),
      group: 'Project',
    },
  ];

  return (
    <Sidebar
      variant="inset"
      className="border-r"
    >
      <SidebarContent className="pt-2">
        <SidebarHeader className="text-center text-xl font-extrabold">
          <ProjectSwitcher projects={projects} />
        </SidebarHeader>
        <SidebarContent>
          <NavMain items={navMain} />
        </SidebarContent>
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
