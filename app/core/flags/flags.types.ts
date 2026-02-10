export type Environment = 'development' | 'production';

export type FeatureFlag = {
  id: string;
  key: string;
  description?: string;
  environment: Environment;
  enabled: boolean;
  createdAt: Date;
  updatedAt: Date;
};
