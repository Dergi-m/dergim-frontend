import { CreateProjectForm } from '@/modules/projects/create-project-form';

export default function CreateProjectPage() {
  return (
    <main
      id="mainContent"
      className="flex h-screen w-full flex-col flex-wrap items-center justify-center"
    >
      <h1 className="text-xl font-bold">Create a project</h1>
      <div className="w-full max-w-md items-center space-y-4 p-6">
        <CreateProjectForm />
      </div>
    </main>
  );
}
