import { useEffect, useState } from 'react';
import { useFetcher } from 'react-router';
import type { TaskActionData } from '../../types';
import { RichTextEditor } from '~/ui/editors/rich-text/RichTextEditor';
import { ActionFeedbackText, getErrorActionDataByIntent } from '~/ui/forms/action-feedback';
import { FormFooter } from './FormFooter';
import { TitleField } from './Title';
import { useCreateFormState } from './hooks/useCreateFormState';
import { getFieldError } from './utils/errors';
import { uploadCreateTaskImage } from './utils/upload';
import { useWorkspaceUiStore } from '~/features/project/store/ui.store';

export function CreateTask({
  activeProjectId,
  mentionCandidates,
  className,
}: {
  activeProjectId?: string;
  mentionCandidates: string[];
  className?: string;
}) {
  const fetcher = useFetcher<TaskActionData>();
  const actionData = fetcher.data;
  const isSubmitting = fetcher.state === 'submitting';
  const [didSubmitCreate, setDidSubmitCreate] = useState(false);
  const storeActiveProjectId = useWorkspaceUiStore((state) => state.activeProjectId);
  const setCreateTaskOpen = useWorkspaceUiStore((state) => state.setCreateTaskOpen);
  const resolvedActiveProjectId = activeProjectId ?? storeActiveProjectId ?? '';
  const createErrorActionData = getErrorActionDataByIntent(actionData, 'create');
  const createIntentError = getFieldError(createErrorActionData?.fieldErrors, 'intent');
  const titleError = getFieldError(createErrorActionData?.fieldErrors, 'title');
  const descriptionError = getFieldError(createErrorActionData?.fieldErrors, 'description');
  const {
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
  } = useCreateFormState({ createErrorActionData, isSubmitting });

  useEffect(() => {
    if (!didSubmitCreate) return;
    if (fetcher.state !== 'idle') return;
    if (!createErrorActionData) {
      setCreateTaskOpen(false);
    }
    setDidSubmitCreate(false);
  }, [didSubmitCreate, fetcher.state, createErrorActionData, setCreateTaskOpen]);

  async function handleEditorImageUpload(file: File) {
    setEditorImageError(null);
    try {
      return await uploadCreateTaskImage(file);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No se pudo subir la imagen.';
      setEditorImageError(message);
      throw error;
    }
  }

  return (
    <section id="create-task" className={className ?? 'max-w-xl space-y-3 rounded border p-4'}>
      <ActionFeedbackText
        actionData={createErrorActionData}
        intent="create"
        showFormError
        fallbackError={createIntentError}
        errorClassName="rounded border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-700"
      />

      <fetcher.Form
        action="/api/tasks"
        method="post"
        className="space-y-3"
        onSubmit={(event) => {
          handleSubmitGuard(event);
          if (!event.defaultPrevented) setDidSubmitCreate(true);
        }}
      >
        <input type="hidden" name="intent" value="create" />
        <input type="hidden" name="projectId" value={resolvedActiveProjectId} />

        <TitleField value={title} error={titleError} onChange={setTitle} />

        <div className="flex flex-col gap-1">
          <label className="font-medium">Descripcion</label>
          <RichTextEditor
            name="description"
            value={description}
            onChange={setDescription}
            mentionCandidates={mentionCandidates}
            onPendingUploadsChange={setHasPendingEditorUploads}
            onImageUploadError={setEditorImageError}
            onImageUpload={handleEditorImageUpload}
          />
        </div>

        <FormFooter
          descriptionError={descriptionError}
          hasPendingEditorUploads={hasPendingEditorUploads}
          hasInlineBase64Images={hasInlineBase64Images}
          editorImageError={editorImageError}
          isSubmitting={isSubmitting}
        />
      </fetcher.Form>
    </section>
  );
}
