import { useEffect } from 'react';
import { useLoaderData, useSearchParams } from 'react-router';
import { Project } from '~/features/project/Project';
import { ProjectsOverview } from '~/features/project/ProjectsOverview';
import type { Route } from './+types/index';
import { taskRepository } from '~/infra/task/task.repository.provider';
import { projectRepository } from '~/infra/project/project.repository.provider';
import { requireUser } from '~/infra/auth/require-user';
import { runTaskLoader } from '~/server/task/loader';
import { useWorkspaceDataStore } from '~/features/store/workspace-data.store';
import { useWorkspaceUiStore } from '~/features/store/workspace-ui.store';
import { CreateDialog } from '~/features/project/components/dialogs/CreateDialog';
import { DeleteDialog } from '~/features/project/components/dialogs/DeleteDialog';
import { TaskCreateDialog } from '~/features/project/components/dialogs/TaskCreateDialog';
import { useProjectDialogStore } from '~/features/store/project-dialog.store';

export async function loader({ request }: Route.LoaderArgs) {
  const user = await requireUser(request);
  return runTaskLoader({
    request,
    userId: user.id,
    taskRepository,
    projectRepository,
  });
}

export default function IndexRoute() {
  const { currentUserId, projects, tasks, taskActivities, taskComments, assignableUsers, viewState } =
    useLoaderData<typeof loader>();
  const [searchParams] = useSearchParams();
  const projectFromQuery = searchParams.get('project');
  const selectedProject = projects.find((project) => project.id === projectFromQuery) ?? null;
  const setCreateProjectOpen = useProjectDialogStore((state) => state.setCreateProjectOpen);
  const setProjectDeleteOpen = useProjectDialogStore((state) => state.setProjectDeleteOpen);
  const setWorkspaceData = useWorkspaceDataStore((state) => state.setWorkspaceData);
  const hydrateViewState = useWorkspaceUiStore((state) => state.hydrateViewState);

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
      activeProjectId: selectedProject?.id ?? null,
      view: viewState.view,
      order: viewState.order,
      scope: viewState.scope,
    });
  }, [hydrateViewState, selectedProject?.id, viewState.order, viewState.scope, viewState.view]);

  return (
    <>
      {selectedProject ? <Project project={selectedProject} /> : <ProjectsOverview projects={projects} />}
      <CreateDialog />
      <DeleteDialog />
      <TaskCreateDialog />
    </>
  );
}
