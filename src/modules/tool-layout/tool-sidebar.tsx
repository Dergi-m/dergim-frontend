'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarTrigger,
} from '@/modules/ui/sidebar';

export function ToolSideBar() {
  return (
    <div className="relative mr-0 md:mr-4">
      <SidebarTrigger className="absolute right-0 z-50 mr-4"></SidebarTrigger>
      <Sidebar
        variant="floating"
        collapsible="icon"
      >
        <SidebarContent className="pt-8 shadow-lg">
          <SidebarHeader className="text-xl font-extrabold">X Organization</SidebarHeader>
          <SidebarGroup>
            <SidebarGroupLabel className="font-extrabold">Group Header</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>Group Content</SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </div>
  );
}
