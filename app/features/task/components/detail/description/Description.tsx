import { useEffect, useRef, useState } from 'react';
import { useRevalidator } from 'react-router';
import type { Task } from '~/core/task/task.types';
import { cleanupDescriptionTempImages, uploadDescriptionAttachment } from './utils';
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
  const closeSignalRef = useRef(closeSignal);

  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [draftDescription, setDraftDescription] = useState(task.description ?? '');
  const [editorImageError, setEditorImageError] = useState<string | null>(null);
  const [hasPendingEditorUploads, setHasPendingEditorUploads] = useState(false);

  const hasInlineBase64Images = draftDescription.includes('data:image/');
  const persistedDescription = task.description ?? '';

  function resetEditorState(nextDescription: string) {
    setDraftDescription(nextDescription);
    setEditorImageError(null);
    setHasPendingEditorUploads(false);
  }

  useEffect(() => {
    setIsEditingDescription(false);
    resetEditorState(persistedDescription);
  }, [task.id, persistedDescription]);

  async function persistDescriptionDraft(closeOnSuccess: boolean) {
    if (hasPendingEditorUploads) return false;
    if (hasInlineBase64Images) {
      setEditorImageError('Hay imagenes sin subir en la descripcion. Reintenta la carga antes de guardar.');
      return false;
    }
    if (draftDescription === persistedDescription) {
      if (closeOnSuccess) setIsEditingDescription(false);
      return true;
    }

    const result = await updateTask({
      id: task.id,
      description: draftDescription,
    });
    if (!result || !result.success) return false;

    revalidator.revalidate();
    if (closeOnSuccess) setIsEditingDescription(false);
    return true;
  }

  useEffect(() => {
    if (!isEditingDescription) return;
    if (closeSignal === closeSignalRef.current) return;
    closeSignalRef.current = closeSignal;

    void (async () => {
      if (hasPendingEditorUploads || hasInlineBase64Images) {
        await cleanupDescriptionTempImages({ taskId: task.id, html: draftDescription });
        setIsEditingDescription(false);
        return;
      }

      await persistDescriptionDraft(true);
    })();
  }, [
    closeSignal,
    isEditingDescription,
    hasPendingEditorUploads,
    hasInlineBase64Images,
    draftDescription,
    persistedDescription,
    task.id,
  ]);

  function handleStartEdit() {
    reset();
    resetEditorState(persistedDescription);
    setIsEditingDescription(true);
  }

  async function handleSubmit(event: { preventDefault: () => void }) {
    event.preventDefault();
    await persistDescriptionDraft(true);
  }

  async function handleCancel() {
    await cleanupDescriptionTempImages({ taskId: task.id, html: draftDescription });
    resetEditorState(persistedDescription);
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
            actionData={actionData}
            isSubmitting={isSubmitting}
            onDraftDescriptionChange={setDraftDescription}
            onPendingUploadsChange={setHasPendingEditorUploads}
            onEditorImageErrorChange={setEditorImageError}
            onImageUpload={handleImageUpload}
            onCancel={handleCancel}
          />
        </form>
      ) : (
        <Preview description={task.description} onStartEdit={handleStartEdit} />
      )}
    </div>
  );
}
