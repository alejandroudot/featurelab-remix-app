import type { HomePageProps } from '../types';
import { Card, CardContent } from '~/ui/primitives/card';

type HomeStatsSectionProps = {
  stats: HomePageProps['stats'];
};

export function HomeStatsSection({ stats }: HomeStatsSectionProps) {
	
  const summaryCards: Array<{ label: string; value: number }> = [
    { label: 'Total tasks', value: stats.total },
    { label: 'In progress / abiertas', value: stats.open },
    { label: 'Ready / listas para release', value: stats.ready },
  ];

  const statusCards: Array<{ label: string; value: number }> = [
    { label: 'To Do', value: stats.byStatus.todo },
    { label: 'In Progress', value: stats.byStatus.inProgress },
    { label: 'QA', value: stats.byStatus.qa },
    { label: 'Ready to Go Live', value: stats.byStatus.readyToGoLive },
  ];

  return (
    <>
      <section className="grid gap-3 sm:grid-cols-3">
        {summaryCards.map((card) => (
          <Card key={card.label} className="gap-2 py-4">
            <CardContent className="px-4">
              <div className="text-xs opacity-70">{card.label}</div>
              <div className="text-2xl font-semibold">{card.value}</div>
            </CardContent>
          </Card>
        ))}
      </section>

      <Card className="gap-3 py-4">
        <CardContent className="space-y-3 px-4">
          <h2 className="text-lg font-semibold">Status breakdown</h2>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {statusCards.map((card) => (
              <Card key={card.label} className="gap-2 py-3">
                <CardContent className="px-3">
                  <div className="text-xs opacity-70">{card.label}</div>
                  <div className="text-xl font-semibold">{card.value}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
