import type { Flag, FlagActionData } from '../types';

type FlagsListResponse = {
  flags: Flag[];
};

type CreateFlagPayload = {
  key: string;
  description: string;
  type: 'boolean' | 'percentage';
  rolloutPercent?: string;
};

type ToggleFlagPayload = {
  id: string;
  environment: 'development' | 'production';
};

type UpdateFlagStatePayload = {
  id: string;
  environment: 'development' | 'production';
  rolloutPercent: string;
};

type DeleteFlagPayload = {
  id: string;
};

async function parseFlagActionResponse(response: Response): Promise<FlagActionData> {
  try {
    return (await response.json()) as FlagActionData;
  } catch {
    return {
      success: false,
      formError: 'No se pudo procesar la respuesta del servidor.',
    };
  }
}

async function postFlagAction(input: {
  url: '/api/flags/create' | '/api/flags/toggle' | '/api/flags/update-state' | '/api/flags/delete';
  formData: FormData;
}): Promise<FlagActionData> {
  try {
    const response = await fetch(input.url, {
      method: 'POST',
      body: input.formData,
      headers: { Accept: 'application/json' },
    });
    return parseFlagActionResponse(response);
  } catch {
    return {
      success: false,
      formError: 'No se pudo conectar con el servidor.',
    };
  }
}

export async function fetchFlagsList(): Promise<FlagsListResponse> {
  const response = await fetch('/api/flags/list', {
    headers: { Accept: 'application/json' },
  });
  if (!response.ok) {
    throw new Error('No se pudo cargar el listado de flags.');
  }
  return (await response.json()) as FlagsListResponse;
}

export async function createFlag(payload: CreateFlagPayload) {
  const formData = new FormData();
  formData.set('key', payload.key);
  formData.set('description', payload.description);
  formData.set('type', payload.type);
  if (payload.type === 'percentage') {
    formData.set('rolloutPercent', payload.rolloutPercent ?? '');
  }
  return postFlagAction({ url: '/api/flags/create', formData });
}

export async function toggleFlag(payload: ToggleFlagPayload) {
  const formData = new FormData();
  formData.set('id', payload.id);
  formData.set('environment', payload.environment);
  return postFlagAction({ url: '/api/flags/toggle', formData });
}

export async function updateFlagState(payload: UpdateFlagStatePayload) {
  const formData = new FormData();
  formData.set('id', payload.id);
  formData.set('environment', payload.environment);
  formData.set('rolloutPercent', payload.rolloutPercent);
  return postFlagAction({ url: '/api/flags/update-state', formData });
}

export async function deleteFlag(payload: DeleteFlagPayload) {
  const formData = new FormData();
  formData.set('id', payload.id);
  return postFlagAction({ url: '/api/flags/delete', formData });
}
