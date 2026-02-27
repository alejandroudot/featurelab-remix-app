import type { Task, TaskPriority, TaskStatus } from '~/core/tasks/tasks.types';
import type { TasksFiltersState } from '../../types';

export type BoardColumnId = Extract<TaskStatus, 'todo' | 'in-progress' | 'qa' | 'ready-to-go-live'>;
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

// Ranking usado cuando el board esta en modo "priority".
const PRIORITY_RANK: Record<TaskPriority, number> = {
  critical: 4,
  high: 3,
  medium: 2,
  low: 1,
};

export function sortByPriority(items: Task[]) {
  return [...items].sort((a, b) => PRIORITY_RANK[b.priority] - PRIORITY_RANK[a.priority]);
}

// Decide estrategia de orden segun el modo actual del board.
function sortByOrder(items: Task[], order: TasksFiltersState['order']) {
  if (order === 'manual') {
    return [...items].sort((a, b) => a.orderIndex - b.orderIndex);
  }
  return sortByPriority(items);
}

// Construye las 4 columnas del board, ya ordenadas para renderizar.
export function buildBoardState(tasks: Task[], order: TasksFiltersState['order']): BoardState {
  return {
    todo: sortByOrder(tasks.filter((task) => task.status === 'todo'), order),
    'in-progress': sortByOrder(tasks.filter((task) => task.status === 'in-progress'), order),
    qa: sortByOrder(tasks.filter((task) => task.status === 'qa'), order),
    'ready-to-go-live': sortByOrder(tasks.filter((task) => task.status === 'ready-to-go-live'), order),
  };
}

// "Huella" de la fuente de datos del board.
// Si esta clave cambia, el estado interactivo local debe resetearse.
export function buildBoardSourceKey(tasks: Task[], order: TasksFiltersState['order']) {
  return `${order}:${tasks
    .map((task) => `${task.id}:${task.status}:${task.orderIndex}:${task.priority}`)
    .join('|')}`;
}

// Clamp asegura que un numero quede dentro de un rango [min, max].
// En el board lo usamos para que el indice de insercion del drag-and-drop
// nunca se salga de los limites de la lista (evita indices negativos o mayores al largo).
function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(value, max));
}

export function moveTaskInBoard(input: {
  board: BoardState;
  order: TasksFiltersState['order'];
  taskId: string;
  fromColumn: BoardColumnId;
  toColumn: BoardColumnId;
  toIndex?: number;
}): BoardState {
  const { board, order, taskId, fromColumn, toColumn, toIndex } = input;
  const sourceTasks = [...board[fromColumn]];
  const sourceIndex = sourceTasks.findIndex((task) => task.id === taskId);
  // Si no existe la task, deja el board como esta.
  if (sourceIndex === -1) return board;

  const [movedTask] = sourceTasks.splice(sourceIndex, 1);

  // Move dentro de la misma columna.
  // Solo aplica en "manual"; en "priority" no se permite reorden manual interno.
  if (fromColumn === toColumn) {
    if (order === 'priority') return board;

    // Inserta la task en un indice valido dentro de esa misma columna.
    const insertIndex = clamp(toIndex ?? sourceTasks.length, 0, sourceTasks.length);
    sourceTasks.splice(insertIndex, 0, movedTask);
    return { ...board, [fromColumn]: sourceTasks };
  }

  // Move entre columnas (cambia status).
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


