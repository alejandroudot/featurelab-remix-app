import type { FlagCommandService, FlagQueryService } from '~/core/flags/service/flags.service';
import { ensureProductFlagsSeeded } from '~/core/flags/service/flag-seed';

type RunFlagLoaderInput = {
  flagQueryService: FlagQueryService;
  flagCommandService: FlagCommandService;
};

export async function runFlagLoader({ flagQueryService, flagCommandService }: RunFlagLoaderInput) {
  await ensureProductFlagsSeeded({
    listAll: () => flagQueryService.listAll(),
    create: (input) => flagCommandService.create(input),
  });

  const flags = await flagQueryService.listAll();
  return { flags };
}
