import type { FeatureFlag } from "~/core/flags/flags.types";

export function mapFlagRow(row: any): FeatureFlag {
  const enabled =
    row.enabled === true ||
    row.enabled === 1 ||
    row.enabled === '1' ||
    row.enabled === 'true';

  return {
    id: row.id,
    key: row.key,
    description: row.description ?? undefined,
    environment: row.environment as FeatureFlag["environment"],
    type: (row.type ?? "boolean") as FeatureFlag["type"],
    enabled,
    rolloutPercent: row.rolloutPercent ?? null,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}
