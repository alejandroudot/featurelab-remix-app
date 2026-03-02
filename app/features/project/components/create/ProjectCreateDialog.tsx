import type { FormEvent } from 'react';
import { ContentDialog } from '~/ui/dialogs/ContentDialog';

type ProjectCreateDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectName: string;
  projectImageUrl: string | null;
  onProjectNameChange: (value: string) => void;
  onProjectImageChange: (event: FormEvent<HTMLInputElement>) => void;
  onClearProjectImage: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export function ProjectCreateDialog({
  open,
  onOpenChange,
  projectName,
  projectImageUrl,
  onProjectNameChange,
  onProjectImageChange,
  onClearProjectImage,
  onSubmit,
}: ProjectCreateDialogProps) {
  return (
    <ContentDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Nuevo proyecto"
      description="Crea un proyecto para organizar tus tareas."
      contentClassName="sm:max-w-md"
    >
      <form className="space-y-3" onSubmit={onSubmit}>
        <div className="space-y-1">
          <label htmlFor="project-name" className="text-sm font-medium">
            Nombre
          </label>
          <input
            id="project-name"
            value={projectName}
            onChange={(event) => onProjectNameChange(event.currentTarget.value)}
            placeholder="Ej: Product Core"
            className="h-9 w-full rounded-md border bg-background px-3 text-sm outline-none ring-offset-background transition placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring/50"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="project-image" className="text-sm font-medium">
            Imagen
          </label>
          <input
            id="project-image"
            type="file"
            accept="image/*"
            onChange={onProjectImageChange}
            className="block w-full text-sm file:mr-3 file:rounded file:border file:bg-background file:px-3 file:py-1.5 file:text-sm file:transition hover:file:bg-muted"
          />
          {projectImageUrl ? (
            <div className="inline-flex items-center gap-2 rounded border px-2 py-1">
              <img src={projectImageUrl} alt="" className="size-8 rounded-sm object-cover" />
              <button
                type="button"
                onClick={onClearProjectImage}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Quitar imagen
              </button>
            </div>
          ) : null}
        </div>

        <div className="flex justify-end gap-2 pt-1">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="rounded border px-3 py-1.5 text-sm transition hover:bg-muted"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={!projectName.trim()}
            className="rounded bg-slate-900 px-3 py-1.5 text-sm font-medium text-white transition disabled:opacity-50 dark:bg-slate-100 dark:text-slate-900"
          >
            Crear proyecto
          </button>
        </div>
      </form>
    </ContentDialog>
  );
}
