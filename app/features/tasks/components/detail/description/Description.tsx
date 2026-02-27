import { useFetcher, useLocation } from 'react-router';
import type { Task } from '~/core/tasks/tasks.types';
import type { TaskActionData } from '../../../types';
import { EditForm } from './components/EditForm';
import { Preview } from './components/Preview';
import { useDescriptionEditor } from './hooks/useDescriptionEditor';

type DescriptionProps = {
  task: Task;
  mentionCandidates: string[];
  closeSignal?: number;
};

export function Description({
  task,
  mentionCandidates,
  closeSignal = 0,
}: DescriptionProps) {
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
  } = useDescriptionEditor({
    task,
    closeSignal,
    redirectTo,
    onSubmitDescriptionUpdate: submitDescriptionUpdate,
  });

  return (
    <div className="rounded border p-3">
      <h3 className="mb-2 text-sm font-semibold">Descripcion</h3>
      {isEditingDescription ? (
        <EditForm
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
        <Preview
          description={task.description}
          onStartEdit={startEditingDescription}
        />
      )}
    </div>
  );
}

