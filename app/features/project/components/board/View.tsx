import { useMemo, useState } from 'react';
import type { Task, TaskStatus } from '~/core/task/task.types';
import type { ProjectViewState } from '~/features/task/types';
import { Column } from './Column';
import {
  BOARD_COLUMNS,
  buildBoardSourceKey,
  buildBoardState,
  moveTaskInBoard,
  type BoardColumnId,
  type BoardState,
} from './utils';

type DraggingState = { taskId: string; fromColumn: BoardColumnId } | null;

type BoardViewProps = {
  tasks: Task[];
  order: ProjectViewState['order'];
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
  // Estado base derivado desde datos reales del server.
  const tasksByColumn = useMemo(() => buildBoardState(tasks, order), [tasks, order]);

  // Clave estable de la fuente actual (tasks + modo de orden).
  // Si cambia, descartamos el estado interactivo anterior.
  const boardSourceKey = useMemo(() => buildBoardSourceKey(tasks, order), [tasks, order]);

  // Estado local solo para interacciones de drag-and-drop.
  // Se mantiene mientras la fuente no cambie.
  const [interactiveBoard, setInteractiveBoard] = useState<{
    sourceKey: string;
    board: BoardState;
  } | null>(null);
  const boardState =
    interactiveBoard?.sourceKey === boardSourceKey ? interactiveBoard.board : tasksByColumn;
  const [dragging, setDragging] = useState<DraggingState>(null);

  function handleDrop(params: { toColumn: BoardColumnId; toIndex?: number }) {
    const { toColumn, toIndex } = params;
    if (!dragging) return;

    const isCrossColumnMove = dragging.fromColumn !== toColumn;

    // Recalcula el board local luego del drop.
    const nextBoard = moveTaskInBoard({
      board: boardState,
      order,
      taskId: dragging.taskId,
      fromColumn: dragging.fromColumn,
      toColumn,
      toIndex,
    });

    setInteractiveBoard({ sourceKey: boardSourceKey, board: nextBoard });

    // Persistencia:
    // - manual: guardar orden exacto (misma columna) o status + posicion (entre columnas)
    // - priority: solo guardar cambio de columna; el orden lo decide la prioridad
    if (order === 'manual') {
      if (isCrossColumnMove) {
        const movedIndex = nextBoard[toColumn].findIndex((task) => task.id === dragging.taskId);
        onMoveTaskStatus?.(dragging.taskId, toColumn, movedIndex >= 0 ? movedIndex : undefined);
      } else {
        onReorderColumn?.(toColumn, nextBoard[toColumn].map((task) => task.id));
      }
    } else if (isCrossColumnMove) {
      onMoveTaskStatus?.(dragging.taskId, toColumn);
    }

    setDragging(null);
  }

  return (
    <section>
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
                handleDrop({ toColumn, toIndex });
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



