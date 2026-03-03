import type { Route } from './+types/notifications';
import { runNotificationsLoader } from '~/server/notifications/loader';

export async function loader({ request }: Route.LoaderArgs) {
  return runNotificationsLoader({ request });
}



