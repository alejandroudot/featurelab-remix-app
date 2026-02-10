import { desc, eq, sql, and } from 'drizzle-orm';
import type { FeatureFlagRepository } from '../../core/flags/flags.port';
import { DuplicateFeatureFlagError } from '~/core/flags/errors';
import type { FeatureFlag } from '../../core/flags/flags.types';
import { db } from '../db/client.sqlite';
import { featureFlags } from '../db/schema';

// Mejor-effort: según driver, puede venir `code`, `errno`, o mensaje.
function isSqliteUniqueConstraintError(err: unknown) {
  if (!err || typeof err !== 'object') return false;

  const anyErr = err as any;
  // better-sqlite3 suele exponer code: 'SQLITE_CONSTRAINT_UNIQUE'
  if (anyErr.code === 'SQLITE_CONSTRAINT_UNIQUE') return true;

  // fallback por mensaje
  const msg = String(anyErr.message ?? '');
  return msg.includes('UNIQUE constraint failed');
}

export const sqliteFlagRepository: FeatureFlagRepository = {
  async listAll(): Promise<FeatureFlag[]> {
    const rows = db.select().from(featureFlags).orderBy(desc(featureFlags.createdAt)).all();

    return rows.map((row) => ({
      id: row.id,
      key: row.key,
      description: row.description ?? undefined,
      environment: row.environment as FeatureFlag['environment'],
      enabled: row.enabled,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    }));
  },

  async create(input: { key: string; environment: string; description?: string }) {
    try {
      const id = crypto.randomUUID();

      const [row] = db
        .insert(featureFlags)
        .values({
          id,
          key: input.key,
          description: input.description ?? null,
          environment: input.environment,
          enabled: false,
          createdAt: sql`CURRENT_TIMESTAMP`,
          updatedAt: sql`CURRENT_TIMESTAMP`,
        })
        .returning()
        .all();

      return {
        id: row.id,
        key: row.key,
        description: row.description ?? undefined,
        environment: row.environment as FeatureFlag['environment'],
        enabled: row.enabled,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
      };
    } catch (err) {
      if (isSqliteUniqueConstraintError(err)) {
        throw new DuplicateFeatureFlagError(input.key, input.environment);
      }
      throw err;
    }
  },

  async toggle(id: string): Promise<FeatureFlag> {
    const existing = db.select().from(featureFlags).where(eq(featureFlags.id, id)).get();
    if (!existing) throw new Response('Flag not found', { status: 404 });

    const nextEnabled = !existing.enabled;

    const [row] = db
      .update(featureFlags)
      .set({
        enabled: nextEnabled,
        updatedAt: sql`CURRENT_TIMESTAMP`,
      })
      .where(eq(featureFlags.id, id))
      .returning()
      .all();

    return {
      id: row.id,
      key: row.key,
      description: row.description ?? undefined,
      environment: row.environment as FeatureFlag['environment'],
      enabled: row.enabled,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
  },

  async remove(id: string): Promise<void> {
    db.delete(featureFlags).where(eq(featureFlags.id, id)).run();
  },

  async isEnabled(key: string, environment: 'development' | 'production') {
    const row = db
      .select({ enabled: featureFlags.enabled })
      .from(featureFlags)
      .where(and(eq(featureFlags.key, key), eq(featureFlags.environment, environment)))
      .get();

    return row?.enabled ?? false;
  },
};
