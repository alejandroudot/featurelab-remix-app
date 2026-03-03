import { queryOptions } from '@tanstack/react-query';
import { fetchNotifications } from './api';

export function notificationsQueryOptions(userId: string) {
  return queryOptions({
    queryKey: ['notifications', userId],
    queryFn: fetchNotifications,
    staleTime: 30_000,
    refetchInterval: 50_000,
    retry: 1,
  });
}

