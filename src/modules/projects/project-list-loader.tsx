'use client';

import Link from 'next/link';
import { Rocket } from 'lucide-react';

import { useSession } from '@/contexts/session-context';
import { ScrollArea } from '@/modules/ui/scroll-area';
import { Text } from '@/modules/typography/text';

export function ProjectListLoader() {
  const { projects } = useSession();

  return (
    <div>
      <div className="my-5 flex w-full items-center justify-end">
        <Link
          className="rounded-lg border-2 bg-accent px-5 py-3 text-sm font-bold text-accent-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
          href={'projects/create'}
        >
          Create New Project
        </Link>
      </div>
      <ScrollArea className="h-full justify-center rounded-xl border-2">
        <div className="grid size-full gap-x-2 gap-y-4 p-5 lg:grid-cols-3 2xl:grid-cols-5">
          {projects.map((project, idx) => (
            <Link
              href={`projects/${project.name}`}
              key={`${project.name}-${idx}`}
              className="flex h-64 w-64 flex-col items-center justify-center space-y-2 rounded-lg border p-4 text-center shadow-sm transition-colors hover:bg-slate-100"
            >
              <div className="rounded-full border-2 p-5">
                <Rocket
                  className="size-12"
                  strokeWidth={1.2}
                />
              </div>
              <h2 className="text-sm font-semibold">{project.name}</h2>
              <Text className="max-w-44 truncate text-sm font-thin text-slate-500">
                {project.description}
              </Text>
            </Link>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
