import { useActionData, useLoaderData, useNavigation, redirect } from 'react-router';
import { TasksPage } from '~/features/tasks/TasksPage';
import { z } from 'zod';
import type { Route } from './+types/tasks';
import { taskRepository } from '../infra/tasks/tasks.repository';
import { taskCreateSchema } from '../core/tasks/task.schema';
import type { TaskActionData } from '~/features/tasks/types';
import { requireUser } from "~/infra/auth/require-user";

export async function loader({request}: Route.LoaderArgs) {
	await requireUser(request);
  const tasks = await taskRepository.listAll();
  return { tasks };
}

export async function action({ request }: Route.ActionArgs) {
	const user = await requireUser(request);
  const formData = await request.formData();
  const intent = formData.get('intent');

  const parsed = taskCreateSchema.safeParse({
    title: formData.get('title'),
    description: formData.get('description'),
  });

  if (intent === 'update') {
    const id = String(formData.get('id') ?? '');
    const status = formData.get('status');
    const priority = formData.get('priority');

    await taskRepository.update({
      id,
      status: typeof status === 'string' ? (status as any) : undefined,
      priority: typeof priority === 'string' ? (priority as any) : undefined,
    });

    return redirect('/tasks');
  }

  if (intent === 'delete') {
    const id = String(formData.get('id') ?? '');
    await taskRepository.remove(id);
    return redirect('/tasks');
  }

  if (!parsed.success) {
    return {
      success: false,
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
    } satisfies TaskActionData;
  }

  await taskRepository.create({...parsed.data, userId: user.id});

  // PRG: evita re-submit al refresh, y re-ejecuta loader
  return redirect('/tasks');
}

export default function TasksRoute() {
  const { tasks } = useLoaderData<typeof loader>();
  const actionData = useActionData<TaskActionData>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';

  return (
		<TasksPage tasks={tasks} actionData={actionData} isSubmitting={isSubmitting} />
  );
}
