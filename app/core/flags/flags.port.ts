import type { FeatureFlag, Environment, FeatureFlagType } from './flags.types';

export type FlagCreateInput = {
  key: string;
  description?: string;
  type?: FeatureFlagType; // default "boolean"
  stateByEnvironment?: Partial<Record<Environment, { enabled: boolean; rolloutPercent: number | null }>>;
};

export interface FeatureFlagRepository {
  listAll(): Promise<FeatureFlag[]>;
  create(input: FlagCreateInput): Promise<FeatureFlag>;
  toggle(input: { id: string; environment: Environment }): Promise<FeatureFlag>;
  remove(id: string): Promise<void>;
  /**
   * Actualiza campos mutables de una flag existente.
   */
  update(input: {
    id: string;
    type?: FeatureFlagType;
    stateByEnvironment?: Partial<
      Record<Environment, { enabled?: boolean; rolloutPercent?: number | null }>
    >;
  }): Promise<FeatureFlag>;
  /**
   * Busca una flag por key, o null si no existe.
   */
  findByKey(key: string): Promise<FeatureFlag | null>;
}
