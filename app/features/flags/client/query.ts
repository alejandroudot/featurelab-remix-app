import { queryOptions } from '@tanstack/react-query';
import { fetchFlagsList } from './api';

export const flagsQueryKey = ['flags'] as const;

export function flagsQueryOptions() {
  return queryOptions({
    queryKey: flagsQueryKey,
    queryFn: fetchFlagsList,
    staleTime: 30_000,
    retry: 1,
  });
}

