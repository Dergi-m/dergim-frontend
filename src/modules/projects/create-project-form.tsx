'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { useSession } from '@/contexts/session-context';
import { trpc } from '@/server/api/react';
import { Button } from '@/modules/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/modules/ui/form';
import { Input } from '@/modules/ui/input';
import { SpinAnim } from '@/modules/ui/spin-anim';
import { Textarea } from '@/modules/ui/textarea';

export function CreateProjectForm() {
  const {
    sessionUser: { organisationId },
    setActiveProject,
    addProject,
  } = useSession();
  const router = useRouter();

  const createProjectFormSchema = z.object({
    name: z.string().min(3, { message: 'Name is required' }),
    description: z.string().min(3, { message: 'Description is required' }),
    organisationId: z.string().min(3, { message: 'Organisation is required' }),
  });

  const createProjectForm = useForm({
    resolver: zodResolver(createProjectFormSchema),
    defaultValues: {
      name: '',
      description: '',
      organisationId,
    },
  });

  const createProjectMutation = trpc.page.projects.createProject.useMutation();

  async function handleCreateProject(data: z.infer<typeof createProjectFormSchema>) {
    await createProjectMutation.mutateAsync({
      name: data.name,
      description: data.description,
      organisationId,
    });
  }

  useEffect(() => {
    if (createProjectMutation.isSuccess && createProjectMutation.data.success) {
      const projectSummary = createProjectMutation.data.data!;

      addProject(projectSummary);
      setActiveProject(projectSummary);

      router.push('/tool/projects');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createProjectMutation.isSuccess]);

  return (
    <Form {...createProjectForm}>
      <form
        className="flex flex-col gap-6"
        onSubmit={createProjectForm.handleSubmit(handleCreateProject)}
      >
        <FormField
          name="name"
          control={createProjectForm.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="create-name">Name</FormLabel>
              <FormControl>
                <Input
                  id="create-name"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          name="description"
          control={createProjectForm.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="create-description">Description</FormLabel>
              <FormControl>
                <Textarea
                  id="create-description"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button
          className="w-full py-6"
          disabled={createProjectMutation.isPending || createProjectMutation.isSuccess}
          type="submit"
        >
          {createProjectMutation.isPending || createProjectMutation.isSuccess ? (
            <SpinAnim />
          ) : (
            'Create Project'
          )}
        </Button>
      </form>
    </Form>
  );
}
