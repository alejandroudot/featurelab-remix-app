import { useEffect, useRef, useState } from 'react';
import { useFetcher, useLocation } from 'react-router';
import type { Task } from '~/core/task/task.types';
import { getErrorActionDataByIntent } from '~/ui/forms/feedback/action-feedback';
import type { TaskActionData } from '../../../types';
import {
  cleanupDescriptionTempImages,
  uploadDescriptionAttachment,
} from './utils';
import { DescriptionEditor } from './components/DescriptionEditor';
import { Preview } from './components/Preview';

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
  const closeSignalRef = useRef(closeSignal);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [draftDescription, setDraftDescription] = useState(task.description ?? '');
  const [editorImageError, setEditorImageError] = useState<string | null>(null);
  const [hasPendingEditorUploads, setHasPendingEditorUploads] = useState(false);
  const hasInlineBase64Images = draftDescription.includes('data:image/');

  useEffect(() => {
    setIsEditingDescription(false);
    setDraftDescription(task.description ?? '');
    setEditorImageError(null);
    setHasPendingEditorUploads(false);
  }, [task.id, task.description]);

  useEffect(() => {
    if (!isEditingDescription) return;
    if (closeSignal === closeSignalRef.current) return;
    closeSignalRef.current = closeSignal;

    const persistDraftOnClose = async () => {
      if (hasPendingEditorUploads || hasInlineBase64Images) {
        await cleanupDescriptionTempImages({ taskId: task.id, html: draftDescription });
        setIsEditingDescription(false);
        return;
      }

      if (draftDescription === (task.description ?? '')) {
        setIsEditingDescription(false);
        return;
      }

      fetcher.submit(
        {
          id: task.id,
          description: draftDescription,
          redirectTo,
        },
        { method: 'post', action: '/api/tasks/update' },
      );
      setIsEditingDescription(false);
    };

    void persistDraftOnClose();
  }, [
    closeSignal,
    draftDescription,
    fetcher,
    hasInlineBase64Images,
    hasPendingEditorUploads,
    isEditingDescription,
    redirectTo,
    task.description,
    task.id,
  ]);

  function handleStartEdit() {
    setDraftDescription(task.description ?? '');
    setEditorImageError(null);
    setHasPendingEditorUploads(false);
    setIsEditingDescription(true);
  }

  function handleSubmit(event: { preventDefault: () => void }) {
    if (draftDescription === (task.description ?? '')) {
      event.preventDefault();
      setEditorImageError(null);
      setIsEditingDescription(false);
      return;
    }
    if (hasPendingEditorUploads) {
      event.preventDefault();
      return;
    }
    if (hasInlineBase64Images) {
      event.preventDefault();
      setEditorImageError('Hay imagenes sin subir en la descripcion. Reintenta la carga antes de guardar.');
    }
  }

  async function handleCancel() {
    await cleanupDescriptionTempImages({ taskId: task.id, html: draftDescription });
    setDraftDescription(task.description ?? '');
    setEditorImageError(null);
    setHasPendingEditorUploads(false);
    setIsEditingDescription(false);
  }

  async function handleImageUpload(file: File) {
    setEditorImageError(null);
    try {
      return await uploadDescriptionAttachment({ taskId: task.id, file, redirectTo });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No se pudo subir la imagen.';
      setEditorImageError(message);
      throw error;
    }
  }

  return (
    <div className="rounded border p-3">
      <h3 className="mb-2 text-sm font-semibold">Descripcion</h3>
      {isEditingDescription ? (
        <fetcher.Form action="/api/tasks/update" method="post" className="space-y-2" onSubmit={handleSubmit}>
          <DescriptionEditor
            taskId={task.id}
            redirectTo={redirectTo}
            draftDescription={draftDescription}
            mentionCandidates={mentionCandidates}
            hasPendingEditorUploads={hasPendingEditorUploads}
            hasInlineBase64Images={hasInlineBase64Images}
            editorImageError={editorImageError}
            updateErrorActionData={updateErrorActionData}
            isSubmitting={fetcher.state === 'submitting'}
            onDraftDescriptionChange={setDraftDescription}
            onPendingUploadsChange={setHasPendingEditorUploads}
            onEditorImageErrorChange={setEditorImageError}
            onImageUpload={handleImageUpload}
            onCancel={handleCancel}
          />
        </fetcher.Form>
      ) : (
        <Preview
          description={task.description}
          onStartEdit={handleStartEdit}
        />
      )}
    </div>
  );
}



