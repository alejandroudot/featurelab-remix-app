import type { FlagActionResult, RunFlagActionInput } from '~/features/flags/types';
import { parseIntent } from './utils';
import { handleCreate } from './action/handlers/create';
import { handleToggle } from './action/handlers/toggle';
import { handleUpdateState } from './action/handlers/update-state';
import { handleDelete } from './action/handlers/delete';
import type { FlagIntentHandler, Intent } from './action/types';

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
