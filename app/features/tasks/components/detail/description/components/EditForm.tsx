import type { useFetcher } from 'react-router';
import { RichTextEditor } from '~/ui/editors/rich-text/RichTextEditor';
import type { TaskActionData } from '../../../../types';
import { FormFooter } from './FormFooter';

type TaskContentFetcher = ReturnType<typeof useFetcher<TaskActionData>>;

type EditFormProps = {
  fetcher: TaskContentFetcher;
  taskId: string;
  redirectTo: string;
  draftDescription: string;
  mentionCandidates: string[];
  hasPendingEditorUploads: boolean;
  hasInlineBase64Images: boolean;
  editorImageError: string | null;
  updateActionData: TaskActionData;
  onDraftDescriptionChange: (value: string) => void;
  onPendingUploadsChange: (hasPendingUploads: boolean) => void;
  onEditorImageErrorChange: (value: string | null) => void;
  onImageUpload: (file: File) => Promise<string>;
  onSubmit: (event: { preventDefault: () => void }) => void;
  onCancel: () => void;
};

export function EditForm({
  fetcher,
  taskId,
  redirectTo,
  draftDescription,
  mentionCandidates,
  hasPendingEditorUploads,
  hasInlineBase64Images,
  editorImageError,
  updateActionData,
  onDraftDescriptionChange,
  onPendingUploadsChange,
  onEditorImageErrorChange,
  onImageUpload,
  onSubmit,
  onCancel,
}: EditFormProps) {
  return (
    <fetcher.Form method="post" className="space-y-2" onSubmit={onSubmit}>
      <input type="hidden" name="intent" value="update" />
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
        updateActionData={updateActionData}
        isSubmitting={fetcher.state === 'submitting'}
        onCancel={onCancel}
      />
    </fetcher.Form>
  );
}

