import type { Task } from '~/core/task/task.types';
import { TaskListCardItem } from '~/features/task/TaskListCardItem';

type ListProps = {
  tasks: Task[];
  assigneeById: Record<string, string>;
  onOpenTask?: (taskId: string) => void;
  onDeleteTask?: (taskId: string) => void;
};

export function List({ tasks, assigneeById, onOpenTask, onDeleteTask }: ListProps) {
  return (
    <section>
      <ul className="space-y-2">
        {tasks.map((task) => (
          <TaskListCardItem
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



