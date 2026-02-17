import { useSubmit } from 'react-router';
import type { HomePageProps } from '../types';
import { Badge } from '~/ui/primitives/badge';
import { Card, CardContent } from '~/ui/primitives/card';
import { Separator } from '~/ui/primitives/separator';
import { Switch } from '~/ui/primitives/switch';

type HomeFeatureSwitchesProps = {
  flagsSummary: HomePageProps['flagsSummary'];
  userRole: HomePageProps['user']['role'];
};

export function HomeFeatureSwitches({ flagsSummary, userRole }: HomeFeatureSwitchesProps) {
  const submit = useSubmit();

  if (userRole !== 'admin' || !flagsSummary) return null;

  return (
    <div className="pt-3 space-y-2">
      <Separator />
      <h3 className="font-semibold text-sm">Feature Switches</h3>
      <p className="text-xs text-muted-foreground">
        env: {flagsSummary.environment} - enabled: {flagsSummary.enabled}/{flagsSummary.total}
      </p>
      {flagsSummary.switches.length === 0 ? (
        <p className="text-xs text-muted-foreground">No hay flags creadas en este environment.</p>
      ) : (
        <ul className="space-y-2">
          {flagsSummary.switches.map((flag) => (
            <li key={flag.key}>
              <Card className="py-2 gap-2">
                <CardContent className="px-3">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                  <div className="font-medium">{flag.key}</div>
                      <div className="text-muted-foreground mt-1 inline-flex items-center gap-2">
                        <Badge variant={flag.enabled ? 'default' : 'outline'}>
                          {flag.enabled ? 'ON' : 'OFF'}
                        </Badge>
                        <Badge variant="secondary">{flag.type}</Badge>
                        {flag.type === 'percentage' ? (
                          <Badge variant="outline">{flag.rolloutPercent ?? 0}%</Badge>
                        ) : null}
                      </div>
                    </div>

                    <Switch
                      type="button"
                      checked={flag.enabled}
                      aria-label={`Toggle flag ${flag.key}`}
                      onCheckedChange={() =>
                        submit(
                          { intent: 'toggle-hub-flag', id: flag.id },
                          { method: 'post', preventScrollReset: true, replace: true },
                        )
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
