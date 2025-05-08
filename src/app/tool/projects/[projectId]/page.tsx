import { notFound } from 'next/navigation';

import { createServerCaller } from '@/server/api/root';
import { ProjectDetails } from '@/modules/projects/project-details';

type ProjectPageProps = {
  params: Promise<{ projectId: string }>;
};

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { projectId } = await params;

  const api = await createServerCaller();

  const projectResponse = await api.page.projects.getProject({ id: projectId });
  const { project, success } = projectResponse;
  if (!success || !project) return notFound();

  return (
    <div>
      <ProjectDetails project={project} />
    </div>
  );
}
