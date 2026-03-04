import { useState } from 'react';
import { SectionCard } from '../../shared/SectionCard';
import { ActionFeedbackText } from '~/ui/forms/feedback/action-feedback';
import type { UserRole } from '~/core/auth/auth.types';
import { Avatar, AvatarFallback } from '~/ui/primitives/avatar';
import { useProfileMutation } from '../../client/mutation';

type ProfileSectionProps = {
  user: {
    id: string;
    email: string;
    displayName: string | null;
    phone: string | null;
    about: string | null;
    role: UserRole;
  };
  asCard?: boolean;
};

export function ProfileSection({ user, asCard = true }: ProfileSectionProps) {
  const { data: actionData, isPending: isSubmitting, mutate: submitProfile } = useProfileMutation();
  const [displayName, setDisplayName] = useState(user.displayName ?? '');
  const [phone, setPhone] = useState(user.phone ?? '');
  const [about, setAbout] = useState(user.about ?? '');
  const profileName = displayName.trim() || 'Usuario';
  const roleLabel = user.role === 'admin' ? 'Admin' : user.role === 'manager' ? 'Manager' : 'User';
  const avatarFallback = buildAvatarFallback(profileName);

  function handleSubmit(event: { preventDefault: () => void }) {
    event.preventDefault();
    submitProfile({
      displayName,
      phone,
      about,
    });
  }

  const content = (
    <>
      <div className="mb-4 rounded border bg-muted/20 p-3">
        <div className="flex items-center gap-3">
          <Avatar data-size="lg">
            <AvatarFallback>{avatarFallback}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{profileName}</p>
            <p className="truncate text-xs opacity-75">{user.email}</p>
            <p className="mt-1 text-xs font-medium uppercase tracking-wide opacity-70">{roleLabel}</p>
          </div>
        </div>
      </div>

      <form className="space-y-2" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-1">
          <label htmlFor="displayName" className="text-sm font-medium">
            Nombre visible
          </label>
          <input
            id="displayName"
            name="displayName"
            value={displayName}
            onChange={(event) => setDisplayName(event.currentTarget.value)}
            className="rounded border px-2 py-1 text-sm"
          />
          <ActionFeedbackText actionData={actionData} fieldKey="displayName" />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="phone" className="text-sm font-medium">
            Telefono
          </label>
          <input
            id="phone"
            name="phone"
            value={phone}
            onChange={(event) => setPhone(event.currentTarget.value)}
            className="rounded border px-2 py-1 text-sm"
          />
          <ActionFeedbackText actionData={actionData} fieldKey="phone" />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="about" className="text-sm font-medium">
            About
          </label>
          <textarea
            id="about"
            name="about"
            value={about}
            onChange={(event) => setAbout(event.currentTarget.value)}
            className="min-h-24 rounded border px-2 py-1 text-sm"
          />
          <ActionFeedbackText actionData={actionData} fieldKey="about" />
        </div>

        <ActionFeedbackText actionData={actionData} showFormError showSuccessMessage />

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded bg-slate-900 px-3 py-1 text-sm font-medium text-white disabled:opacity-60"
        >
          {isSubmitting ? 'Guardando...' : 'Guardar perfil'}
        </button>
      </form>

      {!asCard ? (
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          <section className="rounded border p-3">
            <h3 className="text-sm font-semibold">Work</h3>
            <div className="mt-2 space-y-2">
              <PlaceholderField label="Organization" />
              <PlaceholderField label="Department" />
              <PlaceholderField label="Started working on" />
              <PlaceholderField label="Manager" />
              <PlaceholderField label="Work phone" />
            </div>
          </section>
          <section className="rounded border p-3">
            <h3 className="text-sm font-semibold">Expertise</h3>
            <div className="mt-2 space-y-2">
              <PlaceholderField label="Applications" />
              <PlaceholderField label="Languages" />
              <PlaceholderField label="Programming languages" />
              <PlaceholderField label="Skills" />
              <PlaceholderField label="Certifications" />
            </div>
          </section>
          <section className="rounded border p-3">
            <h3 className="text-sm font-semibold">Location</h3>
            <div className="mt-2 space-y-2">
              <PlaceholderField label="Country" />
              <PlaceholderField label="City" />
              <PlaceholderField label="Address" />
            </div>
          </section>
          <section className="rounded border p-3">
            <h3 className="text-sm font-semibold">Other</h3>
            <div className="mt-2 space-y-2">
              <PlaceholderField label="Driver license" />
              <PlaceholderField label="Additional details" />
            </div>
          </section>
        </div>
      ) : null}
    </>
  );

  if (!asCard) return content;

  return (
    <SectionCard title="Profile" description="Datos basicos de tu cuenta.">
      {content}
    </SectionCard>
  );
}

type PlaceholderFieldProps = {
  label: string;
};

function PlaceholderField({ label }: PlaceholderFieldProps) {
  return (
    <div>
      <p className="text-xs font-medium opacity-80">{label}</p>
      <p className="text-xs opacity-60">Proximamente</p>
    </div>
  );
}

function buildAvatarFallback(name: string): string {
  const tokens = name
    .split(/\s+/)
    .map((token) => token.trim())
    .filter(Boolean);

  if (!tokens.length) return 'U';
  if (tokens.length === 1) return tokens[0].slice(0, 2).toUpperCase();
  return `${tokens[0][0]}${tokens[1][0]}`.toUpperCase();
}
