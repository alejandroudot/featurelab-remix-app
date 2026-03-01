import { SectionCard } from '../../shared/SectionCard';

type PlanSectionProps = {
  asCard?: boolean;
};

export function PlanSection({ asCard = true }: PlanSectionProps) {
  const content = <p className="text-sm opacity-80">Pendiente de implementar en Dia 11.</p>;

  if (!asCard) return content;

  return (
    <SectionCard title="Plan" description="Plan actual, limites y upgrade.">
      {content}
    </SectionCard>
  );
}
