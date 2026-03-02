import { useEffect, useMemo, useState } from 'react';
import type { TaskActionData, TaskAssigneeOption, ProjectViewState } from '~/features/task/types';
import { useSearchParams } from 'react-router';
import { Plus } from 'lucide-react';
import { CreateTask } from '~/features/task/components/create/CreateTask';
import { List } from './components/list/List';
import { Modal } from '~/features/task/components/detail/Modal';
import { InfoEmptyState } from './components/empty/InfoEmptyState';
import { BoardView } from './components/board/View';
import { ProjectTopSection } from './components/ProjectTopSection';
import { ProjectsOverview } from './components/ProjectsOverview';
import { ProjectCreateDialog } from './components/create/ProjectCreateDialog';
import type { Task, TaskActivity, TaskComment } from '~/core/task/task.types';
import type { Project } from '~/core/project/project.types';
import { toast } from 'sonner';
import { getTaskActionToastError } from '~/features/task/utils/client-errors';
import { useProjectTasksController } from './hooks/useProjectTasksController';
import { useProjectsWorkspaceState } from './hooks/useProjectsWorkspaceState';
import {
  buildAssigneeById,
  buildMentionCandidates,
  getVisibleTasks,
} from './utils/project-workspace-utils';
import { ContentDialog } from '~/ui/dialogs/ContentDialog';
import { DeleteDialog } from '~/ui/dialogs/delete-dialog';
import { persistProjectViewPreferences } from './utils/project-view-preferences';

