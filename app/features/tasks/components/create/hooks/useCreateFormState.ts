import { useEffect, useRef, useState } from 'react';
import type { TaskActionData } from '../../../types';

type CreateActionData = Exclude<TaskActionData, undefined>;

type UseCreateFormStateInput = {
  createActionData: CreateActionData | undefined;
  isSubmitting: boolean;
};

export function useCreateFormState({ createActionData, isSubmitting }: UseCreateFormStateInput) {
  const [title, setTitle] = useState(createActionData?.values?.title ?? '');
  const [description, setDescription] = useState(createActionData?.values?.description ?? '');
  const [editorImageError, setEditorImageError] = useState<string | null>(null);
  const [hasPendingEditorUploads, setHasPendingEditorUploads] = useState(false);
  const wasSubmittingRef = useRef(isSubmitting);
  const hasInlineBase64Images = description.includes('data:image/');

  useEffect(() => {
    setTitle(createActionData?.values?.title ?? '');
    setDescription(createActionData?.values?.description ?? '');
    setEditorImageError(null);
    setHasPendingEditorUploads(false);
  }, [createActionData?.values?.title, createActionData?.values?.description]);

  useEffect(() => {
    const finishedSuccessfulCreate = wasSubmittingRef.current && !isSubmitting && !createActionData;

    if (finishedSuccessfulCreate) {
      setTitle('');
      setDescription('');
      setEditorImageError(null);
      setHasPendingEditorUploads(false);
    }

    wasSubmittingRef.current = isSubmitting;
  }, [isSubmitting, createActionData]);

  function handleSubmitGuard(event: { preventDefault: () => void }) {
    if (hasPendingEditorUploads) {
      event.preventDefault();
      return;
    }
    if (hasInlineBase64Images) {
      event.preventDefault();
      setEditorImageError('Hay imagenes sin subir. Vuelve a cargarlas antes de crear.');
    }
  }

  return {
    title,
    description,
    editorImageError,
    hasPendingEditorUploads,
    hasInlineBase64Images,
    setTitle,
    setDescription,
    setEditorImageError,
    setHasPendingEditorUploads,
    handleSubmitGuard,
  };
}
