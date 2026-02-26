import { useEffect, useState } from 'react';
import { useFetcher, useLocation } from 'react-router';
import type { Task } from '~/core/tasks/tasks.types';
import type { TaskActionData } from '../../types';
import { RichTextEditor, RichTextViewer } from './RichTextEditor';

type AttachmentUploadApiResponse = {
  success?: boolean;
  formError?: string;
  fieldErrors?: Record<string, string[] | undefined>;
  data?: {
    storagePath?: string;
  };
};

type TaskDetailContentProps = {
  task: Task;
  mentionCandidates: string[];
  closeSignal?: number;
};

export function TaskDetailContent({
  task,
  mentionCandidates,
  closeSignal = 0,
}: TaskDetailContentProps) {
  const fetcher = useFetcher<TaskActionData>();
  const location = useLocation();
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [draftDescription, setDraftDescription] = useState(task.description ?? '');
  const [editorImageError, setEditorImageError] = useState<string | null>(null);
  const [hasPendingEditorUploads, setHasPendingEditorUploads] = useState(false);
  const hasInlineBase64Images = draftDescription.includes('data:image/');
  const redirectTo = `${location.pathname}${location.search}`;
  const formError =
    fetcher.data?.success === false && fetcher.data.intent === 'update' ? fetcher.data : undefined;

  useEffect(() => {
    setIsEditingDescription(false);
    setDraftDescription(task.description ?? '');
    setEditorImageError(null);
    setHasPendingEditorUploads(false);
  }, [task.id, task.description]);

  useEffect(() => {
    if (!isEditingDescription) return;

    const persistDraft = async () => {
      if (hasPendingEditorUploads || hasInlineBase64Images) {
        if (draftDescription.includes('/uploads/tasks/tmp/')) {
          const cleanupFormData = new FormData();
          cleanupFormData.set('taskId', task.id);
          cleanupFormData.set('html', draftDescription);
          await fetch('/api/tasks/images/cleanup', {
            method: 'POST',
            body: cleanupFormData,
          });
        }
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

      fetcher.submit(
        {
          intent: 'update',
          id: task.id,
          description: draftDescription,
          redirectTo,
        },
        { method: 'post' },
      );
      setIsEditingDescription(false);
    };

    void persistDraft();
  }, [closeSignal]);

  return (
    <div className="rounded border p-3">
      <h3 className="mb-2 text-sm font-semibold">Descripcion</h3>
      {isEditingDescription ? (
        <fetcher.Form
          method="post"
          className="space-y-2"
          onSubmit={(event) => {
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
          }}
        >
          <input type="hidden" name="intent" value="update" />
          <input type="hidden" name="id" value={task.id} />
          <input type="hidden" name="redirectTo" value={redirectTo} />
          <RichTextEditor
            name="description"
            value={draftDescription}
            onChange={setDraftDescription}
            mentionCandidates={mentionCandidates}
            autoFocus
            placeholder="Describe la task..."
            onPendingUploadsChange={setHasPendingEditorUploads}
            onImageUploadError={setEditorImageError}
            onImageUpload={async (file) => {
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
              let payload: AttachmentUploadApiResponse | null = null;
              try {
                payload = JSON.parse(rawBody) as AttachmentUploadApiResponse;
              } catch {
                payload = null;
              }
              const fallbackStoragePath = rawBody.match(
                /\/uploads\/tasks\/(?:tmp\/)?[a-zA-Z0-9._-]+/,
              )?.[0];
              const storagePath = payload?.data?.storagePath ?? fallbackStoragePath;

              if (!response.ok || !storagePath) {
                const firstFieldError = payload?.fieldErrors
                  ? Object.values(payload.fieldErrors).find((messages) => messages?.[0])?.[0]
                  : undefined;
                const message = payload?.formError ?? firstFieldError ?? 'No se pudo subir la imagen.';
                setEditorImageError(message);
                throw new Error(message);
              }

              return storagePath;
            }}
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
          {formError?.fieldErrors?.description?.[0] ? (
            <p className="text-xs text-red-600">{formError.fieldErrors.description[0]}</p>
          ) : null}
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
              onClick={async () => {
                if (draftDescription.includes('/uploads/tasks/tmp/')) {
                  const cleanupFormData = new FormData();
                  cleanupFormData.set('taskId', task.id);
                  cleanupFormData.set('html', draftDescription);
                  await fetch('/api/tasks/images/cleanup', {
                    method: 'POST',
                    body: cleanupFormData,
                  });
                }
                setDraftDescription(task.description ?? '');
                setIsEditingDescription(false);
                setEditorImageError(null);
                setHasPendingEditorUploads(false);
              }}
              className="rounded border px-2 py-1 text-xs font-medium"
            >
              Cancelar
            </button>
          </div>
        </fetcher.Form>
      ) : (
        <button
          type="button"
          onClick={() => {
            setDraftDescription(task.description ?? '');
            setIsEditingDescription(true);
          }}
          className="w-full text-left hover:bg-accent/40"
        >
          {task.description ? (
            <RichTextViewer content={task.description} />
          ) : (
            <span className="block rounded border border-dashed p-2 text-sm opacity-85">
              Sin descripcion por ahora. Click para editar.
            </span>
          )}
        </button>
      )}
    </div>
  );
}
