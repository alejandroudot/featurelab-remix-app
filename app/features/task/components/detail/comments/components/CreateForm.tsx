import { RichTextEditor } from '~/ui/editors/rich-text/RichTextEditor';
import { ActionFeedbackText } from '~/ui/forms/feedback/action-feedback';
import type { TaskActionData } from '../../../../types';

type CreateFormProps = {
  createBody: string;
  mentionCandidates: string[];
  createErrorActionData: TaskActionData;
  isSubmitting: boolean;
  onCreateBodyChange: (value: string) => void;
  onSubmit: (event: { preventDefault: () => void }) => void;
};

type CreateFooterProps = {
  createErrorActionData: TaskActionData;
  isSubmitting: boolean;
};

function CreateFooter({ createErrorActionData, isSubmitting }: CreateFooterProps) {
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
  createErrorActionData,
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
        createErrorActionData={createErrorActionData}
        isSubmitting={isSubmitting}
      />
    </form>
  );
}
