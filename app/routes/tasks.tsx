import * as React from 'react';
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigation,
} from 'react-router';

import type { Route } from './+types/home';
import { taskSchema, type TaskInput } from '../features/tasks/taskSchema';

type Task = {
  id: string;
  title: string;
  description?: string;
  createdAt: string;
};

// "DB" en memoria por ahora
const tasks: Task[] = [];

type LoaderData = {
  tasks: Task[];
};

type ActionErrorData = {
  fieldErrors?: Partial<Record<keyof TaskInput, string>>;
  formError?: string;
};

export async function loader(_args: Route.LoaderArgs): Promise<LoaderData> {
  // acá simplemente devolvemos datos; react-router los pasa a useLoaderData
  return { tasks };
}

export async function action(
  { request }: Route.ActionArgs,
): Promise<ActionErrorData | Response> {
  const formData = await request.formData();
  const raw = {
    title: formData.get('title'),
    description: formData.get('description'),
  };

  const parsed = taskSchema.safeParse(raw);

  if (!parsed.success) {
    const fieldErrors: Partial<Record<keyof TaskInput, string>> = {};

    for (const issue of parsed.error.issues) {
      const field = issue.path[0];
      if (typeof field === 'string' && !fieldErrors[field as keyof TaskInput]) {
        fieldErrors[field as keyof TaskInput] = issue.message;
      }
    }

    // No usamos json(): devolvemos un objeto normal
    return {
      fieldErrors,
      formError: 'Hay errores en el formulario',
    };
  }

  const data = parsed.data;

  const newTask: Task = {
    id: crypto.randomUUID(),
    title: data.title,
    description: data.description,
    createdAt: new Date().toISOString(),
  };

  tasks.push(newTask);

  // Redirección sin helper redirect(): Response con Location
  return new Response(null, {
    status: 303,
    headers: { Location: '/tasks' },
  });
}

export default function TasksRoute() {
  const { tasks } = useLoaderData() as LoaderData;
  const actionData = useActionData() as ActionErrorData | undefined;
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <div className="mx-auto max-w-3xl px-4 py-8">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Tasks</h1>
            <p className="text-sm text-slate-400">
              Ejemplo de loader + action + Zod con React Router fullstack.
            </p>
          </div>
        </header>

        <section className="mb-8 rounded-xl border border-slate-800 bg-slate-900/80 p-4">
          <h2 className="text-lg font-medium">Nueva tarea</h2>
          {actionData?.formError && (
            <p className="mt-2 text-sm text-red-400">{actionData.formError}</p>
          )}

          <Form method="post" className="mt-4 space-y-4">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-slate-200"
              >
                Título
              </label>
              <input
                id="title"
                name="title"
                type="text"
                className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                aria-invalid={actionData?.fieldErrors?.title ? 'true' : 'false'}
                aria-describedby={
                  actionData?.fieldErrors?.title ? 'title-error' : undefined
                }
              />
              {actionData?.fieldErrors?.title && (
                <p id="title-error" className="mt-1 text-xs text-red-400">
                  {actionData.fieldErrors.title}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-slate-200"
              >
                Descripción (opcional)
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                aria-invalid={
                  actionData?.fieldErrors?.description ? 'true' : 'false'
                }
                aria-describedby={
                  actionData?.fieldErrors?.description
                    ? 'description-error'
                    : undefined
                }
              />
              {actionData?.fieldErrors?.description && (
                <p id="description-error" className="mt-1 text-xs text-red-400">
                  {actionData.fieldErrors.description}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center rounded-md bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-500 disabled:opacity-60"
            >
              {isSubmitting ? 'Creando...' : 'Crear tarea'}
            </button>
          </Form>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-medium">Listado</h2>
          {tasks.length === 0 ? (
            <p className="text-sm text-slate-400">Todavía no hay tareas.</p>
          ) : (
            <ul className="space-y-2">
              {tasks.map((task) => (
                <li
                  key={task.id}
                  className="rounded-lg border border-slate-800 bg-slate-900/80 px-4 py-3"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium">{task.title}</h3>
                    <span className="text-xs text-slate-500">
                      {new Date(task.createdAt).toLocaleString()}
                    </span>
                  </div>
                  {task.description && (
                    <p className="mt-1 text-xs text-slate-300">
                      {task.description}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
