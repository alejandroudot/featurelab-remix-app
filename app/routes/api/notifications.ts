import type { Route } from './+types/notifications';
import { inArray } from 'drizzle-orm';
import { requireUser } from '~/infra/auth/require-user';
import { taskActivityQueryService, taskQueryService } from '~/infra/tasks/task.services';
import { buildNotificationsFeedFromTaskActivities } from '~/core/notifications/notifications-feed';
import { db } from '~/infra/db/client.sqlite';
import { tasks as tasksTable } from '~/infra/db/schema';

export async function loader({ request }: Route.LoaderArgs) {
  const user = await requireUser(request);
  const tasks = await taskQueryService.listByUser(user.id);
  const taskActivities = await taskActivityQueryService.listByUser(user.id);

  const knownTaskIdSet = new Set(tasks.map((task) => task.id));
  const missingTaskIds = Array.from(
    new Set(
      taskActivities
        .map((activity) => activity.taskId)
        .filter((taskId) => !knownTaskIdSet.has(taskId)),
    ),
  );

  const extraTasks =
    missingTaskIds.length === 0
      ? []
      : await db
          .select({ id: tasksTable.id, title: tasksTable.title })
          .from(tasksTable)
          .where(inArray(tasksTable.id, missingTaskIds))
          .all();

  const taskTitleById = new Map<string, string>();
  tasks.forEach((task) => taskTitleById.set(task.id, task.title));
  extraTasks.forEach((task) => taskTitleById.set(task.id, task.title));

  const hydratedTasks = taskActivities.map((activity) => ({
    id: activity.taskId,
    title: taskTitleById.get(activity.taskId) ?? 'Task',
  }));
  const notifications = buildNotificationsFeedFromTaskActivities({
    userId: user.id,
    tasks: hydratedTasks,
    taskActivities,
    limit: 20,
  });

  return Response.json({
    currentUserId: user.id,
    notifications,
  });
}
