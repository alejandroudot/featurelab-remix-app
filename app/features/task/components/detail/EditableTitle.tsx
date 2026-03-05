import { useEffect, useState } from 'react';
import { useRevalidator } from 'react-router';
import { ActionFeedbackText } from '~/ui/forms/feedback/action-feedback';
import { useUpdateTaskMutation } from '~/features/task/client/mutation';
import { revalidateAfterSuccess } from '~/lib/query/mutation-result';

type EditableTitleProps = {
  taskId: string;
  title: string;
  closeSignal?: number;
};

export function EditableTitle({ taskId, title, closeSignal = 0 }: EditableTitleProps) {
  const { data: actionData, isPending: isSubmitting, mutateAsync: updateTask, reset } = useUpdateTaskMutation();
  const revalidator = useRevalidator();
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(title);
  const updateErrorActionData = actionData && actionData.success === false ? actionData : undefined;

  useEffect(() => {
    if (!isEditing) return;
    const nextTitle = draft.trim();
    const currentTitle = title.trim();
    if (nextTitle === currentTitle) {
      setIsEditing(false);
      return;
    }

    void (async () => {
      const result = await updateTask({
        id: taskId,
        title: draft,
      });
      if (!revalidateAfterSuccess(result, revalidator.revalidate)) return;
      setIsEditing(false);
    })();
  }, [closeSignal]);

  async function handleSubmit(event: { preventDefault: () => void }) {
    event.preventDefault();
    const result = await updateTask({
      id: taskId,
      title: draft,
    });
    if (!revalidateAfterSuccess(result, revalidator.revalidate)) return;
    setIsEditing(false);
  }

  if (!isEditing) {
    return (
      <button
        type="button"
        onClick={() => {
          reset();
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
    <form className="space-y-2" onSubmit={handleSubmit}>
      <input
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        className="w-full rounded border px-2 py-1 text-lg font-semibold"
        autoFocus
      />
      <ActionFeedbackText actionData={updateErrorActionData} fieldKey="title" />
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded bg-slate-900 px-2 py-1 text-xs font-medium text-white disabled:opacity-60"
        >
          Guardar
        </button>
        <button
          type="button"
          onClick={() => {
            reset();
            setIsEditing(false);
          }}
          className="rounded border px-2 py-1 text-xs font-medium"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
