import { useState } from 'react';
import { useLocation, useSearchParams, useSubmit } from 'react-router';
import type { TaskStatus } from '~/core/tasks/tasks.types';

type BoardTaskStatus = Extract<TaskStatus, 'todo' | 'in-progress' | 'qa' | 'ready-to-go-live'>;

export function useTasksPageController() {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const submit = useSubmit();
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  function setView(view: 'list' | 'board') {
    const next = new URLSearchParams(searchParams);
    next.set('view', view);
    setSearchParams(next);
  }

  function setOrder(order: 'manual' | 'priority') {
    const next = new URLSearchParams(searchParams);
    next.set('order', order);
    setSearchParams(next);
  }

  function setScope(scope: 'all' | 'assigned' | 'created') {
    const next = new URLSearchParams(searchParams);
    next.set('scope', scope);
    setSearchParams(next);
  }

  function resetViewConfig() {
    const next = new URLSearchParams(searchParams);
    next.set('view', 'board');
    next.set('order', 'manual');
    next.set('scope', 'all');
    setSearchParams(next);
  }

  function handleDetailOpenChange(open: boolean) {
    setIsDetailOpen(open);
  }

  function handleOpenTask(taskId: string) {
    setSelectedTaskId(taskId);
    setIsDetailOpen(true);
  }

  function handleEditTask(taskId: string) {
    handleOpenTask(taskId);
  }

  function handleDeleteTask(taskId: string) {
    submit(
      {
        intent: 'delete',
        id: taskId,
        redirectTo: `${location.pathname}${location.search}`,
      },
      {
        method: 'post',
      },
    );
  }

  function handleMoveTaskStatus(taskId: string, toStatus: TaskStatus, orderIndex?: number) {
    submit(
      {
        intent: 'update',
        id: taskId,
        status: toStatus,
        ...(orderIndex !== undefined ? { orderIndex: String(orderIndex) } : {}),
        redirectTo: `${location.pathname}${location.search}`,
      },
      {
        method: 'post',
        action: '/tasks',
      },
    );
  }

  function handleReorderColumn(status: BoardTaskStatus, orderedTaskIds: string[]) {
    submit(
      {
        intent: 'reorder-column',
        status,
        orderedTaskIds: JSON.stringify(orderedTaskIds),
        redirectTo: `${location.pathname}${location.search}`,
      },
      {
        method: 'post',
        action: '/tasks',
      },
    );
  }

  return {
    setView,
    setOrder,
    setScope,
    resetViewConfig,
    handleDetailOpenChange,
    handleOpenTask,
    handleEditTask,
    handleDeleteTask,
    handleMoveTaskStatus,
    handleReorderColumn,
    selectedTaskId,
    isDetailOpen,
  };
}
