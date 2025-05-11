import { ProjectListLoader } from '@/modules/projects/project-list-loader';
import { Heading } from '@/modules/typography/heading';

export default function ProjectsPage() {
  return (
    <div className="size-full">
      <Heading
        as="h3"
        size="h3"
        className="border-b text-2xl font-semibold"
      >
        Projects you have
      </Heading>

      <div className="my-5 flex h-3/4 w-full justify-center">
        <ProjectListLoader />
      </div>
    </div>
  );
}
