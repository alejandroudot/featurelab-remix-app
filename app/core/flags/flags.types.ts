export type Environment = 'development' | 'production';

export type FeatureFlagType = 'boolean' | 'percentage';

// Flags de producto (no por usuario), tipo ConfigCat.
export type FeatureFlag = {
  id: string;
  key: string;
  description?: string;
  environment: Environment;
  type: FeatureFlagType;
  enabled: boolean;
  /**
   * Para flags de tipo "percentage": porcentaje de usuarios
   * que ven la flag activa (0-100). Para "boolean" se ignora.
   */
  rolloutPercent?: number | null;
  createdAt: Date;
  updatedAt: Date;
};
