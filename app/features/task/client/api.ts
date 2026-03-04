import type { TaskStatus } from '~/core/task/task.types';
import type { TaskActionData } from '../types';

type CreateTaskPayload = {
  projectId: string;
  title: string;
  description: string;
};

type UpdateTaskPayload = {
  id: string;
  title?: string;
  description?: string;
  labels?: string;
  checklist?: string;
  status?: string;
  priority?: string;
  dueDate?: string;
  orderIndex?: string;
  assigneeId?: string;
};

type DeleteTaskPayload = {
  id: string;
};

type ReorderColumnPayload = {
  status: TaskStatus;
  orderedTaskIds: string[];
};

type CreateCommentPayload = {
  id: string;
  commentBody: string;
};

type UpdateCommentPayload = {
  commentId: string;
  commentBody: string;
};

type DeleteCommentPayload = {
  commentId: string;
};

async function parseTaskActionResponse(response: Response): Promise<TaskActionData> {
  try {
    return (await response.json()) as TaskActionData;
  } catch {
    return {
      success: false,
      formError: 'No se pudo procesar la respuesta del servidor.',
    };
  }
}

async function postTaskAction(input: {
  url:
    | '/api/tasks/create'
    | '/api/tasks/update'
    | '/api/tasks/delete'
    | '/api/tasks/reorder-column'
    | '/api/task-comments/create'
    | '/api/task-comments/update'
    | '/api/task-comments/delete';
  formData: FormData;
}): Promise<TaskActionData> {
  try {
    const response = await fetch(input.url, {
      method: 'POST',
      body: input.formData,
      headers: { Accept: 'application/json' },
    });
    return parseTaskActionResponse(response);
  } catch {
    return {
      success: false,
      formError: 'No se pudo conectar con el servidor.',
    };
  }
}

export async function createTask(payload: CreateTaskPayload) {
  const formData = new FormData();
  formData.set('projectId', payload.projectId);
  formData.set('title', payload.title);
  formData.set('description', payload.description);
  return postTaskAction({ url: '/api/tasks/create', formData });
}

export async function updateTask(payload: UpdateTaskPayload) {
  const formData = new FormData();
  formData.set('id', payload.id);
  if (payload.title !== undefined) formData.set('title', payload.title);
  if (payload.description !== undefined) formData.set('description', payload.description);
  if (payload.labels !== undefined) formData.set('labels', payload.labels);
  if (payload.checklist !== undefined) formData.set('checklist', payload.checklist);
  if (payload.status !== undefined) formData.set('status', payload.status);
  if (payload.priority !== undefined) formData.set('priority', payload.priority);
  if (payload.dueDate !== undefined) formData.set('dueDate', payload.dueDate);
  if (payload.orderIndex !== undefined) formData.set('orderIndex', payload.orderIndex);
  if (payload.assigneeId !== undefined) formData.set('assigneeId', payload.assigneeId);
  return postTaskAction({ url: '/api/tasks/update', formData });
}

export async function deleteTask(payload: DeleteTaskPayload) {
  const formData = new FormData();
  formData.set('id', payload.id);
  return postTaskAction({ url: '/api/tasks/delete', formData });
}

export async function reorderColumn(payload: ReorderColumnPayload) {
  const formData = new FormData();
  formData.set('status', payload.status);
  formData.set('orderedTaskIds', JSON.stringify(payload.orderedTaskIds));
  return postTaskAction({ url: '/api/tasks/reorder-column', formData });
}

export async function createTaskComment(payload: CreateCommentPayload) {
  const formData = new FormData();
  formData.set('id', payload.id);
  formData.set('commentBody', payload.commentBody);
  return postTaskAction({ url: '/api/task-comments/create', formData });
}

export async function updateTaskComment(payload: UpdateCommentPayload) {
  const formData = new FormData();
  formData.set('commentId', payload.commentId);
  formData.set('commentBody', payload.commentBody);
  return postTaskAction({ url: '/api/task-comments/update', formData });
}

export async function deleteTaskComment(payload: DeleteCommentPayload) {
  const formData = new FormData();
  formData.set('commentId', payload.commentId);
  return postTaskAction({ url: '/api/task-comments/delete', formData });
}
