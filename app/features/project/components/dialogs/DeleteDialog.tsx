import { useRevalidator } from 'react-router';
import { useShallow } from 'zustand/react/shallow';
import { DeleteDialog as DeleteDialogBase } from '~/ui/dialogs/delete-dialog';
import { useWorkspaceDataStore } from '~/features/store/workspace-data.store';
import { useProjectDialogStore } from '~/features/store/project-dialog.store';
import { useDeleteProjectMutation } from '~/features/project/client/mutation';
import { revalidateAfterSuccess } from '~/lib/query/mutation-result';

export function DeleteDialog() {
  const { mutateAsync: deleteProject } = useDeleteProjectMutation();
  const revalidator = useRevalidator();
  const { isProjectDeleteOpen, setProjectDeleteOpen, projectToDeleteId } = useProjectDialogStore(
    useShallow((state) => ({
      isProjectDeleteOpen: state.isProjectDeleteOpen,
      setProjectDeleteOpen: state.setProjectDeleteOpen,
      projectToDeleteId: state.projectToDeleteId,
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
    const data = await deleteProject({ id: projectToDeleteId });
    if (!revalidateAfterSuccess(data, revalidator.revalidate)) return;
    setProjectDeleteOpen(false);
  }

  return (
    <DeleteDialogBase
      open={isProjectDeleteOpen}
      onOpenChange={setProjectDeleteOpen}
      name={projectToDelete?.name ?? 'proyecto'}
      description="Esta accion eliminara el proyecto y desvinculara sus tareas. Queres continuar?"
      onConfirm={handleDeleteProject}
    />
  );
}
