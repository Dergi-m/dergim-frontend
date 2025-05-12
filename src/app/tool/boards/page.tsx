'use client';

import { redirect } from 'next/navigation';

import { useSession } from '@/contexts/session-context';

export default function BoardRedirectPage() {
  const { activeProject } = useSession();

  if (!activeProject) {
    return <div>You don&apos;t have a project :(</div>;
  }

  redirect(`/tool/boards/${activeProject?.id}`);
  return <div>Loading...</div>;
}