export function ProjectWorkspacePage({
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
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const {
    setView,
    setOrder,
    setScope,
    handleDetailOpenChange,
    handleOpenTask,
    handleEditTask,
    handleDeleteTask,
    handleMoveTaskStatus,
    handleReorderColumn,
    selectedTaskId,
    isDetailOpen,
  } = useProjectTasksController();

  const activeProjectId = searchParams.get('project');
  const {
    projects: workspaceProjects,
    hasProjects,
    projectName,
    activeProject,
    isCreateProjectOpen,
    newProjectName,
    newProjectImageUrl,
    isProjectDeleteOpen,
    projectToDelete,
    setCreateProjectOpen,
    setNewProjectName,
    setNewProjectImageUrl,
    handleProjectImageChange,
    createProject,
    openProjectDeleteDialog,
    setProjectDeleteOpen,
    deleteSelectedProject,
  } = useProjectsWorkspaceState(activeProjectId, projects);

  const visibleTasks = useMemo(
    () =>
      getVisibleTasks({
        tasks,
        currentUserId,
        scope: viewState.scope,
        order: viewState.order,
      }),
    [tasks, currentUserId, viewState.scope, viewState.order],
  );

  const projectScopedTasks = useMemo(() => {
    if (!activeProjectId) return visibleTasks;
    return visibleTasks.filter((task) => task.projectId === activeProjectId);
  }, [visibleTasks, activeProjectId]);

  const searchedTasks = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return projectScopedTasks;

    return projectScopedTasks.filter((task) => {
      const plainDescription = (task.description ?? '').replace(/<[^>]*>/g, ' ');
      const searchable = `${task.title} ${plainDescription}`.toLowerCase();
      return searchable.includes(query);
    });
  }, [projectScopedTasks, searchTerm]);

  const selectedTask = useMemo(
    () => tasks.find((task) => task.id === selectedTaskId) ?? null,
    [tasks, selectedTaskId],
  );
  const selectedTaskActivities = useMemo(
    () =>
      selectedTaskId
        ? taskActivities.filter((activity) => activity.taskId === selectedTaskId)
        : [],
    [taskActivities, selectedTaskId],
  );
  const selectedTaskComments = useMemo(
    () => (selectedTaskId ? taskComments.filter((comment) => comment.taskId === selectedTaskId) : []),
    [taskComments, selectedTaskId],
  );
  const assigneeById = useMemo(() => buildAssigneeById(assignableUsers), [assignableUsers]);
  const mentionCandidates = useMemo(() => buildMentionCandidates(assignableUsers), [assignableUsers]);

  useEffect(() => {
    const message = getTaskActionToastError(actionData);
    if (message) toast.error(message);
  }, [actionData]);

  useEffect(() => {
    if (!actionData) {
      setIsCreateOpen(false);
      return;
    }

    if (actionData.success === false && actionData.intent === 'create') {
      setIsCreateOpen(true);
    }
  }, [actionData]);

  function handleViewChange(value: string) {
    if (value === 'board' || value === 'list') {
      setView(value);
      persistProjectViewPreferences({
        view: value,
        order: viewState.order,
        scope: viewState.scope,
      });
    }
  }

  function handleOrderChange(value: string) {
    if (value === 'manual' || value === 'priority') {
      setOrder(value);
      persistProjectViewPreferences({
        view: viewState.view,
        order: value,
        scope: viewState.scope,
      });
    }
  }

  function handleScopeChange(value: string) {
    if (value === 'all' || value === 'assigned' || value === 'created') {
      setScope(value);
      persistProjectViewPreferences({
        view: viewState.view,
        order: viewState.order,
        scope: value,
      });
    }
  }

  const projectCreateDialog = (
    <ProjectCreateDialog
      open={isCreateProjectOpen}
      onOpenChange={setCreateProjectOpen}
      projectName={newProjectName}
      projectImageUrl={newProjectImageUrl}
      onProjectNameChange={setNewProjectName}
      onProjectImageChange={handleProjectImageChange}
      onClearProjectImage={() => setNewProjectImageUrl(null)}
      onSubmit={createProject}
    />
  );

  const projectDeleteDialog = (
    <DeleteDialog
      open={isProjectDeleteOpen}
      onOpenChange={setProjectDeleteOpen}
      id={projectToDelete?.id ?? ''}
      name={projectToDelete?.name ?? 'proyecto'}
      description="Esta accion eliminara el proyecto y desvinculara sus tareas. Queres continuar?"
      onConfirm={deleteSelectedProject}
    />
  );

  if (!activeProjectId && hasProjects) {
    return (
      <>
        <ProjectsOverview
          projects={workspaceProjects}
          onOpenCreateProject={() => setCreateProjectOpen(true)}
          onOpenDeleteProject={openProjectDeleteDialog}
        />
        {projectCreateDialog}
        {projectDeleteDialog}
      </>
    );
  }

  if (!hasProjects) {
    return (
      <main className="container mx-auto space-y-4 p-4">
        <InfoEmptyState
          title="Todavia no hay proyectos."
          description='Crea uno desde "Nuevo proyecto" para empezar.'
        />
        <div>
          <button
            type="button"
            onClick={() => setCreateProjectOpen(true)}
            className="inline-flex h-9 items-center gap-2 rounded-md border px-3 text-sm font-medium transition hover:bg-accent"
          >
            <Plus className="size-4" />
            Nuevo proyecto
          </button>
        </div>
        {projectCreateDialog}
        {projectDeleteDialog}
      </main>
    );
  }

  return (
    <main className="container mx-auto space-y-6 p-4">
      <ProjectTopSection
        projectName={projectName}
        viewState={viewState}
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
        onClearSearch={() => setSearchTerm('')}
        onOpenCreate={() => setIsCreateOpen(true)}
        onViewChange={handleViewChange}
        onOrderChange={handleOrderChange}
        onScopeChange={handleScopeChange}
        onDeleteProject={activeProject ? () => openProjectDeleteDialog(activeProject) : undefined}
      />

      <ContentDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        title="Nueva tarea"
        description="Crea una task sin perder contexto del board."
        contentClassName="max-h-[90vh] sm:max-w-3xl"
      >
        <CreateTask
          activeProjectId={activeProjectId ?? ''}
          actionData={actionData}
          isSubmitting={isSubmitting}
          mentionCandidates={mentionCandidates}
          className="space-y-3"
        />
      </ContentDialog>

      {searchedTasks.length === 0 && searchTerm.trim() ? (
        <InfoEmptyState
          title={`No hay resultados para "${searchTerm.trim()}".`}
          description="Proba con otra palabra clave."
        />
      ) : activeProjectId && projectScopedTasks.length === 0 ? (
        <InfoEmptyState
          title="No hay tareas en este proyecto todavia."
          description="Crea una tarea para empezar."
        />
      ) : visibleTasks.length === 0 ? (
        <InfoEmptyState title="Aun no hay tareas." description="Crea tu primera tarea para empezar." />
      ) : viewState.view === 'list' ? (
        <List
          tasks={searchedTasks}
          assigneeById={assigneeById}
          onOpenTask={handleOpenTask}
          onDeleteTask={handleDeleteTask}
        />
      ) : (
        <BoardView
          tasks={searchedTasks}
          order={viewState.order}
          assigneeById={assigneeById}
          onOpenTask={handleOpenTask}
          onEditTask={handleEditTask}
          onDeleteTask={handleDeleteTask}
          onMoveTaskStatus={handleMoveTaskStatus}
          onReorderColumn={handleReorderColumn}
        />
      )}

      {selectedTask ? (
        <Modal
          task={selectedTask}
          currentUserId={currentUserId}
          activities={selectedTaskActivities}
          comments={selectedTaskComments}
          assignableUsers={assignableUsers}
          open={isDetailOpen}
          onDeleteTask={handleDeleteTask}
          onOpenChange={handleDetailOpenChange}
        />
      ) : null}

      {projectDeleteDialog}
    </main>
  );
}



