// app/features/flags/FlagsList.tsx
import * as React from 'react';
import { Form, useSubmit } from 'react-router';
import type { Flag } from './types';
import { ActionsMenu, MenuItem } from '~/ui/menus/actions-menu';
import { DeleteDialog } from '~/ui/dialogs/delete-dialog';

export function FlagsList({ flags }: { flags: Flag[] }) {
  const submit = useSubmit();

  // Un solo modal para todo el listado
  const [deleteTarget, setDeleteTarget] = React.useState<{
    id: string;
    label: string;
  } | null>(null);

  function post(data: Record<string, string>) {
    const fd = new FormData();
    for (const [k, v] of Object.entries(data)) fd.append(k, v);
    submit(fd, { method: 'post' });
  }

  return (
    <section className="space-y-3">
      <h2 className="font-semibold">Listado</h2>

      <ul className="space-y-2">
        {flags.map((flag) => (
          <li key={flag.id} className="border rounded p-3 flex flex-col gap-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="font-medium">{flag.key}</div>
                {flag.description ? (
                  <div className="text-sm opacity-80">{flag.description}</div>
                ) : null}
                <div className="text-xs opacity-70 mt-1">
                  env: {flag.environment} · type: {flag.type} · enabled: {String(flag.enabled)}
                  {flag.type === 'percentage' && typeof flag.rolloutPercent === 'number'
                    ? ` · rollout: ${flag.rolloutPercent}%`
                    : null}
                </div>
              </div>

              <ActionsMenu>
                {({ close }) => (
                  <>
                    <MenuItem
                      onSelect={() => {
                        post({ intent: 'toggle', id: flag.id });
                        close();
                      }}
                    >
                      {flag.enabled ? 'Apagar' : 'Encender'}
                    </MenuItem>

                    <MenuItem
                      destructive
                      onSelect={(e) => {
                        e.preventDefault();
                        close();
                        setDeleteTarget({ id: flag.id, label: `"${flag.key}"` });
                      }}
                    >
                      Eliminar
                    </MenuItem>
                  </>
                )}
              </ActionsMenu>
            </div>

            {flag.type === 'percentage' ? (
              <Form method="post" className="flex items-center gap-2 text-xs">
                <input type="hidden" name="intent" value="update-rollout" />
                <input type="hidden" name="id" value={flag.id} />
                <label className="flex items-center gap-1">
                  <span className="opacity-70">Rollout %</span>
                  <input
                    name="rolloutPercent"
                    type="number"
                    min={0}
                    max={100}
                    defaultValue={flag.rolloutPercent ?? 0}
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
          </li>
        ))}
      </ul>

      {/* Modal global */}
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
