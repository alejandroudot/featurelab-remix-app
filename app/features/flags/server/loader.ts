import type { FeatureFlagRepository } from '~/core/flags/contracts/flags.port';
import { ensureProductFlagsSeeded } from '~/core/flags/service/flag-seed';

type RunFlagLoaderInput = {
  flagRepository: Pick<FeatureFlagRepository, 'listAll' | 'create'>;
};

export async function runFlagLoader({ flagRepository }: RunFlagLoaderInput) {
  await ensureProductFlagsSeeded(flagRepository);

  const flags = await flagRepository.listAll();
  return { flags };
}


