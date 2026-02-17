import { Form } from 'react-router';
import type { TaskActionData } from './types';

export function CreateTaskForm({ actionData, isSubmitting }: { actionData: TaskActionData, isSubmitting: boolean }) {
  const globalError = actionData?.formError ?? actionData?.fieldErrors?.intent?.[0];

  return (
    <section id="create-task" className="border rounded p-4 space-y-3 max-w-xl">
      {actionData?.success === false && globalError ? (
        <div className="rounded border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-700">
          {globalError}
        </div>
      ) : null}

      <Form method="post" className="space-y-3 max-w-md">
        <input type="hidden" name="intent" value="create" />

        <div className="flex flex-col gap-1">
          <label htmlFor="title" className="font-medium">
            Titulo
          </label>
          <input
            id="title"
            name="title"
            className="border rounded px-3 py-2"
            defaultValue={actionData?.values?.title ?? ''}
          />
          {actionData?.success === false && actionData.fieldErrors?.title?.[0] && (
            <p className="text-sm text-red-600">{actionData.fieldErrors.title[0]}</p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="description" className="font-medium">
            Descripcion
          </label>
          <textarea
            id="description"
            name="description"
            className="border rounded px-3 py-2"
            defaultValue={actionData?.values?.description ?? ''}
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center rounded bg-blue-600 px-4 py-2 text-white text-sm font-medium disabled:opacity-60"
        >
          {isSubmitting ? 'Creando...' : 'Crear task'}
        </button>
      </Form>
    </section>
  );
}
