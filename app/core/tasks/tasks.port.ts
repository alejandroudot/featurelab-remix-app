// app/core/tasks/task.port.ts
import type { Task } from './tasks.types';
import type { z } from 'zod';
import type { taskCreateSchema } from './task.schema';

// input que usamos al crear/editar
export type TaskInput = z.infer<typeof taskCreateSchema>;

export type TaskUpdateInput = {
  id: string;
  status?: 'todo' | 'in-progress' | 'done';
  priority?: 'low' | 'medium' | 'high';
};

export interface TaskRepository {
  listAll(): Promise<Task[]>; // más adelante será listByUser(userId)
  create(input: TaskInput): Promise<Task>;		
	update(input: TaskUpdateInput): Promise<Task>;
	remove(id: string): Promise<void>;
}
