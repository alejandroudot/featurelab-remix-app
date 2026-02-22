import type { FlagCommandService } from '~/core/flags/service/flags.service';

type RunHomeActionInput = {
  formData: FormData;
  userRole: 'user' | 'admin';
  flagCommandService: FlagCommandService;
};

export async function runHomeAction(input: RunHomeActionInput) {
  const { formData, userRole, flagCommandService } = input;

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
    await flagCommandService.toggle({ id, environment: environmentRaw });
    return Response.json({ success: true });
  } catch {
    return Response.json({ success: false, message: 'No se pudo actualizar la flag' }, { status: 500 });
  }
}
