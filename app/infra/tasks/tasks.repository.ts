// app/infra/tasks/task.repository.ts
import type { TaskRepository } from '../../core/tasks/tasks.port';
import { sqliteTaskRepository } from './tasks.repository.sqlite';

// v0.2: acá elegimos por DB_PROVIDER (sqlite vs supabase)
export const taskRepository: TaskRepository = sqliteTaskRepository;
