'use client';

import { redirect } from 'next/navigation';

import { useSession } from '@/contexts/session-context';

export default function BoardRedirectPage() {
  const { activeProject } = useSession();

  if (!activeProject) {
    <div>You don&apos;t have project :(</div>;
  }

  redirect(`/tool/boards/${activeProject?.id}`);

  return <></>;
}
