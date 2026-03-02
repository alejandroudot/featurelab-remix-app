import type { Task, TaskActivity } from '~/core/task/task.types';

export type NotificationFeedItem = {
  id: string;
  taskId: string;
  taskTitle: string;
  actorEmail: string;
  message: string;
  createdAt: Date;
};

type BuildNotificationsFeedFromTasksInput = {
  userId: string;
  tasks: Array<Pick<Task, 'id' | 'title'>>;
  taskActivities: TaskActivity[];
  limit?: number;
};

function formatTaskActivityMessage(activity: TaskActivity, taskTitle: string, userId: string): string {
  const actorEmail = activity.actorEmail ?? 'Usuario';

  if (activity.action === 'assignee-changed') {
    const targetUserId = activity.metadata?.to;
    if (targetUserId === userId) return `${actorEmail} te asigno: ${taskTitle}`;
    return `${actorEmail} reasigno responsable en: ${taskTitle}`;
  }

  if (activity.action === 'comment-added') return `${actorEmail} agrego un comentario en: ${taskTitle}`;
  if (activity.action === 'comment-updated') return `${actorEmail} edito un comentario en: ${taskTitle}`;
  if (activity.action === 'comment-deleted') return `${actorEmail} borro un comentario en: ${taskTitle}`;
  if (activity.action === 'created') return `${actorEmail} creo la task: ${taskTitle}`;
  if (activity.action === 'deleted') return `${actorEmail} elimino la task: ${taskTitle}`;
  if (activity.action === 'status-changed') return `${actorEmail} cambio el estado de: ${taskTitle}`;
  if (activity.action === 'priority-changed') return `${actorEmail} cambio la prioridad de: ${taskTitle}`;
  if (activity.action === 'labels-changed') return `${actorEmail} actualizo etiquetas en: ${taskTitle}`;
  if (activity.action === 'checklist-changed') return `${actorEmail} actualizo checklist en: ${taskTitle}`;
  if (activity.action === 'due-date-changed') return `${actorEmail} cambio la fecha objetivo de: ${taskTitle}`;
  if (activity.action === 'reordered') return `${actorEmail} reordeno la task: ${taskTitle}`;

  if (activity.action === 'updated' && activity.metadata?.kind === 'mention') {
    const source = activity.metadata?.source;
    const sourceLabel = source === 'description' ? 'descripcion' : 'comentario';
    return `${actorEmail} te menciono en ${sourceLabel}: ${taskTitle}`;
  }

  return `${actorEmail} actualizo la task: ${taskTitle}`;
}

export function buildNotificationsFeedFromTaskActivities({
  userId,
  tasks,
  taskActivities,
  limit = 10,
}: BuildNotificationsFeedFromTasksInput): NotificationFeedItem[] {
  const taskTitleById = new Map(tasks.map((task) => [task.id, task.title]));

  return taskActivities
    .sort((left, right) => right.createdAt.getTime() - left.createdAt.getTime())
    .slice(0, limit)
    .map((activity) => {
      const taskTitle = taskTitleById.get(activity.taskId) ?? 'Task';
      return {
        id: activity.id,
        taskId: activity.taskId,
        taskTitle,
        actorEmail: activity.actorEmail ?? 'Usuario',
        message: formatTaskActivityMessage(activity, taskTitle, userId),
        createdAt: activity.createdAt,
      };
    });
}



