import { useShallow } from 'zustand/react/shallow';
import { ContentDialog } from '~/ui/dialogs/ContentDialog';
import { CreateTask } from '~/features/task/components/create/CreateTask';
import type { TaskActionData } from '~/features/task/types';
import { useWorkspaceUiStore } from '~/features/project/store/ui.store';
import { useWorkspaceDataStore } from '~/features/project/store/data.store';

export function TaskCreateDialog({
  actionData,
  isSubmitting,
}: {
  actionData: TaskActionData;
  isSubmitting: boolean;
}) {
  const { isCreateTaskOpen, setCreateTaskOpen } = useWorkspaceUiStore(
    useShallow((state) => ({
      isCreateTaskOpen: state.isCreateTaskOpen,
      setCreateTaskOpen: state.setCreateTaskOpen,
    })),
  );
  const { assignableUsers } = useWorkspaceDataStore(
    useShallow((state) => ({
      assignableUsers: state.assignableUsers,
    })),
  );
  const mentionCandidates = [...new Set(assignableUsers.map((user) => user.email.toLowerCase()))];

  return (
    <ContentDialog
      open={isCreateTaskOpen}
      onOpenChange={setCreateTaskOpen}
      title="Nueva tarea"
      description="Crea una task sin perder contexto del board."
      contentClassName="max-h-[90vh] sm:max-w-3xl"
    >
      <CreateTask actionData={actionData} isSubmitting={isSubmitting} mentionCandidates={mentionCandidates} className="space-y-3" />
    </ContentDialog>
  );
}
