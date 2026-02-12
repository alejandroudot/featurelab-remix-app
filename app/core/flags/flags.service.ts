import type { Environment, FeatureFlag } from './flags.types';
import type { FeatureFlagRepository } from './flags.port';

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

export interface FlagService {
  listAll(): Promise<FeatureFlag[]>;
  create: FeatureFlagRepository['create'];
  toggle: FeatureFlagRepository['toggle'];
  remove: FeatureFlagRepository['remove'];
  update: FeatureFlagRepository['update'];
  isEnabled(input: FlagResolutionInput): Promise<boolean>;
  resolve(input: FlagResolutionInput): Promise<FlagResolution>;
}

function hashStringToInt(input: string): number {
  // Hash simple y deterministico para bucketing (no criptografico).
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const chr = input.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0; // convierte a int32
  }
  return Math.abs(hash);
}

export function createFlagService(repository: FeatureFlagRepository): FlagService {
  return {
    listAll() {
      return repository.listAll();
    },

    create(input) {
      return repository.create(input);
    },

    toggle(id) {
      return repository.toggle(id);
    },

    remove(id) {
      return repository.remove(id);
    },

    update(input) {
      return repository.update(input);
    },

    async resolve({ key, environment, userId, debugOverride }: FlagResolutionInput) {
      if (typeof debugOverride === 'boolean') {
        return { enabled: debugOverride, reason: 'debug-override' };
      }

      const flag = await repository.findByKeyAndEnvironment({ key, environment });
      if (!flag) return { enabled: false, reason: 'flag-not-found' };

      if (flag.type === 'boolean') {
        return {
          enabled: flag.enabled,
          reason: flag.enabled ? 'boolean-enabled' : 'boolean-disabled',
        };
      }

      const bucket = userId ? hashStringToInt(`${userId}:${key}`) % 100 : undefined;

      if (!flag.enabled) {
        return {
          enabled: false,
          reason: 'percentage-disabled',
          bucket,
          rolloutPercent: flag.rolloutPercent ?? 0,
        };
      }

      const percent = flag.rolloutPercent ?? 0;
      if (percent <= 0) {
        return {
          enabled: false,
          reason: 'percentage-zero',
          bucket,
          rolloutPercent: percent,
        };
      }
      if (percent >= 100) {
        return {
          enabled: true,
          reason: 'percentage-full',
          bucket,
          rolloutPercent: 100,
        };
      }
      if (!userId) {
        return { enabled: false, reason: 'percentage-no-user', rolloutPercent: percent };
      }

      const stableBucket = bucket ?? 0;
      return {
        enabled: stableBucket < percent,
        reason: stableBucket < percent ? 'percentage-hit' : 'percentage-miss',
        bucket: stableBucket,
        rolloutPercent: percent,
      };
    },

    async isEnabled(input: FlagResolutionInput) {
      const result = await this.resolve(input);
      return result.enabled;
    },
  };
}
