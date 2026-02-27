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


