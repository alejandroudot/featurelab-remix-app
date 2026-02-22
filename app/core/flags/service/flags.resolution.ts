import type { Environment, FeatureFlag } from '../contracts/flags.types';
import type { FlagResolution } from './flags.service';
import { hashStringToInt } from './flags.hash';

function resolveBooleanFlag(enabled: boolean): FlagResolution {
  return {
    enabled,
    reason: enabled ? 'boolean-enabled' : 'boolean-disabled',
  };
}

function resolvePercentageFlag(input: {
  key: string;
  userId?: string | null;
  state: { enabled: boolean; rolloutPercent: number | null };
}): FlagResolution {
  const { key, userId, state } = input;
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
}

export function resolveFlagDecision(input: {
  flag: FeatureFlag;
  environment: Environment;
  userId?: string | null;
}): FlagResolution {
  const { flag, environment, userId } = input;
  const state = flag.stateByEnvironment[environment];

  if (flag.type === 'boolean') {
    return resolveBooleanFlag(state.enabled);
  }

  // Flags percentage:
  // Cada usuario recibe un numero "fijo" entre 0 y 99 para ESTA flag.
  // Ese numero sale de userId + key, por eso para el mismo usuario/flag
  // siempre da el mismo resultado aunque se recalcule en cada request.
  return resolvePercentageFlag({
    key: flag.key,
    userId,
    state,
  });
}
