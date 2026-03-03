import { useNavigate, useSubmit } from 'react-router';
import { useShallow } from 'zustand/react/shallow';
import { DeleteDialog as DeleteDialogBase } from '~/ui/dialogs/delete-dialog';
import { useWorkspaceUiStore } from '~/features/project/store/ui.store';
import { useWorkspaceDataStore } from '~/features/project/store/data.store';

export function DeleteDialog({
  open,
  onOpenChange,
  projectToDeleteId,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectToDeleteId: string | null;
}) {
  const submit = useSubmit();
  const navigate = useNavigate();
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

  function handleDeleteProject() {
    if (!projectToDeleteId) return;
    if (activeProjectId === projectToDeleteId) navigate('/', { replace: true });
    const formData = new FormData();
    formData.set('intent', 'project-delete');
    formData.set('id', projectToDeleteId);
    submit(formData, { method: 'post' });
    onOpenChange(false);
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
