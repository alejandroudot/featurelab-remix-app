import type { TaskActionData } from '../../../../types';
import { ActionFeedbackText } from '~/ui/forms/feedback/action-feedback';

type FormFooterProps = {
  hasPendingEditorUploads: boolean;
  hasInlineBase64Images: boolean;
  editorImageError: string | null;
  updateErrorActionData: TaskActionData;
  isSubmitting: boolean;
  onCancel: () => void;
};

export function FormFooter({
  hasPendingEditorUploads,
  hasInlineBase64Images,
  editorImageError,
  updateErrorActionData,
  isSubmitting,
  onCancel,
}: FormFooterProps) {
  return (
    <>
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
      <ActionFeedbackText actionData={updateErrorActionData} fieldKey="description" showFormError />
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isSubmitting || hasPendingEditorUploads || hasInlineBase64Images}
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
    </>
  );
}
