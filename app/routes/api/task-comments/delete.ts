import { requireUser } from '~/infra/auth/require-user';
import { notificationService } from '~/infra/notifications/notifications.service';
import { taskRepository } from '~/infra/task/task.repository.provider';
import { handleCommentDelete } from '~/server/task/action/comments';

export async function action({ request }: { request: Request }) {
  const user = await requireUser(request);
  const formData = await request.formData();
  return handleCommentDelete({
    formData,
    userId: user.id,
    taskRepository,
    notificationService,
  });
}

export async function loader() {
  return Response.json({ success: false, formError: 'Method not allowed' }, { status: 405 });
}
