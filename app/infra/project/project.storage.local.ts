import type { ProjectStoragePort } from '~/core/project/project.repository.port';
import type { Project } from '~/core/project/project.types';

export const PROJECTS_STORAGE_KEY = 'fl_projects_v1';
export const PROJECTS_UPDATED_EVENT = 'fl-projects-updated';

function inferCreatedAt(projectId: string, createdAt: unknown) {
  if (typeof createdAt === 'number' && Number.isFinite(createdAt)) return createdAt;
  const fromId = Number(projectId.replace('project_', ''));
  if (Number.isFinite(fromId)) return fromId;
  return Date.now();
}

function readStoredProjects(): Project[] {
  if (typeof window === 'undefined') return [];
  const raw = window.localStorage.getItem(PROJECTS_STORAGE_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as Array<{
      id?: unknown;
      name?: unknown;
      createdAt?: unknown;
      imageUrl?: unknown;
    }>;
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((project) => project && typeof project.id === 'string' && typeof project.name === 'string')
      .map((project) => ({
        id: project.id as string,
        name: project.name as string,
        createdAt: inferCreatedAt(project.id as string, project.createdAt),
        imageUrl: typeof project.imageUrl === 'string' ? project.imageUrl : null,
      }))
      .sort((a, b) => a.createdAt - b.createdAt);
  } catch {
    return [];
  }
}

function saveStoredProjects(projects: Project[]) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projects));
  window.dispatchEvent(new Event(PROJECTS_UPDATED_EVENT));
}

function createStoredProject(name: string, imageUrl: string | null): Project {
  return {
    id: `project_${Date.now()}`,
    name,
    createdAt: Date.now(),
    imageUrl,
  };
}

export const localProjectStoragePort: ProjectStoragePort = {
  readAll: readStoredProjects,
  saveAll: saveStoredProjects,
  create: createStoredProject,
};
