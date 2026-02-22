import { redirect } from 'react-router';
import type { FlagActionResult, RunFlagActionInput } from '../types';
import {
  flagCreateSchema,
  flagDeleteSchema,
  flagIntentSchema,
  flagToggleSchema,
  flagUpdateStateSchema,
} from '~/core/flags/contracts/flags.schema';
import { jsonFlagsError, toFlagFormError, validationToActionData } from './errors';
import { DuplicateFeatureFlagError } from '~/core/flags/contracts/errors';
import { getCreateFlagFormValues, parseIntent } from './utils';

type Intent = (typeof flagIntentSchema)['enum'][keyof (typeof flagIntentSchema)['enum']];
type FlagIntentHandler = (input: RunFlagActionInput) => Promise<FlagActionResult>;

// Handler de creacion: valida datos de alta y crea la flag en ambos entornos.
const handleCreate: FlagIntentHandler = async (input) => {
  const { formData, flagCommandService } = input;
  const parsedCreate = flagCreateSchema.safeParse({
    key: formData.get('key'),
    description: formData.get('description'),
    type: formData.get('type'),
    rolloutPercent: formData.get('rolloutPercent'),
  });

  if (!parsedCreate.success) return validationToActionData(parsedCreate.error, formData);

  try {
    await flagCommandService.create({
      key: parsedCreate.data.key,
      description: parsedCreate.data.description,
      type: parsedCreate.data.type,
      stateByEnvironment: {
        development: {
          enabled: false,
          rolloutPercent: parsedCreate.data.rolloutPercent,
        },
        production: {
          enabled: false,
          rolloutPercent: parsedCreate.data.rolloutPercent,
        },
      },
    });
    return redirect('/flags');
  } catch (err) {
    if (err instanceof DuplicateFeatureFlagError) {
      return jsonFlagsError(
        {
          formError: 'Ya existe una flag con esa key.',
          values: getCreateFlagFormValues(formData),
        },
        409,
      );
    }

    return jsonFlagsError(
      {
        formError: toFlagFormError(err),
        values: getCreateFlagFormValues(formData),
      },
      500,
    );
  }
};

// Handler de toggle: prende/apaga la flag en un entorno puntual.
const handleToggle: FlagIntentHandler = async (input) => {
  const { formData, flagCommandService } = input;
  const parsedToggle = flagToggleSchema.safeParse({
    id: formData.get('id'),
    environment: formData.get('environment'),
  });

  if (!parsedToggle.success) return validationToActionData(parsedToggle.error, formData);

  try {
    await flagCommandService.toggle({
      id: parsedToggle.data.id,
      environment: parsedToggle.data.environment,
    });
    return redirect('/flags');
  } catch (err) {
    return jsonFlagsError(
      {
        formError: toFlagFormError(err),
        values: getCreateFlagFormValues(formData),
      },
      500,
    );
  }
};

// Handler de update-state: actualiza rolloutPercent por entorno.
const handleUpdateState: FlagIntentHandler = async (input) => {
  const { formData, flagCommandService } = input;
  const parsedState = flagUpdateStateSchema.safeParse({
    id: formData.get('id'),
    environment: formData.get('environment'),
    rolloutPercent: formData.get('rolloutPercent'),
  });

  if (!parsedState.success) return validationToActionData(parsedState.error, formData);

  try {
    await flagCommandService.update({
      id: parsedState.data.id,
      stateByEnvironment: {
        [parsedState.data.environment]: {
          rolloutPercent: parsedState.data.rolloutPercent ?? null,
        },
      },
    });
    return redirect('/flags');
  } catch (err) {
    return jsonFlagsError(
      {
        formError: toFlagFormError(err),
        values: getCreateFlagFormValues(formData),
      },
      500,
    );
  }
};

// Handler de delete: valida id y elimina la flag.
const handleDelete: FlagIntentHandler = async (input) => {
  const { formData, flagCommandService } = input;
  const parsedDelete = flagDeleteSchema.safeParse({
    id: formData.get('id'),
  });

  if (!parsedDelete.success) return validationToActionData(parsedDelete.error, formData);

  try {
    await flagCommandService.remove(parsedDelete.data.id);
    return redirect('/flags');
  } catch (err) {
    return jsonFlagsError(
      {
        formError: toFlagFormError(err),
        values: getCreateFlagFormValues(formData),
      },
      500,
    );
  }
};

// Tabla de dispatch por intent para mantener la action extensible.
const intentHandlers: Record<Intent, FlagIntentHandler> = {
  create: handleCreate,
  toggle: handleToggle,
  'update-state': handleUpdateState,
  delete: handleDelete,
};

// Orquestador principal: parsea intent y delega al handler correspondiente.
export async function runFlagAction(input: RunFlagActionInput): Promise<FlagActionResult> {
  const intentResult = parseIntent(input.formData);

  if (typeof intentResult !== 'string') {
    return intentResult;
  }

  const handler = intentHandlers[intentResult as Intent];
  return handler(input);
}
