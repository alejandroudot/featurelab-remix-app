import { Form } from 'react-router';
import type { Task } from '~/core/tasks/tasks.types';
import { Badge } from '~/ui/primitives/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '~/ui/primitives/dialog';

type TaskDetailModalProps = {
  task: Task | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isSubmitting: boolean;
};

export function TaskDetailModal({ task, open, onOpenChange, isSubmitting }: TaskDetailModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="h-[80vh] w-full max-w-5xl p-0 sm:max-w-5xl">
        {task ? (
          <>
            <DialogHeader className="border-b p-4">
              <DialogTitle>{task.title}</DialogTitle>
              <DialogDescription>Detalle de task estilo Jira: contenido principal + panel lateral.</DialogDescription>
            </DialogHeader>

            <div className="grid h-[calc(80vh-96px)] gap-4 p-4 lg:grid-cols-[2fr_1fr]">
              <section className="space-y-4 overflow-y-auto pr-1">
                <div className="rounded border p-3">
                  <h3 className="mb-2 text-sm font-semibold">Descripcion</h3>
                  <p className="text-sm opacity-85">{task.description || 'Sin descripcion por ahora.'}</p>
                </div>

                <div className="rounded border p-3">
                  <h3 className="mb-2 text-sm font-semibold">Comentarios</h3>
                  <p className="text-sm opacity-75">Todavia no hay comentarios. Se integra en proximos bloques.</p>
                </div>
              </section>

              <aside className="space-y-3 overflow-y-auto rounded border p-3">
                <h3 className="text-sm font-semibold">Acciones rapidas</h3>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">{task.status}</Badge>
                  <Badge variant="secondary">{task.priority}</Badge>
                </div>

                <Form method="post" className="space-y-2">
                  <input type="hidden" name="intent" value="update" />
                  <input type="hidden" name="id" value={task.id} />

                  <label className="block text-xs font-medium" htmlFor="detail-status">
                    Status
                  </label>
                  <select
                    id="detail-status"
                    name="status"
                    defaultValue={task.status}
                    className="w-full rounded border px-2 py-1 text-sm"
                  >
                    <option value="todo">todo</option>
                    <option value="in-progress">in-progress</option>
                    <option value="qa">qa</option>
                    <option value="ready-to-go-live">ready-to-go-live</option>
                  </select>

                  <label className="block text-xs font-medium" htmlFor="detail-priority">
                    Priority
                  </label>
                  <select
                    id="detail-priority"
                    name="priority"
                    defaultValue={task.priority}
                    className="w-full rounded border px-2 py-1 text-sm"
                  >
                    <option value="low">low</option>
                    <option value="medium">medium</option>
                    <option value="high">high</option>
                    <option value="critical">critical</option>
                  </select>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full rounded border px-2 py-1 text-sm font-medium"
                  >
                    {isSubmitting ? 'Guardando...' : 'Guardar cambios'}
                  </button>
                </Form>
              </aside>
            </div>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
