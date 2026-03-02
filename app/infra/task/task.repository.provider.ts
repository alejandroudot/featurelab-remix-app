// app/infra/task/task.repository.provider.ts
import type {
  TaskRepository,
} from '../../core/task/task.repository.port';
import { sqliteTaskRepository } from './task.repository.sqlite';

export const taskRepository: TaskRepository = sqliteTaskRepository;
