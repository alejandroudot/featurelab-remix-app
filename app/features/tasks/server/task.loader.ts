import { asc } from 'drizzle-orm';
import type {
  TaskActivityQueryService,
  TaskCommentQueryService,
  TaskQueryService,
} from '~/core/tasks/tasks.port';
import { parseTasksViewStateFromUrl } from './task-view-state';
import { db } from '~/infra/db/client.sqlite';
import { users } from '~/infra/db/schema';

type RunTaskLoaderInput = {
  request: Request;
  userId: string;
  taskQueryService: TaskQueryService;
  taskActivityQueryService: TaskActivityQueryService;
  taskCommentQueryService: TaskCommentQueryService;
};

export async function runTaskLoader({
  request,
  userId,
  taskQueryService,
  taskActivityQueryService,
  taskCommentQueryService,
}: RunTaskLoaderInput) {
  const tasks = await taskQueryService.listByUser(userId);
  const taskActivities = await taskActivityQueryService.listByUser(userId);
  const taskComments = await taskCommentQueryService.listByUser(userId);
	// por ahora trae todos los usuarios
  const assignableUsers = await db
    .select({ id: users.id, email: users.email })
    .from(users)
    .orderBy(asc(users.email))
    .all();

  const url = new URL(request.url);
  const viewState = parseTasksViewStateFromUrl(url);
  const taskTitleById = new Map(tasks.map((task) => [task.id, task.title]));
  const notifications = taskActivities
    .filter((activity) => {
      if (activity.action === 'assignee-changed') {
        const targetUserId = activity.metadata?.to;
        return typeof targetUserId === 'string' && targetUserId === userId;
      }
      if (activity.action === 'updated') {
        const kind = activity.metadata?.kind;
        const targetUserId = activity.metadata?.targetUserId;
        return kind === 'mention' && typeof targetUserId === 'string' && targetUserId === userId;
      }
      return (
        activity.action === 'comment-added' ||
        activity.action === 'comment-updated' ||
        activity.action === 'comment-deleted'
      );
    })
    .slice(0, 10)
    .map((activity) => {
      const taskTitle = taskTitleById.get(activity.taskId) ?? 'Task';
      const actorEmail = activity.actorEmail ?? 'Usuario';

      if (activity.action === 'assignee-changed') {
        return {
          id: activity.id,
          taskId: activity.taskId,
          taskTitle,
          actorEmail,
          message: `${actorEmail} te asigno: ${taskTitle}`,
          createdAt: activity.createdAt,
        };
      }

      if (activity.action === 'comment-updated') {
        return {
          id: activity.id,
          taskId: activity.taskId,
          taskTitle,
          actorEmail,
          message: `${actorEmail} edito un comentario en: ${taskTitle}`,
          createdAt: activity.createdAt,
        };
      }

      if (activity.action === 'comment-deleted') {
        return {
          id: activity.id,
          taskId: activity.taskId,
          taskTitle,
          actorEmail,
          message: `${actorEmail} borro un comentario en: ${taskTitle}`,
          createdAt: activity.createdAt,
        };
      }

      if (activity.action === 'updated' && activity.metadata?.kind === 'mention') {
        const source = activity.metadata?.source;
        const sourceLabel = source === 'description' ? 'descripcion' : 'comentario';
        return {
          id: activity.id,
          taskId: activity.taskId,
          taskTitle,
          actorEmail,
          message: `${actorEmail} te menciono en ${sourceLabel}: ${taskTitle}`,
          createdAt: activity.createdAt,
        };
      }

      return {
        id: activity.id,
        taskId: activity.taskId,
        taskTitle,
        actorEmail,
        message: `${actorEmail} agrego un comentario en: ${taskTitle}`,
        createdAt: activity.createdAt,
      };
    });

  return {
    currentUserId: userId,
    tasks,
    taskActivities,
    taskComments,
    notifications,
    assignableUsers,
    viewState
  };
}
