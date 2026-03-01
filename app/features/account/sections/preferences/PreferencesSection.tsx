import { SectionCard } from '../../shared/SectionCard';

type PreferencesSectionProps = {
  asCard?: boolean;
};

export function PreferencesSection({ asCard = true }: PreferencesSectionProps) {
  const content = <p className="text-sm opacity-80">Pendiente de implementar en Dia 11.</p>;

  if (!asCard) return content;

  return (
    <SectionCard title="Preferences" description="Tema, densidad y defaults de trabajo.">
      {content}
    </SectionCard>
  );
}
