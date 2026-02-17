import { useEffect, useRef } from 'react';
import { useFetcher } from 'react-router';
import { toast } from 'sonner';
import type { HomePageProps } from '../types';
import { Badge } from '~/ui/primitives/badge';
import { Card, CardContent } from '~/ui/primitives/card';
import { Switch } from '~/ui/primitives/switch';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '~/ui/primitives/tooltip';

type HomeFeatureSwitchesProps = {
  flagsSummary: HomePageProps['flagsSummary'];
  userRole: HomePageProps['user']['role'];
};

export function HomeFeatureSwitches({ flagsSummary, userRole }: HomeFeatureSwitchesProps) {
  const fetcher = useFetcher<{ success?: boolean; message?: string }>();
  const wasSubmittingRef = useRef(false);
  const lastToggledKeyRef = useRef<string | null>(null);

  useEffect(() => {
    if (fetcher.state === 'submitting') {
      wasSubmittingRef.current = true;
      return;
    }

    if (!wasSubmittingRef.current || fetcher.state !== 'idle') return;

    if (fetcher.data?.success) {
      toast.success(
        lastToggledKeyRef.current
          ? `Flag ${lastToggledKeyRef.current} actualizada`
          : 'Flag actualizada',
      );
    } else {
      toast.error(fetcher.data?.message ?? 'No se pudo actualizar la flag');
    }

    wasSubmittingRef.current = false;
    lastToggledKeyRef.current = null;
  }, [fetcher.state, fetcher.data]);

  if (userRole !== 'admin' || !flagsSummary) return null;

  return (
    <div className="space-y-2">
      <h3 className="font-semibold text-sm">Feature Switches</h3>
      <p className="text-xs text-muted-foreground">
        env: {flagsSummary.environment} - enabled: {flagsSummary.enabled}/{flagsSummary.total}
      </p>
      {flagsSummary.switches.length === 0 ? (
        <p className="text-xs text-muted-foreground">No hay flags creadas en este environment.</p>
      ) : (
        <TooltipProvider>
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

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Switch
                            type="button"
                            tone="default"
                            checked={flag.enabled}
                            disabled={fetcher.state === 'submitting'}
                            className="h-5.5 w-10 ring-1 ring-border"
                            thumbClassName="size-4"
                            aria-label={`Toggle flag ${flag.key}`}
                            onCheckedChange={() => {
                              lastToggledKeyRef.current = flag.key;
                              fetcher.submit(
                                { intent: 'toggle-hub-flag', id: flag.id },
                                { method: 'post' },
                              );
                            }}
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          {flag.enabled ? 'Desactivar flag' : 'Activar flag'}
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </CardContent>
                </Card>
              </li>
            ))}
          </ul>
        </TooltipProvider>
      )}
    </div>
  );
}
