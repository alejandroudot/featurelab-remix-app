import { useEffect, useRef, useState } from 'react';
import { useRevalidator } from 'react-router';
import type { TaskComment } from '~/core/task/task.types';
import { ActionFeedbackText } from '~/ui/forms/feedback/action-feedback';
import { useCreateTaskCommentMutation, useDeleteTaskCommentMutation, useUpdateTaskCommentMutation } from '~/features/task/client/mutation';
import { CreateForm } from './components/CreateForm';
import { CommentsList } from './components/List';
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
  const revalidator = useRevalidator();
  const {
    data: createActionData,
    isPending: isCreatePending,
    mutateAsync: createComment,
    reset: resetCreate,
  } = useCreateTaskCommentMutation();
  const {
    data: updateActionData,
    isPending: isUpdatePending,
    mutateAsync: updateComment,
    reset: resetUpdate,
  } = useUpdateTaskCommentMutation();
  const {
    data: deleteActionData,
    isPending: isDeletePending,
    mutateAsync: deleteComment,
    reset: resetDelete,
  } = useDeleteTaskCommentMutation();

  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingBody, setEditingBody] = useState('');
  const [createBody, setCreateBody] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const closeSignalRef = useRef(closeSignal);

  const createCommentErrorActionData =
    createActionData && createActionData.success === false ? createActionData : undefined;
  const updateCommentErrorActionData =
    updateActionData && updateActionData.success === false ? updateActionData : undefined;
  const deleteCommentErrorActionData =
    deleteActionData && deleteActionData.success === false ? deleteActionData : undefined;

  useEffect(() => {
    if (!createCommentErrorActionData?.values?.commentBody) return;
    setCreateBody(createCommentErrorActionData.values.commentBody);
  }, [createCommentErrorActionData?.values?.commentBody, taskId]);

  useEffect(() => {
    if (closeSignal === closeSignalRef.current) return;
    closeSignalRef.current = closeSignal;

    if (isCreatePending || isUpdatePending || isDeletePending) return;

    void (async () => {
      if (editingCommentId) {
        const currentComment = comments.find((comment) => comment.id === editingCommentId);
        const currentBody = currentComment?.body ?? '';
        const nextMeaningfulBody = getMeaningfulTextFromHtml(editingBody);

        if (!nextMeaningfulBody) {
          const result = await deleteComment({ commentId: editingCommentId });
          if (result && result.success) {
            revalidator.revalidate();
          }
        } else if (editingBody !== currentBody) {
          const result = await updateComment({
            commentId: editingCommentId,
            commentBody: editingBody,
          });
          if (result && result.success) {
            revalidator.revalidate();
          }
        }

        setEditingCommentId(null);
        setEditingBody('');
      }

      if (isCreateOpen) {
        if (getMeaningfulTextFromHtml(createBody)) {
          const result = await createComment({
            id: taskId,
            commentBody: createBody,
          });
          if (result && result.success) {
            revalidator.revalidate();
          }
        }
        setIsCreateOpen(false);
        setCreateBody('');
      }
    })();
  }, [
    closeSignal,
    comments,
    createBody,
    createComment,
    deleteComment,
    editingBody,
    editingCommentId,
    isCreateOpen,
    isCreatePending,
    isDeletePending,
    isUpdatePending,
    revalidator,
    taskId,
    updateComment,
  ]);

  async function handleCreateSubmit(event: { preventDefault: () => void }) {
    event.preventDefault();

    const meaningfulBody = getMeaningfulTextFromHtml(createBody);
    if (!meaningfulBody) return;

    const result = await createComment({
      id: taskId,
      commentBody: createBody,
    });

    if (!result || !result.success) return;
    setCreateBody('');
    setIsCreateOpen(false);
    resetCreate();
    revalidator.revalidate();
  }

  async function handleUpdateSubmit(commentId: string, event: { preventDefault: () => void }) {
    event.preventDefault();
    const nextMeaningfulBody = getMeaningfulTextFromHtml(editingBody);

    if (!nextMeaningfulBody) {
      const deleteResult = await deleteComment({ commentId });
      if (!deleteResult || !deleteResult.success) return;
      setEditingCommentId(null);
      setEditingBody('');
      resetUpdate();
      revalidator.revalidate();
      return;
    }

    const updateResult = await updateComment({
      commentId,
      commentBody: editingBody,
    });

    if (!updateResult || !updateResult.success) return;
    setEditingCommentId(null);
    setEditingBody('');
    resetUpdate();
    revalidator.revalidate();
  }

  async function handleDeleteComment(commentId: string) {
    const result = await deleteComment({ commentId });
    if (!result || !result.success) return;
    resetDelete();
    revalidator.revalidate();
  }

  return (
    <div className="rounded border p-3">
      <div className="mb-2 flex items-center justify-between gap-2">
        <h3 className="text-sm font-semibold">Comentarios</h3>
        <button
          type="button"
          onClick={() => {
            setIsCreateOpen((prev) => {
              const next = !prev;
              if (!next) {
                setCreateBody('');
                resetCreate();
              }
              return next;
            });
          }}
          className="rounded border px-2 py-1 text-xs font-medium"
        >
          {isCreateOpen ? 'Ocultar' : 'Agregar comentario'}
        </button>
      </div>

      {isCreateOpen ? (
        <CreateForm
          createBody={createBody}
          mentionCandidates={mentionCandidates}
          createErrorActionData={createCommentErrorActionData}
          isSubmitting={isCreatePending}
          onCreateBodyChange={setCreateBody}
          onSubmit={handleCreateSubmit}
        />
      ) : null}

      <CommentsList
        comments={comments}
        currentUserId={currentUserId}
        editingCommentId={editingCommentId}
        editingBody={editingBody}
        mentionCandidates={mentionCandidates}
        updateErrorActionData={updateCommentErrorActionData}
        isSubmittingUpdate={isUpdatePending}
        isSubmittingDelete={isDeletePending}
        onEditingCommentIdChange={(commentId) => {
          setEditingCommentId(commentId);
          if (!commentId) {
            setEditingBody('');
            resetUpdate();
          }
        }}
        onEditingBodyChange={setEditingBody}
        onSubmitUpdate={handleUpdateSubmit}
        onDeleteComment={handleDeleteComment}
      />

      <div className="mt-2">
        <ActionFeedbackText actionData={deleteCommentErrorActionData} showFormError />
      </div>
    </div>
  );
}
