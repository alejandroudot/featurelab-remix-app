import { Form } from 'react-router';
import { Button } from '~/ui/primitives/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/ui/primitives/dialog';

export function HomeCreateTaskDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default">Crear task</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nueva task</DialogTitle>
          <DialogDescription>
            Crea una task rapida desde el Hub. Si queres el flujo completo, usa el fallback al
            formulario de Tasks.
          </DialogDescription>
        </DialogHeader>

        <Form method="post" action="/tasks" className="space-y-3">
          <input type="hidden" name="intent" value="create" />
          <input type="hidden" name="redirectTo" value="/" />

          <div className="flex flex-col gap-1">
            <label htmlFor="hub-title" className="text-sm font-medium">
              Titulo
            </label>
            <input
              id="hub-title"
              name="title"
              required
              className="border rounded-md px-3 py-2 text-sm"
              placeholder="Ej: Preparar release notes"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="hub-description" className="text-sm font-medium">
              Descripcion
            </label>
            <textarea
              id="hub-description"
              name="description"
              className="border rounded-md px-3 py-2 text-sm"
              placeholder="Contexto rapido de la tarea"
            />
          </div>

          <DialogFooter>
            <Button type="submit">Crear task</Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
