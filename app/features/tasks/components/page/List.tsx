import { Form } from 'react-router';
import type { Task } from '~/core/tasks/tasks.types';
import { formatDateUTC, isTaskOverdue } from '../utils/task-due-date';

export function List({ tasks, assigneeById }: { tasks: Task[]; assigneeById: Record<string, string> }) {
  return (
    <section className="space-y-2">
      <h2 className="text-lg font-semibold">Listado</h2>
      <ul className="space-y-2">
        {tasks.map((task) => (
          <li key={task.id} className="border rounded p-3">
            <div className="font-medium">{task.title}</div>
            {task.description ? <p className="text-sm opacity-80">{task.description}</p> : null}
            <div className="text-xs opacity-60 mt-1">
              {task.status} - {task.priority}
            </div>
            <div className="text-xs opacity-70 mt-1">
              Responsible: {task.assigneeId ? assigneeById[task.assigneeId] ?? 'Unknown user' : 'Unassigned'}
            </div>
            <div className="text-xs opacity-70 mt-1">
              Labels: {task.labels.length > 0 ? task.labels.map((label) => `#${label}`).join(', ') : 'None'}
            </div>
            <div className="text-xs opacity-70 mt-1">
              Checklist:{' '}
              {task.checklist.length > 0
                ? `${task.checklist.filter((item) => item.done).length}/${task.checklist.length}`
                : 'None'}
            </div>
            {task.dueDate ? (
              <div className={`text-xs mt-1 ${isTaskOverdue(task) ? 'text-red-600' : 'opacity-70'}`}>
                Due: {formatDateUTC(task.dueDate)} {isTaskOverdue(task) ? '(overdue)' : ''}
              </div>
            ) : null}
            <Form method="post" className="flex items-center gap-2 mt-2">
              <input type="hidden" name="intent" value="update" />
              <input type="hidden" name="id" value={task.id} />

              <select name="status" defaultValue={task.status} className="border rounded px-2 py-1">
                <option value="todo">todo</option>
                <option value="in-progress">in-progress</option>
                <option value="qa">qa</option>
                <option value="ready-to-go-live">ready-to-go-live</option>
                <option value="done">done</option>
                <option value="discarded">discarded</option>
              </select>

              <select name="priority" defaultValue={task.priority} className="border rounded px-2 py-1">
                <option value="low">low</option>
                <option value="medium">medium</option>
                <option value="high">high</option>
                <option value="critical">critical</option>
              </select>

              <input
                type="date"
                name="dueDate"
                defaultValue={task.dueDate ? task.dueDate.toISOString().slice(0, 10) : ''}
                className="border rounded px-2 py-1"
              />
              <input
                type="text"
                name="labels"
                defaultValue={task.labels.join(', ')}
                className="border rounded px-2 py-1"
                placeholder="frontend, bug"
              />

              <button type="submit" className="border rounded px-2 py-1">
                Guardar
              </button>
            </Form>
            <Form
              method="post"
              onSubmit={(e) => {
                if (!confirm('Eliminar esta task?')) e.preventDefault();
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

