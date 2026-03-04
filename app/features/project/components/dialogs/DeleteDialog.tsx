import { useLocation } from 'react-router';
import { useShallow } from 'zustand/react/shallow';
import { DeleteDialog as DeleteDialogBase } from '~/ui/dialogs/delete-dialog';
import { useWorkspaceUiStore } from '~/features/store/workspace-ui.store';
import { useWorkspaceDataStore } from '~/features/store/workspace-data.store';
import { useDeleteProjectMutation } from '~/features/project/client/mutation';

export function DeleteDialog({
  open,
  onOpenChange,
  projectToDeleteId,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectToDeleteId: string | null;
}) {
  const { mutateAsync: deleteProject } = useDeleteProjectMutation();
  const location = useLocation();
  const { activeProjectId } = useWorkspaceUiStore(
    useShallow((state) => ({
      activeProjectId: state.activeProjectId,
    })),
  );
  const { projects } = useWorkspaceDataStore(
    useShallow((state) => ({
      projects: state.projects,
    })),
  );
  const projectToDelete = projects.find((project) => project.id === projectToDeleteId) ?? null;

  async function handleDeleteProject() {
    if (!projectToDeleteId) return;
    const deletingActiveProject = activeProjectId === projectToDeleteId;
    const data = await deleteProject({ id: projectToDeleteId });
    if (!data || !data.success) return;
    onOpenChange(false);
    const nextPath = deletingActiveProject ? '/' : `${location.pathname}${location.search}`;
    window.location.assign(nextPath);
  }

  return (
    <DeleteDialogBase
      open={open}
      onOpenChange={onOpenChange}
      id={projectToDelete?.id ?? ''}
      name={projectToDelete?.name ?? 'proyecto'}
      description="Esta accion eliminara el proyecto y desvinculara sus tareas. Queres continuar?"
      onConfirm={handleDeleteProject}
    />
  );
}
