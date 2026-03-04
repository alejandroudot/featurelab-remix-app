import { useRevalidator } from 'react-router';
import { useShallow } from 'zustand/react/shallow';
import { List } from '~/features/project/components/list/List';
import { Board } from '~/features/project/components/board/Board';
import { EmptyState } from '~/features/project/components/empty/EmptyState';
import { useWorkspaceDataStore } from '~/features/store/workspace-data.store';
import { useWorkspaceUiStore } from '~/features/store/workspace-ui.store';
import { buildAssigneeById, filterTasksBySearch, getVisibleTasks } from '~/features/project/utils/utils';
import type { TaskStatus } from '~/core/task/task.types';
import { useDeleteTaskMutation, useReorderColumnMutation, useUpdateTaskMutation } from '~/features/task/client/mutation';

export function TasksView() {
  const revalidator = useRevalidator();
  const { mutateAsync: deleteTask } = useDeleteTaskMutation();
  const { mutateAsync: updateTask } = useUpdateTaskMutation();
  const { mutateAsync: reorderColumn } = useReorderColumnMutation();
  const dataStore = useWorkspaceDataStore(
    useShallow((state) => ({
      currentUserId: state.currentUserId,
      tasks: state.tasks,
      assignableUsers: state.assignableUsers,
    })),
  );
  const uiState = useWorkspaceUiStore(
    useShallow((state) => ({
      activeProjectId: state.activeProjectId,
      view: state.view,
      order: state.order,
      scope: state.scope,
      searchTerm: state.searchTerm,
    })),
  );
  const assigneeById = buildAssigneeById(dataStore.assignableUsers);
  const visibleTasks = getVisibleTasks({
    tasks: dataStore.tasks,
    currentUserId: dataStore.currentUserId,
    scope: uiState.scope,
    order: uiState.order,
  });
  const projectScopedTasks = uiState.activeProjectId
    ? visibleTasks.filter((task) => task.projectId === uiState.activeProjectId)
    : visibleTasks;
  const searchedTasks = filterTasksBySearch(projectScopedTasks, uiState.searchTerm);

  async function handleDeleteTask(taskId: string) {
    const result = await deleteTask({ id: taskId });
    if (!result || !result.success) return;
    revalidator.revalidate();
  }

  async function handleMoveTaskStatus(taskId: string, status: TaskStatus, orderIndex?: number) {
    const result = await updateTask({
      id: taskId,
      status,
      ...(orderIndex !== undefined ? { orderIndex: orderIndex.toString() } : {}),
    });
    if (!result || !result.success) return;
    revalidator.revalidate();
  }

  async function handleReorderColumn(status: TaskStatus, orderedTaskIds: string[]) {
    const result = await reorderColumn({
      status,
      orderedTaskIds,
    });
    if (!result || !result.success) return;
    revalidator.revalidate();
  }

  if (searchedTasks.length === 0 && uiState.searchTerm.trim()) {
    return <EmptyState title={`No hay resultados para "${uiState.searchTerm.trim()}".`} description="Proba con otra palabra clave." />;
  }

  if (uiState.activeProjectId && projectScopedTasks.length === 0) {
    return <EmptyState title="No hay tareas en este proyecto todavia." description="Crea una tarea para empezar." />;
  }

  if (visibleTasks.length === 0) {
    return <EmptyState title="Aun no hay tareas." description="Crea tu primera tarea para empezar." />;
  }

  if (uiState.view === 'list') {
    return (
      <List
        tasks={searchedTasks}
        assigneeById={assigneeById}
        onDeleteTask={handleDeleteTask}
      />
    );
  }

  return (
    <Board
      tasks={searchedTasks}
      assigneeById={assigneeById}
      onDeleteTask={handleDeleteTask}
      onMoveTaskStatus={handleMoveTaskStatus}
      onReorderColumn={handleReorderColumn}
    />
  );
}
