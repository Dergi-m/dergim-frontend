'use client';

import { useRouter } from 'next/navigation';
import { ChevronsUpDown, LogOut } from 'lucide-react';

import { useSession } from '@/contexts/session-context';
import { Avatar, AvatarFallback } from '@/modules/ui/avatar';
import { Dialog, DialogTrigger } from '@/modules/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/modules/ui/dropdown-menu';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/modules/ui/sidebar';
import { LogOutButtonContent } from '@/modules/sidebar/log-out-button-content';

export function NavUser() {
  const { sessionUser } = useSession();
  const { isMobile } = useSidebar();
  const router = useRouter();

  const avatarFallback = sessionUser.name
    .split(' ')
    .map((item) => item[0]?.toUpperCase())
    .join('');

  async function onLogOut() {
    const sessionRemover = await fetch('/api/remove-session-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (sessionRemover.ok) {
      router.push('/');
    }
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <Dialog>
          <DropdownMenu>
            <DropdownMenuTrigger
              className="transition-colors hover:bg-accent"
              asChild
            >
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarFallback className="rounded-lg">{avatarFallback}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{sessionUser.name}</span>
                  <span className="truncate text-xs">{sessionUser.email}</span>
                </div>
                <ChevronsUpDown className="ml-auto size-4" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
              side={isMobile ? 'bottom' : 'right'}
              align="end"
              sideOffset={4}
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarFallback className="rounded-lg">{avatarFallback}</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{sessionUser.name}</span>
                    <span className="truncate text-xs">{sessionUser.email}</span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <DialogTrigger className="flex size-full items-center gap-2 rounded-md p-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=open]:bg-accent data-[state=open]:text-accent-foreground">
                  <LogOut />
                  Log out
                </DialogTrigger>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <LogOutButtonContent logOutAction={onLogOut} />
        </Dialog>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
