import type { Task } from '~/core/task/task.types';

const TASK_PROJECT_MAP_STORAGE_KEY = 'fl_task_project_map_v1';

type TaskProjectMap = Record<string, string>;

function readTaskProjectMap(): TaskProjectMap {
  if (typeof window === 'undefined') return {};
  const raw = window.localStorage.getItem(TASK_PROJECT_MAP_STORAGE_KEY);
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw) as TaskProjectMap;
    if (!parsed || typeof parsed !== 'object') return {};
    return parsed;
  } catch {
    return {};
  }
}

function writeTaskProjectMap(map: TaskProjectMap) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(TASK_PROJECT_MAP_STORAGE_KEY, JSON.stringify(map));
}

export function syncTaskProjectMap({
  tasks,
  activeProjectId,
  previousTaskIds,
}: {
  tasks: Task[];
  activeProjectId: string | null;
  previousTaskIds: Set<string>;
}) {
  const current = readTaskProjectMap();
  const next: TaskProjectMap = { ...current };
  let changed = false;

  const currentIds = new Set(tasks.map((task) => task.id));

  // Limpia ids borrados.
  for (const taskId of Object.keys(next)) {
    if (!currentIds.has(taskId)) {
      delete next[taskId];
      changed = true;
    }
  }

  // Asigna projectId solo a tasks nuevas sin mapping.
  for (const task of tasks) {
    if (next[task.id]) continue;
    if (activeProjectId && previousTaskIds.size > 0 && !previousTaskIds.has(task.id)) {
      next[task.id] = activeProjectId;
      changed = true;
    }
  }

  if (changed) writeTaskProjectMap(next);

  return next;
}

export function getTaskProjectMap() {
  return readTaskProjectMap();
}

export function removeProjectFromTaskMap(projectId: string) {
  const current = readTaskProjectMap();
  const next = Object.fromEntries(
    Object.entries(current).filter(([, mappedProjectId]) => mappedProjectId !== projectId),
  );
  writeTaskProjectMap(next);
  return next;
}



