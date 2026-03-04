import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';
import { useShallow } from 'zustand/react/shallow';
import type { TaskAssigneeOption, ProjectViewState } from '~/features/task/types';
import type { Task, TaskActivity, TaskComment } from '~/core/task/task.types';
import type { Project } from '~/core/project/project.types';
import { useWorkspaceDataStore } from '~/features/store/workspace-data.store';
import { useWorkspaceUiStore } from '~/features/store/workspace-ui.store';
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
  const [isCreateProjectOpen, setCreateProjectOpen] = useState(false);
  const [projectToDeleteId, setProjectToDeleteId] = useState<string | null>(null);
  const [isProjectDeleteOpen, setProjectDeleteOpen] = useState(false);
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

  const openCreateProjectDialog = useCallback(() => {
    setCreateProjectOpen(true);
  }, []);

  const openProjectDeleteDialog = useCallback((projectId: string) => {
    setProjectDeleteOpen(true);
    setProjectToDeleteId(projectId);
  }, []);

  const handleDeleteProjectOpenChange = useCallback((open: boolean) => {
    setProjectDeleteOpen(open);
    if (!open) setProjectToDeleteId(null);
  }, []);

  const projectsToRender = hydratedUserId.length > 0 ? hydratedProjects : projects;
  const resolvedProjectId = uiActiveProjectId ?? initialActiveProjectId;
  const activeProject = projectsToRender.find((project) => project.id === resolvedProjectId) ?? null;
  const projectName = activeProject ? activeProject.name : projectsToRender[0]?.name ?? 'Sin proyecto';
  const shouldRenderEntryState = projectsToRender.length === 0 || !resolvedProjectId;

  return (
    <>
      {shouldRenderEntryState ? (
        <EntryState
          initialProjects={projects}
          initialActiveProjectId={initialActiveProjectId}
          onOpenCreateProject={openCreateProjectDialog}
          onOpenDeleteProject={openProjectDeleteDialog}
        />
      ) : (
        <main className="container mx-auto space-y-6 p-4">
          <Toolbar
            initialViewState={viewState}
            initialActiveProjectId={initialActiveProjectId}
            onOpenDeleteProject={openProjectDeleteDialog}
            projectName={projectName}
          />
          <TasksView />
          <Modal />
        </main>
      )}
      <CreateDialog open={isCreateProjectOpen} onOpenChange={setCreateProjectOpen} />
      <DeleteDialog
        open={isProjectDeleteOpen}
        onOpenChange={handleDeleteProjectOpenChange}
        projectToDeleteId={projectToDeleteId}
      />
      <TaskCreateDialog />
    </>
  );
}
