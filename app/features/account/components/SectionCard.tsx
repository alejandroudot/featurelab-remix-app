type SectionCardProps = {
  title: string;
  description: string;
  children: React.ReactNode;
};

export function SectionCard({ title, description, children }: SectionCardProps) {
  return (
    <section className="rounded border p-4">
      <header className="mb-3">
        <h2 className="text-base font-semibold">{title}</h2>
        <p className="text-sm opacity-70">{description}</p>
      </header>
      {children}
    </section>
  );
}
