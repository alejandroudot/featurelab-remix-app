// app/infra/tasks/task.repository.ts
import type {
  TaskActivityCommandService,
  TaskActivityQueryService,
  TaskCommandService,
  TaskQueryService,
  TaskService,
} from '../../core/tasks/tasks.port';
import {
  sqliteTaskActivityCommandService,
  sqliteTaskActivityQueryService,
  sqliteTaskCommandService,
  sqliteTaskQueryService,
} from './task.repository.sqlite';

// v0.2: aca elegimos por DB_PROVIDER (sqlite vs supabase)
export const taskQueryService: TaskQueryService = sqliteTaskQueryService;
export const taskCommandService: TaskCommandService = sqliteTaskCommandService;
export const taskActivityQueryService: TaskActivityQueryService = sqliteTaskActivityQueryService;
export const taskActivityCommandService: TaskActivityCommandService =
  sqliteTaskActivityCommandService;

// Alias de transicion para imports legacy.
export const taskService: TaskService = {
  ...taskQueryService,
  ...taskCommandService,
};
