import { SectionCard } from './SectionCard';
import { useFetcher } from 'react-router';
import type { AccountActionData } from '../types';

type ProfileSectionProps = {
  user: {
    id: string;
    email: string;
    displayName: string | null;
    role: 'user' | 'admin';
  };
};

export function ProfileSection({ user }: ProfileSectionProps) {
  const fetcher = useFetcher<AccountActionData>();
  const isSubmitting = fetcher.state === 'submitting';
  const actionData = fetcher.data;
  const displayNameFieldError =
    actionData && !actionData.success && actionData.intent === 'profile'
      ? actionData.fieldErrors?.displayName?.[0]
      : undefined;
  const formError =
    actionData && !actionData.success && actionData.intent === 'profile'
      ? actionData.formError
      : undefined;
  const successMessage =
    actionData && actionData.success && actionData.intent === 'profile'
      ? actionData.message
      : undefined;

  return (
    <SectionCard title="Profile" description="Datos basicos de tu cuenta.">
      <div className="mb-3 space-y-2 text-sm">
        <p>
          <span className="font-medium">Email:</span> {user.email}
        </p>
        <p>
          <span className="font-medium">Role:</span> {user.role}
        </p>
      </div>

      <fetcher.Form method="post" className="space-y-2">
        <input type="hidden" name="intent" value="profile-update" />
        <div className="flex flex-col gap-1">
          <label htmlFor="displayName" className="text-sm font-medium">
            Nombre visible
          </label>
          <input
            id="displayName"
            name="displayName"
            defaultValue={user.displayName ?? ''}
            className="rounded border px-2 py-1 text-sm"
          />
          {displayNameFieldError ? (
            <p className="text-xs text-red-600">{displayNameFieldError}</p>
          ) : null}
          {formError ? <p className="text-xs text-red-600">{formError}</p> : null}
          {successMessage ? <p className="text-xs text-emerald-700">{successMessage}</p> : null}
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded bg-slate-900 px-3 py-1 text-sm font-medium text-white disabled:opacity-60"
        >
          {isSubmitting ? 'Guardando...' : 'Guardar perfil'}
        </button>
      </fetcher.Form>
    </SectionCard>
  );
}
