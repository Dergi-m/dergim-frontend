'use client';

import Link from 'next/link';

import { cn } from '@/lib/variants';
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/modules/ui/sidebar';
import { navItem } from '@/modules/tool-layout/tool-sidebar';

type NavMainProps = {
  items: navItem[];
};

export function NavMain({ items }: NavMainProps) {
  return (
    <SidebarGroup
      key={'tools'}
      title={'tools'}
    >
      <SidebarMenu>
        {items.map((item, idx) => (
          <SidebarMenuItem
            className="flex items-center space-x-3"
            key={`${item.title}-${idx}`}
          >
            <Link
              className="size-full"
              href={item.url}
            >
              <SidebarMenuButton
                className="transition-colors hover:bg-accent"
                tooltip={item.title}
              >
                <span
                  className={cn(item.isActive && 'rounded-full border-2 border-blue-800', 'p-1')}
                >
                  {item.icon}
                </span>
                <span>{item.title}</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
