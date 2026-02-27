import { getFirstFieldError } from './errors';

type UploadResponse = {
  success?: boolean;
  formError?: string;
  fieldErrors?: Record<string, string[] | undefined>;
  data?: { storagePath?: string };
};

function parseUploadResponse(rawBody: string): UploadResponse | undefined {
  try {
    const parsed = JSON.parse(rawBody) as unknown;
    if (parsed && typeof parsed === 'object') return parsed as UploadResponse;
    return undefined;
  } catch {
    return undefined;
  }
}

function extractStoragePath(rawBody: string, payload?: UploadResponse) {
  const fallbackStoragePath = rawBody.match(/\/uploads\/tasks\/(?:tmp\/)?[a-zA-Z0-9._-]+/)?.[0];
  return payload?.data?.storagePath ?? fallbackStoragePath;
}

export async function uploadCreateTaskImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.set('attachmentFile', file);

  const response = await fetch('/api/tasks/attachments', {
    method: 'POST',
    body: formData,
    headers: { Accept: 'application/json' },
  });

  const rawBody = await response.text();
  const payload = parseUploadResponse(rawBody);
  const storagePath = extractStoragePath(rawBody, payload);

  if (!response.ok || !storagePath) {
    const firstFieldError = getFirstFieldError(payload?.fieldErrors);
    const message = payload?.formError ?? firstFieldError ?? 'No se pudo subir la imagen.';
    throw new Error(message);
  }

  return storagePath;
}
