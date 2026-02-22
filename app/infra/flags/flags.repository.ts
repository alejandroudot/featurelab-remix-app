import { sqliteFlagRepository } from './flags.repository.sqlite';
import { createFlagService } from '~/core/flags/service/flags.service';
import type { FlagCommandService, FlagQueryService, FlagService } from '~/core/flags/service/flags.service';

// Servicio de flags de producto (globales), tipo ConfigCat.
const fullFlagService = createFlagService(sqliteFlagRepository);

export const flagQueryService: FlagQueryService = {
  listAll: fullFlagService.listAll,
  resolve: fullFlagService.resolve,
  isEnabled: fullFlagService.isEnabled,
};

export const flagCommandService: FlagCommandService = {
  create: fullFlagService.create,
  toggle: fullFlagService.toggle,
  remove: fullFlagService.remove,
  update: fullFlagService.update,
};

// Alias de transicion para imports legacy.
export const flagService: FlagService = {
  ...flagQueryService,
  ...flagCommandService,
};
