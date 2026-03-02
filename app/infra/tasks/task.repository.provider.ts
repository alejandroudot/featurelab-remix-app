// app/infra/tasks/task.repository.provider.ts
import type {
  TaskActivityCommandPort,
  TaskActivityQueryPort,
  TaskCommentCommandPort,
  TaskCommentQueryPort,
  TaskCommandPort,
  TaskQueryPort,
} from '../../core/tasks/task.repository.port';
import {
  sqliteTaskActivityCommandAdapter,
  sqliteTaskActivityQueryAdapter,
  sqliteTaskCommentCommandAdapter,
  sqliteTaskCommentQueryAdapter,
  sqliteTaskCommandAdapter,
  sqliteTaskQueryAdapter,
} from './task.repository.sqlite';

// v0.2: aca elegimos por DB_PROVIDER (sqlite vs supabase)
export const taskQueryPort: TaskQueryPort = sqliteTaskQueryAdapter;
export const taskCommandPort: TaskCommandPort = sqliteTaskCommandAdapter;
export const taskActivityQueryPort: TaskActivityQueryPort = sqliteTaskActivityQueryAdapter;
export const taskActivityCommandPort: TaskActivityCommandPort = sqliteTaskActivityCommandAdapter;
export const taskCommentQueryPort: TaskCommentQueryPort = sqliteTaskCommentQueryAdapter;
export const taskCommentCommandPort: TaskCommentCommandPort = sqliteTaskCommentCommandAdapter;



