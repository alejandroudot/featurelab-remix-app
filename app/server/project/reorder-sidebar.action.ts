import { z } from 'zod';
import { projectRepository } from '~/infra/project/project.repository.provider';
import type { ProjectActionResponseData } from './types';

type RunProjectReorderSidebarActionInput = {
  formData: FormData;
  userId: string;
};

const idsSchema = z.array(z.string().min(1)).min(1);

export async function runProjectReorderSidebarAction({
  formData,
  userId,
}: RunProjectReorderSidebarActionInput) {
  const orderedProjectIdsRaw = String(formData.get('orderedProjectIds') ?? '').trim();
  let orderedProjectIds: string[] = [];

  try {
    orderedProjectIds = JSON.parse(orderedProjectIdsRaw);
  } catch {
    return Response.json(
      {
        success: false,
        fieldErrors: { orderedProjectIds: ['Formato invalido.'] },
        values: { orderedProjectIds: orderedProjectIdsRaw },
      } satisfies ProjectActionResponseData,
      { status: 400 },
    );
  }

  const parsed = idsSchema.safeParse(orderedProjectIds);
  if (!parsed.success) {
    return Response.json(
      {
        success: false,
        fieldErrors: { orderedProjectIds: ['Debes enviar al menos un proyecto.'] },
        values: { orderedProjectIds: orderedProjectIdsRaw },
      } satisfies ProjectActionResponseData,
      { status: 400 },
    );
  }

  try {
    await projectRepository.reorderSidebar({ userId, orderedProjectIds: parsed.data });
    return Response.json({ success: true } satisfies ProjectActionResponseData);
  } catch {
    return Response.json(
      {
        success: false,
        formError: 'No se pudo reordenar el sidebar de proyectos.',
        values: { orderedProjectIds: orderedProjectIdsRaw },
      } satisfies ProjectActionResponseData,
      { status: 500 },
    );
  }
}

