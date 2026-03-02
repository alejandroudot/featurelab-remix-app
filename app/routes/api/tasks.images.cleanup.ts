import { requireUser } from '~/infra/auth/require-user';
import { taskQueryPort } from '~/infra/task/task.repository.provider';
import { cleanupRichTextTempImagesNotInPersistedHtml } from '~/infra/files/rich-text-images.storage';

// Endpoint de limpieza de temporales del editor.
// Elimina solo archivos /tmp que no quedaron referenciados en la descripcion persistida.
export async function action({ request }: { request: Request }) {
  const user = await requireUser(request);
  const formData = await request.formData();
  const taskId = String(formData.get('taskId') ?? '').trim();
  const html = String(formData.get('html') ?? '');

  if (!taskId) {
    return Response.json({ success: false, formError: 'Task requerida.' }, { status: 400 });
  }

  const task = await taskQueryPort.getByIdForUser({ id: taskId, userId: user.id });
  if (!task) {
    return Response.json({ success: false, formError: 'No tenes permisos para editar esta task.' }, { status: 403 });
  }

  await cleanupRichTextTempImagesNotInPersistedHtml(html, task.description ?? '');
  return Response.json({ success: true });
}

export async function loader() {
  return Response.json({ success: false, formError: 'Method not allowed' }, { status: 405 });
}



