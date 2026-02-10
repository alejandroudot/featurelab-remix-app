import type { FlagsActionData } from './types';
import { CreateFlagForm } from './CreateFlagForm';
import { FlagsList } from './FlagList';

export function FlagsPage({ flags, actionData }: { flags: any[]; actionData: FlagsActionData }) {
  return (
    <main className="container mx-auto p-4 space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">Feature Flags</h1>
        <p className="opacity-80 text-sm">
          Flags por entorno para activar/desactivar features sin redeploy.
        </p>
      </header>

      <CreateFlagForm actionData={actionData} />
      <FlagsList flags={flags} />
    </main>
  );
}
