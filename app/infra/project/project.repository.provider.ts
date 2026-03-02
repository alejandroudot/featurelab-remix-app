import type { ProjectRepository } from '~/core/project/project.repository.port';
import { sqliteProjectRepository } from './project.repository.sqlite';

export const projectRepository: ProjectRepository = sqliteProjectRepository;
