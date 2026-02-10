import type { FeatureFlag, Environment } from './flags.types';

export type FlagInput = {
  userId: string;
  key: string;
  environment: string;
  description?: string;
};

export interface FeatureFlagRepository {
  listAll(userId: string): Promise<FeatureFlag[]>;
  create(input: FlagInput): Promise<FeatureFlag>;
  toggle(id: string): Promise<FeatureFlag>;
  remove(id: string): Promise<void>;
  isEnabled(input: { userId: string; key: string; environment: Environment }): Promise<boolean>;
}
