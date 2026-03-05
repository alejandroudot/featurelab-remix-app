import { Pencil } from 'lucide-react';

type ProjectNameProps = {
  isEditing: boolean;
  draft: string;
  projectName: string;
  onStartEdit: () => void;
  onDraftChange: (value: string) => void;
  onCommit: () => void;
  onCancel: () => void;
};

export function ProjectName({
  isEditing,
  draft,
  projectName,
  onStartEdit,
  onDraftChange,
  onCommit,
  onCancel,
}: ProjectNameProps) {
  if (isEditing) {
    return (
      <input
        autoFocus
        value={draft}
        onChange={(event) => onDraftChange(event.currentTarget.value)}
        onBlur={onCommit}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            event.preventDefault();
            onCommit();
          }
          if (event.key === 'Escape') onCancel();
        }}
        className="h-10 w-full max-w-xl rounded-md border bg-background px-3 text-2xl font-semibold outline-none ring-offset-background transition focus-visible:ring-2 focus-visible:ring-ring/50"
      />
    );
  }

  return (
    <button
      type="button"
      onClick={onStartEdit}
      className="inline-flex items-center gap-2 text-left text-2xl font-semibold transition hover:opacity-80"
    >
      <span>{projectName}</span>
      <Pencil className="size-4 text-muted-foreground" />
    </button>
  );
}
