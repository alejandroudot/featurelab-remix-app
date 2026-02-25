// app/infra/tasks/task.repository.sqlite.ts
import { and, desc, eq, inArray, or } from 'drizzle-orm';
import type {
  TaskActivityCommandService,
  TaskActivityQueryService,
  TaskCommentCommandService,
  TaskCommentQueryService,
  TaskCommandService,
  TaskCreateInput,
  TaskQueryService,
  TaskUpdateInput,
} from '../../core/tasks/tasks.port';
import type { Task, TaskActivity, TaskComment } from '../../core/tasks/tasks.types';
import { db } from '../db/client.sqlite';
import { taskActivities, taskComments, tasks, users } from '../db/schema';
import { mapTasksRow } from './tasks-mapper';

export const sqliteTaskQueryService: TaskQueryService = {
  async listAll(): Promise<Task[]> {
    const rows = db.select().from(tasks).orderBy(desc(tasks.createdAt)).all();
    return rows.map(mapTasksRow);
  },

  async listByUser(userId: string): Promise<Task[]> {
    const rows = db
      .select()
      .from(tasks)
      .where(or(eq(tasks.userId, userId), eq(tasks.assigneeId, userId)))
      .orderBy(desc(tasks.createdAt))
      .all();
    return rows.map(mapTasksRow);
  },

  async getByIdForUser(input: { id: string; userId: string }): Promise<Task | null> {
    const [row] = db
      .select()
      .from(tasks)
      .where(
        and(
          eq(tasks.id, input.id),
          or(eq(tasks.userId, input.userId), eq(tasks.assigneeId, input.userId)),
        ),
      )
      .limit(1)
      .all();

    return row ? mapTasksRow(row) : null;
  },
};

