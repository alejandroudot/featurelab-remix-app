import { Link } from 'react-router';
import type { HomePageProps } from '../types';
import { Button } from '~/ui/primitives/button';
import { Card, CardContent } from '~/ui/primitives/card';

type HomeActivitySectionProps = {
  recentActivity: HomePageProps['recentActivity'];
};

function formatDateTimeUTC(input: Date): string {
  const day = String(input.getUTCDate()).padStart(2, '0');
  const month = String(input.getUTCMonth() + 1).padStart(2, '0');
  const year = String(input.getUTCFullYear());
  const hours = String(input.getUTCHours()).padStart(2, '0');
  const minutes = String(input.getUTCMinutes()).padStart(2, '0');
  const seconds = String(input.getUTCSeconds()).padStart(2, '0');
  return `${day}/${month}/${year}, ${hours}:${minutes}:${seconds} UTC`;
}

export function HomeActivitySection({ recentActivity }: HomeActivitySectionProps) {
  return (
    <Card className="py-4 gap-3 lg:col-span-2">
      <CardContent className="px-4 space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Actividad reciente</h2>
        <Button asChild variant="ghost" size="sm">
          <Link to="/tasks">Ver todas las tasks</Link>
        </Button>
      </div>

      {recentActivity.length === 0 ? (
        <Card className="py-4 gap-2">
          <CardContent className="px-4 text-sm opacity-80">
          No hay actividad todavia. Crea la primera task para iniciar el flujo.
          </CardContent>
        </Card>
      ) : (
        <ul className="space-y-2">
          {recentActivity.map((item) => (
            <li key={item.id}>
              <Card className="py-3 gap-2">
                <CardContent className="px-3">
              <div className="font-medium">{item.taskTitle}</div>
              <div className="text-xs opacity-70 mt-1">
                {item.actor} {item.action} esta task
              </div>
              <div className="text-[11px] opacity-60 mt-1">
                {formatDateTimeUTC(new Date(item.timestamp))}
              </div>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      )}
      </CardContent>
    </Card>
  );
}
