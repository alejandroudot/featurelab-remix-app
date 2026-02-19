import { DuplicateFeatureFlagError } from './errors';
import { PRODUCT_FLAG_CATALOG } from './flag-catalog';
import type { FlagService } from './flags.service';

export async function ensureProductFlagsSeeded(flagService: FlagService) {
  const existing = await flagService.listAll();
  const existingSet = new Set(existing.map((flag) => flag.key));

  for (const item of PRODUCT_FLAG_CATALOG) {
    if (existingSet.has(item.key)) continue;

    try {
      await flagService.create({
        key: item.key,
        description: item.description,
        type: item.type,
        stateByEnvironment: {
          development: {
            enabled: item.defaultsByEnvironment.development,
            rolloutPercent: item.rolloutPercent,
          },
          production: {
            enabled: item.defaultsByEnvironment.production,
            rolloutPercent: item.rolloutPercent,
          },
        },
      });
    } catch (error) {
      // Idempotencia defensiva ante carrera entre requests paralelos.
      if (!(error instanceof DuplicateFeatureFlagError)) {
        throw error;
      }
    }
  }
}
