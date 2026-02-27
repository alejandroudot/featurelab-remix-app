import { ProfileSection } from './components/ProfileSection';
import { SecuritySection } from './components/SecuritySection';
import { PreferencesSection } from './components/PreferencesSection';
import { PlanSection } from './components/PlanSection';

type AccountPageProps = {
  user: {
    id: string;
    email: string;
    role: 'user' | 'admin';
  };
};

export function AccountPage({ user }: AccountPageProps) {
  return (
    <main className="container mx-auto p-4">
      <div className="mb-4">
        <h1 className="text-2xl font-semibold">Account</h1>
        <p className="text-sm opacity-75">Administra tu perfil, seguridad y preferencias.</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ProfileSection user={user} />
        <SecuritySection />
        <PreferencesSection />
        <PlanSection />
      </div>
    </main>
  );
}
