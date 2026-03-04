import { useState } from 'react';
import { DeleteDialog } from '~/ui/dialogs/delete-dialog';

type DeleteSectionProps = {
  taskId: string;
  taskTitle: string;
  onDeleteTask?: (taskId: string) => void;
};

export function DeleteSection({
  taskId,
  taskTitle,
  onDeleteTask,
}: DeleteSectionProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className="w-full rounded border bg-destructive px-2 py-1 text-sm font-medium"
        onClick={() => {
          setTimeout(() => setIsDeleteDialogOpen(true), 0);
        }}
      >
        Borrar Tarea
      </button>
      <DeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        name="task"
        description={`Esta accion es permanente. Queres borrar "${taskTitle}"?`}
        onConfirm={() => {
          onDeleteTask?.(taskId);
          setIsDeleteDialogOpen(false);
        }}
      />
    </>
  );
}

