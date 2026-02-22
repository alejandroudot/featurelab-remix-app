// app/infra/tasks/task.repository.ts
import type { TaskCommandService, TaskQueryService, TaskService } from '../../core/tasks/tasks.port';
import { sqliteTaskCommandService, sqliteTaskQueryService } from './task.repository.sqlite';

// v0.2: aca elegimos por DB_PROVIDER (sqlite vs supabase)
export const taskQueryService: TaskQueryService = sqliteTaskQueryService;
export const taskCommandService: TaskCommandService = sqliteTaskCommandService;

// Alias de transicion para imports legacy.
export const taskService: TaskService = {
  ...taskQueryService,
  ...taskCommandService,
};
