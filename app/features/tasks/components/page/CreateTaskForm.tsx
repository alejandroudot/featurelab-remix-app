import { useEffect, useRef, useState } from 'react';
import { Form } from 'react-router';
import type { TaskActionData } from '../../types';
import { RichTextEditor } from '~/ui/editors/rich-text/RichTextEditor';

type TaskAttachmentUploadResponse = {
  success?: boolean;
  formError?: string;
  fieldErrors?: Record<string, string[] | undefined>;
  data?: { storagePath?: string };
};

const QUICK_TEMPLATES = [
  {
    id: 'bug',
    label: 'Bug',
    title: 'Bug: ',
    description:
      '- Contexto:\n- Comportamiento actual:\n- Comportamiento esperado:\n- Pasos para reproducir:\n',
  },
  {
    id: 'feature',
    label: 'Feature',
    title: 'Feature: ',
    description:
      '- Objetivo de negocio:\n- Alcance:\n- Criterio de aceptacion:\n- Riesgos:\n',
  },
  {
    id: 'refactor',
    label: 'Refactor',
    title: 'Refactor: ',
    description:
      '- Problema tecnico actual:\n- Propuesta de mejora:\n- Impacto esperado:\n- Plan de rollout:\n',
  },
] as const;

export function CreateTaskForm({
  actionData,
  isSubmitting,
  mentionCandidates,
}: {
  actionData: TaskActionData;
  isSubmitting: boolean;
  mentionCandidates: string[];
}) {
  const getFieldError = (fieldErrors: Record<string, string[] | undefined> | undefined, key: string) =>
    fieldErrors?.[key]?.[0];
  const getFirstFieldError = (fieldErrors: Record<string, string[] | undefined> | undefined) => {
    if (!fieldErrors) return undefined;
    for (const key in fieldErrors) {
      const message = fieldErrors[key]?.[0];
      if (message) return message;
    }
    return undefined;
  };
  const parseUploadResponse = (rawBody: string): TaskAttachmentUploadResponse | undefined => {
    try {
      const parsed = JSON.parse(rawBody) as unknown;
      if (parsed && typeof parsed === 'object') {
        return parsed as TaskAttachmentUploadResponse;
      }
      return undefined;
    } catch {
      return undefined;
    }
  };

  const createActionData =
    actionData?.success === false && actionData.intent === 'create' ? actionData : undefined;
  const globalError =
    createActionData?.formError ?? getFieldError(createActionData?.fieldErrors, 'intent');
  const titleError = getFieldError(createActionData?.fieldErrors, 'title');
  const descriptionError = getFieldError(createActionData?.fieldErrors, 'description');
  const [title, setTitle] = useState(createActionData?.values?.title ?? '');
  const [description, setDescription] = useState(createActionData?.values?.description ?? '');
  const [editorImageError, setEditorImageError] = useState<string | null>(null);
  const [hasPendingEditorUploads, setHasPendingEditorUploads] = useState(false);
  const hasInlineBase64Images = description.includes('data:image/');
  const wasSubmittingRef = useRef(isSubmitting);

  useEffect(() => {
    setTitle(createActionData?.values?.title ?? '');
    setDescription(createActionData?.values?.description ?? '');
    setEditorImageError(null);
    setHasPendingEditorUploads(false);
  }, [createActionData?.values?.title, createActionData?.values?.description]);

  useEffect(() => {
    const finishedSuccessfulCreate =
      wasSubmittingRef.current && !isSubmitting && !createActionData;

    if (finishedSuccessfulCreate) {
      setTitle('');
      setDescription('');
      setEditorImageError(null);
      setHasPendingEditorUploads(false);
    }

    wasSubmittingRef.current = isSubmitting;
  }, [isSubmitting, createActionData]);

  return (
    <section id="create-task" className="border rounded p-4 space-y-3 max-w-xl">
			
      {createActionData?.success === false && globalError ? (
        <div className="rounded border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-700">
          {globalError}
        </div>
      ) : null}

      <Form
        method="post"
        className="space-y-3 max-w-md"
        onSubmit={(event) => {
          if (hasPendingEditorUploads) {
            event.preventDefault();
            return;
          }
          if (hasInlineBase64Images) {
            event.preventDefault();
            setEditorImageError('Hay imagenes sin subir. Vuelve a cargarlas antes de crear.');
          }
        }}
      >
        <input type="hidden" name="intent" value="create" />

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs opacity-70">Plantillas:</span>
          {QUICK_TEMPLATES.map((template) => (
            <button
              key={template.id}
              type="button"
              className="rounded border px-2 py-1 text-xs font-medium hover:bg-accent/40"
              onClick={() => {
                setTitle(template.title);
                setDescription(template.description);
              }}
            >
              {template.label}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="title" className="font-medium">
            Titulo
          </label>
          <input
            id="title"
            name="title"
            className="border rounded px-3 py-2"
            value={title}
            onChange={(event) => setTitle(event.currentTarget.value)}
          />
          {titleError ? <p className="text-sm text-red-600">{titleError}</p> : null}
        </div>

        <div className="flex flex-col gap-1">
          <label className="font-medium">
            Descripcion
          </label>
          <RichTextEditor
            name="description"
            value={description}
            onChange={setDescription}
            mentionCandidates={mentionCandidates}
            placeholder="Describe la task..."
            onPendingUploadsChange={setHasPendingEditorUploads}
            onImageUploadError={setEditorImageError}
            onImageUpload={async (file) => {
              setEditorImageError(null);
              const formData = new FormData();
              formData.set('attachmentFile', file);

              const response = await fetch('/api/tasks/attachments', {
                method: 'POST',
                body: formData,
                headers: {
                  Accept: 'application/json',
                },
              });

              const rawBody = await response.text();
              const payload = parseUploadResponse(rawBody);
              const fallbackStoragePath = rawBody.match(
                /\/uploads\/tasks\/(?:tmp\/)?[a-zA-Z0-9._-]+/,
              )?.[0];
              const storagePath = payload?.data?.storagePath ?? fallbackStoragePath;

              if (!response.ok || !storagePath) {
                const firstFieldError = getFirstFieldError(payload?.fieldErrors);
                const message = payload?.formError ?? firstFieldError ?? 'No se pudo subir la imagen.';
                setEditorImageError(message);
                throw new Error(message);
              }

              return storagePath;
            }}
          />
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
        </div>

        <button
          type="submit"
          disabled={isSubmitting || hasPendingEditorUploads || hasInlineBase64Images}
          className="inline-flex items-center justify-center rounded bg-blue-600 px-4 py-2 text-white text-sm font-medium disabled:opacity-60"
        >
          {isSubmitting ? 'Creando...' : hasPendingEditorUploads ? 'Subiendo imagen...' : 'Crear task'}
        </button>
      </Form>
    </section>
  );
}
