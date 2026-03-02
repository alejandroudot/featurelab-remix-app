import { and, asc, eq } from 'drizzle-orm';
import type { ProjectRepository } from '~/core/project/project.repository.port';
import type { Project } from '~/core/project/project.types';
import { db } from '~/infra/db/client.sqlite';
import { projects, tasks } from '~/infra/db/schema';

function mapProjectRow(row: any): Project {
  return {
    id: row.id,
    ownerUserId: row.ownerUserId,
    teamId: row.teamId ?? null,
    name: row.name,
    description: row.description ?? null,
    icon: row.icon ?? null,
    status: row.status === 'archived' ? 'archived' : 'active',
    imageUrl: row.imageUrl ?? null,
    createdAt: Number(row.createdAt),
    updatedAt: Number(row.updatedAt),
  };
}

export const sqliteProjectRepository: ProjectRepository = {
  async listByUser(userId: string): Promise<Project[]> {
    const rows = db.select().from(projects).where(eq(projects.ownerUserId, userId)).orderBy(asc(projects.createdAt)).all();
    return rows.map(mapProjectRow);
  },

  async getByIdForUser(input: { id: string; userId: string }): Promise<Project | null> {
    const [row] = db
      .select()
      .from(projects)
      .where(and(eq(projects.id, input.id), eq(projects.ownerUserId, input.userId)))
      .limit(1)
      .all();

    return row ? mapProjectRow(row) : null;
  },
  async create(input) {
    const now = Date.now();
    const [row] = db
      .insert(projects)
      .values({
        id: crypto.randomUUID(),
        ownerUserId: input.userId,
        teamId: null,
        name: input.name,
        description: null,
        icon: null,
        status: 'active',
        imageUrl: input.imageUrl,
        createdAt: now,
        updatedAt: now,
      })
      .returning()
      .all();

    return mapProjectRow(row);
  },

  async remove(input) {
    const [ownedProject] = db
      .select({ id: projects.id })
      .from(projects)
      .where(and(eq(projects.id, input.id), eq(projects.ownerUserId, input.userId)))
      .limit(1)
      .all();

    if (!ownedProject) return;

    db.update(tasks)
      .set({ projectId: null, updatedAt: new Date() })
      .where(and(eq(tasks.projectId, ownedProject.id), eq(tasks.userId, input.userId)))
      .run();

    db.delete(projects)
      .where(eq(projects.id, ownedProject.id))
      .run();
  },
};
