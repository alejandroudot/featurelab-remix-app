import { desc, eq } from 'drizzle-orm';
import type { FeatureFlagRepository, FlagCreateInput } from '../../core/flags/contracts/flags.port';
import { DuplicateFeatureFlagError } from '~/core/flags/contracts/errors';
import type { FeatureFlag, Environment } from '../../core/flags/contracts/flags.types';
import { db } from '../db/client.sqlite';
import { featureFlags } from '../db/schema';
import { mapFlagRow } from './flags-mapper';
import { isSqliteUniqueConstraintError } from '../db/sqlite-error';

export const sqliteFlagRepository: FeatureFlagRepository = {
  async listAll(): Promise<FeatureFlag[]> {
    const rows = db.select().from(featureFlags).orderBy(desc(featureFlags.createdAt)).all();
    return rows.map(mapFlagRow);
  },

  async create(input: FlagCreateInput) {
    try {
      const id = crypto.randomUUID();
      const dev = input.stateByEnvironment?.development;
      const prod = input.stateByEnvironment?.production;

      const [row] = db
        .insert(featureFlags)
        .values({
          id,
          key: input.key,
          description: input.description ?? null,
          type: input.type ?? 'boolean',
          enabledDevelopment: dev?.enabled ?? false,
          enabledProduction: prod?.enabled ?? false,
          rolloutPercentDevelopment: dev?.rolloutPercent ?? null,
          rolloutPercentProduction: prod?.rolloutPercent ?? null,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning()
        .all();

      return mapFlagRow(row);
    } catch (err) {
      if (isSqliteUniqueConstraintError(err)) {
        throw new DuplicateFeatureFlagError(input.key);
      }
      throw err;
    }
  },

  async toggle(input: { id: string; environment: Environment }): Promise<FeatureFlag> {
    const existing = db.select().from(featureFlags).where(eq(featureFlags.id, input.id)).get();
    if (!existing) throw new Response('Flag not found', { status: 404 });

    const nextEnabled =
      input.environment === 'development' ? !existing.enabledDevelopment : !existing.enabledProduction;

    const [row] = db
      .update(featureFlags)
      .set({
        ...(input.environment === 'development'
          ? { enabledDevelopment: nextEnabled }
          : { enabledProduction: nextEnabled }),
        updatedAt: new Date(),
      })
      .where(eq(featureFlags.id, input.id))
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
    stateByEnvironment?: Partial<Record<Environment, { enabled?: boolean; rolloutPercent?: number | null }>>;
  }): Promise<FeatureFlag> {
    const dev = input.stateByEnvironment?.development;
    const prod = input.stateByEnvironment?.production;

    const [row] = db
      .update(featureFlags)
      .set({
        ...(input.type ? { type: input.type } : {}),
        ...(dev?.enabled !== undefined ? { enabledDevelopment: dev.enabled } : {}),
        ...(dev?.rolloutPercent !== undefined
          ? { rolloutPercentDevelopment: dev.rolloutPercent }
          : {}),
        ...(prod?.enabled !== undefined ? { enabledProduction: prod.enabled } : {}),
        ...(prod?.rolloutPercent !== undefined
          ? { rolloutPercentProduction: prod.rolloutPercent }
          : {}),
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

  async findByKey(key: string) {
    const row = db.select().from(featureFlags).where(eq(featureFlags.key, key)).get();
    return row ? mapFlagRow(row) : null;
  },
};
