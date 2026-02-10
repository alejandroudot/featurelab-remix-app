import { Form } from 'react-router';
import type { TaskActionData } from './types';

export function CreateTaskForm({ actionData, isSubmitting }: { actionData: TaskActionData, isSubmitting: boolean }) {
  return (
    <section className="border rounded p-4 space-y-3 max-w-xl">
		<Form method="post" className="space-y-3 max-w-md">
          <div className="flex flex-col gap-1">
            <label htmlFor="title" className="font-medium">
              Título
            </label>
            <input id="title" name="title" className="border rounded px-3 py-2" />
            {actionData?.success === false && actionData.fieldErrors?.title?.[0] && (
              <p className="text-sm text-red-600">{actionData.fieldErrors.title[0]}</p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="description" className="font-medium">
              Descripción
            </label>
            <textarea id="description" name="description" className="border rounded px-3 py-2" />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center justify-center rounded bg-blue-600 px-4 py-2 text-white text-sm font-medium disabled:opacity-60"
          >
            {isSubmitting ? 'Creando…' : 'Crear task'}
          </button>
        </Form>
    </section>
  );
}
