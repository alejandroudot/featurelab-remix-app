import type { Task, TaskPriority, TaskStatus } from '~/core/tasks/tasks.types';
import type { TasksViewState } from '../server/task-view-state';
import { TaskCard } from './TaskCard';

type BoardColumnId = TaskStatus;

type BoardColumn = {
  id: BoardColumnId;
  title: string;
};

const BOARD_COLUMNS: BoardColumn[] = [
  { id: 'todo', title: 'To Do' },
  { id: 'in-progress', title: 'In Progress' },
  { id: 'qa', title: 'QA' },
  { id: 'ready-to-go-live', title: 'Ready to Go Live' },
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
  onOpenTask?: (taskId: string) => void;
  onEditTask?: (taskId: string) => void;
  onDeleteTask?: (taskId: string) => void;
};

export function TasksBoardView({ tasks, order, onOpenTask, onEditTask, onDeleteTask }: TasksBoardViewProps) {
  function getColumnTasks(columnId: BoardColumnId, items: Task[]) {
    return items.filter((task) => task.status === columnId);
  }

  function sortBoardTasks(items: Task[]) {
    if (order === 'manual') {
      return items;
    }

    return [...items].sort((a, b) => PRIORITY_WEIGHT[a.priority] - PRIORITY_WEIGHT[b.priority]);
  }

  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold">Board</h2>
      <p className="text-xs opacity-70">
        Nuevas tasks entran en <span className="font-medium">To Do</span> por defecto.
      </p>
      <div className="grid gap-3 xl:grid-cols-4">
        {BOARD_COLUMNS.map((column) => {
          const columnTasks = sortBoardTasks(getColumnTasks(column.id, tasks));

          return (
            <article key={column.id} className="space-y-2 rounded border p-3">
              <h3 className="font-medium">{column.title}</h3>
              {columnTasks.length === 0 ? (
                <p className="text-xs opacity-70">Sin tasks en esta columna.</p>
              ) : (
                <ul className="space-y-2">
                  {columnTasks.map((task) => (
                    <li key={task.id}>
                      <TaskCard
                        task={task}
                        compact
                        onOpen={onOpenTask}
                        onEdit={onEditTask}
                        onDelete={onDeleteTask}
                      />
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
