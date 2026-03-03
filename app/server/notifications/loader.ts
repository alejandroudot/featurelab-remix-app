import { inArray } from 'drizzle-orm';
import { getOptionalUser } from '~/infra/auth/require-user';
import { taskRepository } from '~/infra/task/task.repository.provider';
import { buildNotificationsFeedFromTaskActivities } from '~/core/notifications/notifications-feed';
import { db } from '~/infra/db/client.sqlite';
import { tasks as tasksTable } from '~/infra/db/schema';

export async function runNotificationsLoader({ request }: { request: Request }) {
  const user = await getOptionalUser(request);
  if (!user) {
    return Response.json(
      {
        currentUserId: 'anonymous',
        notifications: [],
      },
      { status: 401 },
    );
  }

  const tasks = await taskRepository.listByUser(user.id);
  const taskActivities = await taskRepository.listActivitiesByUser(user.id);
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
