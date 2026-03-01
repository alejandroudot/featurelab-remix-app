import type { ReactNode } from 'react';

type SummaryCardProps = {
  title: string;
  description: string;
  preview?: ReactNode;
  onOpen: () => void;
  ctaLabel?: string;
};

export function SummaryCard({
  title,
  description,
  preview,
  onOpen,
  ctaLabel = 'Actualizar',
}: SummaryCardProps) {
  return (
    <section className="rounded border p-4">
      <h2 className="text-base font-semibold">{title}</h2>
      <p className="mt-1 text-sm opacity-75">{description}</p>
      {preview ? <div className="mt-3">{preview}</div> : null}
      <button
        type="button"
        onClick={onOpen}
        className="mt-3 rounded border px-3 py-1 text-sm font-medium"
      >
        {ctaLabel}
      </button>
    </section>
  );
}
