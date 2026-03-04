import { useState } from 'react';
import type { Flag } from './types';
import { DeleteDialog } from '~/ui/dialogs/delete-dialog';
import { ActionFeedbackText } from '~/ui/forms/feedback/action-feedback';
import {
  useDeleteFlagMutation,
  useToggleFlagMutation,
  useUpdateFlagStateMutation,
} from './client/mutation';

const ENVIRONMENTS = ['development', 'production'] as const;

type Env = (typeof ENVIRONMENTS)[number];

export function FlagsList({ flags }: { flags: Flag[] }) {
  const {
    data: toggleActionData,
    isPending: isTogglePending,
    mutate: toggleFlag,
  } = useToggleFlagMutation();
  const {
    data: updateActionData,
    isPending: isUpdatePending,
    mutate: updateFlagState,
  } = useUpdateFlagStateMutation();
  const { data: deleteActionData, mutate: deleteFlag } = useDeleteFlagMutation();
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    label: string;
  } | null>(null);
  const actionData = deleteActionData ?? updateActionData ?? toggleActionData;

  function handleToggle(input: { id: string; environment: Env }) {
    toggleFlag(input);
  }

  function handleUpdateRollout(input: { id: string; environment: Env; rolloutPercent: string }) {
    updateFlagState(input);
  }

  return (
    <section className="space-y-3">
      <h2 className="font-semibold">Listado</h2>
      <ActionFeedbackText actionData={actionData} showFormError />

      <ul className="space-y-2">
        {flags.map((flag) => (
          <li key={flag.id} className="border rounded p-3 flex flex-col gap-3">
            <div className="flex justify-between align-bottom">
              <div>
                <div className="font-medium">{flag.key}</div>
                {flag.description ? (
                  <div className="text-sm opacity-80">{flag.description}</div>
                ) : null}
                <div className="text-xs opacity-70 mt-1">type: {flag.type}</div>
              </div>

              <div>
                <button
                  type="button"
                  onClick={() => setDeleteTarget({ id: flag.id, label: `"${flag.key}"` })}
                  className="border rounded px-3 py-1 text-xs font-medium text-red-600"
                >
                  Eliminar
                </button>
              </div>
            </div>
            <div className="grid gap-2 md:grid-cols-2">
              {ENVIRONMENTS.map((environment) => {
                const state = flag.stateByEnvironment[environment as Env];

                return (
                  <div key={`${flag.id}-${environment}`} className="rounded border p-2 space-y-2">
                    <div className="text-xs font-medium uppercase tracking-wide opacity-80">
                      {environment}
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleToggle({ id: flag.id, environment })}
                        disabled={isTogglePending}
                        className="border rounded px-3 py-1 text-xs font-medium"
                      >
                        {state.enabled ? 'Apagar' : 'Encender'}
                      </button>

                      <span className="text-xs opacity-80">enabled: {String(state.enabled)}</span>
                    </div>

                    {flag.type === 'percentage' ? (
                      <form
                        className="flex items-center gap-2 text-xs"
                        onSubmit={(event) => {
                          event.preventDefault();
                          const formData = new FormData(event.currentTarget);
                          const rolloutPercent = String(formData.get('rolloutPercent') ?? '');
                          handleUpdateRollout({
                            id: flag.id,
                            environment,
                            rolloutPercent,
                          });
                        }}
                      >
                        <label className="flex items-center gap-1">
                          <span className="opacity-70">Rollout %</span>
                          <input
                            name="rolloutPercent"
                            type="number"
                            min={0}
                            max={100}
                            defaultValue={state.rolloutPercent ?? 0}
                            className="border rounded px-2 py-1 w-20 text-right"
                          />
                        </label>
                        <button
                          type="submit"
                          disabled={isUpdatePending}
                          className="border rounded px-3 py-1 text-xs font-medium"
                        >
                          Guardar
                        </button>
                      </form>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </li>
        ))}
      </ul>

      <DeleteDialog
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        name={deleteTarget?.label ?? 'flag'}
        onConfirm={() => {
          if (!deleteTarget?.id) return;
          deleteFlag({ id: deleteTarget.id });
          setDeleteTarget(null);
        }}
      />
    </section>
  );
}
