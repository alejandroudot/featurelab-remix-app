import { Form } from 'react-router';
import type { Task } from './types';

export function TasksList({ tasks }: { tasks: Task[] }) {
  return (
    <section className="space-y-2">
      <h2 className="text-lg font-semibold">Listado</h2>
      <ul className="space-y-2">
        {tasks.map((task) => (
          <li key={task.id} className="border rounded p-3">
            <div className="font-medium">{task.title}</div>
            {task.description ? <p className="text-sm opacity-80">{task.description}</p> : null}
            <div className="text-xs opacity-60 mt-1">
              {task.status} · {task.priority}
            </div>
            <Form method="post" className="flex items-center gap-2 mt-2">
              <input type="hidden" name="intent" value="update" />
              <input type="hidden" name="id" value={task.id} />

              <select name="status" defaultValue={task.status} className="border rounded px-2 py-1">
                <option value="todo">todo</option>
                <option value="in-progress">in-progress</option>
                <option value="done">done</option>
              </select>

              <select
                name="priority"
                defaultValue={task.priority}
                className="border rounded px-2 py-1"
              >
                <option value="low">low</option>
                <option value="medium">medium</option>
                <option value="high">high</option>
              </select>

              <button type="submit" className="border rounded px-2 py-1">
                Guardar
              </button>
            </Form>
            <Form
              method="post"
              onSubmit={(e) => {
                if (!confirm('¿Eliminar esta task?')) e.preventDefault();
              }}
            >
              <input type="hidden" name="intent" value="delete" />
              <input type="hidden" name="id" value={task.id} />
              <button type="submit" className="border rounded px-2 py-1">
                Eliminar
              </button>
            </Form>
          </li>
        ))}
      </ul>
    </section>
  );
}
