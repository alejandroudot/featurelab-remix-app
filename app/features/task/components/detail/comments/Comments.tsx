import { useEffect, useRef, useState } from 'react';
import { useRevalidator } from 'react-router';
import type { TaskComment } from '~/core/task/task.types';
import { ActionFeedbackText } from '~/ui/forms/feedback/action-feedback';
import { useCreateTaskCommentMutation, useDeleteTaskCommentMutation, useUpdateTaskCommentMutation } from '~/features/task/client/mutation';
import { CreateForm } from './components/CreateForm';
import { CommentsList } from './components/List';
import { getMeaningfulTextFromHtml } from './utils';
import { isSuccessfulMutation, revalidateAfterSuccess } from '~/lib/query/mutation-result';

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
  const createErrorCommentBody =
    createActionData && createActionData.success === false ? createActionData.values?.commentBody : undefined;

  useEffect(() => {
    if (!createErrorCommentBody) return;
    setCreateBody(createErrorCommentBody);
  }, [createErrorCommentBody, taskId]);

  function clearCreateDraft() {
    setCreateBody('');
    setIsCreateOpen(false);
    resetCreate();
  }

  function clearEditingDraft() {
    setEditingCommentId(null);
    setEditingBody('');
    resetUpdate();
  }

  async function persistCreateDraft(closeWhenEmpty: boolean) {
    const meaningfulBody = getMeaningfulTextFromHtml(createBody);
    if (!meaningfulBody) {
      if (closeWhenEmpty) clearCreateDraft();
      return false;
    }

    const result = await createComment({
      id: taskId,
      commentBody: createBody,
    });
    if (!revalidateAfterSuccess(result, revalidator.revalidate)) return false;

    clearCreateDraft();
    return true;
  }

  async function persistEditingDraft(commentId: string, clearOnFinish: boolean) {
    const currentComment = comments.find((comment) => comment.id === commentId);
    const currentBody = currentComment?.body ?? '';
    const nextMeaningfulBody = getMeaningfulTextFromHtml(editingBody);
    let success = false;

    if (!nextMeaningfulBody) {
      const result = await deleteComment({ commentId });
      success = isSuccessfulMutation(result);
    } else if (editingBody !== currentBody) {
      const result = await updateComment({ commentId, commentBody: editingBody });
      success = isSuccessfulMutation(result);
    } else {
      success = true;
    }

    if (success) revalidator.revalidate();
    if (clearOnFinish || success) clearEditingDraft();
    return success;
  }

  useEffect(() => {
    if (closeSignal === closeSignalRef.current) return;
    closeSignalRef.current = closeSignal;
    if (isCreatePending || isUpdatePending || isDeletePending) return;

    void (async () => {
      if (editingCommentId) {
        await persistEditingDraft(editingCommentId, true);
      }
      if (isCreateOpen) {
        await persistCreateDraft(true);
      }
    })();
  }, [
    closeSignal,
    editingCommentId,
    isCreateOpen,
    isCreatePending,
    isDeletePending,
    isUpdatePending,
    comments,
    editingBody,
    createBody,
  ]);

  async function handleCreateSubmit(event: { preventDefault: () => void }) {
    event.preventDefault();
    await persistCreateDraft(false);
  }

  async function handleUpdateSubmit(commentId: string, event: { preventDefault: () => void }) {
    event.preventDefault();
    await persistEditingDraft(commentId, false);
  }

  async function handleDeleteComment(commentId: string) {
    const result = await deleteComment({ commentId });
    if (!revalidateAfterSuccess(result, revalidator.revalidate)) return;
    resetDelete();
  }

  return (
    <div className="rounded border p-3">
      <div className="mb-2 flex items-center justify-between gap-2">
        <h3 className="text-sm font-semibold">Comentarios</h3>
        <button
          type="button"
          onClick={() => {
            if (isCreateOpen) {
              clearCreateDraft();
              return;
            }
            setIsCreateOpen(true);
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
          createActionData={createActionData}
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
        updateActionData={updateActionData}
        isSubmittingUpdate={isUpdatePending}
        isSubmittingDelete={isDeletePending}
        onEditingCommentIdChange={(commentId) => {
          setEditingCommentId(commentId);
          if (!commentId) clearEditingDraft();
        }}
        onEditingBodyChange={setEditingBody}
        onSubmitUpdate={handleUpdateSubmit}
        onDeleteComment={handleDeleteComment}
      />

      <div className="mt-2">
        <ActionFeedbackText actionData={deleteActionData} showFormError />
      </div>
    </div>
  );
}
