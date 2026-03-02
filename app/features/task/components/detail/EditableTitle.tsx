import { useEffect, useState } from 'react';
import { useFetcher, useLocation } from 'react-router';
import type { TaskActionData } from '../../types';
import { ActionFeedbackText, getErrorActionDataByIntent } from '~/ui/forms/action-feedback';

type EditableTitleProps = {
  taskId: string;
  title: string;
  closeSignal?: number;
};

export function EditableTitle({ taskId, title, closeSignal = 0 }: EditableTitleProps) {
  const fetcher = useFetcher<TaskActionData>();
  const location = useLocation();
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(title);
  const [didSubmit, setDidSubmit] = useState(false);
  const redirectTo = `${location.pathname}${location.search}`;
  const updateErrorActionData = getErrorActionDataByIntent(fetcher.data, 'update');

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

  useEffect(() => {
    if (!didSubmit) return;
    if (fetcher.state !== 'idle') return;

    if (!updateErrorActionData) {
      setIsEditing(false);
    }
    setDidSubmit(false);
  }, [didSubmit, fetcher.state, updateErrorActionData]);

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
    <fetcher.Form
      method="post"
      className="space-y-2"
      onSubmit={() => {
        setDidSubmit(true);
      }}
    >
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
      <ActionFeedbackText actionData={updateErrorActionData} intent="update" fieldKey="title" />
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
