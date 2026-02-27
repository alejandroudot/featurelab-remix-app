import type { useFetcher } from 'react-router';
import type { TaskComment } from '~/core/tasks/tasks.types';
import { RichTextEditor, RichTextViewer } from '~/ui/editors/rich-text/RichTextEditor';
import { ActionFeedbackText } from '~/ui/forms/action-feedback';
import type { TaskActionData } from '../../../types';
import { getMeaningfulTextFromHtml } from './utils';

type TaskCommentFetcher = ReturnType<typeof useFetcher<TaskActionData>>;

type CommentsListProps = {
  comments: TaskComment[];
  currentUserId: string;
  editingCommentId: string | null;
  editingBody: string;
  redirectTo: string;
  mentionCandidates: string[];
  updateFetcher: TaskCommentFetcher;
  deleteFetcher: TaskCommentFetcher;
  updateErrorActionData: TaskActionData;
  onEditingCommentIdChange: (commentId: string | null) => void;
  onEditingBodyChange: (value: string) => void;
  onMarkUpdateSubmit: () => void;
  onSkipUpdateSubmit: () => void;
};

type EditActionsProps = {
  isSubmitting: boolean;
  onCancel: () => void;
};

type UpdateSubmitEvent = {
  preventDefault: () => void;
};

function EditActions({ isSubmitting, onCancel }: EditActionsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded bg-slate-900 px-2 py-1 text-xs font-medium text-white hover:bg-slate-800 disabled:opacity-60"
      >
        {isSubmitting ? 'Guardando...' : 'Guardar'}
      </button>
      <button
        type="button"
        onClick={onCancel}
        className="rounded border px-2 py-1 text-xs font-medium"
      >
        Cancelar
      </button>
    </div>
  );
}

export function CommentsList({
  comments,
  currentUserId,
  editingCommentId,
  editingBody,
  redirectTo,
  mentionCandidates,
  updateFetcher,
  deleteFetcher,
  updateErrorActionData,
  onEditingCommentIdChange,
  onEditingBodyChange,
  onMarkUpdateSubmit,
  onSkipUpdateSubmit,
}: CommentsListProps) {
  function handleCancelEdit() {
    onEditingCommentIdChange(null);
    onEditingBodyChange('');
  }

  function buildHandleUpdateSubmit(commentId: string) {
    return (event: UpdateSubmitEvent) => {
      const nextMeaningfulBody = getMeaningfulTextFromHtml(editingBody);
      if (!nextMeaningfulBody) {
        event.preventDefault();
        onSkipUpdateSubmit();
        deleteFetcher.submit(
          {
            intent: 'comment-delete',
            commentId,
            redirectTo,
          },
          { method: 'post' },
        );
        handleCancelEdit();
        return;
      }
      onMarkUpdateSubmit();
    };
  }

  function handleStartEdit(comment: TaskComment) {
    onEditingCommentIdChange(comment.id);
    onEditingBodyChange(comment.body);
  }

  return (
    <ul className="space-y-2">
      {comments.length === 0 ? (
        <li className="text-sm opacity-70">Sin comentarios todavia.</li>
      ) : (
        comments.map((comment) => (
          <li key={comment.id} className="rounded border p-2 text-sm">
            <div className="font-medium">{comment.authorEmail ?? 'Usuario'}</div>
            {editingCommentId === comment.id ? (
              <updateFetcher.Form
                method="post"
                className="mt-2 space-y-2"
                onSubmit={buildHandleUpdateSubmit(comment.id)}
              >
                <input type="hidden" name="intent" value="comment-update" />
                <input type="hidden" name="commentId" value={comment.id} />
                <input type="hidden" name="redirectTo" value={redirectTo} />
                <RichTextEditor
                  name="commentBody"
                  value={editingBody}
                  onChange={onEditingBodyChange}
                  mentionCandidates={mentionCandidates}
                  enableImageUpload={false}
                />
                <ActionFeedbackText actionData={updateErrorActionData} fieldKey="commentBody" showFormError />
                <EditActions
                  isSubmitting={updateFetcher.state === 'submitting'}
                  onCancel={handleCancelEdit}
                />
              </updateFetcher.Form>
            ) : (
              <div className="opacity-90">
                <RichTextViewer content={comment.body} />
              </div>
            )}
            <div className="text-xs opacity-70">
              {new Date(comment.createdAt).toISOString().replace('T', ' ').slice(0, 16)}
            </div>
            {comment.authorUserId === currentUserId && editingCommentId !== comment.id ? (
              <div className="mt-2 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => handleStartEdit(comment)}
                  className="rounded border px-2 py-1 text-xs font-medium"
                >
                  Editar
                </button>
                <deleteFetcher.Form method="post">
                  <input type="hidden" name="intent" value="comment-delete" />
                  <input type="hidden" name="commentId" value={comment.id} />
                  <input type="hidden" name="redirectTo" value={redirectTo} />
                  <button
                    type="submit"
                    disabled={deleteFetcher.state === 'submitting'}
                    className="rounded border border-red-300 px-2 py-1 text-xs font-medium text-red-700 hover:bg-red-50 disabled:opacity-60"
                  >
                    {deleteFetcher.state === 'submitting' ? 'Borrando...' : 'Borrar'}
                  </button>
                </deleteFetcher.Form>
              </div>
            ) : null}
          </li>
        ))
      )}
    </ul>
  );
}
