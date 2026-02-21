import { AlertDialog } from 'radix-ui';
import { useSubmit } from 'react-router';

type DeleteDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  id: string;
  name: string;
  onConfirm?: () => void;
  description?: string;
};

export function DeleteDialog({
  open,
  onOpenChange,
  id,
  name,
  onConfirm,
  description = 'Esta accion es permanente. Queres continuar?',
}: DeleteDialogProps) {
  const submit = useSubmit();

  return (
    <AlertDialog.Root open={open} onOpenChange={onOpenChange}>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 z-50 bg-black/50" />

        <AlertDialog.Content className="fixed left-1/2 top-1/2 z-50 w-[95vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg border bg-white p-4 shadow-lg dark:border-zinc-800 dark:bg-zinc-950">
          <AlertDialog.Title className="text-base font-semibold">Eliminar {name}</AlertDialog.Title>

          <AlertDialog.Description className="mt-2 text-sm opacity-80">
            {description}
          </AlertDialog.Description>

          <div className="mt-4 flex justify-end gap-2">
            <AlertDialog.Cancel asChild>
              <button type="button" className="rounded border px-3 py-2 text-sm dark:border-zinc-800">
                Cancelar
              </button>
            </AlertDialog.Cancel>

            <AlertDialog.Action asChild>
              <button
                type="button"
                className="rounded bg-red-600 px-3 py-2 text-sm text-white disabled:opacity-60"
                onClick={() => {
                  if (onConfirm) {
                    onConfirm();
                    onOpenChange(false);
                    return;
                  }

                  const fd = new FormData();
                  fd.append('intent', 'delete');
                  fd.append('id', id);
                  submit(fd, { method: 'post' });
                  onOpenChange(false);
                }}
              >
                Eliminar
              </button>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
