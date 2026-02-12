import { desc, eq, and } from 'drizzle-orm';
import type { FeatureFlagRepository, FlagCreateInput } from '../../core/flags/flags.port';
import { DuplicateFeatureFlagError } from '~/core/flags/errors';
import type { FeatureFlag, Environment } from '../../core/flags/flags.types';
import { db } from '../db/client.sqlite';
import { featureFlags } from '../db/schema';
import { mapFlagRow } from './flags-mapper';
import { isSqliteUniqueConstraintError } from '../db/sqlite-error';

export const sqliteFlagRepository: FeatureFlagRepository = {
  async listAll(): Promise<FeatureFlag[]> {
    const rows = db
      .select()
      .from(featureFlags)
      .orderBy(desc(featureFlags.createdAt))
      .all();

    return rows.map(mapFlagRow);
  },

  async create(input: FlagCreateInput) {
    try {
      const id = crypto.randomUUID();

      const [row] = db
        .insert(featureFlags)
        .values({
          id,
          key: input.key,
          description: input.description ?? null,
          environment: input.environment,
          type: input.type ?? 'boolean',
          enabled: false,
          rolloutPercent: input.rolloutPercent ?? null,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning()
        .all();

      return mapFlagRow(row);
    } catch (err) {
      if (isSqliteUniqueConstraintError(err)) {
        throw new DuplicateFeatureFlagError(input.key, input.environment);
      }
      throw err;
    }
  },

  async toggle(id: string): Promise<FeatureFlag> {
    const existing = db
      .select()
      .from(featureFlags)
      .where(eq(featureFlags.id, id))
      .get();
    if (!existing) throw new Response('Flag not found', { status: 404 });

    const nextEnabled = !existing.enabled;

    const [row] = db
      .update(featureFlags)
      .set({
        enabled: nextEnabled,
        updatedAt: new Date(),
      })
      .where(eq(featureFlags.id, id))
      .returning()
      .all();

    return mapFlagRow(row);
  },

  async remove(id: string): Promise<void> {
    db.delete(featureFlags).where(eq(featureFlags.id, id)).run();
  },

  async update(input: {
    id: string;
    type?: 'boolean' | 'percentage';
    rolloutPercent?: number | null;
  }): Promise<FeatureFlag> {
    const [row] = db
      .update(featureFlags)
      .set({
        ...(input.type ? { type: input.type } : {}),
        ...(input.rolloutPercent !== undefined ? { rolloutPercent: input.rolloutPercent } : {}),
        updatedAt: new Date(),
      })
      .where(eq(featureFlags.id, input.id))
      .returning()
      .all();

    if (!row) {
      throw new Response('Flag not found', { status: 404 });
    }

    return mapFlagRow(row);
  },

  async findByKeyAndEnvironment(input: { key: string; environment: Environment }) {
    const row = db
      .select()
      	.from(featureFlags)
      .where(
        and(
          eq(featureFlags.key, input.key),
          eq(featureFlags.environment, input.environment),
        ),
      )
      .get();

    return row ? mapFlagRow(row) : null;
  },
};
