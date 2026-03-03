import { useLocation, useSubmit } from 'react-router';
import { useShallow } from 'zustand/react/shallow';
import { List } from '../list/List';
import { Board } from '../board/Board';
import { EmptyState } from '../empty/EmptyState';
import { useWorkspaceDataStore } from '~/features/project/store/data.store';
import { useWorkspaceUiStore } from '~/features/project/store/ui.store';
import { buildAssigneeById, filterTasksBySearch, getVisibleTasks } from '~/features/project/utils/utils';
import type { TaskStatus } from '~/core/task/task.types';

export function TasksView() {
  const submit = useSubmit();
  const location = useLocation();
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

  function submitTask(payload: Record<string, string>) {
    submit({ ...payload, redirectTo: `${location.pathname}${location.search}` }, { method: 'post' });
  }

  function handleDeleteTask(taskId: string) {
    submitTask({ intent: 'delete', id: taskId });
  }

  function handleMoveTaskStatus(taskId: string, status: TaskStatus, orderIndex?: number) {
    submitTask({
      intent: 'update',
      id: taskId,
      status,
      ...(orderIndex !== undefined ? { orderIndex: orderIndex.toString() } : {}),
    });
  }

  function handleReorderColumn(status: TaskStatus, orderedTaskIds: string[]) {
    submitTask({
      intent: 'reorder-column',
      status,
      orderedTaskIds: JSON.stringify(orderedTaskIds),
    });
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
