import type { useFetcher } from 'react-router';
import { RichTextEditor } from '~/ui/editors/rich-text/RichTextEditor';
import type { TaskActionData } from '../../../types';
import { TaskActionErrors } from '../../common/TaskActionErrors';

type TaskContentFetcher = ReturnType<typeof useFetcher<TaskActionData>>;

type TaskDetailDescriptionEditorFormProps = {
  fetcher: TaskContentFetcher;
  taskId: string;
  redirectTo: string;
  draftDescription: string;
  mentionCandidates: string[];
  hasPendingEditorUploads: boolean;
  hasInlineBase64Images: boolean;
  editorImageError: string | null;
  updateActionData: TaskActionData;
  onDraftDescriptionChange: (value: string) => void;
  onPendingUploadsChange: (hasPendingUploads: boolean) => void;
  onEditorImageErrorChange: (value: string | null) => void;
  onImageUpload: (file: File) => Promise<string>;
  onSubmit: (event: { preventDefault: () => void }) => void;
  onCancel: () => void;
};

export function TaskDetailDescriptionEditorForm({
  fetcher,
  taskId,
  redirectTo,
  draftDescription,
  mentionCandidates,
  hasPendingEditorUploads,
  hasInlineBase64Images,
  editorImageError,
  updateActionData,
  onDraftDescriptionChange,
  onPendingUploadsChange,
  onEditorImageErrorChange,
  onImageUpload,
  onSubmit,
  onCancel,
}: TaskDetailDescriptionEditorFormProps) {
  return (
    <fetcher.Form method="post" className="space-y-2" onSubmit={onSubmit}>
      <input type="hidden" name="intent" value="update" />
      <input type="hidden" name="id" value={taskId} />
      <input type="hidden" name="redirectTo" value={redirectTo} />
      <RichTextEditor
        name="description"
        value={draftDescription}
        onChange={onDraftDescriptionChange}
        mentionCandidates={mentionCandidates}
        autoFocus
        onPendingUploadsChange={onPendingUploadsChange}
        onImageUploadError={onEditorImageErrorChange}
        onImageUpload={onImageUpload}
      />
      {hasPendingEditorUploads ? (
        <p className="text-xs text-amber-700">
          Espera a que terminen de subir las imagenes antes de guardar.
        </p>
      ) : null}
      {!hasPendingEditorUploads && hasInlineBase64Images ? (
        <p className="text-xs text-amber-700">
          Hay imagenes sin subir. Vuelve a cargarlas antes de guardar.
        </p>
      ) : null}
      {editorImageError ? <p className="text-xs text-red-600">{editorImageError}</p> : null}
      <TaskActionErrors actionData={updateActionData} fieldKey="description" />
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={fetcher.state === 'submitting' || hasPendingEditorUploads || hasInlineBase64Images}
          className="rounded bg-slate-900 px-2 py-1 text-xs font-medium text-white disabled:opacity-60"
        >
          {hasPendingEditorUploads ? 'Subiendo imagen...' : 'Guardar'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded border px-2 py-1 text-xs font-medium"
        >
          Cancelar
        </button>
      </div>
    </fetcher.Form>
  );
}
