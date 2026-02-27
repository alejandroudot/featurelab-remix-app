import { useEffect, useMemo, useState } from 'react';
import type { Task, TaskStatus } from '~/core/tasks/tasks.types';
import type { TasksViewState } from '../../server/task-view-state';
import { Column } from './Column';
import {
  BOARD_COLUMNS,
  buildBoardState,
  moveTaskInBoard,
  type BoardColumnId,
  type BoardState,
} from './utils';

type DraggingState = { taskId: string; fromColumn: BoardColumnId } | null;

type BoardViewProps = {
  tasks: Task[];
  order: TasksViewState['order'];
  assigneeById: Record<string, string>;
  onOpenTask?: (taskId: string) => void;
  onEditTask?: (taskId: string) => void;
  onDeleteTask?: (taskId: string) => void;
  onMoveTaskStatus?: (taskId: string, toStatus: TaskStatus, orderIndex?: number) => void;
  onReorderColumn?: (status: BoardColumnId, orderedTaskIds: string[]) => void;
};

export function BoardView({
  tasks,
  order,
  assigneeById,
  onOpenTask,
  onEditTask,
  onDeleteTask,
  onMoveTaskStatus,
  onReorderColumn,
}: BoardViewProps) {
  const tasksByColumn = useMemo(() => buildBoardState(tasks, order), [tasks, order]);

  // Base derivada desde server: columnas ya ordenadas segun modo actual.
  const [boardState, setBoardState] = useState<BoardState>(tasksByColumn);

  // Si cambia la fuente real (tasks/order), resincronizamos la copia interactiva.
  useEffect(() => {
    setBoardState(tasksByColumn);
  }, [tasksByColumn]);

  const [dragging, setDragging] = useState<DraggingState>(null);

  function handleDrop(params: { toColumn: BoardColumnId; toIndex?: number }) {
    const { toColumn, toIndex } = params;
    if (!dragging) return;

    const isCrossColumnMove = dragging.fromColumn !== toColumn;
		//Obtiene el nuevo board con las cards re ordenadas
    const nextBoard = moveTaskInBoard({
      board: boardState,
      order,
      taskId: dragging.taskId,
      fromColumn: dragging.fromColumn,
      toColumn,
      toIndex,
    });

    setBoardState(nextBoard);

    // Manual: persiste exactamente el orden que deja el usuario.
    if (order === 'manual') {
      if (isCrossColumnMove) {
        // Cambio de columna: guardar status nuevo + posicion final.
        const movedIndex = nextBoard[toColumn].findIndex((task) => task.id === dragging.taskId);
        onMoveTaskStatus?.(dragging.taskId, toColumn, movedIndex >= 0 ? movedIndex : undefined);
      } else {
        // Misma columna: guardar solo el reorder de ids.
        onReorderColumn?.(toColumn, nextBoard[toColumn].map((task) => task.id));
      }
    // Priority: el orden se calcula por prioridad, solo persiste cambio de columna.
    } else if (isCrossColumnMove) {
      onMoveTaskStatus?.(dragging.taskId, toColumn);
    }

    setDragging(null);
  }

  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold">Board</h2>
      <p className="text-xs opacity-70">
        Nuevas tasks entran en <span className="font-medium">To Do</span> por defecto.
      </p>
      <div className="grid gap-3 xl:grid-cols-4">
        {BOARD_COLUMNS.map((column) => {
          const columnTasks = boardState[column.id];

          return (
            <Column
              key={column.id}
              column={column}
              tasks={columnTasks}
              assigneeById={assigneeById}
              onColumnDrop={(toColumn) => {
                handleDrop({ toColumn });
              }}
              onStartDrag={(taskId, fromColumn) => {
                setDragging({ taskId, fromColumn });
              }}
              onDropAtTask={(_taskId, toColumn, toIndex) => {
                handleDrop({
                  toColumn,
                  toIndex,
                });
              }}
              onOpenTask={onOpenTask}
              onEditTask={onEditTask}
              onDeleteTask={onDeleteTask}
            />
          );
        })}
      </div>
    </section>
  );
}

