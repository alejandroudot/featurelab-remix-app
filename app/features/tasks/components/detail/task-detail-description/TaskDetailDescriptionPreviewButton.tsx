import { RichTextViewer } from '~/ui/editors/rich-text/RichTextEditor';

type TaskDetailDescriptionPreviewButtonProps = {
  description: string | null | undefined;
  onStartEdit: () => void;
};

export function TaskDetailDescriptionPreviewButton({
  description,
  onStartEdit,
}: TaskDetailDescriptionPreviewButtonProps) {
  return (
    <button type="button" onClick={onStartEdit} className="w-full text-left hover:bg-accent/40">
      {description ? (
        <RichTextViewer content={description} />
      ) : (
        <span className="block rounded border border-dashed p-2 text-sm opacity-85">
          Sin descripcion por ahora. Click para editar.
        </span>
      )}
    </button>
  );
}
