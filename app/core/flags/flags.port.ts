import type { FeatureFlag, Environment } from './flags.types';

export type FlagInput = {
  key: string;
  description?: string;
  environment: Environment;
};

export interface FeatureFlagRepository {
  listAll(): Promise<FeatureFlag[]>;
  create(input: FlagInput): Promise<FeatureFlag>;
  toggle(id: string): Promise<FeatureFlag>;
  remove(id: string): Promise<void>;

  isEnabled(key: string, environment: Environment): Promise<boolean>;
}
