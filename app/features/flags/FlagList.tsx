import * as React from 'react';
import { Form } from 'react-router';
import type { Flag } from './types';
import { DeleteDialog } from '~/ui/dialogs/delete-dialog';

const ENVIRONMENTS = ['development', 'production'] as const;

type Env = (typeof ENVIRONMENTS)[number];

export function FlagsList({ flags }: { flags: Flag[] }) {
  const [deleteTarget, setDeleteTarget] = React.useState<{
    id: string;
    label: string;
  } | null>(null);

  return (
    <section className="space-y-3">
      <h2 className="font-semibold">Listado</h2>

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
                      <Form method="post">
                        <input type="hidden" name="intent" value="toggle" />
                        <input type="hidden" name="id" value={flag.id} />
                        <input type="hidden" name="environment" value={environment} />
                        <button
                          type="submit"
                          className="border rounded px-3 py-1 text-xs font-medium"
                        >
                          {state.enabled ? 'Apagar' : 'Encender'}
                        </button>
                      </Form>

                      <span className="text-xs opacity-80">enabled: {String(state.enabled)}</span>
                    </div>

                    {flag.type === 'percentage' ? (
                      <Form method="post" className="flex self items-center gap-2 text-xs">
                        <input type="hidden" name="intent" value="update-state" />
                        <input type="hidden" name="id" value={flag.id} />
                        <input type="hidden" name="environment" value={environment} />
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
                          className="border rounded px-3 py-1 text-xs font-medium"
                        >
                          Guardar
                        </button>
                      </Form>
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
      />
    </section>
  );
}
