import type { Task } from '~/core/task/task.types';
import { TaskListCard } from '~/features/task/TaskListCard';

type ListProps = {
  tasks: Task[];
  assigneeById: Record<string, string>;
  onDeleteTask?: (taskId: string) => void;
};

export function List({ tasks, assigneeById, onDeleteTask }: ListProps) {
  return (
    <section>
      <ul className="space-y-2">
        {tasks.map((task) => (
          <TaskListCard
            key={task.id}
            task={task}
            assigneeLabel={task.assigneeId ? assigneeById[task.assigneeId] ?? 'Unknown user' : 'Unassigned'}
            onDeleteTask={onDeleteTask}
          />
        ))}
      </ul>
    </section>
  );
}
