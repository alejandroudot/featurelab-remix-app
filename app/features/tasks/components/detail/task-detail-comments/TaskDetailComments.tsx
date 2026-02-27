import { useEffect, useState } from 'react';
import { useFetcher, useLocation } from 'react-router';
import type { TaskComment } from '~/core/tasks/tasks.types';
import type { TaskActionData } from '../../../types';
import { TaskDetailCommentsCreateForm } from './TaskDetailCommentsCreateForm';
import { TaskDetailCommentsList } from './TaskDetailCommentsList';
import { getMeaningfulTextFromHtml } from './utils';

type TaskDetailCommentsProps = {
  taskId: string;
  comments: TaskComment[];
  currentUserId: string;
  mentionCandidates: string[];
  closeSignal?: number;
};

export function TaskDetailComments({
  taskId,
  comments,
  currentUserId,
  mentionCandidates,
  closeSignal = 0,
}: TaskDetailCommentsProps) {
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

  const createFormActionData =
    createFetcher.data?.success === false && createFetcher.data.intent === 'comment-create'
      ? createFetcher.data
      : undefined;
  const updateFormActionData =
    updateFetcher.data?.success === false && updateFetcher.data.intent === 'comment-update'
      ? updateFetcher.data
      : undefined;
  const deleteFormActionData =
    deleteFetcher.data?.success === false && deleteFetcher.data.intent === 'comment-delete'
      ? deleteFetcher.data
      : undefined;

  useEffect(() => {
    setCreateBody(createFormActionData?.values?.commentBody ?? '');
  }, [createFormActionData?.values?.commentBody, taskId]);

  useEffect(() => {
    if (!didSubmitCreate) return;
    if (createFetcher.state !== 'idle') return;

    if (!createFormActionData) {
      setCreateBody('');
      setIsCreateOpen(false);
    }
    setDidSubmitCreate(false);
  }, [didSubmitCreate, createFetcher.state, createFormActionData]);

  useEffect(() => {
    if (!didSubmitUpdate) return;
    if (updateFetcher.state !== 'idle') return;

    // Si no hay error de action, cerramos modo edicion automaticamente.
    if (!updateFormActionData) {
      setEditingCommentId(null);
      setEditingBody('');
    }
    setDidSubmitUpdate(false);
  }, [didSubmitUpdate, updateFetcher.state, updateFormActionData]);

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
        <TaskDetailCommentsCreateForm
          createFetcher={createFetcher}
          taskId={taskId}
          redirectTo={redirectTo}
          createBody={createBody}
          mentionCandidates={mentionCandidates}
          createFormActionData={createFormActionData}
          onCreateBodyChange={setCreateBody}
          onMarkCreateSubmit={() => setDidSubmitCreate(true)}
        />
      ) : null}

      <TaskDetailCommentsList
        comments={comments}
        currentUserId={currentUserId}
        editingCommentId={editingCommentId}
        editingBody={editingBody}
        redirectTo={redirectTo}
        mentionCandidates={mentionCandidates}
        updateFetcher={updateFetcher}
        deleteFetcher={deleteFetcher}
        updateFormActionData={updateFormActionData}
        onEditingCommentIdChange={setEditingCommentId}
        onEditingBodyChange={setEditingBody}
        onMarkUpdateSubmit={() => setDidSubmitUpdate(true)}
        onSkipUpdateSubmit={() => setDidSubmitUpdate(false)}
      />

      {deleteFormActionData?.formError ? (
        <p className="mt-2 text-xs text-red-600">{deleteFormActionData.formError}</p>
      ) : null}
    </div>
  );
}

