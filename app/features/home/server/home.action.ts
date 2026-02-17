import { redirect } from 'react-router';
import type { FlagService } from '~/core/flags/flags.service';

type RunHomeActionInput = {
  formData: FormData;
  userRole: 'user' | 'admin';
  flagService: FlagService;
};

export async function runHomeAction(input: RunHomeActionInput) {
  const { formData, userRole, flagService } = input;

  if (userRole !== 'admin') {
    return Response.json({ success: false, message: 'No autorizado' }, { status: 403 });
  }

  const intent = String(formData.get('intent') ?? '');
  if (intent !== 'toggle-hub-flag') {
    return Response.json({ success: false, message: 'Intent invalido' }, { status: 400 });
  }

  const id = String(formData.get('id') ?? '');
  if (!id) {
    return Response.json({ success: false, message: 'ID requerido' }, { status: 400 });
  }

  await flagService.toggle(id);
  return redirect('/');
}
