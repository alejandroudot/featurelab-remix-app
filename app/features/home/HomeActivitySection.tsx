import { Link } from 'react-router';
import type { HomePageProps } from './types';

type HomeActivitySectionProps = {
  recentActivity: HomePageProps['recentActivity'];
};

export function HomeActivitySection({ recentActivity }: HomeActivitySectionProps) {
  return (
    <div className="border rounded p-4 lg:col-span-2 space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Actividad reciente</h2>
        <Link to="/tasks" className="text-sm underline opacity-80">
          Ver todas las tasks
        </Link>
      </div>

      {recentActivity.length === 0 ? (
        <div className="rounded border p-4 text-sm opacity-80">
          No hay actividad todavia. Crea la primera task para iniciar el flujo.
        </div>
      ) : (
        <ul className="space-y-2">
          {recentActivity.map((item) => (
            <li key={item.id} className="rounded border p-3">
              <div className="font-medium">{item.taskTitle}</div>
              <div className="text-xs opacity-70 mt-1">
                {item.actor} {item.action} esta task
              </div>
              <div className="text-[11px] opacity-60 mt-1">
                {new Date(item.timestamp).toLocaleString()}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
