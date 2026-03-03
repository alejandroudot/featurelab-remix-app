import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';
import { useShallow } from 'zustand/react/shallow';
import type { TaskActionData, TaskAssigneeOption, ProjectViewState } from '~/features/task/types';
import type { Task, TaskActivity, TaskComment } from '~/core/task/task.types';
import type { Project } from '~/core/project/project.types';
import { toast } from 'sonner';
import { getTaskActionToastError } from '~/features/task/utils/client-errors';
import { useWorkspaceDataStore } from './store/data.store';
import { useWorkspaceUiStore } from './store/ui.store';
import { CreateDialog } from './components/dialogs/CreateDialog';
import { DeleteDialog } from './components/dialogs/DeleteDialog';
import { TaskCreateDialog } from './components/dialogs/TaskCreateDialog';
import { EntryState } from './EntryState';
import { Toolbar } from './components/toolbar/Toolbar';
import { TasksView } from './components/views/TasksView';
import { Modal } from '~/features/task/components/detail/Modal';

export function ProjectWorkspace({
  currentUserId,
  tasks,
  taskActivities,
  taskComments,
  projects,
  assignableUsers,
  viewState,
  actionData,
  isSubmitting,
}: {
  currentUserId: string;
  tasks: Task[];
  taskActivities: TaskActivity[];
  taskComments: TaskComment[];
  projects: Project[];
  assignableUsers: TaskAssigneeOption[];
  viewState: ProjectViewState;
  actionData: TaskActionData;
  isSubmitting: boolean;
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
  const { hydrateViewState, setCreateTaskOpen } = useWorkspaceUiStore(
    useShallow((state) => ({
      hydrateViewState: state.hydrateViewState,
      setCreateTaskOpen: state.setCreateTaskOpen,
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

  useEffect(() => {
    const message = getTaskActionToastError(actionData);
    if (message) toast.error(message);

    if (!actionData || (actionData.success === false && actionData.intent === 'create')) {
      setCreateTaskOpen(Boolean(actionData && actionData.success === false && actionData.intent === 'create'));
    }
  }, [actionData, setCreateTaskOpen]);

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
      <TaskCreateDialog actionData={actionData} isSubmitting={isSubmitting} />
    </>
  );
}
