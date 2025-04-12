'use client';

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/modules/ui/sidebar';
import { navItem } from '@/modules/tool-layout/tool-sidebar';

type NavMainProps = {
  items: navItem[];
};

export function NavMain({ items }: NavMainProps) {
  const groups = ['Project', 'Organization'];

  return (
    <>
      {groups.map((group) => (
        <SidebarGroup
          key={group}
          title={group}
        >
          <SidebarGroupLabel>{group}</SidebarGroupLabel>
          <SidebarMenu>
            {items
              .filter((item) => item.group === group)
              .map((item, idx) => (
                <SidebarMenuItem key={`${item.title}-${idx}`}>
                  <SidebarMenuButton tooltip={item.title}>
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
          </SidebarMenu>
        </SidebarGroup>
      ))}
    </>
  );
}
