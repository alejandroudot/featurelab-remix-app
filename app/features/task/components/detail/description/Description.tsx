import { useFetcher, useLocation } from 'react-router';
import type { Task } from '~/core/task/task.types';
import { getErrorActionDataByIntent } from '~/ui/forms/action-feedback';
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
  const updateErrorActionData = getErrorActionDataByIntent(fetcher.data, 'update');

  function submitDescriptionUpdate(description: string) {
    fetcher.submit(
      {
        intent: 'update',
        id: task.id,
        description,
        redirectTo,
      },
      { method: 'post', action: '/api/tasks' },
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
          updateErrorActionData={updateErrorActionData}
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



