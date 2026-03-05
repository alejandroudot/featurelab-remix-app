import { projectRepository } from '~/infra/project/project.repository.provider';
import type { ProjectActionResponseData } from './types';

type RunProjectPinActionInput = {
  formData: FormData;
  userId: string;
};

export async function runProjectPinAction({ formData, userId }: RunProjectPinActionInput) {
  const id = String(formData.get('id') ?? '').trim();
  const pinnedRaw = String(formData.get('pinned') ?? '').trim().toLowerCase();

  if (id.length === 0) {
    return Response.json(
      {
        success: false,
        fieldErrors: { id: ['ID de proyecto requerido.'] },
        values: { id, pinned: pinnedRaw },
      } satisfies ProjectActionResponseData,
      { status: 400 },
    );
  }

  const pinned = pinnedRaw === 'true' || pinnedRaw === '1';

  try {
    await projectRepository.setPinned({ id, userId, pinned });
    return Response.json({ success: true } satisfies ProjectActionResponseData);
  } catch {
    return Response.json(
      {
        success: false,
        formError: 'No se pudo actualizar el pin del proyecto.',
        values: { id, pinned: pinnedRaw },
      } satisfies ProjectActionResponseData,
      { status: 500 },
    );
  }
}

