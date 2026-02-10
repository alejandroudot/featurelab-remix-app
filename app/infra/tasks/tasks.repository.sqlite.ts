// app/infra/tasks/task.repository.sqlite.ts
import { desc, sql, eq } from 'drizzle-orm';
import type { TaskRepository, TaskInput, TaskUpdateInput } from '../../core/tasks/tasks.port';
import type { Task } from '../../core/tasks/tasks.types';
import { db } from '../db/client.sqlite';
import { tasks } from '../db/schema';

export const sqliteTaskRepository: TaskRepository = {
  async listAll(): Promise<Task[]> {
    const rows = db.select().from(tasks).orderBy(desc(tasks.createdAt)).all();

    return rows.map((row) => ({
      id: row.id,
      title: row.title,
      description: row.description ?? undefined,
      status: row.status as Task['status'],
      priority: row.priority as Task['priority'],
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    }));
  },

  async create(input: TaskInput): Promise<Task> {
    const [row] = db
      .insert(tasks)
      .values({
        id: crypto.randomUUID(),
        title: input.title,
        description: input.description ?? null,
        status: 'todo',
        priority: 'medium',
        createdAt: sql`CURRENT_TIMESTAMP`,
        updatedAt: sql`CURRENT_TIMESTAMP`,
      })
      .returning()
      .all();

    return {
      id: row.id,
      title: row.title,
      description: row.description ?? undefined,
      status: row.status as Task['status'],
      priority: row.priority as Task['priority'],
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
  },

  async update(input: TaskUpdateInput) {
    const [row] = await db
      .update(tasks)
      .set({
        ...(input.status ? { status: input.status } : {}),
        ...(input.priority ? { priority: input.priority } : {}),
        updatedAt: sql`CURRENT_TIMESTAMP`,
      })
      .where(eq(tasks.id, input.id))
      .returning();

    return {
      id: row.id,
      title: row.title,
      description: row.description ?? undefined,
      status: row.status as Task['status'],
      priority: row.priority as Task['priority'],
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
  },

  async remove(id: string): Promise<void> {
    db.delete(tasks).where(eq(tasks.id, id)).run();
  },
};
