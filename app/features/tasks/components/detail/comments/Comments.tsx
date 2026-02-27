import { useEffect, useState } from 'react';
import { useFetcher, useLocation } from 'react-router';
import type { TaskComment } from '~/core/tasks/tasks.types';
import { ActionFeedbackText, getErrorActionDataByIntent } from '~/ui/forms/action-feedback';
import type { TaskActionData } from '../../../types';
import { CreateForm } from './CreateForm';
import { CommentsList } from './List';
import { getMeaningfulTextFromHtml } from './utils';

type CommentsProps = {
  taskId: string;
  comments: TaskComment[];
  currentUserId: string;
  mentionCandidates: string[];
  closeSignal?: number;
};

export function Comments({
  taskId,
  comments,
  currentUserId,
  mentionCandidates,
  closeSignal = 0,
}: CommentsProps) {
  const createFetcher = useFetcher<TaskActionData>();
  const updateFetcher = useFetcher<TaskActionData>();
  const deleteFetcher = useFetcher<TaskActionData>();
  const location = useLocation();
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingBody, setEditingBody] = useState('');
  const [createBody, setCreateBody] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [didSubmitCreate, setDidSubmitCreate] = useState(false);
  const [didSubmitUpdate, setDidSubmitUpdate] = useState(false);

  const redirectTo = `${location.pathname}${location.search}`;

  const createCommentErrorActionData = getErrorActionDataByIntent(createFetcher.data, 'comment-create');
  const updateCommentErrorActionData = getErrorActionDataByIntent(updateFetcher.data, 'comment-update');
  const deleteCommentErrorActionData = getErrorActionDataByIntent(deleteFetcher.data, 'comment-delete');

  useEffect(() => {
    setCreateBody(createCommentErrorActionData?.values?.commentBody ?? '');
  }, [createCommentErrorActionData?.values?.commentBody, taskId]);

  useEffect(() => {
    if (!didSubmitCreate) return;
    if (createFetcher.state !== 'idle') return;

    if (!createCommentErrorActionData) {
      setCreateBody('');
      setIsCreateOpen(false);
    }
    setDidSubmitCreate(false);
  }, [didSubmitCreate, createFetcher.state, createCommentErrorActionData]);

  useEffect(() => {
    if (!didSubmitUpdate) return;
    if (updateFetcher.state !== 'idle') return;

    // Si no hay error de action, cerramos modo edicion automaticamente.
    if (!updateCommentErrorActionData) {
      setEditingCommentId(null);
      setEditingBody('');
    }
    setDidSubmitUpdate(false);
  }, [didSubmitUpdate, updateFetcher.state, updateCommentErrorActionData]);

  useEffect(() => {
    if (createFetcher.state !== 'idle' || updateFetcher.state !== 'idle') return;

    if (editingCommentId) {
      const currentComment = comments.find((comment) => comment.id === editingCommentId);
      const currentBody = currentComment?.body ?? '';
      const nextMeaningfulBody = getMeaningfulTextFromHtml(editingBody);

      if (!nextMeaningfulBody) {
        deleteFetcher.submit(
          {
            intent: 'comment-delete',
            commentId: editingCommentId,
            redirectTo,
          },
          { method: 'post' },
        );
      } else if (editingBody !== currentBody) {
        updateFetcher.submit(
          {
            intent: 'comment-update',
            commentId: editingCommentId,
            commentBody: editingBody,
            redirectTo,
          },
          { method: 'post' },
        );
      }
      setEditingCommentId(null);
      setEditingBody('');
    }

    if (isCreateOpen) {
      if (getMeaningfulTextFromHtml(createBody)) {
        createFetcher.submit(
          {
            intent: 'comment-create',
            id: taskId,
            commentBody: createBody,
            redirectTo,
          },
          { method: 'post' },
        );
      }
      setIsCreateOpen(false);
      setCreateBody('');
    }
  }, [closeSignal]);

  return (
    <div className="rounded border p-3">
      <div className="mb-2 flex items-center justify-between gap-2">
        <h3 className="text-sm font-semibold">Comentarios</h3>
        <button
          type="button"
          onClick={() => setIsCreateOpen((prev) => !prev)}
          className="rounded border px-2 py-1 text-xs font-medium"
        >
          {isCreateOpen ? 'Ocultar' : 'Agregar comentario'}
        </button>
      </div>

      {isCreateOpen ? (
        <CreateForm
          createFetcher={createFetcher}
          taskId={taskId}
          redirectTo={redirectTo}
          createBody={createBody}
          mentionCandidates={mentionCandidates}
          createErrorActionData={createCommentErrorActionData}
          onCreateBodyChange={setCreateBody}
          onMarkCreateSubmit={() => setDidSubmitCreate(true)}
        />
      ) : null}

      <CommentsList
        comments={comments}
        currentUserId={currentUserId}
        editingCommentId={editingCommentId}
        editingBody={editingBody}
        redirectTo={redirectTo}
        mentionCandidates={mentionCandidates}
        updateFetcher={updateFetcher}
        deleteFetcher={deleteFetcher}
        updateErrorActionData={updateCommentErrorActionData}
        onEditingCommentIdChange={setEditingCommentId}
        onEditingBodyChange={setEditingBody}
        onMarkUpdateSubmit={() => setDidSubmitUpdate(true)}
        onSkipUpdateSubmit={() => setDidSubmitUpdate(false)}
      />

      <div className="mt-2">
        <ActionFeedbackText actionData={deleteCommentErrorActionData} intent="comment-delete" showFormError />
      </div>
    </div>
  );
}
