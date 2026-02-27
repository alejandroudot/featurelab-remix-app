import { useEffect, useRef, useState } from 'react';
import type { TaskActionData } from '../../../types';

type CreateErrorActionData = Exclude<TaskActionData, undefined>;

type UseCreateFormStateInput = {
  createErrorActionData: CreateErrorActionData | undefined;
  isSubmitting: boolean;
};

export function useCreateFormState({ createErrorActionData, isSubmitting }: UseCreateFormStateInput) {
  const [title, setTitle] = useState(createErrorActionData?.values?.title ?? '');
  const [description, setDescription] = useState(createErrorActionData?.values?.description ?? '');
  const [editorImageError, setEditorImageError] = useState<string | null>(null);
  const [hasPendingEditorUploads, setHasPendingEditorUploads] = useState(false);
  const wasSubmittingRef = useRef(isSubmitting);
  const hasInlineBase64Images = description.includes('data:image/');

  useEffect(() => {
    setTitle(createErrorActionData?.values?.title ?? '');
    setDescription(createErrorActionData?.values?.description ?? '');
    setEditorImageError(null);
    setHasPendingEditorUploads(false);
  }, [createErrorActionData?.values?.title, createErrorActionData?.values?.description]);

  useEffect(() => {
    const finishedSuccessfulCreate = wasSubmittingRef.current && !isSubmitting && !createErrorActionData;

    if (finishedSuccessfulCreate) {
      setTitle('');
      setDescription('');
      setEditorImageError(null);
      setHasPendingEditorUploads(false);
    }

    wasSubmittingRef.current = isSubmitting;
  }, [isSubmitting, createErrorActionData]);

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
