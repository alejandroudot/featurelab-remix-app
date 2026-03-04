import { useState } from 'react';
import type { Flag } from './types';
import { DeleteDialog } from '~/ui/dialogs/delete-dialog';
import { ActionFeedbackText } from '~/ui/forms/feedback/action-feedback';
import { useDeleteFlagMutation, useToggleFlagMutation, useUpdateFlagStateMutation } from './client/mutation';

const ENVIRONMENTS = ['development', 'production'] as const;

type Env = (typeof ENVIRONMENTS)[number];

export function FlagsList({ flags }: { flags: Flag[] }) {
  const toggleMutation = useToggleFlagMutation();
  const updateStateMutation = useUpdateFlagStateMutation();
  const deleteMutation = useDeleteFlagMutation();
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    label: string;
  } | null>(null);
  const actionData = deleteMutation.data ?? updateStateMutation.data ?? toggleMutation.data;

  function handleToggle(input: { id: string; environment: Env }) {
    toggleMutation.mutate(input);
  }

  function handleUpdateRollout(input: { id: string; environment: Env; rolloutPercent: string }) {
    updateStateMutation.mutate(input);
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
                  onClick={() => setDeleteTarget({ id: flag.id, label: `\"${flag.key}\"` })}
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
                        disabled={toggleMutation.isPending}
                        className="border rounded px-3 py-1 text-xs font-medium"
                      >
                        {state.enabled ? 'Apagar' : 'Encender'}
                      </button>

                      <span className="text-xs opacity-80">enabled: {String(state.enabled)}</span>
                    </div>

                    {flag.type === 'percentage' ? (
                      <form
                        className="flex self items-center gap-2 text-xs"
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
                          disabled={updateStateMutation.isPending}
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
        id={deleteTarget?.id ?? ''}
        name={deleteTarget?.label ?? 'flag'}
        onConfirm={() => {
          if (!deleteTarget?.id) return;
          deleteMutation.mutate({ id: deleteTarget.id });
          setDeleteTarget(null);
        }}
      />
    </section>
  );
}
