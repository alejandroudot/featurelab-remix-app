import type { ProjectActionData } from '../types';

type CreateProjectPayload = {
  name: string;
  imageUrl: string | null;
};

type DeleteProjectPayload = {
  id: string;
};

async function parseProjectActionResponse(response: Response): Promise<ProjectActionData> {
  try {
    return (await response.json()) as ProjectActionData;
  } catch {
    return {
      success: false,
      formError: 'No se pudo procesar la respuesta del servidor.',
    };
  }
}

async function postProjectAction(input: {
  url: '/api/projects/create' | '/api/projects/delete';
  formData: FormData;
}): Promise<ProjectActionData> {
  try {
    const response = await fetch(input.url, {
      method: 'POST',
      body: input.formData,
      headers: { Accept: 'application/json' },
    });
    return parseProjectActionResponse(response);
  } catch {
    return {
      success: false,
      formError: 'No se pudo conectar con el servidor.',
    };
  }
}

export async function createProject(payload: CreateProjectPayload) {
  const formData = new FormData();
  formData.set('name', payload.name);
  if (payload.imageUrl) {
    formData.set('imageUrl', payload.imageUrl);
  }

  return postProjectAction({
    url: '/api/projects/create',
    formData,
  });
}

export async function deleteProject(payload: DeleteProjectPayload) {
  const formData = new FormData();
  formData.set('id', payload.id);

  return postProjectAction({
    url: '/api/projects/delete',
    formData,
  });
}
