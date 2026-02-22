export type Environment = 'development' | 'production';

export type FeatureFlagType = 'boolean' | 'percentage';

// Flags de producto (no por usuario), tipo ConfigCat.
export type FeatureFlag = {
  id: string;
  key: string;
  description?: string;
  type: FeatureFlagType;
  stateByEnvironment: Record<Environment, { enabled: boolean; rolloutPercent: number | null }>;
  createdAt: Date;
  updatedAt: Date;
};
