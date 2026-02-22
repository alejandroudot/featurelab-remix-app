import type { Task, TaskPriority, TaskStatus } from '~/core/tasks/tasks.types';
import type { TasksViewState } from '../../server/task-view-state';

export type BoardColumnId = TaskStatus;
export type BoardState = Record<BoardColumnId, Task[]>;

export type BoardColumn = {
  id: BoardColumnId;
  title: string;
};

export const BOARD_COLUMNS: BoardColumn[] = [
  { id: 'todo', title: 'To Do' },
  { id: 'in-progress', title: 'In Progress' },
  { id: 'qa', title: 'QA' },
  { id: 'ready-to-go-live', title: 'Ready to Go Live' },
];

const PRIORITY_RANK: Record<TaskPriority, number> = {
  critical: 4,
  high: 3,
  medium: 2,
  low: 1,
};

export function sortByPriority(items: Task[]) {
  return [...items].sort((a, b) => PRIORITY_RANK[b.priority] - PRIORITY_RANK[a.priority]);
}

function sortByOrder(items: Task[], order: TasksViewState['order']) {
  if (order === 'manual') {
    return [...items].sort((a, b) => a.orderIndex - b.orderIndex);
  }
  return sortByPriority(items);
}

export function buildBoardState(tasks: Task[], order: TasksViewState['order']): BoardState {
  return {
    todo: sortByOrder(tasks.filter((task) => task.status === 'todo'), order),
    'in-progress': sortByOrder(tasks.filter((task) => task.status === 'in-progress'), order),
    qa: sortByOrder(tasks.filter((task) => task.status === 'qa'), order),
    'ready-to-go-live': sortByOrder(tasks.filter((task) => task.status === 'ready-to-go-live'), order),
  };
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(value, max));
}

export function moveTaskInBoard(input: {
  board: BoardState;
  order: TasksViewState['order'];
  taskId: string;
  fromColumn: BoardColumnId;
  toColumn: BoardColumnId;
  toIndex?: number;
}): BoardState {
  const { board, order, taskId, fromColumn, toColumn, toIndex } = input;
  const sourceTasks = [...board[fromColumn]];
  const sourceIndex = sourceTasks.findIndex((task) => task.id === taskId);
  if (sourceIndex === -1) return board;

  const [movedTask] = sourceTasks.splice(sourceIndex, 1);

  if (fromColumn === toColumn) {
    if (order === 'priority') return board;

    const insertIndex = clamp(toIndex ?? sourceTasks.length, 0, sourceTasks.length);
    sourceTasks.splice(insertIndex, 0, movedTask);
    return { ...board, [fromColumn]: sourceTasks };
  }

  const targetTasks = [...board[toColumn]];
  const insertIndex = clamp(toIndex ?? targetTasks.length, 0, targetTasks.length);
  targetTasks.splice(insertIndex, 0, { ...movedTask, status: toColumn });

  if (order === 'priority') {
    return {
      ...board,
      [fromColumn]: sortByPriority(sourceTasks),
      [toColumn]: sortByPriority(targetTasks),
    };
  }

  return {
    ...board,
    [fromColumn]: sourceTasks,
    [toColumn]: targetTasks,
  };
}
