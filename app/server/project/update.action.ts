import { projectRepository } from '~/infra/project/project.repository.provider';
import type { ProjectActionResponseData } from './types';

type RunProjectUpdateActionInput = {
  formData: FormData;
  userId: string;
};

export async function runProjectUpdateAction({ formData, userId }: RunProjectUpdateActionInput) {
  const id = String(formData.get('id') ?? '').trim();
  const nameRaw = String(formData.get('name') ?? '');
  const descriptionRaw = String(formData.get('description') ?? '');
  const imageUrlRaw = String(formData.get('imageUrl') ?? '');

  if (id.length === 0) {
    return Response.json(
      {
        success: false,
        fieldErrors: { id: ['ID de proyecto requerido.'] },
        values: { id, name: nameRaw, description: descriptionRaw, imageUrl: imageUrlRaw },
      } satisfies ProjectActionResponseData,
      { status: 400 },
    );
  }

  const name = nameRaw.trim();
  if (nameRaw.length > 0 && name.length === 0) {
    return Response.json(
      {
        success: false,
        fieldErrors: { name: ['El nombre no puede ser vacio.'] },
        values: { id, name: nameRaw, description: descriptionRaw, imageUrl: imageUrlRaw },
      } satisfies ProjectActionResponseData,
      { status: 400 },
    );
  }
  if (name.length > 120) {
    return Response.json(
      {
        success: false,
        fieldErrors: { name: ['Maximo 120 caracteres.'] },
        values: { id, name: nameRaw, description: descriptionRaw, imageUrl: imageUrlRaw },
      } satisfies ProjectActionResponseData,
      { status: 400 },
    );
  }

  const description = descriptionRaw.trim().length > 0 ? descriptionRaw.trim() : null;
  if (description && description.length > 500) {
    return Response.json(
      {
        success: false,
        fieldErrors: { description: ['Maximo 500 caracteres.'] },
        values: { id, name: nameRaw, description: descriptionRaw, imageUrl: imageUrlRaw },
      } satisfies ProjectActionResponseData,
      { status: 400 },
    );
  }
  const imageUrl = imageUrlRaw.trim().length > 0 ? imageUrlRaw.trim() : null;
  if (imageUrl && !imageUrl.startsWith('data:image/') && !imageUrl.startsWith('http')) {
    return Response.json(
      {
        success: false,
        fieldErrors: { imageUrl: ['Formato de imagen no valido.'] },
        values: { id, name: nameRaw, description: descriptionRaw, imageUrl: imageUrlRaw },
      } satisfies ProjectActionResponseData,
      { status: 400 },
    );
  }

  try {
    const updated = await projectRepository.update({
      id,
      userId,
      ...(nameRaw.length > 0 ? { name } : {}),
      description,
      ...(formData.has('imageUrl') ? { imageUrl } : {}),
    });

    if (!updated) {
      return Response.json(
        {
          success: false,
          formError: 'Proyecto no encontrado o sin permisos.',
          values: { id, name: nameRaw, description: descriptionRaw, imageUrl: imageUrlRaw },
        } satisfies ProjectActionResponseData,
        { status: 404 },
      );
    }

    return Response.json({ success: true } satisfies ProjectActionResponseData);
  } catch {
    return Response.json(
      {
        success: false,
        formError: 'No se pudo actualizar el proyecto.',
        values: { id, name: nameRaw, description: descriptionRaw, imageUrl: imageUrlRaw },
      } satisfies ProjectActionResponseData,
      { status: 500 },
    );
  }
}
