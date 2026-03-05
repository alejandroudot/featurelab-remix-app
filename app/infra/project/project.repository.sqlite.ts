import { and, asc, eq, inArray, max, sql } from 'drizzle-orm';
import type { ProjectRepository } from '~/core/project/project.repository.port';
import type { Project } from '~/core/project/project.types';
import { db } from '~/infra/db/client.sqlite';
import { projectMembers, projects, tasks } from '~/infra/db/schema';

function mapProjectRow(row: any): Project {
  return {
    id: row.id,
    ownerUserId: row.ownerUserId,
    teamId: row.teamId ?? null,
    name: row.name,
    description: row.description ?? null,
    icon: row.icon ?? null,
    status: row.status === 'archived' ? 'archived' : 'active',
    pinned: Boolean(row.pinned ?? false),
    sidebarOrder: Number(row.sidebarOrder ?? 0),
    imageUrl: row.imageUrl ?? null,
    createdAt: Number(row.createdAt),
    updatedAt: Number(row.updatedAt),
  };
}

export const sqliteProjectRepository: ProjectRepository = {
  async listByUser(userId: string): Promise<Project[]> {
    const ownedRows = db
      .select({
        id: projects.id,
        createdAt: projects.createdAt,
      })
      .from(projects)
      .where(eq(projects.ownerUserId, userId))
      .orderBy(asc(projects.createdAt))
      .all();
    const memberships = db
      .select({ projectId: projectMembers.projectId })
      .from(projectMembers)
      .where(eq(projectMembers.userId, userId))
      .all();
    const membershipIds = new Set(memberships.map((row) => row.projectId));
    const now = Date.now();

    ownedRows.forEach((row, index) => {
      if (membershipIds.has(row.id)) return;
      db.insert(projectMembers)
        .values({
          id: crypto.randomUUID(),
          projectId: row.id,
          userId,
          role: 'full',
          sidebarOrder: index,
          pinned: false,
          createdAt: now,
          updatedAt: now,
        })
        .run();
    });

    const rows = db
      .select({
        id: projects.id,
        ownerUserId: projects.ownerUserId,
        teamId: projects.teamId,
        name: projects.name,
        description: projects.description,
        icon: projects.icon,
        status: projects.status,
        pinned: projectMembers.pinned,
        sidebarOrder: projectMembers.sidebarOrder,
        imageUrl: projects.imageUrl,
        createdAt: projects.createdAt,
        updatedAt: projects.updatedAt,
      })
      .from(projectMembers)
      .innerJoin(projects, eq(projects.id, projectMembers.projectId))
      .where(eq(projectMembers.userId, userId))
      .orderBy(
        sql`${projectMembers.pinned} DESC`,
        asc(projectMembers.sidebarOrder),
        asc(projects.createdAt),
      )
      .all();
    return rows.map(mapProjectRow);
  },

  async getByIdForUser(input: { id: string; userId: string }): Promise<Project | null> {
    const [row] = db
      .select({
        id: projects.id,
        ownerUserId: projects.ownerUserId,
        teamId: projects.teamId,
        name: projects.name,
        description: projects.description,
        icon: projects.icon,
        status: projects.status,
        pinned: projectMembers.pinned,
        sidebarOrder: projectMembers.sidebarOrder,
        imageUrl: projects.imageUrl,
        createdAt: projects.createdAt,
        updatedAt: projects.updatedAt,
      })
      .from(projectMembers)
      .innerJoin(projects, eq(projects.id, projectMembers.projectId))
      .where(and(eq(projects.id, input.id), eq(projectMembers.userId, input.userId)))
      .limit(1)
      .all();

    return row ? mapProjectRow(row) : null;
  },
  async create(input) {
    const now = Date.now();
    const [orderRow] = db
      .select({ maxOrder: max(projectMembers.sidebarOrder) })
      .from(projectMembers)
      .where(eq(projectMembers.userId, input.userId))
      .all();
    const nextOrder = (orderRow?.maxOrder ?? -1) + 1;

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

    db.insert(projectMembers)
      .values({
        id: crypto.randomUUID(),
        projectId: row.id,
        userId: input.userId,
        role: 'full',
        sidebarOrder: nextOrder,
        pinned: false,
        createdAt: now,
        updatedAt: now,
      })
      .run();

    return mapProjectRow({
      ...row,
      pinned: false,
      sidebarOrder: nextOrder,
    });
  },

  async update(input) {
    const [ownedProject] = db
      .select({ id: projects.id })
      .from(projects)
      .where(and(eq(projects.id, input.id), eq(projects.ownerUserId, input.userId)))
      .limit(1)
      .all();

    if (!ownedProject) return null;

    const [updated] = db
      .update(projects)
      .set({
        ...(input.name !== undefined ? { name: input.name } : {}),
        ...(input.description !== undefined ? { description: input.description } : {}),
        ...(input.imageUrl !== undefined ? { imageUrl: input.imageUrl } : {}),
        updatedAt: Date.now(),
      })
      .where(eq(projects.id, input.id))
      .returning()
      .all();

    const [member] = db
      .select({
        pinned: projectMembers.pinned,
        sidebarOrder: projectMembers.sidebarOrder,
      })
      .from(projectMembers)
      .where(and(eq(projectMembers.projectId, input.id), eq(projectMembers.userId, input.userId)))
      .limit(1)
      .all();

    return mapProjectRow({
      ...updated,
      pinned: member?.pinned ?? false,
      sidebarOrder: member?.sidebarOrder ?? 0,
    });
  },

  async setPinned(input) {
    const now = Date.now();
    const [membership] = db
      .select({ id: projectMembers.id })
      .from(projectMembers)
      .where(and(eq(projectMembers.projectId, input.id), eq(projectMembers.userId, input.userId)))
      .limit(1)
      .all();

    if (!membership) return;
    const [maxOrderRow] = db
      .select({ maxOrder: max(projectMembers.sidebarOrder) })
      .from(projectMembers)
      .where(and(eq(projectMembers.userId, input.userId), eq(projectMembers.pinned, input.pinned)))
      .all();
    const nextOrder = (maxOrderRow?.maxOrder ?? -1) + 1;

    db.update(projectMembers)
      .set({
        pinned: input.pinned,
        sidebarOrder: nextOrder,
        updatedAt: now,
      })
      .where(eq(projectMembers.id, membership.id))
      .run();
  },

  async reorderSidebar(input) {
    if (input.orderedProjectIds.length === 0) return;

    const now = Date.now();
    const memberships = db
      .select({ projectId: projectMembers.projectId })
      .from(projectMembers)
      .where(
        and(
          eq(projectMembers.userId, input.userId),
          inArray(projectMembers.projectId, input.orderedProjectIds),
        ),
      )
      .all();
    const allowedIds = new Set(memberships.map((row) => row.projectId));

    input.orderedProjectIds.forEach((projectId, index) => {
      if (!allowedIds.has(projectId)) return;
      db.update(projectMembers)
        .set({
          sidebarOrder: index,
          updatedAt: now,
        })
        .where(and(eq(projectMembers.userId, input.userId), eq(projectMembers.projectId, projectId)))
        .run();
    });
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
