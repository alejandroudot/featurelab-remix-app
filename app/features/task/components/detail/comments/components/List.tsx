import type { TaskComment } from '~/core/task/task.types';
import { RichTextEditor, RichTextViewer } from '~/ui/editors/rich-text/RichTextEditor';
import { ActionFeedbackText } from '~/ui/forms/feedback/action-feedback';
import type { TaskActionData } from '../../../../types';

type CommentsListProps = {
  comments: TaskComment[];
  currentUserId: string;
  editingCommentId: string | null;
  editingBody: string;
  mentionCandidates: string[];
  updateErrorActionData: TaskActionData;
  isSubmittingUpdate: boolean;
  isSubmittingDelete: boolean;
  onEditingCommentIdChange: (commentId: string | null) => void;
  onEditingBodyChange: (value: string) => void;
  onSubmitUpdate: (commentId: string, event: { preventDefault: () => void }) => void;
  onDeleteComment: (commentId: string) => void;
};

type EditActionsProps = {
  isSubmitting: boolean;
  onCancel: () => void;
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
  mentionCandidates,
  updateErrorActionData,
  isSubmittingUpdate,
  isSubmittingDelete,
  onEditingCommentIdChange,
  onEditingBodyChange,
  onSubmitUpdate,
  onDeleteComment,
}: CommentsListProps) {
  function handleCancelEdit() {
    onEditingCommentIdChange(null);
    onEditingBodyChange('');
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
              <form
                className="mt-2 space-y-2"
                onSubmit={(event) => onSubmitUpdate(comment.id, event)}
              >
                <RichTextEditor
                  name="commentBody"
                  value={editingBody}
                  onChange={onEditingBodyChange}
                  mentionCandidates={mentionCandidates}
                  enableImageUpload={false}
                />
                <ActionFeedbackText actionData={updateErrorActionData} fieldKey="commentBody" showFormError />
                <EditActions isSubmitting={isSubmittingUpdate} onCancel={handleCancelEdit} />
              </form>
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
                <button
                  type="button"
                  onClick={() => onDeleteComment(comment.id)}
                  disabled={isSubmittingDelete}
                  className="rounded border border-red-300 px-2 py-1 text-xs font-medium text-red-700 hover:bg-red-50 disabled:opacity-60"
                >
                  {isSubmittingDelete ? 'Borrando...' : 'Borrar'}
                </button>
              </div>
            ) : null}
          </li>
        ))
      )}
    </ul>
  );
}
