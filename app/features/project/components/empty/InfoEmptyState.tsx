type InfoEmptyStateProps = {
  title: string;
  description: string;
};

export function InfoEmptyState({ title, description }: InfoEmptyStateProps) {
  return (
    <section className="rounded border p-4 text-sm">
      <p className="font-medium">{title}</p>
      <p className="mt-1 text-muted-foreground">{description}</p>
    </section>
  );
}
