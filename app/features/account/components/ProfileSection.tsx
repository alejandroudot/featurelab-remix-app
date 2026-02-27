import { SectionCard } from './SectionCard';

type ProfileSectionProps = {
  user: {
    id: string;
    email: string;
    role: 'user' | 'admin';
  };
};

export function ProfileSection({ user }: ProfileSectionProps) {
  return (
    <SectionCard title="Profile" description="Datos basicos de tu cuenta.">
      <div className="space-y-2 text-sm">
        <p>
          <span className="font-medium">Email:</span> {user.email}
        </p>
        <p>
          <span className="font-medium">Role:</span> {user.role}
        </p>
      </div>
    </SectionCard>
  );
}
