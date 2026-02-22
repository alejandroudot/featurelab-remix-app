import type { Environment, FeatureFlag } from '../contracts/flags.types';
import type { FeatureFlagRepository } from '../contracts/flags.port';
import { resolveFlagDecision } from './flags.resolution';

export type FlagResolutionInput = {
  key: string;
  environment: Environment;
  userId?: string | null;
  debugOverride?: boolean;
};

export type FlagResolutionReason =
  | 'debug-override'
  | 'flag-not-found'
  | 'boolean-enabled'
  | 'boolean-disabled'
  | 'percentage-disabled'
  | 'percentage-no-user'
  | 'percentage-zero'
  | 'percentage-full'
  | 'percentage-hit'
  | 'percentage-miss';

export type FlagResolution = {
  enabled: boolean;
  reason: FlagResolutionReason;
  bucket?: number;
  rolloutPercent?: number | null;
};

export interface FlagQueryService {
  listAll(): Promise<FeatureFlag[]>;
  isEnabled(input: FlagResolutionInput): Promise<boolean>;
  resolve(input: FlagResolutionInput): Promise<FlagResolution>;
}

export interface FlagCommandService {
  create: FeatureFlagRepository['create'];
  toggle: FeatureFlagRepository['toggle'];
  remove: FeatureFlagRepository['remove'];
  update: FeatureFlagRepository['update'];
}

export type FlagService = FlagQueryService & FlagCommandService;

export function createFlagService(repository: FeatureFlagRepository): FlagService {
  return {
    listAll() {
      return repository.listAll();
    },

    create(input) {
      return repository.create(input);
    },

    toggle(input) {
      return repository.toggle(input);
    },

    remove(id) {
      return repository.remove(id);
    },

    update(input) {
      return repository.update(input);
    },

    // Funcion clave del modulo: concentra la decision final de una flag en runtime.
		// Los consumer (loaders/actions/UI gates) deberian depender de este resultado
    // en lugar de leer estado crudo de DB para mantener un criterio unico.
    async resolve({ key, environment, userId, debugOverride }: FlagResolutionInput) {
      // Prioridad 1: override explicito para debugging local/manual.
      if (typeof debugOverride === 'boolean') {
        return { enabled: debugOverride, reason: 'debug-override' };
      }

      // Prioridad 2: resolver por key global y luego bajar al estado del environment activo.
      const flag = await repository.findByKey(key);
      if (!flag) return { enabled: false, reason: 'flag-not-found' };
      return resolveFlagDecision({ flag, environment, userId });
    },

    async isEnabled(input: FlagResolutionInput) {
      const result = await this.resolve(input);
      return result.enabled;
    },
  };
}
