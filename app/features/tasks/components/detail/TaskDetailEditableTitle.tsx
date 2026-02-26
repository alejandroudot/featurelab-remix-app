import { useEffect, useState } from 'react';
import { useFetcher, useLocation } from 'react-router';
import type { TaskActionData } from '../../types';

type TaskDetailEditableTitleProps = {
  taskId: string;
  title: string;
  closeSignal?: number;
};

export function TaskDetailEditableTitle({ taskId, title, closeSignal = 0 }: TaskDetailEditableTitleProps) {
  const fetcher = useFetcher<TaskActionData>();
  const location = useLocation();
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(title);
  const redirectTo = `${location.pathname}${location.search}`;
  const formError =
    fetcher.data?.success === false && fetcher.data.intent === 'update' ? fetcher.data : undefined;

  useEffect(() => {
    if (!isEditing) return;
    const nextTitle = draft.trim();
    const currentTitle = title.trim();
    if (nextTitle === currentTitle) {
      setIsEditing(false);
      return;
    }

    fetcher.submit(
      {
        intent: 'update',
        id: taskId,
        title: draft,
        redirectTo,
      },
      { method: 'post' },
    );
    setIsEditing(false);
  }, [closeSignal]);

  if (!isEditing) {
    return (
      <button
        type="button"
        onClick={() => {
          setDraft(title);
          setIsEditing(true);
        }}
        className="text-left text-xl font-semibold hover:opacity-80"
      >
        {title}
      </button>
    );
  }

  return (
    <fetcher.Form method="post" className="space-y-2">
      <input type="hidden" name="intent" value="update" />
      <input type="hidden" name="id" value={taskId} />
      <input type="hidden" name="redirectTo" value={redirectTo} />
      <input
        name="title"
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        className="w-full rounded border px-2 py-1 text-lg font-semibold"
        autoFocus
      />
      {formError?.fieldErrors?.title?.[0] ? (
        <p className="text-xs text-red-600">{formError.fieldErrors.title[0]}</p>
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
          onClick={() => setIsEditing(false)}
          className="rounded border px-2 py-1 text-xs font-medium"
        >
          Cancelar
        </button>
      </div>
    </fetcher.Form>
  );
}
