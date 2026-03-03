import { requireUser } from '~/infra/auth/require-user';
import { taskRepository } from '~/infra/task/task.repository.provider';
import { notificationService } from '~/infra/notifications/notifications.service';
import { runTaskAction } from '~/server/task/action';

export async function action({ request }: { request: Request }) {
  const user = await requireUser(request);
  const formData = await request.formData();
  return runTaskAction({
    formData,
    userId: user.id,
    taskRepository,
    notificationService,
  });
}

export async function loader() {
  return Response.json({ success: false, formError: 'Method not allowed' }, { status: 405 });
}
