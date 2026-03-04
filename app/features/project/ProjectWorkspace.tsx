import { useEffect } from 'react';
import { useSearchParams } from 'react-router';
import { useShallow } from 'zustand/react/shallow';
import type { TaskAssigneeOption, ProjectViewState } from '~/features/task/types';
import type { Task, TaskActivity, TaskComment } from '~/core/task/task.types';
import type { Project } from '~/core/project/project.types';
import { useWorkspaceDataStore } from '~/features/store/workspace-data.store';
import { useWorkspaceUiStore } from '~/features/store/workspace-ui.store';
import { useProjectDialogStore } from '~/features/store/project-dialog.store';
import { CreateDialog } from './components/dialogs/CreateDialog';
import { DeleteDialog } from './components/dialogs/DeleteDialog';
import { TaskCreateDialog } from './components/dialogs/TaskCreateDialog';
import { EntryState } from './EntryState';
import { Toolbar } from './components/toolbar/Toolbar';
import { TasksView } from '~/features/task/TasksView';
import { Modal } from '~/features/task/components/detail/Modal';

export function ProjectWorkspace({
  currentUserId,
  tasks,
  taskActivities,
  taskComments,
  projects,
  assignableUsers,
  viewState,
}: {
  currentUserId: string;
  tasks: Task[];
  taskActivities: TaskActivity[];
  taskComments: TaskComment[];
  projects: Project[];
  assignableUsers: TaskAssigneeOption[];
  viewState: ProjectViewState;
}) {
  const [searchParams] = useSearchParams();
  const initialActiveProjectId = searchParams.get('project');
  const setCreateProjectOpen = useProjectDialogStore((state) => state.setCreateProjectOpen);
  const setProjectDeleteOpen = useProjectDialogStore((state) => state.setProjectDeleteOpen);
  const setWorkspaceData = useWorkspaceDataStore((state) => state.setWorkspaceData);
  const { hydratedUserId, hydratedProjects } = useWorkspaceDataStore(
    useShallow((state) => ({
      hydratedUserId: state.currentUserId,
      hydratedProjects: state.projects,
    })),
  );
  const { hydrateViewState } = useWorkspaceUiStore(
    useShallow((state) => ({
      hydrateViewState: state.hydrateViewState,
    })),
  );
  const uiActiveProjectId = useWorkspaceUiStore((state) => state.activeProjectId);

  useEffect(() => {
    setCreateProjectOpen(false);
    setProjectDeleteOpen(false);
  }, [setCreateProjectOpen, setProjectDeleteOpen]);

  useEffect(() => {
    setWorkspaceData({
      currentUserId,
      projects,
      tasks,
      taskActivities,
      taskComments,
      assignableUsers,
    });
  }, [currentUserId, projects, tasks, taskActivities, taskComments, assignableUsers, setWorkspaceData]);

  useEffect(() => {
    hydrateViewState({
      activeProjectId: initialActiveProjectId,
      view: viewState.view,
      order: viewState.order,
      scope: viewState.scope,
    });
  }, [initialActiveProjectId, viewState.view, viewState.order, viewState.scope, hydrateViewState]);

  const projectsToRender = hydratedUserId.length > 0 ? hydratedProjects : projects;
  const resolvedProjectId = uiActiveProjectId ?? initialActiveProjectId;
  const shouldRenderEntryState = projectsToRender.length === 0 || !resolvedProjectId;

  return (
    <>
      {shouldRenderEntryState ? (
        <EntryState
          initialProjects={projects}
          initialActiveProjectId={initialActiveProjectId}
        />
      ) : (
        <main className="container mx-auto space-y-6 p-4">
          <Toolbar
            initialProjects={projects}
            initialViewState={viewState}
            initialActiveProjectId={initialActiveProjectId}
          />
          <TasksView />
          <Modal />
        </main>
      )}
      <CreateDialog />
      <DeleteDialog />
      <TaskCreateDialog />
    </>
  );
}
