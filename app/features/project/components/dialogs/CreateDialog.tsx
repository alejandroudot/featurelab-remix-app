import { useState } from 'react';
import { useLocation, useSubmit } from 'react-router';
import { ContentDialog } from '~/ui/dialogs/ContentDialog';

export function CreateDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const submit = useSubmit();
  const location = useLocation();
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectImageUrl, setNewProjectImageUrl] = useState<string | null>(null);

  function resetForm() {
    setNewProjectName('');
    setNewProjectImageUrl(null);
  }

  function handleProjectImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0];
    if (!file) {
      setNewProjectImageUrl(null);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') setNewProjectImageUrl(reader.result);
    };
    reader.readAsDataURL(file);
  }

  function handleCreateProject(event: { preventDefault: () => void }) {
    event.preventDefault();
    const name = newProjectName.trim();
    if (!name) return;
    const formData = new FormData();
    formData.set('name', name);
    if (newProjectImageUrl) formData.set('imageUrl', newProjectImageUrl);
    formData.set('redirectTo', `${location.pathname}${location.search}`);
    submit(formData, { method: 'post', action: '/api/projects/create' });
    resetForm();
    onOpenChange(false);
  }

  function handleOpenChange(open: boolean) {
    onOpenChange(open);
    if (!open) resetForm();
  }

  return (
    <ContentDialog
      open={open}
      onOpenChange={handleOpenChange}
      title="Nuevo proyecto"
      description="Crea un proyecto para organizar tus tareas."
      contentClassName="sm:max-w-md"
    >
      <form className="space-y-3" onSubmit={handleCreateProject}>
        <div className="space-y-1">
          <label htmlFor="project-name" className="text-sm font-medium">
            Nombre
          </label>
          <input
            id="project-name"
            value={newProjectName}
            onChange={(event) => setNewProjectName(event.currentTarget.value)}
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
            onChange={handleProjectImageChange}
            className="block w-full text-sm file:mr-3 file:rounded file:border file:bg-background file:px-3 file:py-1.5 file:text-sm file:transition hover:file:bg-muted"
          />
          {newProjectImageUrl ? (
            <div className="inline-flex items-center gap-2 rounded border px-2 py-1">
              <img src={newProjectImageUrl} alt="" className="size-8 rounded-sm object-cover" />
              <button
                type="button"
                onClick={() => setNewProjectImageUrl(null)}
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
            onClick={() => handleOpenChange(false)}
            className="rounded border px-3 py-1.5 text-sm transition hover:bg-muted"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={!newProjectName.trim()}
            className="rounded bg-slate-900 px-3 py-1.5 text-sm font-medium text-white transition disabled:opacity-50 dark:bg-slate-100 dark:text-slate-900"
          >
            Crear proyecto
          </button>
        </div>
      </form>
    </ContentDialog>
  );
}
