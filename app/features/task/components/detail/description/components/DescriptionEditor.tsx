import { RichTextEditor } from '~/ui/editors/rich-text/RichTextEditor';
import type { TaskActionData } from '../../../../types';
import { FormFooter } from './FormFooter';

type DescriptionEditorProps = {
  taskId: string;
  redirectTo: string;
  draftDescription: string;
  mentionCandidates: string[];
  hasPendingEditorUploads: boolean;
  hasInlineBase64Images: boolean;
  editorImageError: string | null;
  updateErrorActionData: TaskActionData;
  isSubmitting: boolean;
  onDraftDescriptionChange: (value: string) => void;
  onPendingUploadsChange: (hasPendingUploads: boolean) => void;
  onEditorImageErrorChange: (message: string | null) => void;
  onImageUpload: (file: File) => Promise<string>;
  onCancel: () => void;
};

export function DescriptionEditor({
  taskId,
  redirectTo,
  draftDescription,
  mentionCandidates,
  hasPendingEditorUploads,
  hasInlineBase64Images,
  editorImageError,
  updateErrorActionData,
  isSubmitting,
  onDraftDescriptionChange,
  onPendingUploadsChange,
  onEditorImageErrorChange,
  onImageUpload,
  onCancel,
}: DescriptionEditorProps) {
  return (
    <>
      <input type="hidden" name="id" value={taskId} />
      <input type="hidden" name="redirectTo" value={redirectTo} />
      <RichTextEditor
        name="description"
        value={draftDescription}
        onChange={onDraftDescriptionChange}
        mentionCandidates={mentionCandidates}
        autoFocus
        onPendingUploadsChange={onPendingUploadsChange}
        onImageUploadError={onEditorImageErrorChange}
        onImageUpload={onImageUpload}
      />
      <FormFooter
        hasPendingEditorUploads={hasPendingEditorUploads}
        hasInlineBase64Images={hasInlineBase64Images}
        editorImageError={editorImageError}
        updateErrorActionData={updateErrorActionData}
        isSubmitting={isSubmitting}
        onCancel={onCancel}
      />
    </>
  );
}
