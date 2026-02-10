// app/features/flags/FlagsList.tsx
import * as React from 'react';
import { useSubmit } from 'react-router';
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
          <li key={flag.id} className="border rounded p-3 flex items-start justify-between gap-3">
            <div>
              <div className="font-medium">{flag.key}</div>
              {flag.description ? (
                <div className="text-sm opacity-80">{flag.description}</div>
              ) : null}
              <div className="text-xs opacity-70 mt-1">
                env: {flag.environment} · enabled: {String(flag.enabled)}
              </div>
            </div>

            <ActionsMenu>
              {({ close }) => (
                <>
                  <MenuItem
                    onSelect={() => {
                      // toggle: dejá que cierre normal
                      post({ intent: 'toggle', id: flag.id });
                      close();
                    }}
                  >
                    {flag.enabled ? 'Apagar' : 'Encender'}
                  </MenuItem>

                  <MenuItem
                    destructive
                    onSelect={(e) => {
                      //clave: evitamos el cierre automático (que pisa el setState)
                      e.preventDefault();
                      close(); // cerramos nosotros
                      setDeleteTarget({ id: flag.id, label: `"${flag.key}"` });
                    }}
                  >
                    Eliminar
                  </MenuItem>
                </>
              )}
            </ActionsMenu>
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
