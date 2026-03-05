import { useRevalidator } from 'react-router';
import { useShallow } from 'zustand/react/shallow';
import { useWorkspaceDataStore } from '~/features/store/workspace-data.store';
import { useWorkspaceUiStore } from '~/features/store/workspace-ui.store';
import { buildAssigneeById, filterTasksBySearch, getVisibleTasks } from '~/features/project/utils/utils';
import type { TaskStatus } from '~/core/task/task.types';
import { useDeleteTaskMutation, useReorderColumnMutation, useUpdateTaskMutation } from '~/features/task/client/mutation';
import { EmptyState } from './EmptyState';
import { Board } from '../board/Board';
import { List } from '../list/List';
import type { Task } from '~/core/task/task.types';
import type { TaskAssigneeOption, ProjectViewState } from '~/features/task/types';
import { revalidateAfterSuccess } from '~/lib/query/mutation-result';

type ViewProps = {
  initialState: {
    currentUserId: string;
    tasks: Task[];
    assignableUsers: TaskAssigneeOption[];
    activeProjectId: string;
    viewState: ProjectViewState;
  };
};

export function View({ initialState }: ViewProps) {
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
  const isHydrated = dataStore.currentUserId.length > 0;
  const data = isHydrated
    ? dataStore
    : {
        currentUserId: initialState.currentUserId,
        tasks: initialState.tasks,
        assignableUsers: initialState.assignableUsers,
      };
  const workspaceUi = isHydrated
    ? uiState
    : {
        ...uiState,
        activeProjectId: initialState.activeProjectId,
        view: initialState.viewState.view,
        order: initialState.viewState.order,
        scope: initialState.viewState.scope,
      };

  const assigneeById = buildAssigneeById(data.assignableUsers);
  const visibleTasks = getVisibleTasks({
    tasks: data.tasks,
    currentUserId: data.currentUserId,
    scope: workspaceUi.scope,
    order: workspaceUi.order,
  });
  const projectScopedTasks = workspaceUi.activeProjectId
    ? visibleTasks.filter((task) => task.projectId === workspaceUi.activeProjectId)
    : visibleTasks;
  const searchedTasks = filterTasksBySearch(projectScopedTasks, workspaceUi.searchTerm);

  async function handleDeleteTask(taskId: string) {
    const result = await deleteTask({ id: taskId });
    revalidateAfterSuccess(result, revalidator.revalidate);
  }

  async function handleMoveTaskStatus(taskId: string, status: TaskStatus, orderIndex?: number) {
    const result = await updateTask({
      id: taskId,
      status,
      ...(orderIndex !== undefined ? { orderIndex: orderIndex.toString() } : {}),
    });
    revalidateAfterSuccess(result, revalidator.revalidate);
  }

  async function handleReorderColumn(status: TaskStatus, orderedTaskIds: string[]) {
    const result = await reorderColumn({ status, orderedTaskIds });
    revalidateAfterSuccess(result, revalidator.revalidate);
  }

  if (searchedTasks.length === 0) {
    return (
      <EmptyState
        searchTerm={workspaceUi.searchTerm}
        activeProjectId={workspaceUi.activeProjectId}
        projectScopedTasksCount={projectScopedTasks.length}
        visibleTasksCount={visibleTasks.length}
      />
    );
  }

  if (workspaceUi.view === 'list') {
    return <List tasks={searchedTasks} assigneeById={assigneeById} onDeleteTask={handleDeleteTask} />;
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
