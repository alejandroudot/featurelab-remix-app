import type { TaskActionData } from '../../types';

type ActionErrorsProps = {
  actionData: TaskActionData;
  fieldKey?: string;
  className?: string;
};

export function ActionErrors({
  actionData,
  fieldKey,
  className = 'text-xs text-red-600',
}: ActionErrorsProps) {
  const fieldError = fieldKey ? actionData?.fieldErrors?.[fieldKey]?.[0] : undefined;
  const formError = actionData?.formError;

  if (!fieldError && !formError) return null;

  return (
    <>
      {fieldError ? <p className={className}>{fieldError}</p> : null}
      {formError ? <p className={className}>{formError}</p> : null}
    </>
  );
}


