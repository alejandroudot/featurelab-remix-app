import type { Project } from './project.types';

export type ProjectCreateInput = {
  userId: string;
  name: string;
  imageUrl: string | null;
};

export interface ProjectRepository {
  listByUser(userId: string): Promise<Project[]>;
  getByIdForUser(input: { id: string; userId: string }): Promise<Project | null>;
  create(input: ProjectCreateInput): Promise<Project>;
  remove(input: { id: string; userId: string }): Promise<void>;
}
