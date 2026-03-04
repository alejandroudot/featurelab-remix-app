import { projectRepository } from '~/infra/project/project.repository.provider';
import type { ProjectActionResponseData } from './types';

type RunProjectCreateActionInput = {
  formData: FormData;
  userId: string;
};

export async function runProjectCreateAction({ formData, userId }: RunProjectCreateActionInput) {
  const name = String(formData.get('name') ?? '').trim();
  const imageUrlRaw = String(formData.get('imageUrl') ?? '').trim();
  const values = {
    name,
    imageUrl: imageUrlRaw,
  };

  if (name.length === 0) {
    return Response.json(
      {
        success: false,
        fieldErrors: { name: ['El nombre es obligatorio.'] },
        values,
      } satisfies ProjectActionResponseData,
      { status: 400 },
    );
  }

  try {
    await projectRepository.create({
      userId,
      name,
      imageUrl: imageUrlRaw.length > 0 ? imageUrlRaw : null,
    });

    return Response.json({
      success: true,
      message: 'Proyecto creado.',
    } satisfies ProjectActionResponseData);
  } catch {
    return Response.json(
      {
        success: false,
        formError: 'No se pudo crear el proyecto.',
        values,
      } satisfies ProjectActionResponseData,
      { status: 500 },
    );
  }
}
