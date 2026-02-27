import type { Task } from '~/core/tasks/tasks.types';
import { Item } from './components/Item';

type ListProps = {
  tasks: Task[];
  assigneeById: Record<string, string>;
  onOpenTask?: (taskId: string) => void;
  onDeleteTask?: (taskId: string) => void;
};

export function List({ tasks, assigneeById, onOpenTask, onDeleteTask }: ListProps) {
  return (
    <section className="space-y-2">
      <h2 className="text-lg font-semibold">Listado</h2>
      <ul className="space-y-2">
        {tasks.map((task) => (
          <Item
            key={task.id}
            task={task}
            assigneeLabel={task.assigneeId ? assigneeById[task.assigneeId] ?? 'Unknown user' : 'Unassigned'}
            onOpenTask={onOpenTask}
            onDeleteTask={onDeleteTask}
          />
        ))}
      </ul>
    </section>
  );
}
