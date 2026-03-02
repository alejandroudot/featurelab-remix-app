import type { Project } from './project.types';

export interface ProjectStoragePort {
  readAll(): Project[];
  saveAll(projects: Project[]): void;
  create(name: string, imageUrl: string | null): Project;
}
