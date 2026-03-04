import { useEffect } from 'react';
import { useSearchParams } from 'react-router';
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
  const hydratedProjects = useWorkspaceDataStore((state) => state.projects);
  const hydrateViewState = useWorkspaceUiStore((state) => state.hydrateViewState);
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
  }, [assignableUsers, currentUserId, projects, setWorkspaceData, taskActivities, taskComments, tasks]);

  useEffect(() => {
    hydrateViewState({
      activeProjectId: initialActiveProjectId,
      view: viewState.view,
      order: viewState.order,
      scope: viewState.scope,
    });
  }, [hydrateViewState, initialActiveProjectId, viewState.order, viewState.scope, viewState.view]);

  const projectsToRender = hydratedProjects.length > 0 ? hydratedProjects : projects;
  const resolvedActiveProjectId = uiActiveProjectId ?? initialActiveProjectId;
  const hasActiveProject = projectsToRender.some((project) => project.id === resolvedActiveProjectId);
  const shouldRenderEntryState = projectsToRender.length === 0 || !hasActiveProject;
  const activeProject = projectsToRender.find((project) => project.id === resolvedActiveProjectId) ?? null;
  const projectName = activeProject?.name ?? projectsToRender[0]?.name ?? 'Sin proyecto';

  return (
    <>
      {shouldRenderEntryState ? (
        <EntryState projects={projectsToRender} activeProjectId={resolvedActiveProjectId} />
      ) : (
        <main className="container mx-auto space-y-6 p-4">
          <Toolbar projectName={projectName} />
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
