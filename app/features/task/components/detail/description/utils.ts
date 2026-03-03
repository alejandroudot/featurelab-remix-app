export type AttachmentUploadApiResponse = {
  success?: boolean;
  formError?: string;
  fieldErrors?: Record<string, string[] | undefined>;
  data?: {
    storagePath?: string;
  };
};

export function parseAttachmentUploadResponse(rawBody: string): AttachmentUploadApiResponse | null {
  try {
    return JSON.parse(rawBody) as AttachmentUploadApiResponse;
  } catch {
    return null;
  }
}

export function extractStoragePath(
  rawBody: string,
  payload: AttachmentUploadApiResponse | null,
): string | undefined {
  const fallbackStoragePath = rawBody.match(/\/uploads\/tasks\/(?:tmp\/)?[a-zA-Z0-9._-]+/)?.[0];
  return payload?.data?.storagePath ?? fallbackStoragePath;
}

export function getFirstFieldError(
  fieldErrors: Record<string, string[] | undefined> | undefined,
): string | undefined {
  if (!fieldErrors) return undefined;
  for (const key in fieldErrors) {
    const message = fieldErrors[key]?.[0];
    if (message) return message;
  }
  return undefined;
}

export function shouldCleanupTempImages(html: string): boolean {
  return html.includes('/uploads/tasks/tmp/');
}

export async function cleanupDescriptionTempImages(input: { taskId: string; html: string }) {
  if (!shouldCleanupTempImages(input.html)) return;
  const cleanupFormData = new FormData();
  cleanupFormData.set('taskId', input.taskId);
  cleanupFormData.set('html', input.html);
  await fetch('/api/tasks/images/cleanup', {
    method: 'POST',
    body: cleanupFormData,
  });
}

export async function uploadDescriptionAttachment(input: {
  taskId: string;
  file: File;
  redirectTo: string;
}): Promise<string> {
  const formData = new FormData();
  formData.set('taskId', input.taskId);
  formData.set('attachmentFile', input.file);
  formData.set('redirectTo', input.redirectTo);

  const response = await fetch('/api/tasks/attachments', {
    method: 'POST',
    body: formData,
    headers: {
      Accept: 'application/json',
    },
  });

  const rawBody = await response.text();
  const payload = parseAttachmentUploadResponse(rawBody);
  const storagePath = extractStoragePath(rawBody, payload);

  if (!response.ok || !storagePath) {
    const firstFieldError = getFirstFieldError(payload?.fieldErrors);
    const message = payload?.formError ?? firstFieldError ?? 'No se pudo subir la imagen.';
    throw new Error(message);
  }

  return storagePath;
}

