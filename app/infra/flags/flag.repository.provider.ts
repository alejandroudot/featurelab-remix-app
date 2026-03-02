import type { FeatureFlagRepository } from '~/core/flags/contracts/flags.port';
import { sqliteFlagRepository } from './flag.repository.sqlite';

// Repository concreto (SQLite) para CRUD de flags.
export const flagRepository: FeatureFlagRepository = sqliteFlagRepository;