export const sqliteTaskCommandService: TaskCommandService = {
  async create(input: TaskCreateInput): Promise<Task> {
    const [row] = db
      .insert(tasks)
      .values({
        id: crypto.randomUUID(),
        userId: input.userId,
        title: input.title,
        description: input.description ?? null,
        labels: '[]',
        checklist: '[]',
        status: 'todo',
        priority: 'medium',
        orderIndex: Date.now(),
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning()
      .all();

    return mapTasksRow(row);
  },

  async update(input: TaskUpdateInput): Promise<Task> {
    const [row] = await db
      .update(tasks)
      .set({
        ...(input.labels !== undefined ? { labels: JSON.stringify(input.labels) } : {}),
        ...(input.checklist !== undefined ? { checklist: JSON.stringify(input.checklist) } : {}),
        ...(input.dueDate !== undefined ? { dueDate: input.dueDate } : {}),
        ...(input.status ? { status: input.status } : {}),
        ...(input.priority ? { priority: input.priority } : {}),
        ...(input.orderIndex !== undefined ? { orderIndex: input.orderIndex } : {}),
        ...(input.assigneeId !== undefined ? { assigneeId: input.assigneeId } : {}),
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(tasks.id, input.id),
          or(eq(tasks.userId, input.userId), eq(tasks.assigneeId, input.userId)),
        ),
      )
      .returning();

    if (!row) throw new Response('Task not found', { status: 404 });
    return mapTasksRow(row);
  },

  async reorderColumn(input: {
    userId: string;
    status: 'todo' | 'in-progress' | 'qa' | 'ready-to-go-live';
    orderedTaskIds: string[];
  }): Promise<void> {
    if (input.orderedTaskIds.length === 0) return;

    const now = new Date();
    input.orderedTaskIds.forEach((taskId, index) => {
      db.update(tasks)
        .set({
          status: input.status,
          orderIndex: index,
          updatedAt: now,
        })
        .where(
          and(
            eq(tasks.id, taskId),
            or(eq(tasks.userId, input.userId), eq(tasks.assigneeId, input.userId)),
          ),
        )
        .run();
    });
  },

  async remove(input: { id: string; userId: string }): Promise<void> {
    db.delete(tasks)
      .where(and(eq(tasks.id, input.id), eq(tasks.userId, input.userId)))
      .run();
  },
};

export const sqliteTaskActivityQueryService: TaskActivityQueryService = {
  async listByUser(userId: string): Promise<TaskActivity[]> {
    const visibleTaskRows = db
      .select({ id: tasks.id })
      .from(tasks)
      .where(or(eq(tasks.userId, userId), eq(tasks.assigneeId, userId)))
      .all();

    const visibleTaskIds = visibleTaskRows.map((row) => row.id);
    if (visibleTaskIds.length === 0) return [];

    const rows = db
      .select({
        id: taskActivities.id,
        taskId: taskActivities.taskId,
        actorUserId: taskActivities.actorUserId,
        actorEmail: users.email,
        action: taskActivities.action,
        metadata: taskActivities.metadata,
        createdAt: taskActivities.createdAt,
      })
      .from(taskActivities)
      .leftJoin(users, eq(taskActivities.actorUserId, users.id))
      .where(inArray(taskActivities.taskId, visibleTaskIds))
      .orderBy(desc(taskActivities.createdAt))
      .all();

    return rows.map((row) => ({
      id: row.id,
      taskId: row.taskId,
      actorUserId: row.actorUserId,
      actorEmail: row.actorEmail ?? null,
      action: row.action as TaskActivity['action'],
      metadata: row.metadata ? (JSON.parse(row.metadata) as TaskActivity['metadata']) : null,
      createdAt: row.createdAt,
    }));
  },
};

export const sqliteTaskActivityCommandService: TaskActivityCommandService = {
  async create(input): Promise<void> {
    db.insert(taskActivities)
      .values({
        id: crypto.randomUUID(),
        taskId: input.taskId,
        actorUserId: input.actorUserId,
        action: input.action,
        metadata: input.metadata ? JSON.stringify(input.metadata) : null,
        createdAt: new Date(),
      })
      .run();
  },
};

export const sqliteTaskCommentQueryService: TaskCommentQueryService = {
  async listByUser(userId: string): Promise<TaskComment[]> {
    const visibleTaskRows = db
      .select({ id: tasks.id })
      .from(tasks)
      .where(or(eq(tasks.userId, userId), eq(tasks.assigneeId, userId)))
      .all();

    const visibleTaskIds = visibleTaskRows.map((row) => row.id);
    if (visibleTaskIds.length === 0) return [];

    const rows = db
      .select({
        id: taskComments.id,
        taskId: taskComments.taskId,
        authorUserId: taskComments.authorUserId,
        authorEmail: users.email,
        body: taskComments.body,
        createdAt: taskComments.createdAt,
      })
      .from(taskComments)
      .leftJoin(users, eq(taskComments.authorUserId, users.id))
      .where(inArray(taskComments.taskId, visibleTaskIds))
      .orderBy(desc(taskComments.createdAt))
      .all();

    return rows.map((row) => ({
      id: row.id,
      taskId: row.taskId,
      authorUserId: row.authorUserId,
      authorEmail: row.authorEmail ?? null,
      body: row.body,
      createdAt: row.createdAt,
    }));
  },

  async getByIdForUser(input: { id: string; userId: string }): Promise<TaskComment | null> {
    const [row] = db
      .select({
        id: taskComments.id,
        taskId: taskComments.taskId,
        authorUserId: taskComments.authorUserId,
        authorEmail: users.email,
        body: taskComments.body,
        createdAt: taskComments.createdAt,
      })
      .from(taskComments)
      .leftJoin(users, eq(taskComments.authorUserId, users.id))
      .innerJoin(tasks, eq(taskComments.taskId, tasks.id))
      .where(
        and(
          eq(taskComments.id, input.id),
          or(eq(tasks.userId, input.userId), eq(tasks.assigneeId, input.userId)),
        ),
      )
      .limit(1)
      .all();

    if (!row) return null;

    return {
      id: row.id,
      taskId: row.taskId,
      authorUserId: row.authorUserId,
      authorEmail: row.authorEmail ?? null,
      body: row.body,
      createdAt: row.createdAt,
    };
  },
};

export const sqliteTaskCommentCommandService: TaskCommentCommandService = {
  async create(input): Promise<TaskComment> {
    const newId = crypto.randomUUID();
    db.insert(taskComments)
      .values({
        id: newId,
        taskId: input.taskId,
        authorUserId: input.authorUserId,
        body: input.body,
        createdAt: new Date(),
      })
      .run();

    const [row] = db
      .select({
        id: taskComments.id,
        taskId: taskComments.taskId,
        authorUserId: taskComments.authorUserId,
        authorEmail: users.email,
        body: taskComments.body,
        createdAt: taskComments.createdAt,
      })
      .from(taskComments)
      .leftJoin(users, eq(taskComments.authorUserId, users.id))
      .where(eq(taskComments.id, newId))
      .all();

    return {
      id: row.id,
      taskId: row.taskId,
      authorUserId: row.authorUserId,
      authorEmail: row.authorEmail ?? null,
      body: row.body,
      createdAt: row.createdAt,
    };
  },

  async update(input): Promise<TaskComment> {
    const [updated] = db
      .update(taskComments)
      .set({ body: input.body })
      .where(and(eq(taskComments.id, input.id), eq(taskComments.authorUserId, input.authorUserId)))
      .returning()
      .all();

    if (!updated) throw new Response('Comment not found', { status: 404 });

    const [row] = db
      .select({
        id: taskComments.id,
        taskId: taskComments.taskId,
        authorUserId: taskComments.authorUserId,
        authorEmail: users.email,
        body: taskComments.body,
        createdAt: taskComments.createdAt,
      })
      .from(taskComments)
      .leftJoin(users, eq(taskComments.authorUserId, users.id))
      .where(eq(taskComments.id, updated.id))
      .limit(1)
      .all();

    return {
      id: row.id,
      taskId: row.taskId,
      authorUserId: row.authorUserId,
      authorEmail: row.authorEmail ?? null,
      body: row.body,
      createdAt: row.createdAt,
    };
  },

  async remove(input): Promise<void> {
    db.delete(taskComments)
      .where(and(eq(taskComments.id, input.id), eq(taskComments.authorUserId, input.authorUserId)))
      .run();
  },
};
