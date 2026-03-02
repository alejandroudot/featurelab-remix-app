import type { FeatureFlagRepository } from '~/core/flags/contracts/flags.port';
import type { UserRole } from '~/core/auth/auth.types';

type RunHomeActionInput = {
  formData: FormData;
  userRole: UserRole;
  flagRepository: Pick<FeatureFlagRepository, 'toggle'>;
};

export async function runHomeAction(input: RunHomeActionInput) {
  const { formData, userRole, flagRepository } = input;

  if (userRole !== 'admin') {
    return Response.json({ success: false, message: 'No autorizado' }, { status: 403 });
  }

  const intent = String(formData.get('intent') ?? '');
  if (intent !== 'toggle-hub-flag') {
    return Response.json({ success: false, message: 'Intent invalido' }, { status: 400 });
  }

  const id = String(formData.get('id') ?? '');
  const environmentRaw = String(formData.get('environment') ?? '');
  if (!id) {
    return Response.json({ success: false, message: 'ID requerido' }, { status: 400 });
  }
  if (environmentRaw !== 'development' && environmentRaw !== 'production') {
    return Response.json({ success: false, message: 'Environment invalido' }, { status: 400 });
  }

  try {
    await flagRepository.toggle({ id, environment: environmentRaw });
    return Response.json({ success: true });
  } catch {
    return Response.json({ success: false, message: 'No se pudo actualizar la flag' }, { status: 500 });
  }
}

