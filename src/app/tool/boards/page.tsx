'use client';

import { redirect } from 'next/navigation';

import { useSession } from '@/contexts/session-context';

export default function BoardRedirectPage() {
  const { activeProject } = useSession();

  redirect(`/tool/boards/${activeProject?.id}`);

  return <></>;
}
