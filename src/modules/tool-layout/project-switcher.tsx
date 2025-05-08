'use client';

import Link from 'next/link';
import { ChevronsUpDown, Plus, Rocket } from 'lucide-react';

import { ProjectSummary } from '@/lib/schema/session-user';
import { cn } from '@/lib/variants';
import { useSession } from '@/contexts/session-context';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/modules/ui/dropdown-menu';
import { ScrollArea } from '@/modules/ui/scroll-area';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/modules/ui/sidebar';

type ProjectSwitcherProps = {
  projects: ProjectSummary[];
};

export function ProjectSwitcher({ projects }: ProjectSwitcherProps) {
  const { isMobile } = useSidebar();
  const { activeProject, setActiveProject } = useSession();

  if (!activeProject) {
    return null;
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu modal={true}>
          <DropdownMenuTrigger
            className="transition-colors hover:bg-accent"
            asChild
          >
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                <Rocket className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="max-w-32 truncate font-semibold">{activeProject.name}</span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? 'bottom' : 'right'}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Projects
            </DropdownMenuLabel>
            <ScrollArea className="max-h-60">
              {projects.map((project, idx) => (
                <DropdownMenuItem
                  key={`{project.name-${idx}`}
                  onClick={() => setActiveProject(project)}
                  className="gap-2 p-2"
                >
                  <div className="flex size-6 items-center justify-center rounded-sm border">
                    {activeProject.id == project.id && <Rocket className="size-4 shrink-0" />}
                  </div>
                  <span
                    className={cn(
                      'max-w-32 truncate font-bold',
                      activeProject.name !== project.name && 'text-muted-foreground'
                    )}
                  >
                    {project.name}
                  </span>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link
                  className="flex size-full gap-2"
                  href={'/tool/projects/create'}
                >
                  <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                    <Plus className="size-4" />
                  </div>
                  <div className="font-medium text-muted-foreground">New Project</div>
                </Link>
              </DropdownMenuItem>
            </ScrollArea>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
