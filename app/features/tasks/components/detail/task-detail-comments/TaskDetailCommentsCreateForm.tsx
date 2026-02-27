import type { useFetcher } from 'react-router';
import { RichTextEditor } from '~/ui/editors/rich-text/RichTextEditor';
import type { TaskActionData } from '../../../types';
import { TaskActionErrors } from '../../common/TaskActionErrors';

type TaskCommentFetcher = ReturnType<typeof useFetcher<TaskActionData>>;

type TaskDetailCommentsCreateFormProps = {
  createFetcher: TaskCommentFetcher;
  taskId: string;
  redirectTo: string;
  createBody: string;
  mentionCandidates: string[];
  createFormActionData: TaskActionData;
  onCreateBodyChange: (value: string) => void;
  onMarkCreateSubmit: () => void;
};

type CreateFooterProps = {
  createFormActionData: TaskActionData;
  isSubmitting: boolean;
};

function TaskDetailCommentCreateFooter({ createFormActionData, isSubmitting }: CreateFooterProps) {
  return (
    <>
      <TaskActionErrors actionData={createFormActionData} fieldKey="commentBody" />
      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded bg-slate-900 px-3 py-1 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
      >
        {isSubmitting ? 'Comentando...' : 'Comentar'}
      </button>
    </>
  );
}

export function TaskDetailCommentsCreateForm({
  createFetcher,
  taskId,
  redirectTo,
  createBody,
  mentionCandidates,
  createFormActionData,
  onCreateBodyChange,
  onMarkCreateSubmit,
}: TaskDetailCommentsCreateFormProps) {
  return (
    <createFetcher.Form method="post" className="mb-3 space-y-2" onSubmit={onMarkCreateSubmit}>
      <input type="hidden" name="intent" value="comment-create" />
      <input type="hidden" name="id" value={taskId} />
      <input type="hidden" name="redirectTo" value={redirectTo} />
      <RichTextEditor
        name="commentBody"
        value={createBody}
        onChange={onCreateBodyChange}
        mentionCandidates={mentionCandidates}
        enableImageUpload={false}
        placeholder="Escribe un comentario..."
      />
      <TaskDetailCommentCreateFooter
        createFormActionData={createFormActionData}
        isSubmitting={createFetcher.state === 'submitting'}
      />
    </createFetcher.Form>
  );
}
