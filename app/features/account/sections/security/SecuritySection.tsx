import { useMemo, useState } from 'react';
import { SectionCard } from '../../shared/SectionCard';
import { PasswordField } from '~/ui/primitives/password-field';
import { getPasswordChecks, isPasswordPolicySatisfied } from '~/core/auth/password-policy';
import {
  ActionFeedbackText,
} from '~/ui/forms/feedback/action-feedback';
import { PasswordChecklist } from '~/ui/forms/security/password-checklist';
import { useFieldMatchOnBlur } from '~/ui/hooks/use-field-match-on-blur';
import { usePasswordMutation } from '../../client/mutation';

type SecuritySectionProps = {
  asCard?: boolean;
};

export function SecuritySection({ asCard = true }: SecuritySectionProps) {
  const { data: actionData, isPending: isSubmitting, mutateAsync: submitPassword } = usePasswordMutation();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const passwordChecks = useMemo(() => getPasswordChecks(newPassword), [newPassword]);
  const passwordMatch = useFieldMatchOnBlur({
    leftValue: newPassword,
    rightValue: confirmPassword,
    message: 'Las passwords no coinciden',
  });
  const canSubmitPasswordUpdate =
    !isSubmitting &&
    currentPassword.length > 0 &&
    newPassword.length > 0 &&
    confirmPassword.length > 0 &&
    isPasswordPolicySatisfied(newPassword) &&
    newPassword === confirmPassword;

  async function handleSubmit(event: { preventDefault: () => void }) {
    event.preventDefault();
    const data = await submitPassword({
      currentPassword,
      newPassword,
      confirmPassword,
    });
    if (!data.success) return;
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  }

  const content = (
    <>
      <form className="space-y-2" onSubmit={handleSubmit}>

        <div className="flex flex-col gap-1">
          <label htmlFor="currentPassword" className="text-sm font-medium">
            Password actual
          </label>
          <PasswordField
            id="currentPassword"
            name="currentPassword"
            value={currentPassword}
            onChange={(event) => setCurrentPassword(event.currentTarget.value)}
            className="w-full rounded border px-2 py-1 pr-10 text-sm"
          />
          <ActionFeedbackText actionData={actionData} fieldKey="currentPassword" />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="newPassword" className="text-sm font-medium">
            Password nueva
          </label>
          <PasswordField
            id="newPassword"
            name="newPassword"
            value={newPassword}
            onChange={(event) => setNewPassword(event.currentTarget.value)}
            className="w-full rounded border px-2 py-1 pr-10 text-sm"
            onBlur={passwordMatch.markTouched}
          />
          <ActionFeedbackText actionData={actionData} fieldKey="newPassword" />
          <PasswordChecklist checks={passwordChecks} />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="confirmPassword" className="text-sm font-medium">
            Confirmar password
          </label>
          <PasswordField
            id="confirmPassword"
            name="confirmPassword"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.currentTarget.value)}
            className="w-full rounded border px-2 py-1 pr-10 text-sm"
            onBlur={passwordMatch.markTouched}
          />
          <ActionFeedbackText
            actionData={actionData}
            fieldKey="confirmPassword"
            fallbackError={passwordMatch.mismatchError}
          />
        </div>

        <ActionFeedbackText actionData={actionData} showFormError showSuccessMessage />

        <button
          type="submit"
          disabled={!canSubmitPasswordUpdate}
          className="rounded bg-slate-900 px-3 py-1 text-sm font-medium text-white disabled:opacity-60"
        >
          {isSubmitting ? 'Guardando...' : 'Actualizar password'}
        </button>
      </form>
    </>
  );

  if (!asCard) return content;

  return (
    <SectionCard title="Security" description="Cambio de password y sesiones activas.">
      {content}
    </SectionCard>
  );
}
