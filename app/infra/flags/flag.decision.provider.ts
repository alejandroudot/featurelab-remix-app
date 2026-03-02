import { createFlagDecisionService } from '~/core/flags/service/flag-decision.service';
import { flagRepository } from './flag.repository.provider';

export const flagDecisionService = createFlagDecisionService(flagRepository);

