import { requireUser } from '~/infra/auth/require-user';
import { taskQueryPort } from '~/infra/task/task.repository.provider';
import { saveRichTextImageTemp } from '~/infra/files/rich-text-images.storage';

// Endpoint de subida de imagenes del editor rich-text.
// Valida permisos sobre la task y guarda archivo temporal en /uploads/tasks/tmp.
export async function action({ request }: { request: Request }) {
  const user = await requireUser(request);
  const formData = await request.formData();
  const taskId = String(formData.get('taskId') ?? '').trim();
  const file = formData.get('attachmentFile');

  if (!(file instanceof File) || file.size === 0) {
    return Response.json({ success: false, formError: 'Selecciona una imagen valida.' }, { status: 400 });
  }
  if (!file.type.startsWith('image/')) {
    return Response.json({ success: false, formError: 'Solo se permiten imagenes.' }, { status: 400 });
  }
  if (file.size > 10 * 1024 * 1024) {
    return Response.json({ success: false, formError: 'El archivo supera el limite de 10MB.' }, { status: 400 });
  }

  // Si viene taskId validamos permisos. Sin taskId permitimos upload temporal para create form.
  if (taskId) {
    const task = await taskQueryPort.getByIdForUser({ id: taskId, userId: user.id });
    if (!task) {
      return Response.json({ success: false, formError: 'No tenes permisos para editar esta task.' }, { status: 403 });
    }
  }

  const storedFile = await saveRichTextImageTemp(file);
  return Response.json({
    success: true,
    data: {
      storagePath: storedFile.storagePath,
      fileName: storedFile.fileName,
      mimeType: storedFile.mimeType,
      sizeBytes: storedFile.sizeBytes,
    },
  });
}

export async function loader() {
  return Response.json({ success: false, formError: 'Method not allowed' }, { status: 405 });
}



