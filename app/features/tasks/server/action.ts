import type { RunTaskActionInput, TaskActionResult } from '../types';
import { parseIntent } from './utils';
import type { Intent, TaskIntentHandler } from './action/shared/types';
import { handleCreate } from './action/handlers/create';
import { handleUpdate } from './action/handlers/update';
import { handleDelete } from './action/handlers/delete';
import { handleReorderColumn } from './action/handlers/reorder-column';
import {
  handleCommentCreate,
  handleCommentDelete,
  handleCommentUpdate,
} from './action/handlers/comments';

const intentHandlers: Record<Intent, TaskIntentHandler> = {
  create: handleCreate,
  update: handleUpdate,
  delete: handleDelete,
  'reorder-column': handleReorderColumn,
  'comment-create': handleCommentCreate,
  'comment-update': handleCommentUpdate,
  'comment-delete': handleCommentDelete,
};

export async function runTaskAction(input: RunTaskActionInput): Promise<TaskActionResult> {
  const intentResult = parseIntent(input.formData);

  if (typeof intentResult !== 'string') {
    return intentResult;
  }

  const handler = intentHandlers[intentResult as Intent];
  return handler(input);
}
