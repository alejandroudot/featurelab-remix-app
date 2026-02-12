import type { FeatureFlag, Environment, FeatureFlagType } from './flags.types';

export type FlagCreateInput = {
  key: string;
  environment: Environment;
  description?: string;
  type?: FeatureFlagType; // default "boolean"
  rolloutPercent?: number | null;
};

export interface FeatureFlagRepository {
  listAll(): Promise<FeatureFlag[]>;
  create(input: FlagCreateInput): Promise<FeatureFlag>;
  toggle(id: string): Promise<FeatureFlag>;
  remove(id: string): Promise<void>;
  /**
   * Actualiza campos mutables de una flag existente.
   */
  update(input: {
    id: string;
    type?: FeatureFlagType;
    rolloutPercent?: number | null;
  }): Promise<FeatureFlag>;
  /**
   * Busca una flag por key+env, o null si no existe.
   */
  findByKeyAndEnvironment(input: { key: string; environment: Environment }): Promise<FeatureFlag | null>;
}
