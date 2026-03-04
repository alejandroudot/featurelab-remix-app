import { RichTextEditor } from '~/ui/editors/rich-text/RichTextEditor';
import { ActionFeedbackText } from '~/ui/forms/feedback/action-feedback';
import type { TaskActionData } from '../../../../types';

type CreateFormProps = {
  createBody: string;
  mentionCandidates: string[];
  createActionData: TaskActionData;
  isSubmitting: boolean;
  onCreateBodyChange: (value: string) => void;
  onSubmit: (event: { preventDefault: () => void }) => void;
};

type CreateFooterProps = {
  createActionData: TaskActionData;
  isSubmitting: boolean;
};

function CreateFooter({ createActionData, isSubmitting }: CreateFooterProps) {
  const createErrorActionData =
    createActionData && createActionData.success === false ? createActionData : undefined;

  return (
    <>
      <ActionFeedbackText actionData={createErrorActionData} fieldKey="commentBody" showFormError />
      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded bg-slate-900 px-3 py-1 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
      >
        {isSubmitting ? 'Comentando...' : 'Comentar'}
      </button>
    </>
  );
}

export function CreateForm({
  createBody,
  mentionCandidates,
  createActionData,
  isSubmitting,
  onCreateBodyChange,
  onSubmit,
}: CreateFormProps) {
  return (
    <form className="mb-3 space-y-2" onSubmit={onSubmit}>
      <RichTextEditor
        name="commentBody"
        value={createBody}
        onChange={onCreateBodyChange}
        mentionCandidates={mentionCandidates}
        enableImageUpload={false}
        placeholder="Escribe un comentario..."
      />
      <CreateFooter
        createActionData={createActionData}
        isSubmitting={isSubmitting}
      />
    </form>
  );
}
