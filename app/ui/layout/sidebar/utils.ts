import type { Project } from '~/core/project/project.types';

export function navClassName(isActive: boolean) {
  return `flex items-center gap-2 rounded px-3 py-2 text-sm transition ${
    isActive ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900' : 'hover:bg-muted'
  }`;
}

export function sortProjectsForSidebar(projects: Project[]) {
  return [...projects].sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    if (a.sidebarOrder !== b.sidebarOrder) return a.sidebarOrder - b.sidebarOrder;
    return a.createdAt - b.createdAt;
  });
}

export function buildTasksHref(locationSearch: string, projectId: string) {
  const next = new URLSearchParams(locationSearch);
  next.set('project', projectId);
  const query = next.toString();
  return query ? `/?${query}` : '/';
}

export function reorderIds(orderedIds: string[], draggedId: string, targetId: string) {
  const fromIndex = orderedIds.indexOf(draggedId);
  const toIndex = orderedIds.indexOf(targetId);
  if (fromIndex < 0 || toIndex < 0 || fromIndex === toIndex) return orderedIds;

  const next = [...orderedIds];
  const [moved] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, moved);
  return next;
}

