import type { FeatureFlag } from '~/core/flags/contracts/flags.types';

function toBoolean(value: unknown) {
  return value === true || value === 1 || value === '1' || value === 'true';
}

export function mapFlagRow(row: any): FeatureFlag {
  return {
    id: row.id,
    key: row.key,
    description: row.description ?? undefined,
    type: (row.type ?? 'boolean') as FeatureFlag['type'],
    stateByEnvironment: {
      development: {
        enabled: toBoolean(row.enabledDevelopment),
        rolloutPercent: row.rolloutPercentDevelopment ?? null,
      },
      production: {
        enabled: toBoolean(row.enabledProduction),
        rolloutPercent: row.rolloutPercentProduction ?? null,
      },
    },
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}
