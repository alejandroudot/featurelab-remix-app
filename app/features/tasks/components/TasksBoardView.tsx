import type { Task, TaskPriority, TaskStatus } from '~/core/tasks/tasks.types';
import type { TasksViewState } from '../server/task-view-state';

type BoardColumn = {
  title: string;
  status: TaskStatus;
};

const BOARD_COLUMNS: BoardColumn[] = [
  { title: 'To Do', status: 'todo' },
  { title: 'In Progress', status: 'in-progress' },
  { title: 'Done', status: 'done' },
];

const PRIORITY_WEIGHT: Record<TaskPriority, number> = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
};

type TasksBoardViewProps = {
  tasks: Task[];
  order: TasksViewState['order'];
};

export function TasksBoardView({ tasks, order }: TasksBoardViewProps) {
  function sortBoardTasks(items: Task[]) {
    if (order === 'manual') {
      return items;
    }

    return [...items].sort((a, b) => PRIORITY_WEIGHT[a.priority] - PRIORITY_WEIGHT[b.priority]);
  }

  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold">Board</h2>
      <div className="grid gap-3 md:grid-cols-3">
        {BOARD_COLUMNS.map((column) => {
          const columnTasks = sortBoardTasks(tasks.filter((task) => task.status === column.status));

          return (
            <article key={column.status} className="space-y-2 rounded border p-3">
              <h3 className="font-medium">{column.title}</h3>
              {columnTasks.length === 0 ? (
                <p className="text-xs opacity-70">Sin tasks en esta columna.</p>
              ) : (
                <ul className="space-y-2">
                  {columnTasks.map((task) => (
                    <li key={task.id} className="rounded border p-2 text-sm">
                      <div className="font-medium">{task.title}</div>
                      <div className="text-xs opacity-70">Priority: {task.priority}</div>
                    </li>
                  ))}
                </ul>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
