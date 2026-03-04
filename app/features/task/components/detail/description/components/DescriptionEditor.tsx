import { RichTextEditor } from '~/ui/editors/rich-text/RichTextEditor';
import type { TaskActionData } from '../../../../types';
import { FormFooter } from './FormFooter';

type DescriptionEditorProps = {
  draftDescription: string;
  mentionCandidates: string[];
  hasPendingEditorUploads: boolean;
  hasInlineBase64Images: boolean;
  editorImageError: string | null;
  actionData: TaskActionData;
  isSubmitting: boolean;
  onDraftDescriptionChange: (value: string) => void;
  onPendingUploadsChange: (hasPendingUploads: boolean) => void;
  onEditorImageErrorChange: (message: string | null) => void;
  onImageUpload: (file: File) => Promise<string>;
  onCancel: () => void;
};

export function DescriptionEditor({
  draftDescription,
  mentionCandidates,
  hasPendingEditorUploads,
  hasInlineBase64Images,
  editorImageError,
  actionData,
  isSubmitting,
  onDraftDescriptionChange,
  onPendingUploadsChange,
  onEditorImageErrorChange,
  onImageUpload,
  onCancel,
}: DescriptionEditorProps) {
  return (
    <>
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
        actionData={actionData}
        isSubmitting={isSubmitting}
        onCancel={onCancel}
      />
    </>
  );
}
