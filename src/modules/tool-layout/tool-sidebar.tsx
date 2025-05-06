'use client';

import { ComponentType } from 'react';

import { Organization } from '@/lib/schema/organization';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarTrigger,
} from '@/modules/ui/sidebar';
import { NavMain } from '@/modules/tool-layout/nav-main';
import { ProjectSwitcher } from '@/modules/tool-layout/nav-project';
import { NavUser } from '@/modules/tool-layout/nav-user';

export type navItem = {
  title: string;
  url: string;
  icon: ComponentType;
  isActive: boolean;
  group: 'Organization' | 'Project' | 'User';
};

type ToolSidebarProps = {
  organizaton: Organization;
};

export function ToolSidebar({ organizaton }: ToolSidebarProps) {
  const navMain: navItem[] = [
    {
      title: 'Dashboard',
      url: '/dashboard',
      icon: () => <></>,
      isActive: true,
      group: 'Project',
    },
    {
      title: 'Boards',
      url: '/boards',
      icon: () => <></>,
      isActive: false,
      group: 'Project',
    },
    {
      title: 'Files',
      url: '/files',
      icon: () => <></>,
      isActive: false,
      group: 'Project',
    },
    {
      title: 'Projects',
      url: '/projects',
      icon: () => <></>,
      isActive: false,
      group: 'Organization',
    },
  ];
  return (
    <div className="relative mr-0 size-fit shadow-2xl md:mr-4">
      <Sidebar
        variant="floating"
        collapsible="icon"
      >
        <SidebarTrigger className="absolute right-4 top-4 z-30" />
        <SidebarContent className="pt-8">
          <SidebarHeader className="text-center text-xl font-extrabold">
            <ProjectSwitcher organization={organizaton} />
          </SidebarHeader>
          <SidebarContent>
            <NavMain items={navMain} />
          </SidebarContent>
        </SidebarContent>
        <SidebarFooter>
          <NavUser />
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
    </div>
  );
}
