import { SectionCard } from '../../shared/SectionCard';

type PlanSectionProps = {
  asCard?: boolean;
};

export function PlanSection({ asCard = true }: PlanSectionProps) {
  const limits = [
    '1 workspace personal',
    'Asignacion y colaboracion basica',
    'Notificaciones in-app',
    'Sin equipos de manager',
    'Sin integraciones externas avanzadas',
  ];

  const content = (
    <div className="space-y-4">
      <div className="rounded border bg-muted/20 p-3">
        <div className="flex items-center justify-between gap-2">
          <div>
            <p className="text-sm font-semibold">Plan actual</p>
            <p className="text-xs opacity-75">Estas usando el plan base del producto.</p>
          </div>
          <span className="rounded border px-2 py-0.5 text-xs font-medium">Free</span>
        </div>
      </div>

      <section className="space-y-2">
        <p className="text-sm font-medium">Limites del plan</p>
        <ul className="list-inside list-disc space-y-1 text-sm opacity-85">
          {limits.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <div className="space-y-2">
        <button
          type="button"
          disabled
          className="rounded border px-3 py-1 text-sm font-medium opacity-60"
        >
          Upgrade (Coming soon)
        </button>
        <p className="text-xs opacity-70">
          El upgrade habilitara capacidades de manager y gestion de equipo.
        </p>
      </div>
    </div>
  );

  if (!asCard) return content;

  return (
    <SectionCard title="Plan" description="Plan actual, limites y upgrade.">
      {content}
    </SectionCard>
  );
}
