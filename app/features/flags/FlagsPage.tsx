import { useQuery } from '@tanstack/react-query';
import type { Flag } from './types';
import { flagsQueryOptions } from './client/query';
import { CreateFlagForm } from './CreateFlagForm';
import { FlagsList } from './FlagList';

export function FlagsPage({ flags: initialFlags }: { flags: Flag[] }) {
  const flagsQuery = useQuery({
    ...flagsQueryOptions(),
    initialData: { flags: initialFlags },
  });
  const flags = flagsQuery.data?.flags ?? initialFlags;

  return (
    <main className="container mx-auto p-4 space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">Feature Flags (producto)</h1>
        <p className="opacity-80 text-sm">
          Flags globales por entorno para activar/desactivar features de producto.
        </p>
      </header>
      <CreateFlagForm />
      {flagsQuery.isError ? (
        <section className="rounded border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-700">
          No se pudo actualizar el listado de flags.
        </section>
      ) : null}
      <FlagsList flags={flags} />
    </main>
  );
}
