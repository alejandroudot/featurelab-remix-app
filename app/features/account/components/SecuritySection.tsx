import { SectionCard } from './SectionCard';
import { useFetcher } from 'react-router';
import type { AccountActionData } from '../types';

export function SecuritySection() {
  const fetcher = useFetcher<AccountActionData>();
  const isSubmitting = fetcher.state === 'submitting';
  const actionData = fetcher.data;
  const currentPasswordError =
    actionData && !actionData.success && actionData.intent === 'password'
      ? actionData.fieldErrors?.currentPassword?.[0]
      : undefined;
  const newPasswordError =
    actionData && !actionData.success && actionData.intent === 'password'
      ? actionData.fieldErrors?.newPassword?.[0]
      : undefined;
  const confirmPasswordError =
    actionData && !actionData.success && actionData.intent === 'password'
      ? actionData.fieldErrors?.confirmPassword?.[0]
      : undefined;
  const formError =
    actionData && !actionData.success && actionData.intent === 'password'
      ? actionData.formError
      : undefined;
  const successMessage =
    actionData && actionData.success && actionData.intent === 'password'
      ? actionData.message
      : undefined;

  return (
    <SectionCard title="Security" description="Cambio de password y sesiones activas.">
      <fetcher.Form method="post" className="space-y-2">
        <input type="hidden" name="intent" value="password-update" />

        <div className="flex flex-col gap-1">
          <label htmlFor="currentPassword" className="text-sm font-medium">
            Password actual
          </label>
          <input
            id="currentPassword"
            name="currentPassword"
            type="password"
            className="rounded border px-2 py-1 text-sm"
          />
          {currentPasswordError ? (
            <p className="text-xs text-red-600">{currentPasswordError}</p>
          ) : null}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="newPassword" className="text-sm font-medium">
            Password nueva
          </label>
          <input
            id="newPassword"
            name="newPassword"
            type="password"
            className="rounded border px-2 py-1 text-sm"
          />
          {newPasswordError ? <p className="text-xs text-red-600">{newPasswordError}</p> : null}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="confirmPassword" className="text-sm font-medium">
            Confirmar password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            className="rounded border px-2 py-1 text-sm"
          />
          {confirmPasswordError ? (
            <p className="text-xs text-red-600">{confirmPasswordError}</p>
          ) : null}
        </div>

        {formError ? <p className="text-xs text-red-600">{formError}</p> : null}
        {successMessage ? <p className="text-xs text-emerald-700">{successMessage}</p> : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded bg-slate-900 px-3 py-1 text-sm font-medium text-white disabled:opacity-60"
        >
          {isSubmitting ? 'Guardando...' : 'Actualizar password'}
        </button>
      </fetcher.Form>
    </SectionCard>
  );
}
