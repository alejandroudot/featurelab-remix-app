type ProjectDescriptionProps = {
  isEditing: boolean;
  draft: string;
  currentDescription: string | null;
  onStartEdit: () => void;
  onDraftChange: (value: string) => void;
  onCommit: () => void;
  onCancel: () => void;
};

export function ProjectDescription({
  isEditing,
  draft,
  currentDescription,
  onStartEdit,
  onDraftChange,
  onCommit,
  onCancel,
}: ProjectDescriptionProps) {
  if (isEditing) {
    return (
      <textarea
        autoFocus
        value={draft}
        onChange={(event) => onDraftChange(event.currentTarget.value)}
        onBlur={onCommit}
        onKeyDown={(event) => {
          if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
            event.preventDefault();
            onCommit();
          }
          if (event.key === 'Escape') onCancel();
        }}
        rows={2}
        maxLength={500}
        className="w-full max-w-2xl rounded-md border bg-background px-3 py-2 text-sm outline-none ring-offset-background transition placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring/50"
        placeholder="Descripcion del proyecto..."
      />
    );
  }

  return (
    <button
      type="button"
      onClick={onStartEdit}
      className="text-left text-sm text-muted-foreground transition hover:text-foreground"
    >
      {currentDescription?.trim() || 'Agregar descripcion del proyecto'}
    </button>
  );
}
