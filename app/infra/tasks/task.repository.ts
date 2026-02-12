// app/infra/tasks/task.repository.ts
import type { TaskService } from '../../core/tasks/tasks.port';
import { sqliteTaskService } from './task.repository.sqlite';

// v0.2: acá elegimos por DB_PROVIDER (sqlite vs supabase)
export const taskService: TaskService = sqliteTaskService;

