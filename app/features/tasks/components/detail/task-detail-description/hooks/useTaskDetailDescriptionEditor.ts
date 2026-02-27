import { useEffect, useState } from 'react';
import type { Task } from '~/core/tasks/tasks.types';
import {
  extractStoragePath,
  getFirstFieldError,
  parseAttachmentUploadResponse,
  shouldCleanupTempImages,
} from '../utils';

type UseTaskDetailDescriptionEditorInput = {
  task: Task;
  closeSignal: number;
  redirectTo: string;
  onSubmitDescriptionUpdate: (description: string) => void;
};

export function useTaskDetailDescriptionEditor({
  task,
  closeSignal,
  redirectTo,
  onSubmitDescriptionUpdate,
}: UseTaskDetailDescriptionEditorInput) {
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

  async function cleanupTempImages(html: string) {
    if (!shouldCleanupTempImages(html)) return;
    const cleanupFormData = new FormData();
    cleanupFormData.set('taskId', task.id);
    cleanupFormData.set('html', html);
    await fetch('/api/tasks/images/cleanup', {
      method: 'POST',
      body: cleanupFormData,
    });
  }

  useEffect(() => {
    if (!isEditingDescription) return;

    const persistDraftOnClose = async () => {
      if (hasPendingEditorUploads || hasInlineBase64Images) {
        await cleanupTempImages(draftDescription);
        setIsEditingDescription(false);
        setEditorImageError(null);
        setHasPendingEditorUploads(false);
        return;
      }

      if (draftDescription === (task.description ?? '')) {
        setIsEditingDescription(false);
        setEditorImageError(null);
        return;
      }

      onSubmitDescriptionUpdate(draftDescription);
      setIsEditingDescription(false);
    };

    void persistDraftOnClose();
  }, [closeSignal]);

  function handleFormSubmit(event: { preventDefault: () => void }) {
    if (draftDescription === (task.description ?? '')) {
      event.preventDefault();
      setIsEditingDescription(false);
      setEditorImageError(null);
      return;
    }
    if (hasPendingEditorUploads) {
      event.preventDefault();
      return;
    }
    if (hasInlineBase64Images) {
      event.preventDefault();
      setEditorImageError(
        'Hay imagenes sin subir en la descripcion. Reintenta la carga antes de guardar.',
      );
    }
  }

  async function handleCancelEdit() {
    await cleanupTempImages(draftDescription);
    setDraftDescription(task.description ?? '');
    setIsEditingDescription(false);
    setEditorImageError(null);
    setHasPendingEditorUploads(false);
  }

  async function handleImageUpload(file: File) {
    setEditorImageError(null);
    const formData = new FormData();
    formData.set('taskId', task.id);
    formData.set('attachmentFile', file);
    formData.set('redirectTo', redirectTo);

    const response = await fetch('/api/tasks/attachments', {
      method: 'POST',
      body: formData,
      headers: {
        Accept: 'application/json',
      },
    });

    const rawBody = await response.text();
    const payload = parseAttachmentUploadResponse(rawBody);
    const storagePath = extractStoragePath(rawBody, payload);

    if (!response.ok || !storagePath) {
      const firstFieldError = getFirstFieldError(payload?.fieldErrors);
      const message = payload?.formError ?? firstFieldError ?? 'No se pudo subir la imagen.';
      setEditorImageError(message);
      throw new Error(message);
    }

    return storagePath;
  }

  function startEditingDescription() {
    setDraftDescription(task.description ?? '');
    setIsEditingDescription(true);
  }

  return {
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
  };
}
