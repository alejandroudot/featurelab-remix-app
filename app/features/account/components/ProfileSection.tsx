import { SectionCard } from './SectionCard';
import { useFetcher } from 'react-router';
import { ActionFeedbackText } from '~/ui/forms/action-feedback';
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
          <ActionFeedbackText actionData={actionData} intent="profile" fieldKey="displayName" />
          <ActionFeedbackText actionData={actionData} intent="profile" showFormError showSuccessMessage />
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
