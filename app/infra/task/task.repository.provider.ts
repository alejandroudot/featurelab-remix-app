// app/infra/task/task.repository.provider.ts
import type {
  TaskActivityCommandPort,
  TaskActivityQueryPort,
  TaskCommentCommandPort,
  TaskCommentQueryPort,
  TaskCommandPort,
  TaskPort,
  TaskQueryPort,
} from '../../core/task/task.repository.port';
import {
  sqliteTaskActivityCommandAdapter,
  sqliteTaskActivityQueryAdapter,
  sqliteTaskCommentCommandAdapter,
  sqliteTaskCommentQueryAdapter,
  sqliteTaskCommandAdapter,
  sqliteTaskQueryAdapter,
} from './task.repository.sqlite';

// Primary grouped port.
export const taskPort: TaskPort = {
  task: {
    listAll: sqliteTaskQueryAdapter.listAll,
    listByUser: sqliteTaskQueryAdapter.listByUser,
    getByIdForUser: sqliteTaskQueryAdapter.getByIdForUser,
    create: sqliteTaskCommandAdapter.create,
    update: sqliteTaskCommandAdapter.update,
    reorderColumn: sqliteTaskCommandAdapter.reorderColumn,
    remove: sqliteTaskCommandAdapter.remove,
  },
  activity: {
    listByUser: sqliteTaskActivityQueryAdapter.listByUser,
    create: sqliteTaskActivityCommandAdapter.create,
  },
  comment: {
    listByUser: sqliteTaskCommentQueryAdapter.listByUser,
    getByIdForUser: sqliteTaskCommentQueryAdapter.getByIdForUser,
    create: sqliteTaskCommentCommandAdapter.create,
    update: sqliteTaskCommentCommandAdapter.update,
    remove: sqliteTaskCommentCommandAdapter.remove,
  },
};

// Backward-compatible named exports.
export const taskQueryPort: TaskQueryPort = taskPort.task;
export const taskCommandPort: TaskCommandPort = taskPort.task;
export const taskActivityQueryPort: TaskActivityQueryPort = taskPort.activity;
export const taskActivityCommandPort: TaskActivityCommandPort = taskPort.activity;
export const taskCommentQueryPort: TaskCommentQueryPort = taskPort.comment;
export const taskCommentCommandPort: TaskCommentCommandPort = taskPort.comment;
