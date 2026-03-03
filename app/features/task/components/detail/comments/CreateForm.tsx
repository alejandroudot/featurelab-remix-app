import type { useFetcher } from 'react-router';
import { RichTextEditor } from '~/ui/editors/rich-text/RichTextEditor';
import { ActionFeedbackText } from '~/ui/forms/action-feedback';
import type { TaskActionData } from '../../../types';

type TaskCommentFetcher = ReturnType<typeof useFetcher<TaskActionData>>;

type CreateFormProps = {
  createFetcher: TaskCommentFetcher;
  taskId: string;
  redirectTo: string;
  createBody: string;
  mentionCandidates: string[];
  createErrorActionData: TaskActionData;
  onCreateBodyChange: (value: string) => void;
  onMarkCreateSubmit: () => void;
};

type CreateFooterProps = {
  createErrorActionData: TaskActionData;
  isSubmitting: boolean;
};

function CreateFooter({ createErrorActionData, isSubmitting }: CreateFooterProps) {
  return (
    <>
      <ActionFeedbackText actionData={createErrorActionData} fieldKey="commentBody" showFormError />
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

export function CreateForm({
  createFetcher,
  taskId,
  redirectTo,
  createBody,
  mentionCandidates,
  createErrorActionData,
  onCreateBodyChange,
  onMarkCreateSubmit,
}: CreateFormProps) {
  return (
    <createFetcher.Form action="/api/task-comments/create" method="post" className="mb-3 space-y-2" onSubmit={onMarkCreateSubmit}>
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
      <CreateFooter
        createErrorActionData={createErrorActionData}
        isSubmitting={createFetcher.state === 'submitting'}
      />
    </createFetcher.Form>
  );
}
