import { requireUser } from '~/infra/auth/require-user';
import { notificationService } from '~/infra/notifications/notifications.service';
import { taskRepository } from '~/infra/task/task.repository.provider';
import { handleReorderColumn } from '~/server/task/action/reorder-column';

export async function action({ request }: { request: Request }) {
  const user = await requireUser(request);
  const formData = await request.formData();
  return handleReorderColumn({
    formData,
    userId: user.id,
    taskRepository,
    notificationService,
  });
}

export async function loader() {
  return Response.json({ success: false, formError: 'Method not allowed' }, { status: 405 });
}
