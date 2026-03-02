import { useState } from 'react';
import { SummaryCard } from './shared/SummaryCard';
import { ProfileSection } from './sections/profile/ProfileSection';
import { SecuritySection } from './sections/security/SecuritySection';
import { PlanSection } from './sections/plan/PlanSection';
import { ContentDialog } from '~/ui/dialogs/ContentDialog';
import type { UserRole } from '~/core/auth/auth.types';

type AccountPageProps = {
  user: {
    id: string;
    email: string;
    displayName: string | null;
    phone: string | null;
    about: string | null;
    role: UserRole;
  };
};

type AccountSectionKey = 'profile' | 'security' | 'plan';

const DIALOG_META: Record<AccountSectionKey, { title: string; description: string }> = {
  profile: { title: 'Perfil', description: 'Actualiza tu informacion basica.' },
  security: { title: 'Seguridad', description: 'Cambio de password y control de credenciales.' },
  plan: { title: 'Plan', description: 'Plan actual y opciones de upgrade.' },
};

function renderSectionContent(section: AccountSectionKey, user: AccountPageProps['user']) {
  if (section === 'profile') return <ProfileSection user={user} asCard={false} />;
  if (section === 'security') return <SecuritySection asCard={false} />;
  return <PlanSection asCard={false} />;
}

export function AccountPage({ user }: AccountPageProps) {
  const [openSection, setOpenSection] = useState<AccountSectionKey | null>(null);

  return (
    <main className="container mx-auto p-4">
      <div className="mb-4">
        <h1 className="text-2xl font-semibold">Account</h1>
        <p className="text-sm opacity-75">Administra tu perfil, seguridad y plan.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <SummaryCard
          title="Perfil"
          description="Datos personales y de contacto."
          onOpen={() => setOpenSection('profile')}
          ctaLabel="Actualizar"
          preview={
            <div className="space-y-1 text-xs opacity-80">
              <p>
                <span className="font-medium">Nombre:</span> {user.displayName ?? 'Sin definir'}
              </p>
              <p>
                <span className="font-medium">Email:</span> {user.email}
              </p>
            </div>
          }
        />

        <SummaryCard
          title="Seguridad"
          description="Password, credenciales y proteccion de cuenta."
          onOpen={() => setOpenSection('security')}
          ctaLabel="Actualizar"
        />

        <SummaryCard
          title="Plan"
          description="Plan actual, limites y upgrade."
          onOpen={() => setOpenSection('plan')}
          ctaLabel="Actualizar"
          preview={
            <div className="space-y-1 text-xs opacity-80">
              <p>
                <span className="font-medium">Plan:</span> Free
              </p>
              <p>
                <span className="font-medium">Upgrade:</span> Coming soon
              </p>
            </div>
          }
        />
      </div>

      {openSection ? (
        <ContentDialog
          open
          onOpenChange={(open) => {
            if (!open) setOpenSection(null);
          }}
          title={DIALOG_META[openSection].title}
          description={DIALOG_META[openSection].description}
        >
          {renderSectionContent(openSection, user)}
        </ContentDialog>
      ) : null}
    </main>
  );
}
