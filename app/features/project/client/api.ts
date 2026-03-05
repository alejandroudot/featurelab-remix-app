import type { ProjectActionData } from '../types';

type CreateProjectPayload = {
  name: string;
  imageUrl: string | null;
};

type DeleteProjectPayload = {
  id: string;
};

type PinProjectPayload = {
  id: string;
  pinned: boolean;
};

type ReorderProjectSidebarPayload = {
  orderedProjectIds: string[];
};

type UpdateProjectPayload = {
  id: string;
  name?: string;
  description?: string | null;
  imageUrl?: string | null;
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
  url:
    | '/api/projects/create'
    | '/api/projects/delete'
    | '/api/projects/pin'
    | '/api/projects/reorder-sidebar'
    | '/api/projects/update';
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

export async function pinProject(payload: PinProjectPayload) {
  const formData = new FormData();
  formData.set('id', payload.id);
  formData.set('pinned', payload.pinned ? 'true' : 'false');

  return postProjectAction({
    url: '/api/projects/pin',
    formData,
  });
}

export async function reorderProjectSidebar(payload: ReorderProjectSidebarPayload) {
  const formData = new FormData();
  formData.set('orderedProjectIds', JSON.stringify(payload.orderedProjectIds));

  return postProjectAction({
    url: '/api/projects/reorder-sidebar',
    formData,
  });
}

export async function updateProject(payload: UpdateProjectPayload) {
  const formData = new FormData();
  formData.set('id', payload.id);
  if (payload.name !== undefined) {
    formData.set('name', payload.name);
  }
  if (payload.description !== undefined && payload.description !== null) {
    formData.set('description', payload.description);
  }
  if (payload.imageUrl !== undefined && payload.imageUrl !== null) {
    formData.set('imageUrl', payload.imageUrl);
  }
  if (payload.imageUrl === null) {
    formData.set('imageUrl', '');
  }

  return postProjectAction({
    url: '/api/projects/update',
    formData,
  });
}
