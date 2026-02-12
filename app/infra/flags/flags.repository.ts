import { sqliteFlagRepository } from './flags.repository.sqlite';
import { createFlagService } from '~/core/flags/flags.service';

// Servicio de flags de producto (globales), tipo ConfigCat.
export const flagService = createFlagService(sqliteFlagRepository);
