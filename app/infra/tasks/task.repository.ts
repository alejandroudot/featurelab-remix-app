// app/infra/tasks/task.repository.ts
import type {
  TaskActivityCommandService,
  TaskActivityQueryService,
  TaskCommentCommandService,
  TaskCommentQueryService,
  TaskCommandService,
  TaskQueryService,
} from '../../core/tasks/tasks.port';
import {
  sqliteTaskActivityCommandService,
  sqliteTaskActivityQueryService,
  sqliteTaskCommentCommandService,
  sqliteTaskCommentQueryService,
  sqliteTaskCommandService,
  sqliteTaskQueryService,
} from './task.repository.sqlite';

// v0.2: aca elegimos por DB_PROVIDER (sqlite vs supabase)
export const taskQueryService: TaskQueryService = sqliteTaskQueryService;
export const taskCommandService: TaskCommandService = sqliteTaskCommandService;
export const taskActivityQueryService: TaskActivityQueryService = sqliteTaskActivityQueryService;
export const taskActivityCommandService: TaskActivityCommandService = sqliteTaskActivityCommandService;
export const taskCommentQueryService: TaskCommentQueryService = sqliteTaskCommentQueryService;
export const taskCommentCommandService: TaskCommentCommandService = sqliteTaskCommentCommandService;