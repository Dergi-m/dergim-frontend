import { Suspense } from 'react';
import { notFound } from 'next/navigation';

import { createServerCaller } from '@/server/api/root';
import { Board } from '@/modules/boards/board';

type BoardPageProps = {
  params: Promise<{ projectId: string }>;
};

export default async function BoardPage({ params }: BoardPageProps) {
  const { projectId } = await params;

  const api = await createServerCaller();

  const projectResponse = await api.page.projects.getProject({ id: projectId });

  const { project, success } = projectResponse;

  if (!success || !project) {
    return notFound();
  }

  return (
    <div className="flex-1 overflow-auto p-4">
      <Suspense>
        <Board project={project} />
      </Suspense>
    </div>
  );
}
