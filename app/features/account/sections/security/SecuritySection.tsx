import { useMemo, useState } from 'react';
import { SectionCard } from '../../shared/SectionCard';
import { PasswordField } from '~/ui/primitives/password-field';
import { useFetcher } from 'react-router';
import { getPasswordChecks, isPasswordPolicySatisfied } from '~/core/auth/password-policy';
import {
  ActionFeedbackText,
} from '~/ui/forms/action-feedback';
import { PasswordPolicyChecklist } from '~/ui/forms/password-policy-checklist';
import { useFieldMatchOnBlur } from '~/ui/hooks/use-field-match-on-blur';
import type { AccountActionData } from '../../types';

type SecuritySectionProps = {
  asCard?: boolean;
};

export function SecuritySection({ asCard = true }: SecuritySectionProps) {
  const fetcher = useFetcher<AccountActionData>();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const isSubmitting = fetcher.state === 'submitting';
  const actionData = fetcher.data;
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

  const content = (
    <>
      <fetcher.Form method="post" action="/api/account/password" className="space-y-2">

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
          <ActionFeedbackText actionData={actionData} intent="password" fieldKey="currentPassword" />
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
          <ActionFeedbackText actionData={actionData} intent="password" fieldKey="newPassword" />
          <PasswordPolicyChecklist checks={passwordChecks} />
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
            intent="password"
            fieldKey="confirmPassword"
            fallbackError={passwordMatch.mismatchError}
          />
        </div>

        <ActionFeedbackText actionData={actionData} intent="password" showFormError showSuccessMessage />

        <button
          type="submit"
          disabled={!canSubmitPasswordUpdate}
          className="rounded bg-slate-900 px-3 py-1 text-sm font-medium text-white disabled:opacity-60"
        >
          {isSubmitting ? 'Guardando...' : 'Actualizar password'}
        </button>
      </fetcher.Form>
    </>
  );

  if (!asCard) return content;

  return (
    <SectionCard title="Security" description="Cambio de password y sesiones activas.">
      {content}
    </SectionCard>
  );
}
