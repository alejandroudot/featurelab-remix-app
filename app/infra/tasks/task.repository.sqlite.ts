// app/infra/tasks/task.repository.sqlite.ts
import { desc, eq, and } from 'drizzle-orm';
import type { TaskService, TaskCreateInput, TaskUpdateInput } from '../../core/tasks/tasks.port';
import type { Task } from '../../core/tasks/tasks.types';
import { db } from '../db/client.sqlite';
import { tasks } from '../db/schema';
import { mapTasksRow } from './tasks-mapper';

export const sqliteTaskService: TaskService = {
  async listAll(): Promise<Task[]> {
    const rows = db.select().from(tasks).orderBy(desc(tasks.createdAt)).all();
    return rows.map(mapTasksRow);
  },

  async listByUser(userId: string): Promise<Task[]> {
    const rows = db
      .select()
      .from(tasks)
      .where(eq(tasks.userId, userId))
      .orderBy(desc(tasks.createdAt))
      .all();
    return rows.map(mapTasksRow);
  },

  async create(input: TaskCreateInput): Promise<Task> {
    const [row] = db
      .insert(tasks)
      .values({
        id: crypto.randomUUID(),
        userId: input.userId,
        title: input.title,
        description: input.description ?? null,
        status: 'todo',
        priority: 'medium',
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning()
      .all();
    return mapTasksRow(row);
  },

  async update(input: TaskUpdateInput) {
    const [row] = await db
      .update(tasks)
      .set({
        ...(input.status ? { status: input.status } : {}),
        ...(input.priority ? { priority: input.priority } : {}),
        updatedAt: new Date(),
      })
      .where(and(eq(tasks.id, input.id), eq(tasks.userId, input.userId)))
      .returning();
		if (!row) throw new Response('Task not found', { status: 404 })
    return mapTasksRow(row);
  },

  async remove(input: { id: string; userId: string }): Promise<void> {
    db.delete(tasks)
      .where(and(eq(tasks.id, input.id), eq(tasks.userId, input.userId)))
      .run();
  },
};

