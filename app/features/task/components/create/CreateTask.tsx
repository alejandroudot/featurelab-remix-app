import { useEffect, useState } from 'react';
import { useRevalidator } from 'react-router';
import { useShallow } from 'zustand/react/shallow';
import { RichTextEditor } from '~/ui/editors/rich-text/RichTextEditor';
import { ActionFeedbackText } from '~/ui/forms/feedback/action-feedback';
import { useWorkspaceUiStore } from '~/features/store/workspace-ui.store';
import { useWorkspaceDataStore } from '~/features/store/workspace-data.store';
import { FormFooter } from './FormFooter';
import { TitleField } from './Title';
import { getFieldError } from './utils/errors';
import { uploadCreateTaskImage } from './utils/upload-image';
import { useCreateTaskMutation } from '~/features/task/client/mutation';

type CreateTaskFormState = {
  title: string;
  description: string;
  editorImageError: string | null;
  hasPendingEditorUploads: boolean;
};

const INITIAL_FORM_STATE: CreateTaskFormState = {
  title: '',
  description: '',
  editorImageError: null,
  hasPendingEditorUploads: false,
};

export function CreateTask({
  className,
}: {
  className?: string;
}) {
  const { data: actionData, isPending: isSubmitting, mutateAsync: createTask, reset } = useCreateTaskMutation();
  const revalidator = useRevalidator();
  const { activeProjectId, setCreateTaskOpen } = useWorkspaceUiStore(
    useShallow((state) => ({
      activeProjectId: state.activeProjectId,
      setCreateTaskOpen: state.setCreateTaskOpen,
    })),
  );
  const { assignableUsers } = useWorkspaceDataStore(
    useShallow((state) => ({
      assignableUsers: state.assignableUsers,
    })),
  );
  const mentionCandidates = [...new Set(assignableUsers.map((user) => user.email.toLowerCase()))];
  const resolvedActiveProjectId = activeProjectId ?? '';
  const createErrorActionData = actionData && actionData.success === false ? actionData : undefined;
  const [formState, setFormState] = useState<CreateTaskFormState>(INITIAL_FORM_STATE);
  const hasInlineBase64Images = formState.description.includes('data:image/');

  useEffect(() => {
    if (!actionData || actionData.success !== true) return;
    setFormState(INITIAL_FORM_STATE);
    setCreateTaskOpen(false);
    reset();
  }, [actionData, reset, setCreateTaskOpen]);

  async function handleSubmit(event: { preventDefault: () => void }) {
    event.preventDefault();

    if (formState.hasPendingEditorUploads) {
      return;
    }

    if (hasInlineBase64Images) {
      setFormState((prev) => ({
        ...prev,
        editorImageError: 'Hay imagenes sin subir. Vuelve a cargarlas antes de crear.',
      }));
      return;
    }

    const data = await createTask({
      projectId: resolvedActiveProjectId,
      title: formState.title,
      description: formState.description,
    });

    if (!data || !data.success) return;
    revalidator.revalidate();
  }

  async function handleEditorImageUpload(file: File) {
    setFormState((prev) => ({ ...prev, editorImageError: null }));
    try {
      return await uploadCreateTaskImage(file);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No se pudo subir la imagen.';
      setFormState((prev) => ({ ...prev, editorImageError: message }));
      throw error;
    }
  }

  return (
    <section id="create-task" className={className ?? 'max-w-xl space-y-3 rounded border p-4'}>
      <ActionFeedbackText
        actionData={createErrorActionData}
        showFormError
        errorClassName="rounded border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-700"
      />

      <form className="space-y-3" onSubmit={handleSubmit}>
        <TitleField
          value={formState.title}
          error={getFieldError(createErrorActionData, 'title')}
          onChange={(title) => setFormState((prev) => ({ ...prev, title }))}
        />

        <div className="flex flex-col gap-1">
          <label className="font-medium">Descripcion</label>
          <RichTextEditor
            name="description"
            value={formState.description}
            onChange={(description) => setFormState((prev) => ({ ...prev, description }))}
            mentionCandidates={mentionCandidates}
            onPendingUploadsChange={(hasPendingEditorUploads) =>
              setFormState((prev) => ({ ...prev, hasPendingEditorUploads }))
            }
            onImageUploadError={(editorImageError) =>
              setFormState((prev) => ({ ...prev, editorImageError }))
            }
            onImageUpload={handleEditorImageUpload}
          />
        </div>

        <FormFooter
          descriptionError={getFieldError(createErrorActionData, 'description')}
          hasPendingEditorUploads={formState.hasPendingEditorUploads}
          hasInlineBase64Images={hasInlineBase64Images}
          editorImageError={formState.editorImageError}
          isSubmitting={isSubmitting}
        />
      </form>
    </section>
  );
}
