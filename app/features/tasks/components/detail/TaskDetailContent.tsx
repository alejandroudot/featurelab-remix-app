import { useEffect, useState } from 'react';
import { useFetcher, useLocation } from 'react-router';
import type { Task } from '~/core/tasks/tasks.types';
import type { TaskActionData } from '../../types';
import { MentionTextarea } from './MentionTextarea';
import { renderMentions } from './mention-render';

type TaskDetailContentProps = {
  task: Task;
  mentionCandidates: string[];
};

export function TaskDetailContent({ task, mentionCandidates }: TaskDetailContentProps) {
  const fetcher = useFetcher<TaskActionData>();
  const location = useLocation();
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [draftDescription, setDraftDescription] = useState(task.description ?? '');
  const redirectTo = `${location.pathname}${location.search}`;
  const formError =
    fetcher.data?.success === false && fetcher.data.intent === 'update' ? fetcher.data : undefined;

  useEffect(() => {
    setIsEditingDescription(false);
    setDraftDescription(task.description ?? '');
  }, [task.id, task.description]);

  return (
    <div className="rounded border p-3">
      <h3 className="mb-2 text-sm font-semibold">Descripcion</h3>
      {isEditingDescription ? (
        <fetcher.Form method="post" className="space-y-2">
          <input type="hidden" name="intent" value="update" />
          <input type="hidden" name="id" value={task.id} />
          <input type="hidden" name="redirectTo" value={redirectTo} />
          <MentionTextarea
            name="description"
            value={draftDescription}
            onChange={setDraftDescription}
            candidates={mentionCandidates}
            className="w-full rounded border px-2 py-1 text-sm"
            rows={4}
            autoFocus
          />
          {formError?.fieldErrors?.description?.[0] ? (
            <p className="text-xs text-red-600">{formError.fieldErrors.description[0]}</p>
          ) : null}
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={fetcher.state === 'submitting'}
              className="rounded bg-slate-900 px-2 py-1 text-xs font-medium text-white disabled:opacity-60"
            >
              Guardar
            </button>
            <button
              type="button"
              onClick={() => {
                setDraftDescription(task.description ?? '');
                setIsEditingDescription(false);
              }}
              className="rounded border px-2 py-1 text-xs font-medium"
            >
              Cancelar
            </button>
          </div>
        </fetcher.Form>
      ) : (
        <button
          type="button"
          onClick={() => {
            setDraftDescription(task.description ?? '');
            setIsEditingDescription(true);
          }}
          className="w-full rounded border border-dashed p-2 text-left text-sm opacity-85 hover:bg-accent"
        >
          {task.description ? renderMentions(task.description) : 'Sin descripcion por ahora. Click para editar.'}
        </button>
      )}
    </div>
  );
}
