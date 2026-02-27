import { useFetcher, useLocation } from 'react-router';
import type { Task } from '~/core/tasks/tasks.types';
import type { TaskActionData } from '../../../types';
import { TaskDetailDescriptionEditorForm } from './TaskDetailDescriptionEditorForm';
import { TaskDetailDescriptionPreviewButton } from './TaskDetailDescriptionPreviewButton';
import { useTaskDetailDescriptionEditor } from './hooks/useTaskDetailDescriptionEditor';

type TaskDetailDescriptionProps = {
  task: Task;
  mentionCandidates: string[];
  closeSignal?: number;
};

export function TaskDetailDescription({
  task,
  mentionCandidates,
  closeSignal = 0,
}: TaskDetailDescriptionProps) {
  const fetcher = useFetcher<TaskActionData>();
  const location = useLocation();
  const redirectTo = `${location.pathname}${location.search}`;
  const updateActionData =
    fetcher.data?.success === false && fetcher.data.intent === 'update' ? fetcher.data : undefined;

  function submitDescriptionUpdate(description: string) {
    fetcher.submit(
      {
        intent: 'update',
        id: task.id,
        description,
        redirectTo,
      },
      { method: 'post' },
    );
  }

  const {
    isEditingDescription,
    draftDescription,
    editorImageError,
    hasPendingEditorUploads,
    hasInlineBase64Images,
    setDraftDescription,
    setEditorImageError,
    setHasPendingEditorUploads,
    handleFormSubmit,
    handleCancelEdit,
    handleImageUpload,
    startEditingDescription,
  } = useTaskDetailDescriptionEditor({
    task,
    closeSignal,
    redirectTo,
    onSubmitDescriptionUpdate: submitDescriptionUpdate,
  });

  return (
    <div className="rounded border p-3">
      <h3 className="mb-2 text-sm font-semibold">Descripcion</h3>
      {isEditingDescription ? (
        <TaskDetailDescriptionEditorForm
          fetcher={fetcher}
          taskId={task.id}
          redirectTo={redirectTo}
          draftDescription={draftDescription}
          mentionCandidates={mentionCandidates}
          hasPendingEditorUploads={hasPendingEditorUploads}
          hasInlineBase64Images={hasInlineBase64Images}
          editorImageError={editorImageError}
          updateActionData={updateActionData}
          onDraftDescriptionChange={setDraftDescription}
          onPendingUploadsChange={setHasPendingEditorUploads}
          onEditorImageErrorChange={setEditorImageError}
          onImageUpload={handleImageUpload}
          onSubmit={handleFormSubmit}
          onCancel={handleCancelEdit}
        />
      ) : (
        <TaskDetailDescriptionPreviewButton
          description={task.description}
          onStartEdit={startEditingDescription}
        />
      )}
    </div>
  );
}
