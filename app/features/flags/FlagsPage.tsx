import type { FlagActionData, Flag } from './types';
import { CreateFlagForm } from './CreateFlagForm';
import { FlagsList } from './FlagList';

export function FlagsPage({ flags, actionData }: { flags: Flag[]; actionData: FlagActionData }) {
  return (
    <main className="container mx-auto p-4 space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">Feature Flags (producto)</h1>
        <p className="opacity-80 text-sm">
          Flags globales por entorno para activar/desactivar features de producto.
        </p>
      </header>
      <CreateFlagForm actionData={actionData} />
      <FlagsList flags={flags} />
    </main>
  );
}
