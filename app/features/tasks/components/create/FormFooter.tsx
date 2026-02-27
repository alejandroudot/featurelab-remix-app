type FormFooterProps = {
  descriptionError?: string;
  hasPendingEditorUploads: boolean;
  hasInlineBase64Images: boolean;
  editorImageError: string | null;
  isSubmitting: boolean;
};

export function FormFooter({
  descriptionError,
  hasPendingEditorUploads,
  hasInlineBase64Images,
  editorImageError,
  isSubmitting,
}: FormFooterProps) {
  return (
    <>
      {descriptionError ? <p className="text-sm text-red-600">{descriptionError}</p> : null}
      {hasPendingEditorUploads ? (
        <p className="text-xs text-amber-700">
          Espera a que terminen de subir las imagenes antes de crear.
        </p>
      ) : null}
      {!hasPendingEditorUploads && hasInlineBase64Images ? (
        <p className="text-xs text-amber-700">
          Hay imagenes sin subir. Vuelve a cargarlas antes de crear.
        </p>
      ) : null}
      {editorImageError ? <p className="text-xs text-red-600">{editorImageError}</p> : null}

      <button
        type="submit"
        disabled={isSubmitting || hasPendingEditorUploads || hasInlineBase64Images}
        className="inline-flex items-center justify-center rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
      >
        {isSubmitting ? 'Creando...' : hasPendingEditorUploads ? 'Subiendo imagen...' : 'Crear task'}
      </button>
    </>
  );
}
