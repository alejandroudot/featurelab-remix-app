import type { Project } from './project.types';

export type ProjectCreateInput = {
  userId: string;
  name: string;
  imageUrl: string | null;
};

export type ProjectUpdateInput = {
  id: string;
  userId: string;
  name?: string;
  description?: string | null;
  imageUrl?: string | null;
};

export interface ProjectRepository {
  listByUser(userId: string): Promise<Project[]>;
  getByIdForUser(input: { id: string; userId: string }): Promise<Project | null>;
  create(input: ProjectCreateInput): Promise<Project>;
  update(input: ProjectUpdateInput): Promise<Project | null>;
  setPinned(input: { id: string; userId: string; pinned: boolean }): Promise<void>;
  reorderSidebar(input: { userId: string; orderedProjectIds: string[] }): Promise<void>;
  remove(input: { id: string; userId: string }): Promise<void>;
}
