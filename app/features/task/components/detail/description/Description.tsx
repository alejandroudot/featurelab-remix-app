import { useEffect, useRef, useState } from 'react';
import { useRevalidator } from 'react-router';
import type { Task } from '~/core/task/task.types';
import {
  cleanupDescriptionTempImages,
  uploadDescriptionAttachment,
} from './utils';
import { DescriptionEditor } from './components/DescriptionEditor';
import { Preview } from './components/Preview';
import { useUpdateTaskMutation } from '~/features/task/client/mutation';

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
  const { data: actionData, isPending: isSubmitting, mutateAsync: updateTask, reset } = useUpdateTaskMutation();
  const revalidator = useRevalidator();
  const updateErrorActionData = actionData && actionData.success === false ? actionData : undefined;
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

      const result = await updateTask({
        id: task.id,
        description: draftDescription,
      });
      if (result && result.success) {
        revalidator.revalidate();
        setIsEditingDescription(false);
      }
    };

    void persistDraftOnClose();
  }, [
    closeSignal,
    draftDescription,
    hasInlineBase64Images,
    hasPendingEditorUploads,
    isEditingDescription,
    task.description,
    task.id,
    updateTask,
    revalidator,
  ]);

  function handleStartEdit() {
    reset();
    setDraftDescription(task.description ?? '');
    setEditorImageError(null);
    setHasPendingEditorUploads(false);
    setIsEditingDescription(true);
  }

  async function handleSubmit(event: { preventDefault: () => void }) {
    event.preventDefault();

    if (draftDescription === (task.description ?? '')) {
      setEditorImageError(null);
      setIsEditingDescription(false);
      return;
    }
    if (hasPendingEditorUploads) {
      return;
    }
    if (hasInlineBase64Images) {
      setEditorImageError('Hay imagenes sin subir en la descripcion. Reintenta la carga antes de guardar.');
      return;
    }

    const result = await updateTask({
      id: task.id,
      description: draftDescription,
    });
    if (!result || !result.success) return;
    setIsEditingDescription(false);
    revalidator.revalidate();
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
      return await uploadDescriptionAttachment({ taskId: task.id, file });
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
        <form className="space-y-2" onSubmit={handleSubmit}>
          <DescriptionEditor
            draftDescription={draftDescription}
            mentionCandidates={mentionCandidates}
            hasPendingEditorUploads={hasPendingEditorUploads}
            hasInlineBase64Images={hasInlineBase64Images}
            editorImageError={editorImageError}
            updateErrorActionData={updateErrorActionData}
            isSubmitting={isSubmitting}
            onDraftDescriptionChange={setDraftDescription}
            onPendingUploadsChange={setHasPendingEditorUploads}
            onEditorImageErrorChange={setEditorImageError}
            onImageUpload={handleImageUpload}
            onCancel={handleCancel}
          />
        </form>
      ) : (
        <Preview
          description={task.description}
          onStartEdit={handleStartEdit}
        />
      )}
    </div>
  );
}

