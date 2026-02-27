import { Form } from 'react-router';
import type { TaskActionData } from '../../types';
import { RichTextEditor } from '~/ui/editors/rich-text/RichTextEditor';
import { ActionFeedbackText, getErrorActionDataByIntent } from '~/ui/forms/action-feedback';
import { FormFooter } from './FormFooter';
import { TitleField } from './Title';
import { useCreateFormState } from './hooks/useCreateFormState';
import { getFieldError } from './utils/errors';
import { uploadCreateTaskImage } from './utils/upload';

export function CreateTask({
  actionData,
  isSubmitting,
  mentionCandidates,
}: {
  actionData: TaskActionData;
  isSubmitting: boolean;
  mentionCandidates: string[];
}) {
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
    <section id="create-task" className="max-w-xl space-y-3 rounded border p-4">
      <ActionFeedbackText
        actionData={createErrorActionData}
        intent="create"
        showFormError
        fallbackError={createIntentError}
        errorClassName="rounded border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-700"
      />

      <Form method="post" className="max-w-md space-y-3" onSubmit={handleSubmitGuard}>
        <input type="hidden" name="intent" value="create" />

        <TitleField value={title} error={titleError} onChange={setTitle} />

        <div className="flex flex-col gap-1">
          <label className="font-medium">Descripcion</label>
          <RichTextEditor
            name="description"
            value={description}
            onChange={setDescription}
            mentionCandidates={mentionCandidates}
            placeholder="Describe la task..."
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
      </Form>
    </section>
  );
}
