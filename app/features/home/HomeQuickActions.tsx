import { Link } from 'react-router';
import type { HomePageProps } from './types';
import { HomeFeatureSwitches } from './HomeFeatureSwitches';
import { Button } from '~/ui/primitives/button';
import { Card, CardContent } from '~/ui/primitives/card';
import { Separator } from '~/ui/primitives/separator';

type HomeQuickActionsProps = {
  userRole: HomePageProps['user']['role'];
  flagsSummary: HomePageProps['flagsSummary'];
};

export function HomeQuickActions({ userRole, flagsSummary }: HomeQuickActionsProps) {
  return (
    <Card className="py-4 gap-3">
      <CardContent className="px-4 space-y-3">
      <h2 className="text-lg font-semibold">Quick Actions</h2>
      <div className="flex flex-col gap-2">
        <Button asChild variant="outline">
          <Link to="/tasks#create-task">Crear task</Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/tasks">Ir al board/listado de tasks</Link>
        </Button>
        {userRole === 'admin' ? (
          <Button asChild variant="outline">
            <Link to="/flags">Gestionar feature flags</Link>
          </Button>
        ) : null}
      </div>

      <Separator />
      <div>
        <p className="text-xs opacity-70">
          Proxima iteracion: dark mode toggle y panel inline de feature switches para admins.
        </p>
      </div>

      <HomeFeatureSwitches flagsSummary={flagsSummary} userRole={userRole} />
      </CardContent>
    </Card>
  );
}
