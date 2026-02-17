import { Form } from 'react-router';
import type { HomePageProps } from './types';

type HomeFeatureSwitchesProps = {
  flagsSummary: HomePageProps['flagsSummary'];
  userRole: HomePageProps['user']['role'];
};

export function HomeFeatureSwitches({ flagsSummary, userRole }: HomeFeatureSwitchesProps) {
  if (userRole !== 'admin' || !flagsSummary) return null;

  return (
    <div className="pt-3 border-t space-y-2">
      <h3 className="font-semibold text-sm">Feature Switches</h3>
      <p className="text-xs opacity-70">
        env: {flagsSummary.environment} - enabled: {flagsSummary.enabled}/{flagsSummary.total}
      </p>
      {flagsSummary.switches.length === 0 ? (
        <p className="text-xs opacity-70">No hay flags creadas en este environment.</p>
      ) : (
        <ul className="space-y-2">
          {flagsSummary.switches.map((flag) => (
            <li key={flag.key} className="rounded border px-3 py-2 text-xs">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <div className="font-medium">{flag.key}</div>
                  <div className="opacity-70">
                    {flag.enabled ? 'ON' : 'OFF'} - {flag.type}
                    {flag.type === 'percentage' ? ` - ${flag.rolloutPercent ?? 0}%` : ''}
                  </div>
                </div>

                <Form method="post">
                  <input type="hidden" name="intent" value="toggle-hub-flag" />
                  <input type="hidden" name="id" value={flag.id} />
                  <button type="submit" className="rounded border px-2 py-1 text-[11px] font-medium">
                    {flag.enabled ? 'Apagar' : 'Prender'}
                  </button>
                </Form>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
