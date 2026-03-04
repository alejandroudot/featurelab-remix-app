import { projectRepository } from '~/infra/project/project.repository.provider';
import type { ProjectActionResponseData } from './types';

type RunProjectDeleteActionInput = {
  formData: FormData;
  userId: string;
};

export async function runProjectDeleteAction({ formData, userId }: RunProjectDeleteActionInput) {
  const id = String(formData.get('id') ?? '').trim();

  if (id.length === 0) {
    return Response.json(
      {
        success: false,
        fieldErrors: { id: ['ID de proyecto requerido.'] },
        values: { id },
      } satisfies ProjectActionResponseData,
      { status: 400 },
    );
  }

  try {
    await projectRepository.remove({
      id,
      userId,
    });

    return Response.json({
      success: true,
      message: 'Proyecto eliminado.',
    } satisfies ProjectActionResponseData);
  } catch {
    return Response.json(
      {
        success: false,
        formError: 'No se pudo eliminar el proyecto.',
        values: { id },
      } satisfies ProjectActionResponseData,
      { status: 500 },
    );
  }
}
