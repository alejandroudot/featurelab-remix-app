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
   // Todo consumer (loaders/actions/UI gates) deberia depender de este resultado
    // en lugar de leer estado crudo de DB para mantener un criterio unico.
    async resolve({ key, environment, userId, debugOverride }: FlagResolutionInput) {
      // Prioridad 1: override explicito para debugging local/manual.
      if (typeof debugOverride === 'boolean') {
        return { enabled: debugOverride, reason: 'debug-override' };
      }

      // Prioridad 2: resolver por key global y luego bajar al estado del environment activo.
      const flag = await repository.findByKey(key);
      if (!flag) return { enabled: false, reason: 'flag-not-found' };
      const state = flag.stateByEnvironment[environment];

      // Flags booleanas: resultado directo del estado por environment.
      if (flag.type === 'boolean') {
        return {
          enabled: state.enabled,
          reason: state.enabled ? 'boolean-enabled' : 'boolean-disabled',
        };
      }

    // Flags percentage:
    // Cada usuario recibe un numero "fijo" entre 0 y 99 para ESTA flag.
    // Ese numero sale de userId + key, por eso para el mismo usuario/flag
    // siempre da el mismo resultado aunque se recalcule en cada request.
    const bucket = userId ? hashStringToInt(`${userId}:${key}`) % 100 : undefined;

      if (!state.enabled) {
        return {
          enabled: false,
          reason: 'percentage-disabled',
          bucket,
          rolloutPercent: state.rolloutPercent ?? 0,
        };
      }

    // rolloutPercent define cuantos buckets entran.
    // Ejemplo: 25 => entran buckets 0..24.
    // No promete exactitud perfecta en muestras chicas, pero si un reparto estable.
    const percent = state.rolloutPercent ?? 0;
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

    // Regla final:
    // si el bucket del usuario cae dentro del rango habilitado, entra a la feature.
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
